// ===================================
// AUTOCOMPLETE SEARCH FUNCTIONALITY
// ===================================

let searchSuggestions = [];
let currentSearchIndex = -1;

function initAutocompleteSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        // Create autocomplete container
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.className = 'search-autocomplete';
        autocompleteContainer.style.display = 'none';
        
        // Insert after search input wrapper
        const searchWrapper = input.parentElement;
        searchWrapper.appendChild(autocompleteContainer);
        
        // Event listeners
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 1) {
                showSearchSuggestions(query, autocompleteContainer);
            } else {
                hideSearchSuggestions(autocompleteContainer);
            }
        });
        
        input.addEventListener('focus', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 1) {
                showSearchSuggestions(query, autocompleteContainer);
            }
        });
        
        input.addEventListener('keydown', (e) => {
            handleSearchKeydown(e, autocompleteContainer, input);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) {
                hideSearchSuggestions(autocompleteContainer);
            }
        });
    });
}

function showSearchSuggestions(query, container) {
    const suggestions = getSearchSuggestions(query);
    currentSearchIndex = -1;
    
    if (suggestions.length === 0) {
        hideSearchSuggestions(container);
        return;
    }
    
    const suggestionsHTML = suggestions.map((suggestion, index) => {
        const highlightedText = highlightSearchTerm(suggestion.name, query);
        const categoryIcon = getCategoryIcon(suggestion.category);
        
        return `
            <div class="search-suggestion-item" data-index="${index}" data-query="${suggestion.name}">
                <div class="suggestion-icon">${categoryIcon}</div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${highlightedText}</div>
                    <div class="suggestion-category">${suggestion.category}</div>
                </div>
                <div class="suggestion-price">${formatCurrency(suggestion.price)}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = suggestionsHTML;
    container.style.display = 'block';
    
    // Add click handlers to suggestions
    container.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const searchQuery = item.dataset.query;
            const searchInput = container.parentElement.querySelector('.search-input');
            searchInput.value = searchQuery;
            hideSearchSuggestions(container);
            performGlobalSearch(searchQuery);
        });
    });
}

function hideSearchSuggestions(container) {
    container.style.display = 'none';
    container.innerHTML = '';
    currentSearchIndex = -1;
}

function getSearchSuggestions(query) {
    const searchTerm = query.toLowerCase();
    const maxSuggestions = 8;
    
    // Search in products
    const productSuggestions = products
        .filter(product => {
            return product.name.toLowerCase().includes(searchTerm) ||
                   product.brand.toLowerCase().includes(searchTerm) ||
                   product.category.toLowerCase().includes(searchTerm);
        })
        .map(product => ({
            name: product.name,
            category: product.category,
            price: product.price,
            type: 'product'
        }))
        .slice(0, maxSuggestions);
    
    // Add category suggestions
    const categories = [
        'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 
        'Mobiles', 'Laptops', 'Headphones', 'Cameras', 'Watches',
        'Men\'s Clothing', 'Women\'s Clothing', 'Footwear', 'Furniture'
    ];
    
    const categorySuggestions = categories
        .filter(category => category.toLowerCase().includes(searchTerm))
        .map(category => ({
            name: category,
            category: 'Category',
            price: null,
            type: 'category'
        }))
        .slice(0, 3);
    
    // Combine and limit suggestions
    return [...productSuggestions, ...categorySuggestions].slice(0, maxSuggestions);
}

function highlightSearchTerm(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

function getCategoryIcon(category) {
    const icons = {
        'Electronics': '📱',
        'Fashion': '👕',
        'Home & Kitchen': '🏠',
        'Beauty': '💄',
        'Sports': '⚽',
        'Mobiles': '📱',
        'Laptops': '💻',
        'Headphones': '🎧',
        'Cameras': '📷',
        'Watches': '⌚',
        'Men\'s Clothing': '👔',
        'Women\'s Clothing': '👗',
        'Footwear': '👟',
        'Furniture': '🛋️'
    };
    
    return icons[category] || '📦';
}

function handleSearchKeydown(e, container, input) {
    const items = container.querySelectorAll('.search-suggestion-item');
    
    if (items.length === 0) return;
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            currentSearchIndex = Math.min(currentSearchIndex + 1, items.length - 1);
            updateActiveSuggestion(items, currentSearchIndex);
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            currentSearchIndex = Math.max(currentSearchIndex - 1, -1);
            updateActiveSuggestion(items, currentSearchIndex);
            break;
            
        case 'Enter':
            e.preventDefault();
            if (currentSearchIndex >= 0 && items[currentSearchIndex]) {
                items[currentSearchIndex].click();
            } else {
                performGlobalSearch(input.value);
            }
            break;
            
        case 'Escape':
            hideSearchSuggestions(container);
            input.blur();
            break;
    }
}

function updateActiveSuggestion(items, activeIndex) {
    items.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
            // Scroll into view if needed
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize autocomplete search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAutocompleteSearch();
});
