// ===================================
// CHECKOUT PAGE FUNCTIONALITY
// ===================================

let checkoutData = {
    address: {},
    paymentMethod: 'card',
    cardDetails: {},
    upiId: ''
};

function initCheckoutPage() {
    if (cart.length === 0) {
        showNotification('Cart Empty', 'Please add items to your cart before checkout.', 'error');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 2000);
        return;
    }

    renderCheckoutItems();
    updateCheckoutSummary();
    setupPaymentMethodListeners();
    updateCartCount();
}

function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;

    container.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}" class="checkout-item-image">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
                <div class="checkout-item-price">${formatCurrency(item.price)}</div>
            </div>
            <div class="checkout-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
}

function updateCheckoutSummary() {
    const subtotal = calculateCartTotal();
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + tax;

    document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summaryTax').textContent = formatCurrency(tax);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
}

function setupPaymentMethodListeners() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            checkoutData.paymentMethod = e.target.value;
            
            // Hide all payment details
            document.getElementById('cardDetails').style.display = 'none';
            document.getElementById('upiDetails').style.display = 'none';
            
            // Show relevant payment details
            if (e.target.value === 'card') {
                document.getElementById('cardDetails').style.display = 'block';
            } else if (e.target.value === 'upi') {
                document.getElementById('upiDetails').style.display = 'block';
            }
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // PIN Code validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

function proceedToPayment() {
    const addressForm = document.getElementById('addressForm');
    if (!validateForm(addressForm)) {
        showNotification('Validation Error', 'Please fill in all required fields.', 'error');
        return;
    }

    // Save address data
    const formData = new FormData(addressForm);
    checkoutData.address = Object.fromEntries(formData);

    // Update progress
    updateProgress(2);

    // Show payment section
    document.getElementById('addressSection').classList.remove('active');
    document.getElementById('paymentSection').classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function proceedToReview() {
    // Validate payment details
    if (checkoutData.paymentMethod === 'card') {
        const cardForm = document.getElementById('paymentForm');
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            showNotification('Validation Error', 'Please fill in all card details.', 'error');
            return;
        }

        checkoutData.cardDetails = { cardNumber, expiryDate, cvv, cardName };
    } else if (checkoutData.paymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId) {
            showNotification('Validation Error', 'Please enter your UPI ID.', 'error');
            return;
        }
        checkoutData.upiId = upiId;
    }

    // Update progress
    updateProgress(3);

    // Show review section
    document.getElementById('paymentSection').classList.remove('active');
    document.getElementById('reviewSection').classList.add('active');

    // Populate review data
    populateReviewData();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateReviewData() {
    // Address review
    const reviewAddress = document.getElementById('reviewAddress');
    reviewAddress.innerHTML = `
        <p><strong>${checkoutData.address.firstName} ${checkoutData.address.lastName}</strong></p>
        <p>${checkoutData.address.address}</p>
        <p>${checkoutData.address.city}, ${checkoutData.address.state} - ${checkoutData.address.pincode}</p>
        <p>${checkoutData.address.country}</p>
        <p>📱 ${checkoutData.address.phone}</p>
        <p>✉️ ${checkoutData.address.email}</p>
    `;

    // Payment review
    const reviewPayment = document.getElementById('reviewPayment');
    let paymentInfo = '';
    if (checkoutData.paymentMethod === 'card') {
        const last4 = checkoutData.cardDetails.cardNumber.slice(-4);
        paymentInfo = `Credit/Debit Card ending in ${last4}`;
    } else if (checkoutData.paymentMethod === 'upi') {
        paymentInfo = `UPI ID: ${checkoutData.upiId}`;
    } else {
        paymentInfo = 'Cash on Delivery';
    }
    reviewPayment.innerHTML = `<p>${paymentInfo}</p>`;

    // Items review
    const reviewItems = document.getElementById('reviewItems');
    reviewItems.innerHTML = cart.map(item => `
        <div class="review-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="review-item-info">
                <div class="review-item-name">${item.name}</div>
                <div class="review-item-quantity">Quantity: ${item.quantity}</div>
                <div class="review-item-price">${formatCurrency(item.price)} × ${item.quantity}</div>
            </div>
            <div class="review-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
}

function goBackToAddress() {
    updateProgress(1);
    document.getElementById('paymentSection').classList.remove('active');
    document.getElementById('addressSection').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBackToPayment() {
    updateProgress(2);
    document.getElementById('reviewSection').classList.remove('active');
    document.getElementById('paymentSection').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index === step - 1) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    return true;
}

function placeOrder() {
    // Show processing state
    const placeOrderBtn = event.target;
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = `
        <div class="spinner"></div>
        Processing...
    `;

    // Simulate order processing
    setTimeout(() => {
        // Generate order ID
        const orderId = 'ORD' + Date.now();
        
        // Clear cart
        cart = [];
        saveToLocalStorage();
        
        // Show success message
        showNotification('Order Placed!', `Your order ${orderId} has been placed successfully.`, 'success');
        
        // Redirect to order confirmation page
        setTimeout(() => {
            window.location.href = `order-confirmation.html?order=${orderId}`;
        }, 2000);
    }, 2000);
}

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('checkout.html')) {
        initCheckoutPage();
    }
});
