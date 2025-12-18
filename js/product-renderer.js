/**
 * Product Renderer Module
 * Handles DOM manipulation for product details and variants
 */

class ProductRenderer {
  constructor(productData) {
    this.productData = productData;
    this.currentVariant = null;
    
    // DOM element references
    this.elements = {
      productTitle: document.getElementById('productTitle'),
      productRating: document.getElementById('productRating'),
      productFeatures: document.getElementById('productFeatures'),
      productDescription: document.getElementById('productDescription'),
      colorVariants: document.getElementById('colorVariants'),
      currentPrice: document.getElementById('currentPrice'),
      originalPrice: document.getElementById('originalPrice'),
      savings: document.getElementById('savings'),
      stockStatus: document.getElementById('stockStatus'),
      shippingInfo: document.getElementById('shippingInfo'),
      brandName: document.getElementById('brandName'),
      categoryName: document.getElementById('categoryName'),
      quantity: document.getElementById('quantity'),
      addToCartBtn: document.getElementById('addToCartBtn'),
      buyNowBtn: document.getElementById('buyNowBtn')
    };
    
    console.log('ProductRenderer initialized');
  }

  /**
   * Render product details section
   */
  renderProductDetails(variant) {
    this.currentVariant = variant;
    
    // Render title
    this.renderTitle();
    
    // Render rating
    this.renderRating();
    
    // Render features
    this.renderFeatures();
    
    // Render description
    this.renderDescription();
    
    console.log('Product details rendered for:', variant.asin);
  }

  /**
   * Render product title
   */
  renderTitle() {
    if (!this.elements.productTitle || !this.productData) return;
    
    const titleHTML = `
      <h1>${this.escapeHtml(this.productData.title)}</h1>
    `;
    
    this.elements.productTitle.innerHTML = titleHTML;
  }

  /**
   * Render product rating with stars
   */
  renderRating() {
    if (!this.elements.productRating || !this.productData) return;
    
    const rating = this.productData.rating || 0;
    const reviewsCount = this.productData.reviews_count || 0;
    
    // Generate star rating HTML
    const starsHTML = this.generateStarRating(rating);
    
    const ratingHTML = `
      <div class="rating">
        <div class="rating-stars">
          ${starsHTML}
        </div>
        <span class="rating-text">${rating.toFixed(1)}</span>
        <a href="#" class="rating-count">${this.formatNumber(reviewsCount)} ratings</a>
      </div>
    `;
    
    this.elements.productRating.innerHTML = ratingHTML;
  }

  /**
   * Generate star rating HTML
   * Handles full stars, half stars, and empty stars
   */
  generateStarRating(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<span class="star filled">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
      starsHTML += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<span class="star">★</span>';
    }
    
    return starsHTML;
  }

  /**
   * Render product features list
   */
  renderFeatures() {
    if (!this.elements.productFeatures || !this.productData) return;
    
    const features = this.productData.features || [];
    
    if (features.length === 0) {
      this.elements.productFeatures.innerHTML = '';
      return;
    }
    
    const featuresHTML = `
      <div class="product-features">
        <h3>About this item</h3>
        <ul>
          ${features.map(feature => `
            <li>${this.escapeHtml(feature)}</li>
          `).join('')}
        </ul>
      </div>
    `;
    
    this.elements.productFeatures.innerHTML = featuresHTML;
  }

  /**
   * Render product description
   */
  renderDescription() {
    if (!this.elements.productDescription || !this.productData) return;
    
    const description = this.productData.description || '';
    
    const descriptionHTML = `
      <div class="product-description">
        <p>${this.escapeHtml(description)}</p>
      </div>
    `;
    
    this.elements.productDescription.innerHTML = descriptionHTML;
  }

  /**
   * Render buy box section
   */
  renderBuyBox(variant) {
    this.currentVariant = variant;
    
    // Render price
    this.renderPrice();
    
    // Render stock status
    this.renderStockStatus();
    
    // Render shipping info
    this.renderShippingInfo();
    
    // Render brand and category
    this.renderProductInfo();
    
    // Update quantity options
    this.updateQuantityOptions();
    
    // Update button states
    this.updateButtonStates();
    
    console.log('Buy box rendered for:', variant.asin);
  }

  /**
   * Render price information
   */
  renderPrice() {
    if (!this.elements.currentPrice || !this.currentVariant) return;
    
    const currentPrice = this.currentVariant.price || 0;
    const originalPrice = this.currentVariant.original_price || 0;
    const savings = originalPrice > currentPrice ? originalPrice - currentPrice : 0;
    const savingsPercentage = originalPrice > currentPrice ? ((savings / originalPrice) * 100) : 0;
    
    // Current price
    const currentPriceHTML = `
      <div class="price">
        <span class="price-symbol">$</span>
        <span class="price-whole">${Math.floor(currentPrice)}</span>
        <span class="price-fraction">${(currentPrice % 1).toFixed(2).substring(2)}</span>
      </div>
    `;
    
    this.elements.currentPrice.innerHTML = currentPriceHTML;
    
    // Original price
    if (originalPrice > currentPrice && this.elements.originalPrice) {
      this.elements.originalPrice.innerHTML = `$${originalPrice.toFixed(2)}`;
      this.elements.originalPrice.style.display = 'block';
    } else if (this.elements.originalPrice) {
      this.elements.originalPrice.style.display = 'none';
    }
    
    // Savings
    if (savings > 0 && this.elements.savings) {
      this.elements.savings.innerHTML = `Save $${savings.toFixed(2)} (${savingsPercentage.toFixed(0)}%)`;
      this.elements.savings.style.display = 'block';
    } else if (this.elements.savings) {
      this.elements.savings.style.display = 'none';
    }
  }

  /**
   * Render stock status
   */
  renderStockStatus() {
    if (!this.elements.stockStatus || !this.currentVariant) return;
    
    const stockStatus = this.currentVariant.stock_status || 'Unknown';
    const stockCount = this.currentVariant.stock_count || 0;
    
    let statusClass = 'in-stock';
    let statusText = stockStatus;
    
    // Determine status class based on stock
    if (stockCount === 0) {
      statusClass = 'out-of-stock';
      statusText = 'Out of Stock';
    } else if (stockCount <= 3) {
      statusClass = 'low-stock';
      statusText = `Only ${stockCount} left in stock`;
    }
    
    const stockHTML = `
      <div class="stock-status ${statusClass}">
        ${this.escapeHtml(statusText)}
      </div>
    `;
    
    this.elements.stockStatus.innerHTML = stockHTML;
  }

  /**
   * Render shipping information
   */
  renderShippingInfo() {
    if (!this.elements.shippingInfo || !this.currentVariant) return;
    
    const shipping = this.currentVariant.shipping || '';
    
    const shippingHTML = `
      <div class="shipping-info">
        ${this.escapeHtml(shipping)}
      </div>
    `;
    
    this.elements.shippingInfo.innerHTML = shippingHTML;
  }

  /**
   * Render brand and category information
   */
  renderProductInfo() {
    if (!this.productData) return;
    
    // Brand
    if (this.elements.brandName) {
      this.elements.brandName.textContent = this.productData.brand || 'Unknown';
    }
    
    // Category
    if (this.elements.categoryName) {
      this.elements.categoryName.textContent = this.productData.category || 'Unknown';
    }
  }

  /**
   * Update quantity options based on stock
   */
  updateQuantityOptions() {
    if (!this.elements.quantity || !this.currentVariant) return;
    
    const stockCount = this.currentVariant.stock_count || 10;
    const currentValue = parseInt(this.elements.quantity.value) || 1;
    
    // Clear existing options
    this.elements.quantity.innerHTML = '';
    
    // Add quantity options up to stock count (max 10)
    const maxQuantity = Math.min(stockCount, 10);
    for (let i = 1; i <= maxQuantity; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      if (i === currentValue) {
        option.selected = true;
      }
      this.elements.quantity.appendChild(option);
    }
    
    // Add "10+" option if stock is more than 10
    if (stockCount > 10) {
      const option = document.createElement('option');
      option.value = '10+';
      option.textContent = '10+';
      this.elements.quantity.appendChild(option);
    }
  }

  /**
   * Update button states based on stock
   */
  updateButtonStates() {
    if (!this.currentVariant) return;
    
    const stockCount = this.currentVariant.stock_count || 0;
    const isOutOfStock = stockCount === 0;
    
    // Update Add to Cart button
    if (this.elements.addToCartBtn) {
      this.elements.addToCartBtn.disabled = isOutOfStock;
      this.elements.addToCartBtn.textContent = isOutOfStock ? 'Out of Stock' : 'Add to Cart';
    }
    
    // Update Buy Now button
    if (this.elements.buyNowBtn) {
      this.elements.buyNowBtn.disabled = isOutOfStock;
      this.elements.buyNowBtn.textContent = isOutOfStock ? 'Out of Stock' : 'Buy Now';
    }
  }

  /**
   * Render color variant swatches
   */
  renderColorVariants(currentVariant) {
    if (!this.elements.colorVariants || !this.productData) return;
    
    const variants = this.productData.variants || [];
    
    if (variants.length <= 1) {
      this.elements.colorVariants.innerHTML = '';
      return;
    }
    
    const variantsHTML = `
      <div class="color-variants">
        ${variants.map(variant => this.createColorSwatch(variant, variant.asin === currentVariant.asin)).join('')}
      </div>
    `;
    
    this.elements.colorVariants.innerHTML = variantsHTML;
    
    // Add click event listeners to color swatches
    this.attachColorSwatchListeners();
    
    console.log('Color variants rendered');
  }

  /**
   * Create HTML for a single color swatch
   */
  createColorSwatch(variant, isActive) {
    const colorName = variant.color_name || 'Unknown';
    const activeClass = isActive ? 'active' : '';
    const disabledClass = (variant.stock_count || 0) === 0 ? 'disabled' : '';
    
    // Generate color based on color name (simplified for demo)
    const colorStyle = this.getColorStyle(colorName);
    
    return `
      <button 
        class="color-swatch ${activeClass} ${disabledClass}" 
        data-asin="${variant.asin}"
        data-color="${colorName}"
        ${disabledClass ? 'disabled' : ''}
        title="${colorName} ${disabledClass ? '(Out of Stock)' : ''}"
      >
        <div class="color-dot" style="${colorStyle}"></div>
        <span class="color-name">${colorName}</span>
      </button>
    `;
  }

  /**
   * Get CSS style for color dot based on color name
   * This is a simplified mapping - in production, you'd use actual color values
   */
  getColorStyle(colorName) {
    const colorMap = {
      'Black': 'background-color: #1a1a1a;',
      'Silver': 'background-color: linear-gradient(135deg, #c0c0c0, #808080);',
      'Blue': 'background-color: #0066cc;',
      'Red': 'background-color: #cc0000;',
      'Green': 'background-color: #008800;',
      'White': 'background-color: #ffffff; border-color: #cccccc;',
      'Gold': 'background-color: linear-gradient(135deg, #ffd700, #daa520);',
      'Rose Gold': 'background-color: linear-gradient(135deg, #e0bfb8, #b76e79);',
      'Space Gray': 'background-color: #4a4a4a;'
    };
    
    return colorMap[colorName] || 'background-color: #cccccc;';
  }

  /**
   * Attach click event listeners to color swatches
   */
  attachColorSwatchListeners() {
    const swatches = this.elements.colorVariants.querySelectorAll('.color-swatch:not(.disabled)');
    
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (event) => {
        event.preventDefault();
        const asin = swatch.dataset.asin;
        
        // Notify main app to switch variant
        if (window.amazonApp && typeof window.amazonApp.switchVariant === 'function') {
          window.amazonApp.switchVariant(asin);
        }
      });
    });
  }

  /**
   * Update variant display without full re-render
   * Used for quick updates when switching variants
   */
  updateVariantDisplay(variant) {
    this.currentVariant = variant;
    
    // Update only the necessary elements
    this.renderPrice();
    this.renderStockStatus();
    this.renderShippingInfo();
    this.updateQuantityOptions();
    this.updateButtonStates();
    
    // Update active color swatch
    this.updateActiveColorSwatch(variant.asin);
    
    console.log('Variant display updated for:', variant.asin);
  }

  /**
   * Update active color swatch styling
   */
  updateActiveColorSwatch(activeASIN) {
    const swatches = this.elements.colorVariants.querySelectorAll('.color-swatch');
    
    swatches.forEach(swatch => {
      if (swatch.dataset.asin === activeASIN) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }

  /**
   * Format large numbers (e.g., 284731 -> 284,731)
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Escape HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Get current variant
   */
  getCurrentVariant() {
    return this.currentVariant;
  }

  /**
   * Get all variants
   */
  getAllVariants() {
    return this.productData ? this.productData.variants : [];
  }

  /**
   * Check if variant is in stock
   */
  isVariantInStock(variant) {
    return variant && (variant.stock_count || 0) > 0;
  }

  /**
   * Get variant by ASIN
   */
  getVariantByASIN(asin) {
    if (!this.productData || !this.productData.variants) return null;
    return this.productData.variants.find(v => v.asin === asin);
  }

  /**
   * Calculate total price with quantity
   */
  calculateTotalPrice(quantity = 1) {
    if (!this.currentVariant) return 0;
    return (this.currentVariant.price || 0) * quantity;
  }

  /**
   * Destroy renderer and clean up
   */
  destroy() {
    // Clear element references
    Object.keys(this.elements).forEach(key => {
      this.elements[key] = null;
    });
    
    this.currentVariant = null;
    this.productData = null;
    
    console.log('ProductRenderer destroyed');
  }
}

// Make available globally
window.ProductRenderer = ProductRenderer;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductRenderer;
}
