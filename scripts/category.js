// ===================================
// CATEGORY PAGE FUNCTIONALITY
// ===================================

let categoryFilters = {
    subcategories: [],
    priceRange: '',
    brands: [],
    rating: 0,
    sort: 'featured'
};

function initCategoryPage() {
    const categoryName = getCategoryFromURL();
    renderCategoryProducts(categoryName);
    updateCartCount();
}

function getCategoryFromURL() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');
    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
}

function renderCategoryProducts(categoryName) {
    let filteredProducts = products.filter(product => {
        // Filter by main category
        if (categoryName === 'Electronics') {
            return product.category === 'Electronics' || product.category === 'Audio';
        } else if (categoryName === 'Fashion') {
            return product.category === 'Fashion';
        } else if (categoryName === 'Home') {
            return product.category === 'Home Appliances';
        }
        return false;
    });

    // Apply filters
    filteredProducts = applyFiltersToProducts(filteredProducts);

    // Sort products
    filteredProducts = sortProducts(filteredProducts);

    // Render products
    const grid = document.getElementById('categoryProductsGrid');
    const noProducts = document.getElementById('noCategoryProducts');

    if (!grid) return;

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noProducts.style.display = 'flex';
        return;
    }

    grid.style.display = 'grid';
    noProducts.style.display = 'none';

    grid.innerHTML = filteredProducts.map(product => {
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

function applyFiltersToProducts(productsToFilter) {
    let filtered = [...productsToFilter];

    // Apply subcategory filter
    if (categoryFilters.subcategories.length > 0) {
        filtered = filtered.filter(product => {
            return categoryFilters.subcategories.some(subcat => 
                product.name.toLowerCase().includes(subcat.toLowerCase()) ||
                product.category.toLowerCase().includes(subcat.toLowerCase())
            );
        });
    }

    // Apply price range filter
    if (categoryFilters.priceRange) {
        filtered = filtered.filter(product => {
            const price = product.price;
            switch (categoryFilters.priceRange) {
                case '0-10000':
                    return price <= 10000;
                case '10000-50000':
                    return price > 10000 && price <= 50000;
                case '50000-100000':
                    return price > 50000 && price <= 100000;
                case '100000+':
                    return price > 100000;
                default:
                    return true;
            }
        });
    }

    // Apply brand filter
    if (categoryFilters.brands.length > 0) {
        filtered = filtered.filter(product => {
            return categoryFilters.brands.includes(product.brand);
        });
    }

    // Apply rating filter
    if (categoryFilters.rating > 0) {
        filtered = filtered.filter(product => {
            return product.rating >= categoryFilters.rating;
        });
    }

    return filtered;
}

function sortProducts(productsToSort) {
    const sorted = [...productsToSort];

    switch (categoryFilters.sort) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'featured':
        default:
            return sorted;
    }
}

function applyCategoryFilters() {
    // Get subcategory filters
    const subcategoryCheckboxes = document.querySelectorAll('input[type="checkbox"][value="Mobiles"], input[type="checkbox"][value="Laptops"], input[type="checkbox"][value="Audio"], input[type="checkbox"][value="Cameras"], input[type="checkbox"][value="TV"]');
    categoryFilters.subcategories = Array.from(subcategoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Get price range filter
    const priceRadio = document.querySelector('input[name="priceRange"]:checked');
    categoryFilters.priceRange = priceRadio ? priceRadio.value : '';

    // Get brand filters
    const brandCheckboxes = document.querySelectorAll('input[type="checkbox"][value="Apple"], input[type="checkbox"][value="Samsung"], input[type="checkbox"][value="Sony"], input[type="checkbox"][value="Canon"]');
    categoryFilters.brands = Array.from(brandCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    // Get rating filter
    const ratingCheckboxes = document.querySelectorAll('input[type="checkbox"][value="4"], input[type="checkbox"][value="3"]');
    categoryFilters.rating = Array.from(ratingCheckboxes)
        .filter(cb => cb.checked)
        .reduce((max, cb) => Math.max(max, parseInt(cb.value)), 0);

    // Get sort filter
    const sortSelect = document.getElementById('sortSelect');
    categoryFilters.sort = sortSelect ? sortSelect.value : 'featured';

    // Re-render products
    const categoryName = getCategoryFromURL();
    renderCategoryProducts(categoryName);
}

function resetCategoryFilters() {
    // Reset all checkboxes and radio buttons
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
    
    // Reset sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'featured';

    // Reset filters object
    categoryFilters = {
        subcategories: [],
        priceRange: '',
        brands: [],
        rating: 0,
        sort: 'featured'
    };

    // Re-render products
    const categoryName = getCategoryFromURL();
    renderCategoryProducts(categoryName);
}

// Initialize category page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('electronics.html') || 
        window.location.pathname.includes('fashion.html') || 
        window.location.pathname.includes('home.html')) {
        initCategoryPage();
    }
});
