/**
 * Cart Page Module
 * Handles shopping cart page functionality including item management, quantity updates, and checkout
 */

class CartPageManager {
  constructor() {
    this.cartSystem = null;
    this.cartItems = [];
    
    // DOM elements
    this.elements = {
      cartItems: document.getElementById('cartItems'),
      emptyCart: document.getElementById('emptyCart'),
      itemCount: document.getElementById('itemCount'),
      subtotal: document.getElementById('subtotal'),
      estimatedTax: document.getElementById('estimatedTax'),
      estimatedShipping: document.getElementById('estimatedShipping'),
      total: document.getElementById('total'),
      clearCartBtn: document.getElementById('clearCartBtn'),
      checkoutBtn: document.getElementById('checkoutBtn'),
      promoInput: document.getElementById('promoInput'),
      applyPromoBtn: document.getElementById('applyPromoBtn'),
      promoMessage: document.getElementById('promoMessage'),
      loadingOverlay: document.getElementById('loadingOverlay')
    };
    
    this.init();
  }

  /**
   * Initialize cart page
   */
  async init() {
    try {
      // Initialize cart system
      this.initializeCartSystem();
      
      // Load cart items
      await this.loadCartItems();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Render cart
      this.renderCart();
      
      console.log('Cart page initialized');
    } catch (error) {
      console.error('Failed to initialize cart page:', error);
      showError('Failed to load cart. Please refresh the page.');
    }
  }

  /**
   * Initialize cart system
   */
  initializeCartSystem() {
    if (typeof ShoppingCart !== 'undefined') {
      this.cartSystem = new ShoppingCart();
    } else {
      throw new Error('ShoppingCart not available');
    }
  }

  /**
   * Load cart items from cart system
   */
  async loadCartItems() {
    this.cartItems = this.cartSystem.getItems();
    console.log('Cart items loaded:', this.cartItems.length);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Clear cart button
    if (this.elements.clearCartBtn) {
      this.elements.clearCartBtn.addEventListener('click', () => {
        this.handleClearCart();
      });
    }

    // Checkout button
    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.addEventListener('click', () => {
        this.handleCheckout();
      });
    }

    // Promo code
    if (this.elements.applyPromoBtn) {
      this.elements.applyPromoBtn.addEventListener('click', () => {
        this.handleApplyPromo();
      });
    }

    if (this.elements.promoInput) {
      this.elements.promoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleApplyPromo();
        }
      });
    }

    // Cart update events
    document.addEventListener('cart-update', (event) => {
      this.handleCartUpdate(event);
    });
  }

  /**
   * Render cart
   */
  renderCart() {
    if (this.cartItems.length === 0) {
      this.renderEmptyCart();
    } else {
      this.renderCartItems();
      this.renderCartSummary();
    }
    
    this.updateCartCount();
  }

  /**
   * Render empty cart
   */
  renderEmptyCart() {
    if (this.elements.cartItems) {
      this.elements.cartItems.innerHTML = '';
    }
    
    if (this.elements.emptyCart) {
      this.elements.emptyCart.classList.remove('hidden');
    }
    
    // Disable checkout button
    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.disabled = true;
    }
  }

  /**
   * Render cart items
   */
  renderCartItems() {
    if (!this.elements.cartItems) return;
    
    this.elements.cartItems.innerHTML = '';
    
    this.cartItems.forEach(item => {
      const cartItemElement = this.createCartItemElement(item);
      this.elements.cartItems.appendChild(cartItemElement);
    });
    
    if (this.elements.emptyCart) {
      this.elements.emptyCart.classList.add('hidden');
    }
    
    // Enable checkout button
    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.disabled = false;
    }
  }

  /**
   * Create cart item element
   */
  createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.itemId = item.id;
    
    // Check for stock issues
    const stockIssues = this.checkStockIssues(item);
    const stockIssueClass = stockIssues.length > 0 ? 'stock-issue' : '';
    
    cartItem.innerHTML = `
      <img src="${item.variant.images.thumbnail}" alt="${item.variant.title}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-title">${this.escapeHtml(item.variant.title)}</h3>
        <div class="cart-item-meta">
          <span class="cart-item-brand">${this.escapeHtml(item.variant.brand)}</span>
          <span class="cart-item-category">${this.escapeHtml(item.variant.category)}</span>
        </div>
        <div class="cart-item-price">$${(item.variant.price * item.quantity).toFixed(2)}</div>
        ${stockIssues.length > 0 ? this.createStockIssueMessage(stockIssues) : ''}
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease-btn" data-item-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.variant.stock_count || 10}" data-item-id="${item.id}">
          <button class="quantity-btn increase-btn" data-item-id="${item.id}" ${item.quantity >= (item.variant.stock_count || 10) ? 'disabled' : ''}>+</button>
        </div>
        <button class="cart-item-remove" data-item-id="${item.id}">Remove</button>
      </div>
    `;
    
    // Add event listeners
    this.attachCartItemListeners(cartItem, item);
    
    return cartItem;
  }

  /**
   * Check for stock issues with cart item
   */
  checkStockIssues(item) {
    const issues = [];
    const maxQuantity = item.variant.stock_count || 10;
    
    if (item.quantity > maxQuantity) {
      issues.push({
        type: 'insufficient_stock',
        message: `Only ${maxQuantity} available in stock`
      });
    }
    
    if (maxQuantity === 0) {
      issues.push({
        type: 'out_of_stock',
        message: 'Item is out of stock'
      });
    }
    
    return issues;
  }

  /**
   * Create stock issue message HTML
   */
  createStockIssueMessage(issues) {
    const messages = issues.map(issue => issue.message).join(', ');
    return `<div class="stock-issue-message">${messages}</div>`;
  }

  /**
   * Attach event listeners to cart item
   */
  attachCartItemListeners(cartItemElement, item) {
    // Quantity decrease button
    const decreaseBtn = cartItemElement.querySelector('.decrease-btn');
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        this.handleQuantityChange(item.id, item.quantity - 1);
      });
    }

    // Quantity increase button
    const increaseBtn = cartItemElement.querySelector('.increase-btn');
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        this.handleQuantityChange(item.id, item.quantity + 1);
      });
    }

    // Quantity input
    const quantityInput = cartItemElement.querySelector('.quantity-input');
    if (quantityInput) {
      quantityInput.addEventListener('change', (e) => {
        const newQuantity = parseInt(e.target.value) || 1;
        this.handleQuantityChange(item.id, newQuantity);
      });
    }

    // Remove button
    const removeBtn = cartItemElement.querySelector('.cart-item-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        this.handleRemoveItem(item.id);
      });
    }
  }

  /**
   * Render cart summary
   */
  renderCartSummary() {
    const summary = this.cartSystem.getCartSummary();
    
    if (this.elements.itemCount) {
      this.elements.itemCount.textContent = summary.uniqueItemCount;
    }
    
    if (this.elements.subtotal) {
      this.elements.subtotal.textContent = `$${summary.subtotal.toFixed(2)}`;
    }
    
    if (this.elements.estimatedTax) {
      this.elements.estimatedTax.textContent = `$${summary.estimatedTax.toFixed(2)}`;
    }
    
    if (this.elements.estimatedShipping) {
      const shippingText = summary.estimatedShipping === 0 ? 'FREE' : `$${summary.estimatedShipping.toFixed(2)}`;
      this.elements.estimatedShipping.textContent = shippingText;
    }
    
    if (this.elements.total) {
      this.elements.total.textContent = `$${summary.total.toFixed(2)}`;
    }
  }

  /**
   * Handle quantity change
   */
  async handleQuantityChange(itemId, newQuantity) {
    try {
      this.showLoading();
      
      await this.cartSystem.updateItemQuantity(itemId, newQuantity);
      
      // Reload cart items
      await this.loadCartItems();
      
      // Re-render cart
      this.renderCart();
      
      showSuccess('Cart quantity updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Handle remove item
   */
  async handleRemoveItem(itemId) {
    try {
      this.showLoading();
      
      await this.cartSystem.removeItem(itemId);
      
      // Reload cart items
      await this.loadCartItems();
      
      // Re-render cart
      this.renderCart();
      
      showWarning('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Handle clear cart
   */
  async handleClearCart() {
    if (this.cartItems.length === 0) return;
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
      try {
        this.showLoading();
        
        this.cartSystem.clearCart();
        
        // Reload cart items
        await this.loadCartItems();
        
        // Re-render cart
        this.renderCart();
        
        showInfo('Cart cleared');
      } catch (error) {
        console.error('Failed to clear cart:', error);
        showError(error.message);
      } finally {
        this.hideLoading();
      }
    }
  }

  /**
   * Handle checkout
   */
  handleCheckout() {
    if (this.cartItems.length === 0) {
      showWarning('Your cart is empty');
      return;
    }
    
    // Check for stock issues
    const stockIssues = this.cartSystem.validateCartStock();
    if (stockIssues.length > 0) {
      const fixedCount = this.cartSystem.fixStockIssues();
      if (fixedCount > 0) {
        showWarning(`Fixed ${fixedCount} stock issues in your cart. Please review your cart before checkout.`);
        this.loadCartItems().then(() => this.renderCart());
        return;
      }
    }
    
    showBuyToast('Proceeding to checkout...');
    
    // Navigate to checkout page
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 1000);
  }

  /**
   * Handle apply promo code
   */
  handleApplyPromo() {
    const promoCode = this.elements.promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
      this.showPromoMessage('Please enter a promo code', 'error');
      return;
    }
    
    // Simulate promo code validation (in real app, this would be an API call)
    const validPromos = {
      'SAVE10': { discount: 0.1, description: '10% off' },
      'SAVE20': { discount: 0.2, description: '20% off' },
      'FREESHIP': { discount: 0, description: 'Free shipping', freeShipping: true },
      'NEWUSER': { discount: 0.15, description: '15% off for new users' }
    };
    
    if (validPromos[promoCode]) {
      const promo = validPromos[promoCode];
      this.applyPromo(promo, promoCode);
      this.showPromoMessage(`Promo code applied: ${promo.description}`, 'success');
      showSuccess(`Promo code "${promoCode}" applied successfully!`);
    } else {
      this.showPromoMessage('Invalid promo code', 'error');
      showError('Invalid promo code. Please try again.');
    }
  }

  /**
   * Apply promo code to cart
   */
  applyPromo(promo, promoCode) {
    // In a real application, this would update the cart total
    // For demo purposes, we'll just show the message
    console.log('Promo applied:', promo, promoCode);
    
    // Store promo in localStorage for checkout page
    localStorage.setItem('appliedPromo', JSON.stringify({
      code: promoCode,
      ...promo
    }));
  }

  /**
   * Show promo message
   */
  showPromoMessage(message, type) {
    if (!this.elements.promoMessage) return;
    
    this.elements.promoMessage.textContent = message;
    this.elements.promoMessage.className = `promo-message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      this.elements.promoMessage.textContent = '';
      this.elements.promoMessage.className = 'promo-message';
    }, 5000);
  }

  /**
   * Handle cart update events
   */
  handleCartUpdate(event) {
    const { type, data } = event.detail;
    
    // Reload cart items on cart updates
    this.loadCartItems().then(() => {
      this.renderCart();
    });
  }

  /**
   * Update cart count in header
   */
  updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      const itemCount = this.cartSystem.getItemCount();
      cartCountElement.textContent = itemCount;
      cartCountElement.style.display = itemCount > 0 ? 'block' : 'none';
    }
  }

  /**
   * Show loading overlay
   */
  showLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.remove('hidden');
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.classList.add('hidden');
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get cart summary
   */
  getCartSummary() {
    return this.cartSystem.getCartSummary();
  }

  /**
   * Refresh cart
   */
  async refreshCart() {
    await this.loadCartItems();
    this.renderCart();
  }

  /**
   * Destroy cart page manager
   */
  destroy() {
    // Clear event listeners
    if (this.elements.clearCartBtn) {
      this.elements.clearCartBtn.removeEventListener('click', () => {});
    }
    if (this.elements.checkoutBtn) {
      this.elements.checkoutBtn.removeEventListener('click', () => {});
    }
    if (this.elements.applyPromoBtn) {
      this.elements.applyPromoBtn.removeEventListener('click', () => {});
    }

    // Clear references
    this.cartSystem = null;
    this.cartItems = [];
    Object.keys(this.elements).forEach(key => {
      this.elements[key] = null;
    });

    console.log('Cart page manager destroyed');
  }
}

// Initialize cart page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create global cart page instance
  window.cartPageManager = new CartPageManager();
  
  // Make available globally
  window.CartPageManager = CartPageManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartPageManager;
}
