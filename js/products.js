/**
 * Products Manager
 * Handles product data, filtering, sorting, and rendering for the e-commerce site
 */

class ProductsManager {
  constructor() {
    this.products = [];
    this.categories = [];
    this.filteredProducts = [];
    this.currentCategory = '';
    this.currentSort = 'featured';
    this.searchTerm = '';
    this.currentPage = 1;
    this.productsPerPage = 12;
    
    // DOM element references
    this.elements = {
      productsGrid: document.getElementById('productsGrid'),
      categoriesGrid: document.getElementById('categoriesGrid'),
      categoryFilter: document.getElementById('categoryFilter'),
      sortFilter: document.getElementById('sortFilter'),
      searchInput: document.getElementById('searchInput'),
      searchBtn: document.getElementById('searchBtn'),
      loadMoreBtn: document.getElementById('loadMoreBtn'),
      productModal: document.getElementById('productModal'),
      modalClose: document.getElementById('modalClose')
    };
    
    this.init();
  }

  /**
   * Initialize the products manager
   */
  async init() {
    try {
      // Load product data
      await this.loadProducts();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Render initial content
      this.renderCategories();
      this.renderProducts();
      
      console.log('ProductsManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ProductsManager:', error);
      throw error;
    }
  }

  /**
   * Load product data
   */
  async loadProducts() {
    // Sample product data - in real app this would come from API
    this.products = [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 299.99,
        originalPrice: 399.99,
        category: 'Electronics',
        rating: 4.5,
        reviews: 234,
        image: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Headphones',
        badge: 'best-seller',
        stock: 15,
        description: 'Premium noise-cancelling wireless headphones with exceptional sound quality.'
      },
      {
        id: 2,
        name: 'Smart Watch Pro',
        price: 449.99,
        originalPrice: 599.99,
        category: 'Electronics',
        rating: 4.8,
        reviews: 512,
        image: 'https://via.placeholder.com/300x300/7C3AED/FFFFFF?text=Smart+Watch',
        badge: 'new-arrival',
        stock: 8,
        description: 'Advanced fitness tracking and health monitoring smartwatch.'
      },
      {
        id: 3,
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        originalPrice: 39.99,
        category: 'Clothing',
        rating: 4.2,
        reviews: 128,
        image: 'https://via.placeholder.com/300x300/EC4899/FFFFFF?text=T-Shirt',
        stock: 50,
        description: 'Comfortable organic cotton t-shirt in various colors.'
      },
      {
        id: 4,
        name: 'Professional Laptop Backpack',
        price: 79.99,
        originalPrice: 99.99,
        category: 'Accessories',
        rating: 4.6,
        reviews: 189,
        image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Backpack',
        badge: 'limited-offer',
        stock: 25,
        description: 'Durable laptop backpack with multiple compartments and USB charging.'
      },
      {
        id: 5,
        name: '4K Webcam',
        price: 129.99,
        originalPrice: 179.99,
        category: 'Electronics',
        rating: 4.4,
        reviews: 96,
        image: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Webcam',
        stock: 12,
        description: 'Ultra HD 4K webcam with auto-focus and noise reduction.'
      },
      {
        id: 6,
        name: 'Yoga Mat Premium',
        price: 49.99,
        originalPrice: 69.99,
        category: 'Sports',
        rating: 4.7,
        reviews: 342,
        image: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Yoga+Mat',
        stock: 30,
        description: 'Extra thick non-slip yoga mat with carrying strap.'
      }
    ];
    
    // Extract unique categories
    this.categories = [...new Set(this.products.map(product => product.category))];
    
    // Initialize filtered products
    this.filteredProducts = [...this.products];
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Category filter
    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.applyFilters();
      });
    }

    // Sort filter
    if (this.elements.sortFilter) {
      this.elements.sortFilter.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applySorting();
      });
    }

    // Search functionality
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.applyFilters();
      });
    }

    if (this.elements.searchBtn) {
      this.elements.searchBtn.addEventListener('click', () => {
        this.applyFilters();
      });
    }

    // Load more button
    if (this.elements.loadMoreBtn) {
      this.elements.loadMoreBtn.addEventListener('click', () => {
        this.loadMoreProducts();
      });
    }

    // Modal close
    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => {
        this.closeProductModal();
      });
    }

    // Close modal on outside click
    if (this.elements.productModal) {
      this.elements.productModal.addEventListener('click', (e) => {
        if (e.target === this.elements.productModal) {
          this.closeProductModal();
        }
      });
    }
  }

  /**
   * Render categories
   */
  renderCategories() {
    if (!this.elements.categoriesGrid) return;

    const categoriesHTML = this.categories.map(category => `
      <div class="category-card" data-category="${category}">
        <div class="category-icon">${category.charAt(0)}</div>
        <div class="category-name">${category}</div>
        <div class="category-count">${this.products.filter(p => p.category === category).length} items</div>
      </div>
    `).join('');

    this.elements.categoriesGrid.innerHTML = categoriesHTML;

    // Add click handlers
    this.elements.categoriesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (card) {
        const category = card.dataset.category;
        this.filterByCategory(category);
      }
    });
  }

  /**
   * Render products
   */
  renderProducts() {
    if (!this.elements.productsGrid) return;

    const productsToShow = this.getProductsForCurrentPage();
    
    const productsHTML = productsToShow.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        ${product.badge ? `<div class="product-badge ${product.badge}">${this.formatBadge(product.badge)}</div>` : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-rating">
            <div class="product-rating-stars">${this.renderStars(product.rating)}</div>
            <span class="product-rating-count">(${product.reviews})</span>
          </div>
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
          </div>
          <div class="product-stock ${this.getStockClass(product.stock)}">
            ${this.getStockText(product.stock)}
          </div>
          <div class="product-actions">
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <button class="buy-now-btn" data-product-id="${product.id}">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');

    this.elements.productsGrid.innerHTML = productsHTML;

    // Add product action handlers
    this.elements.productsGrid.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('.add-to-cart-btn');
      const buyNowBtn = e.target.closest('.buy-now-btn');
      const productImage = e.target.closest('.product-image');
      const productTitle = e.target.closest('.product-title');

      if (addToCartBtn) {
        const productId = parseInt(addToCartBtn.dataset.productId);
        this.handleAddToCart(productId);
      } else if (buyNowBtn) {
        const productId = parseInt(buyNowBtn.dataset.productId);
        this.handleBuyNow(productId);
      } else if (productImage || productTitle) {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.dataset.productId);
        this.showProductDetails(productId);
      }
    });

    // Update load more button
    this.updateLoadMoreButton();
  }

  /**
   * Get products for current page
   */
  getProductsForCurrentPage() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  /**
   * Apply filters
   */
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = !this.currentCategory || product.category === this.currentCategory;
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.category.toLowerCase().includes(this.searchTerm) ||
        product.description.toLowerCase().includes(this.searchTerm);
      
      return matchesCategory && matchesSearch;
    });

    this.currentPage = 1;
    this.applySorting();
    this.renderProducts();
  }

  /**
   * Apply sorting
   */
  applySorting() {
    switch (this.currentSort) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // featured
        // Keep original order or implement featured logic
        break;
    }

    this.renderProducts();
  }

  /**
   * Filter by category
   */
  filterByCategory(category) {
    this.currentCategory = category;
    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.value = category;
    }
    this.applyFilters();
  }

  /**
   * Load more products
   */
  loadMoreProducts() {
    this.currentPage++;
    const productsToShow = this.getProductsForCurrentPage();
    
    if (productsToShow.length === 0) {
      this.currentPage--;
      return;
    }

    const productsHTML = productsToShow.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        ${product.badge ? `<div class="product-badge ${product.badge}">${this.formatBadge(product.badge)}</div>` : ''}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-rating">
            <div class="product-rating-stars">${this.renderStars(product.rating)}</div>
            <span class="product-rating-count">(${product.reviews})</span>
          </div>
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
          </div>
          <div class="product-stock ${this.getStockClass(product.stock)}">
            ${this.getStockText(product.stock)}
          </div>
          <div class="product-actions">
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <button class="buy-now-btn" data-product-id="${product.id}">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');

    this.elements.productsGrid.insertAdjacentHTML('beforeend', productsHTML);
    this.updateLoadMoreButton();
  }

  /**
   * Update load more button
   */
  updateLoadMoreButton() {
    if (!this.elements.loadMoreBtn) return;

    const hasMore = this.currentPage * this.productsPerPage < this.filteredProducts.length;
    this.elements.loadMoreBtn.style.display = hasMore ? 'block' : 'none';
  }

  /**
   * Show product details modal
   */
  showProductDetails(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modalHTML = `
      <div class="product-detail">
        <div class="product-detail-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-detail-info">
          <h2>${product.name}</h2>
          <div class="product-rating">
            <div class="product-rating-stars">${this.renderStars(product.rating)}</div>
            <span class="product-rating-count">(${product.reviews} reviews)</span>
          </div>
          <div class="product-price">
            <span class="current-price">$${product.price}</span>
            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-stock ${this.getStockClass(product.stock)}">
            ${this.getStockText(product.stock)}
          </div>
          <div class="product-actions">
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <button class="buy-now-btn" data-product-id="${product.id}">Buy Now</button>
          </div>
        </div>
      </div>
    `;

    if (this.elements.modalBody) {
      this.elements.modalBody.innerHTML = modalHTML;
    }

    if (this.elements.productModal) {
      this.elements.productModal.classList.remove('hidden');
      this.elements.productModal.classList.add('show');
    }
  }

  /**
   * Close product modal
   */
  closeProductModal() {
    if (this.elements.productModal) {
      this.elements.productModal.classList.remove('show');
      this.elements.productModal.classList.add('hidden');
    }
  }

  /**
   * Handle add to cart
   */
  handleAddToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Check if cart system is available
    if (window.cartSystem) {
      window.cartSystem.addItem(product);
    } else {
      console.warn('Cart system not available');
      showWarning('Cart system not available');
    }
  }

  /**
   * Handle buy now
   */
  handleBuyNow(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Add to cart and navigate to checkout
    if (window.cartSystem) {
      window.cartSystem.addItem(product);
      window.location.href = 'checkout.html';
    } else {
      console.warn('Cart system not available');
      showWarning('Cart system not available');
    }
  }

  /**
   * Render star rating
   */
  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<span class="star filled">★</span>';
    }
    if (halfStar) {
      stars += '<span class="star half">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<span class="star">★</span>';
    }

    return stars;
  }

  /**
   * Format badge text
   */
  formatBadge(badge) {
    return badge.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  /**
   * Get stock class
   */
  getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  /**
   * Get stock text
   */
  getStockText(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Only ${stock} left`;
    return 'In Stock';
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category) {
    return this.products.filter(product => product.category === category);
  }

  /**
   * Get product by ID
   */
  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  /**
   * Search products
   */
  searchProducts(term) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
    return this.filteredProducts;
  }

  /**
   * Get all categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(count = 6) {
    return this.products.slice(0, count);
  }

  /**
   * Destroy products manager
   */
  destroy() {
    // Clear references
    this.products = [];
    this.categories = [];
    this.filteredProducts = [];
    
    // Clear element references
    Object.keys(this.elements).forEach(key => {
      this.elements[key] = null;
    });
    
    console.log('ProductsManager destroyed');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Make ProductsManager available globally
  window.ProductsManager = ProductsManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductsManager;
}
