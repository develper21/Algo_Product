/**
 * Main Application Entry Point
 * Handles app initialization and module coordination for multi-product e-commerce site
 */

class AlgoProductApp {
  constructor() {
    this.productsManager = null;
    this.cartSystem = null;
    this.toastSystem = null;
    this.isLoading = false;
    
    // DOM element references
    this.elements = {
      loadingOverlay: document.getElementById('loadingOverlay'),
      cartButton: document.getElementById('cartButton'),
      cartCount: document.getElementById('cartCount')
    };
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Show loading state
      this.showLoading();
      
      // Initialize modules
      await this.initializeModules();
      
      // Setup global event listeners
      this.setupEventListeners();
      
      // Update cart count
      this.updateCartCount();
      
      // Hide loading state
      this.hideLoading();
      
      // Show welcome toast
      showInfo('Welcome to AlgoProduct! Start shopping our amazing products.', {
        duration: 3000
      });
      
      console.log('AlgoProduct E-commerce App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.handleError(error);
    }
  }

  /**
   * Initialize application modules
   */
  async initializeModules() {
    // Initialize Toast System (already initialized in toast.js)
    this.toastSystem = window.toastSystem;
    
    // Initialize Cart System
    if (typeof ShoppingCart !== 'undefined') {
      this.cartSystem = new ShoppingCart();
      window.cartSystem = this.cartSystem;
    } else {
      throw new Error('ShoppingCart not available');
    }

    // Initialize Products Manager
    if (typeof ProductsManager !== 'undefined') {
      this.productsManager = new ProductsManager();
      window.productsManager = this.productsManager;
    } else {
      throw new Error('ProductsManager not available');
    }
    
    console.log('All modules initialized');
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Cart button click
    if (this.elements.cartButton) {
      this.elements.cartButton.addEventListener('click', () => {
        this.handleCartClick();
      });
    }

    // Cart update events
    document.addEventListener('cart-update', (event) => {
      this.handleCartUpdate(event);
    });

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.updateCartCount();
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });

    console.log('Global event listeners setup complete');
  }

  /**
   * Handle cart button click
   */
  handleCartClick() {
    if (!this.cartSystem) return;

    const cartItems = this.cartSystem.getItems();
    const itemCount = this.cartSystem.getItemCount();

    if (itemCount === 0) {
      showInfo('Your cart is empty. Add some products to start shopping!');
      return;
    }

    // Show cart summary toast
    const summary = this.cartSystem.getCartSummary();
    showCartToast(`You have ${itemCount} items in your cart. Total: $${summary.total.toFixed(2)}`, {
      action: {
        text: 'View Cart',
        callback: () => {
          this.navigateToPage('cart.html');
        }
      },
      persistent: true
    });
  }

  /**
   * Handle cart update events
   */
  handleCartUpdate(event) {
    const { type, data } = event.detail;
    
    // Update cart count
    this.updateCartCount();
    
    // Handle different cart events
    switch (type) {
      case 'item-added':
        showSuccess(`Item added to cart! (${data.totalItems} items total)`);
        break;
      case 'item-removed':
        showWarning('Item removed from cart');
        break;
      case 'quantity-updated':
        showInfo('Cart quantity updated');
        break;
      case 'cart-cleared':
        showInfo('Cart cleared');
        break;
      case 'cart-imported':
        showSuccess(`Cart imported with ${data.importedItemsCount} items`);
        break;
      case 'stock-issues-fixed':
        showWarning(`Fixed ${data.fixedItemsCount} stock issues in your cart`);
        break;
    }
  }

  /**
   * Handle browser back/forward navigation
   */
  handlePopState(event) {
    // Reload page state if needed
    console.log('Popstate event:', event);
  }

  /**
   * Navigate to different pages
   */
  navigateToPage(page) {
    window.location.href = page;
  }

  /**
   * Update cart count display
   */
  updateCartCount() {
    if (!this.cartSystem || !this.elements.cartCount) return;

    const itemCount = this.cartSystem.getItemCount();
    this.elements.cartCount.textContent = itemCount;
    this.elements.cartCount.style.display = itemCount > 0 ? 'block' : 'none';
  }

  /**
   * Show loading overlay
   */
  showLoading() {
    this.isLoading = true;
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.remove('hidden');
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    this.isLoading = false;
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.add('hidden');
    }
  }

  /**
   * Handle application errors
   */
  handleError(error) {
    console.error('Application error:', error);
    this.hideLoading();
    
    // Show error toast
    showError(error.message || 'An unexpected error occurred. Please refresh the page and try again.');
    
    // Show error message on page if needed
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-error';
    errorElement.style.position = 'fixed';
    errorElement.style.top = '20px';
    errorElement.style.left = '50%';
    errorElement.style.transform = 'translateX(-50%)';
    errorElement.style.zIndex = '9999';
    errorElement.innerHTML = `
      <div class="alert-content">
        <div class="alert-title">Error</div>
        <div class="alert-message">${error.message || 'An unexpected error occurred. Please refresh the page and try again.'}</div>
      </div>
    `;
    
    document.body.appendChild(errorElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.parentNode.removeChild(errorElement);
      }
    }, 5000);
  }

  /**
   * Get application state
   */
  getAppState() {
    return {
      isLoading: this.isLoading,
      cartItemCount: this.cartSystem ? this.cartSystem.getItemCount() : 0,
      productsCount: this.productsManager ? this.productsManager.products.length : 0
    };
  }

  /**
   * Check if app is loading
   */
  isLoadingState() {
    return this.isLoading;
  }

  /**
   * Get products manager
   */
  getProductsManager() {
    return this.productsManager;
  }

  /**
   * Get cart system
   */
  getCartSystem() {
    return this.cartSystem;
  }

  /**
   * Get toast system
   */
  getToastSystem() {
    return this.toastSystem;
  }

  /**
   * Destroy application
   */
  destroy() {
    // Destroy modules
    if (this.productsManager) {
      this.productsManager.destroy();
    }
    
    if (this.cartSystem) {
      this.cartSystem.destroy();
    }
    
    // Clear references
    this.productsManager = null;
    this.cartSystem = null;
    this.toastSystem = null;
    
    // Clear element references
    Object.keys(this.elements).forEach(key => {
      this.elements[key] = null;
    });
    
    console.log('AlgoProduct E-commerce App destroyed');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create global app instance
  window.algoProductApp = new AlgoProductApp();
  
  // Make app available to other modules
  window.AlgoProductApp = AlgoProductApp;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AlgoProductApp;
}
