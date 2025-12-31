// ===================================
// ORDER CONFIRMATION PAGE FUNCTIONALITY
// ===================================

let orderData = {
    orderId: '',
    orderDate: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: '',
    paymentMethod: '',
    expectedDelivery: ''
};

function initOrderConfirmationPage() {
    // Get order ID from URL parameter
    const orderId = getUrlParameter('order') || 'ORD' + Date.now();
    
    // Load order data (in real app, this would come from backend)
    loadOrderData(orderId);
    
    // Display order details
    displayOrderDetails();
    
    updateCartCount();
}

function loadOrderData(orderId) {
    // In a real application, this would fetch order data from the server
    // For now, we'll create mock order data
    
    orderData.orderId = orderId;
    orderData.orderDate = new Date().toISOString();
    orderData.paymentMethod = 'Credit Card';
    orderData.expectedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days from now
    
    // Get order items from localStorage (temporary storage)
    const tempOrderData = localStorage.getItem('tempOrderData');
    if (tempOrderData) {
        const parsedData = JSON.parse(tempOrderData);
        orderData.items = parsedData.items || [];
        orderData.subtotal = parsedData.subtotal || 0;
        orderData.shippingAddress = parsedData.address || '';
        
        // Clear temporary order data
        localStorage.removeItem('tempOrderData');
    } else {
        // Fallback: use some sample items
        orderData.items = [
            {
                name: 'Sample Product',
                price: 999,
                quantity: 1,
                image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800'
            }
        ];
        orderData.subtotal = 999;
        orderData.shippingAddress = 'Sample Address';
    }
    
    // Calculate tax and total
    orderData.tax = Math.round(orderData.subtotal * 0.18); // 18% GST
    orderData.total = orderData.subtotal + orderData.tax;
}

function displayOrderDetails() {
    // Order ID
    document.getElementById('orderId').textContent = orderData.orderId;
    
    // Order date
    const orderDate = new Date(orderData.orderDate);
    document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Order placed time for timeline
    document.getElementById('orderPlacedTime').textContent = orderDate.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Payment method
    document.getElementById('paymentMethod').textContent = orderData.paymentMethod;
    
    // Expected delivery
    const deliveryDate = new Date(orderData.expectedDelivery);
    document.getElementById('expectedDelivery').textContent = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
    });
    
    // Shipping address
    document.getElementById('shippingAddress').textContent = orderData.shippingAddress;
    
    // Order items
    displayOrderItems();
    
    // Order summary
    displayOrderSummary();
}

function displayOrderItems() {
    const itemsContainer = document.getElementById('orderItems');
    if (!itemsContainer) return;
    
    itemsContainer.innerHTML = orderData.items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                <div class="order-item-price">${formatCurrency(item.price)} × ${item.quantity}</div>
            </div>
            <div class="order-item-total">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>
    `).join('');
}

function displayOrderSummary() {
    document.getElementById('subtotal').textContent = formatCurrency(orderData.subtotal);
    document.getElementById('tax').textContent = formatCurrency(orderData.tax);
    document.getElementById('total').textContent = formatCurrency(orderData.total);
}

function continueShopping() {
    window.location.href = 'index.html';
}

function printOrder() {
    window.print();
}

function trackOrder() {
    // In a real application, this would navigate to a detailed tracking page
    showNotification('Order Tracking', `Tracking order ${orderData.orderId}. Real-time tracking coming soon!`, 'info');
}

// Save order data before checkout completion
function saveOrderDataForConfirmation(address, paymentMethod, items) {
    const orderData = {
        address: address,
        paymentMethod: paymentMethod,
        items: items,
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    localStorage.setItem('tempOrderData', JSON.stringify(orderData));
}

// Initialize order confirmation page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('order-confirmation.html')) {
        initOrderConfirmationPage();
    }
});
