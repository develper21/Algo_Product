// ===================================
// SEARCH PAGE FUNCTIONALITY
// ===================================

let searchResults = [];
let searchQuery = '';
let searchSort = 'relevant';
let searchFilters = {
    category: '',
    priceRange: '',
    brand: '',
    rating: 0
};

function initSearchPage() {
    // Get search query from URL parameter
    searchQuery = getUrlParameter('q') || '';
    
    // Set search input value
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
    }

    // Perform search
    performSearch();
    updateCartCount();
}

function performSearch() {
    if (!searchQuery.trim()) {
        showNoResults();
        return;
    }

    // Search products
    searchResults = searchProducts(searchQuery);
    
    // Apply filters
    searchResults = applySearchFiltersToResults(searchResults);
    
    // Sort results
    searchResults = sortSearchResults(searchResults);
    
    // Display results
    displaySearchResults();
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return [];
    
    return products.filter(product => {
        // Search in product name
        if (product.name.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in brand
        if (product.brand.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in category
        if (product.category.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in description
        if (product.description.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        // Search in specifications
        if (product.specifications) {
            for (let [key, value] of Object.entries(product.specifications)) {
                if (key.toLowerCase().includes(searchTerm) || 
                    value.toString().toLowerCase().includes(searchTerm)) {
                    return true;
                }
            }
        }
        
        return false;
    });
}

function applySearchFiltersToResults(results) {
    let filtered = [...results];

    // Apply category filter
    if (searchFilters.category) {
        filtered = filtered.filter(product => 
            product.category.toLowerCase() === searchFilters.category.toLowerCase()
        );
    }

    // Apply price range filter
    if (searchFilters.priceRange) {
        filtered = filtered.filter(product => {
            const price = product.price;
            switch (searchFilters.priceRange) {
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
    if (searchFilters.brand) {
        filtered = filtered.filter(product => 
            product.brand.toLowerCase() === searchFilters.brand.toLowerCase()
        );
    }

    // Apply rating filter
    if (searchFilters.rating > 0) {
        filtered = filtered.filter(product => 
            product.rating >= searchFilters.rating
        );
    }

    return filtered;
}

function sortSearchResults(results) {
    const sorted = [...results];

    switch (searchSort) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'relevant':
        default:
            // Sort by relevance (exact matches first, then partial)
            return sorted.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const query = searchQuery.toLowerCase();
                
                const aExactMatch = aName === query;
                const bExactMatch = bName === query;
                
                if (aExactMatch && !bExactMatch) return -1;
                if (!aExactMatch && bExactMatch) return 1;
                
                const aStartsWith = aName.startsWith(query);
                const bStartsWith = bName.startsWith(query);
                
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                
                return 0;
            });
    }
}

function displaySearchResults() {
    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noSearchResults');
    const suggestions = document.getElementById('searchSuggestions');
    const resultsCount = document.getElementById('resultsCount');
    const searchQueryElement = document.getElementById('searchQuery');

    // Update search query display
    if (searchQueryElement) {
        searchQueryElement.textContent = `Searching for "${searchQuery}"`;
    }

    // Update results count
    if (resultsCount) {
        const count = searchResults.length;
        resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
    }

    if (!grid) return;

    if (searchResults.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'flex';
        suggestions.style.display = 'block';
        
        // Update no results query
        const noResultsQuery = document.getElementById('noResultsQuery');
        if (noResultsQuery) {
            noResultsQuery.textContent = searchQuery;
        }
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    suggestions.style.display = 'none';

    grid.innerHTML = searchResults.map(product => {
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

function showNoResults() {
    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noSearchResults');
    const suggestions = document.getElementById('searchSuggestions');
    const resultsCount = document.getElementById('resultsCount');

    if (grid) grid.style.display = 'none';
    if (noResults) noResults.style.display = 'flex';
    if (suggestions) suggestions.style.display = 'none';
    if (resultsCount) resultsCount.textContent = '0 results found';
}

function applySearchFilters() {
    // Get sort value
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        searchSort = sortSelect.value;
    }

    // Re-perform search with new filters
    performSearch();
}

function loadMoreResults() {
    // This would typically load more results from a paginated API
    // For now, we'll just show a message
    showNotification('Load More', 'All available products are displayed.', 'info');
}

// Enhanced search functionality for homepage search
function performGlobalSearch(query) {
    if (!query.trim()) return;
    
    // Redirect to search page with query
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

// Search suggestions (autocomplete)
function showSearchSuggestions(query) {
    if (!query.trim()) return;
    
    const suggestions = products
        .filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(product => product.name);
    
    return suggestions;
}

// Initialize search page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('search.html')) {
        initSearchPage();
    }
    
    // Add search functionality to all search inputs
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query) {
                    performGlobalSearch(query);
                }
            }
        });
        
        const searchBtn = input.parentElement.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = input.value.trim();
                if (query) {
                    performGlobalSearch(query);
                }
            });
        }
    });
});
