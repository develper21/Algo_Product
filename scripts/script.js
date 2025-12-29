// ===================================
// GLOBAL STATE & UTILITIES
// ===================================

let currentProduct = null;
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let quantity = 1;

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Calculate discount percentage
function calculateDiscount(original, current) {
    return Math.round(((original - current) / original) * 100);
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ===================================
// HOMEPAGE FUNCTIONALITY
// ===================================

function initHomepage() {
    let filteredProducts = [...products];

    // Render products grid
    function renderProducts(productsToRender) {
        const grid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        const productsCount = document.getElementById('productsCount');

        if (!grid) return;

        if (productsToRender.length === 0) {
            grid.style.display = 'none';
            noProducts.style.display = 'flex';
            productsCount.textContent = 'No products found';
            return;
        }

        grid.style.display = 'grid';
        noProducts.style.display = 'none';
        productsCount.textContent = `Showing ${productsToRender.length} product${productsToRender.length !== 1 ? 's' : ''}`;

        grid.innerHTML = productsToRender.map(product => {
            const discount = calculateDiscount(product.originalPrice, product.price);

            return `
                <div class="product-card" onclick="navigateToProduct(${product.id})">
                    <div class="product-image-container">
                        ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ''}
                        <img src="${product.images[0]}" alt="${product.name}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-content">
                        <div class="product-brand-tag">${product.brand}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-rating">
                            <div class="rating-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                ${product.rating}
                            </div>
                            <span class="rating-reviews">(${product.reviews.toLocaleString()})</span>
                        </div>
                        <div class="product-price">
                            <span class="price-current">${formatCurrency(product.price)}</span>
                            ${product.originalPrice > product.price ? `
                                <span class="price-old">${formatCurrency(product.originalPrice)}</span>
                                <span class="price-off">${discount}% off</span>
                            ` : ''}
                        </div>
                        <div class="product-footer">
                            <div class="delivery-tag">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Free Delivery
                            </div>
                            <span class="view-details">
                                View Details
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Apply filters
    function applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const searchInput = document.getElementById('searchInput').value.toLowerCase();

        // Filter by category
        filteredProducts = products.filter(product => {
            if (categoryFilter !== 'all' && product.category !== categoryFilter) {
                return false;
            }
            return true;
        });

        // Filter by price range
        if (priceFilter !== 'all') {
            const [min, max] = priceFilter.split('-').map(Number);
            filteredProducts = filteredProducts.filter(product => {
                return product.price >= min && product.price <= max;
            });
        }

        // Filter by search
        if (searchInput) {
            filteredProducts = filteredProducts.filter(product => {
                return product.name.toLowerCase().includes(searchInput) ||
                    product.brand.toLowerCase().includes(searchInput) ||
                    product.category.toLowerCase().includes(searchInput);
            });
        }

        // Sort products
        switch (sortFilter) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        renderProducts(filteredProducts);
    }

    // Event listeners for filters
    document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
    document.getElementById('sortFilter')?.addEventListener('change', applyFilters);
    document.getElementById('priceFilter')?.addEventListener('change', applyFilters);
    document.getElementById('searchInput')?.addEventListener('input', applyFilters);

    // Reset filters
    document.getElementById('resetFilters')?.addEventListener('click', () => {
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('sortFilter').value = 'featured';
        document.getElementById('priceFilter').value = 'all';
        document.getElementById('searchInput').value = '';
        applyFilters();
    });

    // Initial render
    renderProducts(products);
    updateCartCount();
}

// Navigate to product page
function navigateToProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// ===================================
// PRODUCT DETAILS PAGE FUNCTIONALITY
// ===================================

function initProductPage() {
    const productId = parseInt(getUrlParameter('id'));
    currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }

    quantity = 1;

    // Load all product details
    loadProductDetails();
    setupEventListeners();
    updateCartCount();
}

function loadProductDetails() {
    // Update breadcrumb
    document.getElementById('breadcrumbCategory').textContent = currentProduct.category;
    document.getElementById('breadcrumbProduct').textContent = currentProduct.name;

    // Update basic info
    document.getElementById('productBrand').textContent = currentProduct.brand;
    document.getElementById('productTitle').textContent = currentProduct.name;

    // Update rating
    renderStars('ratingStars', currentProduct.rating);
    document.getElementById('ratingValue').textContent = currentProduct.rating.toFixed(1);
    document.getElementById('ratingCount').textContent = `(${currentProduct.reviews.toLocaleString()} reviews)`;

    // Update pricing
    const discount = calculateDiscount(currentProduct.originalPrice, currentProduct.price);
    document.getElementById('priceMain').textContent = formatCurrency(currentProduct.price);
    document.getElementById('priceOriginal').textContent = formatCurrency(currentProduct.originalPrice);
    document.getElementById('priceDiscount').textContent = `${discount}% off`;

    // Update stock info
    const stockInfo = document.getElementById('stockInfo');
    if (currentProduct.stock > 0) {
        stockInfo.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>In Stock (${currentProduct.stock} available)</span>
        `;
        stockInfo.classList.remove('out-of-stock');
    } else {
        stockInfo.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>Out of Stock</span>
        `;
        stockInfo.classList.add('out-of-stock');
    }

    // Load image gallery
    loadImageGallery();

    // Load variants
    loadVariants();

    // Update delivery info
    document.getElementById('deliveryText').textContent = currentProduct.delivery;
    document.getElementById('returnText').textContent = currentProduct.returnPolicy;

    // Load tabs content
    document.getElementById('productDescription').textContent = currentProduct.description;
    loadSpecifications();
    loadReviews();

    // Update total price
    updateTotalPrice();

    // Check wishlist status
    updateWishlistIcon();
}

function renderStars(containerId, rating) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) {
        starsHTML += `
            <svg class="star filled" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }

    if (hasHalfStar) {
        starsHTML += `
            <svg class="star filled" viewBox="0 0 24 24">
                <defs>
                    <linearGradient id="half">
                        <stop offset="50%" stop-color="currentColor"/>
                        <stop offset="50%" stop-color="transparent"/>
                    </linearGradient>
                </defs>
                <path fill="url(#half)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `
            <svg class="star empty" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }

    container.innerHTML = starsHTML;
}

function loadImageGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailContainer = document.getElementById('thumbnailContainer');

    mainImage.src = currentProduct.images[0];
    mainImage.alt = currentProduct.name;

    thumbnailContainer.innerHTML = currentProduct.images.map((image, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
            <img src="${image}" alt="${currentProduct.name} - Image ${index + 1}">
        </div>
    `).join('');
}

function changeImage(index) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = currentProduct.images[index];

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function loadVariants() {
    const variantsContainer = document.getElementById('productVariants');
    if (!currentProduct.variants || currentProduct.variants.length === 0) {
        variantsContainer.style.display = 'none';
        return;
    }

    // Group variants by type
    const variantsByType = {};
    currentProduct.variants.forEach(variant => {
        if (!variantsByType[variant.type]) {
            variantsByType[variant.type] = [];
        }
        variantsByType[variant.type].push(variant);
    });

    variantsContainer.innerHTML = Object.entries(variantsByType).map(([type, variants]) => `
        <div class="variant-group">
            <div class="variant-label">${type}</div>
            <div class="variant-options">
                ${variants.map((variant, index) => `
                    <button class="variant-option ${index === 0 ? 'active' : ''} ${!variant.available ? 'unavailable' : ''}"
                            ${!variant.available ? 'disabled' : ''}
                            onclick="selectVariant(this)">
                        ${variant.name}
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectVariant(button) {
    if (button.classList.contains('unavailable')) return;

    // Remove active from siblings
    const siblings = button.parentElement.querySelectorAll('.variant-option');
    siblings.forEach(sib => sib.classList.remove('active'));

    // Add active to clicked
    button.classList.add('active');

    // Check if this is a color variant and update images
    const variantName = button.textContent.trim();
    const variantGroup = button.closest('.variant-group');
    const variantLabel = variantGroup.querySelector('.variant-label').textContent.toLowerCase();

    if (variantLabel === 'color' && currentProduct.colorImages && currentProduct.colorImages[variantName]) {
        // Update images based on color selection
        const colorImages = currentProduct.colorImages[variantName];
        const mainImage = document.getElementById('mainImage');
        const thumbnailContainer = document.getElementById('thumbnailContainer');

        // Update main image
        mainImage.src = colorImages[0];

        // Update thumbnails
        thumbnailContainer.innerHTML = colorImages.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeColorImage(${index}, '${variantName}')">
                <img src="${image}" alt="${currentProduct.name} - ${variantName} - Image ${index + 1}">
            </div>
        `).join('');
    }
}

function changeColorImage(index, colorName) {
    if (currentProduct.colorImages && currentProduct.colorImages[colorName]) {
        const mainImage = document.getElementById('mainImage');
        mainImage.src = currentProduct.colorImages[colorName][index];

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

function updateTotalPrice() {
    const total = currentProduct.price * quantity;
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = formatCurrency(total);
    }
}

function setupEventListeners() {
    // Quantity controls
    const increaseBtn = document.getElementById('increaseQty');
    const decreaseBtn = document.getElementById('decreaseQty');
    const quantityInput = document.getElementById('quantity');

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            const maxQty = Math.min(10, currentProduct.stock);
            if (quantity < maxQty) {
                quantity++;
                quantityInput.value = quantity;
                updateTotalPrice();
            }
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
                updateTotalPrice();
            }
        });
    }

    // Wishlist toggle
    const wishlistToggleBtn = document.getElementById('wishlistToggle');
    if (wishlistToggleBtn) {
        wishlistToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWishlist();
        });
    }

    // Add to cart
    const addToCartBtn = document.getElementById('addToCart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (currentProduct.stock === 0) {
                alert('Sorry, this product is out of stock!');
                return;
            }

            const existingItem = cart.find(item => item.id === currentProduct.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.images[0],
                    quantity: quantity
                });
            }

            saveToLocalStorage();
            updateCartCount();

            // Show success message
            alert(`✅ ${quantity} item(s) added to cart successfully!\n\nProduct: ${currentProduct.name}\nPrice: ${formatCurrency(currentProduct.price)} x ${quantity}\nTotal: ${formatCurrency(currentProduct.price * quantity)}`);
        });
    }

    // Buy now
    const buyNowBtn = document.getElementById('buyNow');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            if (currentProduct.stock === 0) {
                alert('Sorry, this product is out of stock!');
                return;
            }

            // Show checkout alert
            alert(`🛒 Proceeding to checkout...\n\nProduct: ${currentProduct.name}\nQuantity: ${quantity}\nTotal Amount: ${formatCurrency(currentProduct.price * quantity)}\n\n✅ Order placed successfully!\n\nThis is a demo. In a real application, you would be redirected to the payment page.`);
        });
    }

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active to clicked button
            button.classList.add('active');

            // Add active to target panel
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

function toggleWishlist() {
    const index = wishlist.findIndex(item => item.id === currentProduct.id);

    if (index > -1) {
        wishlist.splice(index, 1);
        alert('❌ Removed from wishlist!');
    } else {
        wishlist.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0]
        });
        alert('❤️ Added to wishlist!');
    }

    saveToLocalStorage();
    updateWishlistIcon();
}

function updateWishlistIcon() {
    const wishlistBtn = document.getElementById('wishlistToggle');
    if (!wishlistBtn) return;

    const isInWishlist = wishlist.some(item => item.id === currentProduct.id);

    if (isInWishlist) {
        wishlistBtn.classList.add('active');
    } else {
        wishlistBtn.classList.remove('active');
    }
}

function loadSpecifications() {
    const specsTable = document.getElementById('specsTable');
    if (!specsTable) return;

    specsTable.innerHTML = Object.entries(currentProduct.specifications).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${value}</td>
        </tr>
    `).join('');
}

function loadReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;

    // Update summary
    document.getElementById('reviewsScore').textContent = currentProduct.rating.toFixed(1);
    renderStars('reviewsStars', currentProduct.rating);
    document.getElementById('reviewsTotal').textContent = `${currentProduct.reviews.toLocaleString()} reviews`;

    // Render reviews
    reviewsList.innerHTML = currentProduct.customerReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">
                    <div class="review-name">${review.name}</div>
                    ${review.verified ? `
                        <div class="review-verified">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Verified Purchase
                        </div>
                    ` : ''}
                </div>
                <div class="review-date">${formatDate(review.date)}</div>
            </div>
            <div class="review-rating">
                ${generateStars(review.rating)}
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += `
                <svg class="star filled" viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            `;
        } else {
            stars += `
                <svg class="star empty" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            `;
        }
    }
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on
    const path = window.location.pathname;

    if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
        initHomepage();
    } else if (path.endsWith('product.html')) {
        initProductPage();
    }

    // Always update cart count
    updateCartCount();
});

console.log('ShopVerse E-commerce Platform Loaded ✓');
console.log('Developed for Algonive Internship - Task 2');
