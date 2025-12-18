/**
 * Shopping Cart Module
 * Handles LocalStorage cart functionality and cart management
 */

class ShoppingCart {
  constructor() {
    this.storageKey = 'amazon_cart';
    this.cartItems = [];
    this.maxItems = 50; // Maximum items in cart
    
    // Initialize cart from localStorage
    this.loadCart();
    
    console.log('ShoppingCart initialized');
  }

  /**
   * Load cart from localStorage
   */
  loadCart() {
    try {
      const storedCart = localStorage.getItem(this.storageKey);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart);
        // Validate cart data
        this.cartItems = this.validateCartData(this.cartItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      this.cartItems = [];
      this.saveCart();
    }
  }

  /**
   * Save cart to localStorage
   */
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
      console.log('Cart saved to localStorage');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.handleStorageQuotaExceeded();
      }
    }
  }

  /**
   * Add item to cart
   */
  addItem(variant, quantity = 1) {
    if (!variant || !variant.asin) {
      throw new Error('Invalid variant data');
    }
    
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    // Check if item already exists in cart
    const existingItemIndex = this.cartItems.findIndex(item => item.variant.asin === variant.asin);
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const existingItem = this.cartItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock availability
      const maxQuantity = variant.stock_count || 10;
      if (newQuantity > maxQuantity) {
        throw new Error(`Cannot add more than ${maxQuantity} items of this product`);
      }
      
      this.cartItems[existingItemIndex].quantity = newQuantity;
      this.cartItems[existingItemIndex].updatedAt = new Date().toISOString();
    } else {
      // Add new item
      if (this.cartItems.length >= this.maxItems) {
        throw new Error('Cart is full. Maximum items allowed: ' + this.maxItems);
      }
      
      const cartItem = {
        id: this.generateItemId(),
        variant: variant,
        quantity: quantity,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.cartItems.push(cartItem);
    }
    
    // Save to localStorage
    this.saveCart();
    
    // Dispatch custom event for cart updates
    this.dispatchCartEvent('item-added', {
      variant: variant,
      quantity: quantity,
      totalItems: this.getItemCount()
    });
    
    console.log('Item added to cart:', variant.asin, quantity);
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId) {
    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    const removedItem = this.cartItems[itemIndex];
    this.cartItems.splice(itemIndex, 1);
    
    // Save to localStorage
    this.saveCart();
    
    // Dispatch custom event
    this.dispatchCartEvent('item-removed', {
      removedItem: removedItem,
      totalItems: this.getItemCount()
    });
    
    console.log('Item removed from cart:', itemId);
  }

  /**
   * Update item quantity
   */
  updateItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    const item = this.cartItems[itemIndex];
    const maxQuantity = item.variant.stock_count || 10;
    
    if (newQuantity > maxQuantity) {
      throw new Error(`Cannot add more than ${maxQuantity} items of this product`);
    }
    
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;
    item.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    this.saveCart();
    
    // Dispatch custom event
    this.dispatchCartEvent('quantity-updated', {
      itemId: itemId,
      oldQuantity: oldQuantity,
      newQuantity: newQuantity,
      totalItems: this.getItemCount()
    });
    
    console.log('Item quantity updated:', itemId, newQuantity);
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    const itemCount = this.cartItems.length;
    this.cartItems = [];
    
    // Save to localStorage
    this.saveCart();
    
    // Dispatch custom event
    this.dispatchCartEvent('cart-cleared', {
      clearedItemsCount: itemCount
    });
    
    console.log('Cart cleared');
  }

  /**
   * Get all cart items
   */
  getItems() {
    return [...this.cartItems]; // Return copy to prevent mutation
  }

  /**
   * Get cart item by ID
   */
  getItem(itemId) {
    return this.cartItems.find(item => item.id === itemId);
  }

  /**
   * Get total number of items in cart
   */
  getItemCount() {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get total number of unique items in cart
   */
  getUniqueItemCount() {
    return this.cartItems.length;
  }

  /**
   * Calculate cart subtotal
   */
  getSubtotal() {
    return this.cartItems.reduce((total, item) => {
      return total + (item.variant.price * item.quantity);
    }, 0);
  }

  /**
   * Calculate estimated tax (simplified - 8.25%)
   */
  getEstimatedTax() {
    return this.getSubtotal() * 0.0825;
  }

  /**
   * Calculate estimated shipping (simplified - free over $25, otherwise $5.99)
   */
  getEstimatedShipping() {
    return this.getSubtotal() >= 25 ? 0 : 5.99;
  }

  /**
   * Calculate total cart amount
   */
  getTotal() {
    return this.getSubtotal() + this.getEstimatedTax() + this.getEstimatedShipping();
  }

  /**
   * Check if cart is empty
   */
  isEmpty() {
    return this.cartItems.length === 0;
  }

  /**
   * Check if cart is full
   */
  isFull() {
    return this.cartItems.length >= this.maxItems;
  }

  /**
   * Get cart summary for display
   */
  getCartSummary() {
    return {
      itemCount: this.getItemCount(),
      uniqueItemCount: this.getUniqueItemCount(),
      subtotal: this.getSubtotal(),
      estimatedTax: this.getEstimatedTax(),
      estimatedShipping: this.getEstimatedShipping(),
      total: this.getTotal(),
      isEmpty: this.isEmpty(),
      isFull: this.isFull()
    };
  }

  /**
   * Generate unique item ID
   */
  generateItemId() {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate cart data integrity
   */
  validateCartData(cartData) {
    if (!Array.isArray(cartData)) {
      return [];
    }
    
    return cartData.filter(item => {
      // Check required fields
      if (!item.id || !item.variant || !item.variant.asin) {
        console.warn('Invalid cart item found and removed:', item);
        return false;
      }
      
      // Check quantity
      if (!item.quantity || item.quantity <= 0) {
        console.warn('Invalid quantity in cart item:', item);
        return false;
      }
      
      return true;
    });
  }

  /**
   * Handle localStorage quota exceeded
   */
  handleStorageQuotaExceeded() {
    console.warn('localStorage quota exceeded, clearing old items');
    
    // Sort by added date and remove oldest items
    this.cartItems.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
    
    // Remove oldest 10 items
    const removedItems = this.cartItems.splice(0, Math.min(10, this.cartItems.length));
    
    console.log('Removed items due to storage quota:', removedItems);
    
    // Try to save again
    try {
      this.saveCart();
    } catch (error) {
      console.error('Still cannot save to localStorage after cleanup:', error);
      // Clear cart completely as last resort
      this.cartItems = [];
    }
  }

  /**
   * Dispatch custom cart event
   */
  dispatchCartEvent(eventType, data) {
    const event = new CustomEvent('cart-update', {
      detail: {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Export cart data for backup
   */
  exportCart() {
    const cartData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      items: this.cartItems,
      summary: this.getCartSummary()
    };
    
    return JSON.stringify(cartData, null, 2);
  }

  /**
   * Import cart data from backup
   */
  importCart(cartDataString) {
    try {
      const cartData = JSON.parse(cartDataString);
      
      if (!cartData.items || !Array.isArray(cartData.items)) {
        throw new Error('Invalid cart data format');
      }
      
      // Validate imported data
      const validItems = this.validateCartData(cartData.items);
      
      if (validItems.length === 0) {
        throw new Error('No valid items found in imported data');
      }
      
      // Check if import would exceed max items
      if (validItems.length > this.maxItems) {
        throw new Error(`Imported cart has too many items. Maximum allowed: ${this.maxItems}`);
      }
      
      // Replace current cart
      this.cartItems = validItems;
      this.saveCart();
      
      // Dispatch event
      this.dispatchCartEvent('cart-imported', {
        importedItemsCount: validItems.length,
        summary: this.getCartSummary()
      });
      
      console.log('Cart imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing cart:', error);
      throw error;
    }
  }

  /**
   * Get cart statistics
   */
  getStatistics() {
    const stats = {
      totalItemsAdded: 0,
      totalItemsRemoved: 0,
      mostAddedVariant: null,
      averageQuantity: 0,
      cartValue: this.getSubtotal()
    };
    
    if (this.cartItems.length === 0) {
      return stats;
    }
    
    // Calculate statistics
    stats.totalItemsAdded = this.getItemCount();
    stats.averageQuantity = stats.totalItemsAdded / this.cartItems.length;
    
    // Find most added variant
    const variantCounts = {};
    this.cartItems.forEach(item => {
      variantCounts[item.variant.asin] = (variantCounts[item.variant.asin] || 0) + item.quantity;
    });
    
    const mostAddedASIN = Object.keys(variantCounts).reduce((a, b) => 
      variantCounts[a] > variantCounts[b] ? a : b
    );
    
    const mostAddedItem = this.cartItems.find(item => item.variant.asin === mostAddedASIN);
    stats.mostAddedVariant = mostAddedItem ? mostAddedItem.variant : null;
    
    return stats;
  }

  /**
   * Check for expired items (items that might be out of stock)
   */
  validateCartStock() {
    const issues = [];
    
    this.cartItems.forEach(item => {
      if (item.variant.stock_count !== undefined && item.quantity > item.variant.stock_count) {
        issues.push({
          itemId: item.id,
          variant: item.variant,
          requestedQuantity: item.quantity,
          availableQuantity: item.variant.stock_count,
          issue: 'insufficient_stock'
        });
      }
    });
    
    return issues;
  }

  /**
   * Fix stock issues in cart
   */
  fixStockIssues() {
    const issues = this.validateCartStock();
    let fixedCount = 0;
    
    issues.forEach(issue => {
      const itemIndex = this.cartItems.findIndex(item => item.id === issue.itemId);
      if (itemIndex !== -1) {
        if (issue.availableQuantity === 0) {
          // Remove item if no stock available
          this.cartItems.splice(itemIndex, 1);
        } else {
          // Update quantity to available stock
          this.cartItems[itemIndex].quantity = issue.availableQuantity;
          this.cartItems[itemIndex].updatedAt = new Date().toISOString();
        }
        fixedCount++;
      }
    });
    
    if (fixedCount > 0) {
      this.saveCart();
      this.dispatchCartEvent('stock-issues-fixed', {
        fixedItemsCount: fixedCount,
        remainingIssues: this.validateCartStock()
      });
    }
    
    return fixedCount;
  }

  /**
   * Destroy cart and clean up
   */
  destroy() {
    // Save final state
    this.saveCart();
    
    // Clear references
    this.cartItems = [];
    
    console.log('ShoppingCart destroyed');
  }
}

// Make available globally
window.ShoppingCart = ShoppingCart;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingCart;
}
