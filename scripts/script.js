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
// NOTIFICATION SYSTEM
// ===================================

function initNotifications() {
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(title, message, type = 'success', duration = 3000) {
    initNotifications();
    const container = document.querySelector('.notification-container');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ?
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
        type === 'error' ?
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' :
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close" onclick="this.parentElement.remove()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </div>
        <div class="toast-progress">
            <div class="toast-progress-bar"></div>
        </div>
    `;

    container.appendChild(toast);

    // Animation: show
    setTimeout(() => toast.classList.add('show'), 10);

    // Progress bar
    const progressBar = toast.querySelector('.toast-progress-bar');
    progressBar.style.transitionDuration = `${duration}ms`;
    progressBar.style.width = '0%';

    // Remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, duration);
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

    // Back to top functionality
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initial render
    renderProducts(products);
    updateCartCount();
    initHeroCarousel();
}

// Hero Carousel Logic
function initHeroCarousel() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.carousel-slide');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    const intervalTime = 5000; // 5 seconds

    function updateCarousel() {
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update active class for content animation
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }

    // Auto slide
    let carouselInterval = setInterval(nextSlide, intervalTime);

    // Pause on hover
    const carouselSection = document.querySelector('.hero-carousel');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        carouselSection.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, intervalTime);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
            // Reset interval
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, intervalTime);
        });
    });
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
                showNotification('Out of Stock', 'Sorry, this product is currently unavailable.', 'error');
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
            showNotification('Added to Cart', `${quantity} x ${currentProduct.name} added successfully!`, 'success');
        });
    }

    // Buy now
    const buyNowBtn = document.getElementById('buyNow');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            if (currentProduct.stock === 0) {
                showNotification('Out of Stock', 'Sorry, this product is out of stock!', 'error');
                return;
            }

            // Show checkout notification
            showNotification('Order Placed', `Your order for ${currentProduct.name} has been placed successfully!`, 'success');
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
        showNotification('Wishlist Updated', 'Product removed from your wishlist.', 'info');
    } else {
        wishlist.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0]
        });
        showNotification('Wishlist Updated', 'Product added to your wishlist.', 'success');
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

// ===================================
// CART PAGE FUNCTIONALITY
// ===================================

function initCartPage() {
    renderCart();
    updateCartCount();

    const checkoutBtn = document.getElementById('proceedCheckout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            showNotification('Order Success', 'Your order has been placed successfully! Total: ' + formatCurrency(calculateCartTotal()), 'success');
            cart = [];
            saveToLocalStorage();
            renderCart();
            updateCartCount();
        });
    }
}

function renderCart() {
    const list = document.getElementById('cartItemsList');
    const layout = document.getElementById('cartLayout');
    const empty = document.getElementById('emptyCart');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('cartTotal');

    if (!list) return;

    if (cart.length === 0) {
        layout.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    layout.style.display = 'grid';
    empty.style.display = 'none';

    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div>
                    <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-qty">
                        <button class="qty-control" onclick="updateItemQty(${index}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-control" onclick="updateItemQty(${index}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    const total = calculateCartTotal();
    subtotalEl.textContent = formatCurrency(total);
    totalEl.textContent = formatCurrency(total);
}

function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

window.updateItemQty = function (index, change) {
    const item = cart[index];
    const product = products.find(p => p.id === item.id);

    if (change > 0 && item.quantity >= (product ? product.stock : 10)) {
        showNotification('Limit Reached', 'Cannot add more. Stock limit for this product has been reached.', 'error');
        return;
    }

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(index);
    } else {
        saveToLocalStorage();
        renderCart();
        updateCartCount();
    }
};

window.removeFromCart = function (index) {
    const itemName = cart[index].name;
    if (confirm(`Are you sure you want to remove ${itemName} from your cart?`)) {
        cart.splice(index, 1);
        saveToLocalStorage();
        renderCart();
        updateCartCount();
        showNotification('Item Removed', 'Product has been removed from your cart.', 'info');
    }
};

// ===================================
// WISHLIST PAGE FUNCTIONALITY
// ===================================

function initWishlistPage() {
    renderWishlist();
    updateCartCount();
}

function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    const empty = document.getElementById('emptyWishlist');

    if (!grid) return;

    if (wishlist.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = wishlist.map((item, index) => {
        const product = products.find(p => p.id === item.id);
        const discount = product ? calculateDiscount(product.originalPrice, product.price) : 0;

        return `
            <div class="wishlist-card product-card">
                <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
                <div class="product-image-container" onclick="navigateToProduct(${item.id})">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                </div>
                <div class="product-content">
                    <h3 class="product-name" onclick="navigateToProduct(${item.id})">${item.name}</h3>
                    <div class="product-price">
                        <span class="price-current">${formatCurrency(item.price)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addToCartFromWishlist(${item.id})" style="padding: 10px; font-size: 14px; width: 100%; margin-top: 10px;">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.removeFromWishlist = function (id) {
    const index = wishlist.findIndex(item => item.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        saveToLocalStorage();
        renderWishlist();
    }
};

window.addToCartFromWishlist = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (product.stock === 0) {
        alert('Sorry, this product is out of stock!');
        return;
    }

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }

    saveToLocalStorage();
    updateCartCount();
    showNotification('Added to Cart', `${product.name} added from wishlist!`, 'success');
};

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
    } else if (path.endsWith('cart.html')) {
        initCartPage();
    } else if (path.endsWith('wishlist.html')) {
        initWishlistPage();
    }

    // Always update cart count
    updateCartCount();
});

console.log('ShopVerse E-commerce Platform Loaded ✓');
console.log('Developed for Algonive Internship - Task 2');

