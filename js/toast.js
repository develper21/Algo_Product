/**
 * Toast Notification System
 * Handles all notification events with different types and animations
 */

class ToastNotificationSystem {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.maxToasts = 5;
    this.defaultDuration = 4000;
    
    this.init();
  }

  /**
   * Initialize toast system
   */
  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      // Create container if it doesn't exist
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
    
    console.log('Toast notification system initialized');
  }

  /**
   * Show a toast notification
   */
  show(message, type = 'info', options = {}) {
    const config = {
      duration: options.duration || this.defaultDuration,
      persistent: options.persistent || false,
      action: options.action || null,
      icon: options.icon || null,
      position: options.position || 'top-right'
    };

    // Create toast element
    const toast = this.createToast(message, type, config);
    
    // Add to container
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove if not persistent
    if (!config.persistent) {
      setTimeout(() => {
        this.remove(toast);
      }, config.duration);
    }

    // Limit number of toasts
    this.limitToasts();

    return toast;
  }

  /**
   * Create toast element
   */
  createToast(message, type, config) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create toast content
    const content = document.createElement('div');
    content.className = 'toast-content';
    
    // Add icon
    const icon = this.getIcon(type, config.icon);
    if (icon) {
      const iconElement = document.createElement('span');
      iconElement.className = 'toast-icon';
      iconElement.innerHTML = icon;
      content.appendChild(iconElement);
    }
    
    // Add message
    const messageElement = document.createElement('span');
    messageElement.className = 'toast-message';
    messageElement.textContent = message;
    content.appendChild(messageElement);
    
    // Add action button if provided
    if (config.action) {
      const actionButton = document.createElement('button');
      actionButton.className = 'toast-action';
      actionButton.textContent = config.action.text;
      actionButton.addEventListener('click', () => {
        config.action.callback();
        this.remove(toast);
      });
      content.appendChild(actionButton);
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      this.remove(toast);
    });
    content.appendChild(closeButton);
    
    toast.appendChild(content);
    
    // Add progress bar if not persistent
    if (!config.persistent) {
      const progressBar = document.createElement('div');
      progressBar.className = 'toast-progress';
      progressBar.style.animationDuration = `${config.duration}ms`;
      toast.appendChild(progressBar);
    }
    
    return toast;
  }

  /**
   * Get icon for toast type
   */
  getIcon(type, customIcon) {
    if (customIcon) return customIcon;
    
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 2L3 9v11a2 2 0 002 2h14a2 2 0 002-2V9l-6-7z"></path><line x1="3" y1="9" x2="21" y2="9"></line><path d="M9 22V12h6v10"></path></svg>',
      buy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>'
    };
    
    return icons[type] || icons.info;
  }

  /**
   * Remove toast
   */
  remove(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.classList.add('hide');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Limit number of toasts displayed
   */
  limitToasts() {
    if (this.toasts.length > this.maxToasts) {
      const oldestToast = this.toasts[0];
      this.remove(oldestToast);
    }
  }

  /**
   * Clear all toasts
   */
  clear() {
    this.toasts.forEach(toast => {
      this.remove(toast);
    });
  }

  /**
   * Convenience methods for different toast types
   */
  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  error(message, options = {}) {
    return this.show(message, 'error', options);
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  cart(message, options = {}) {
    return this.show(message, 'cart', options);
  }

  buy(message, options = {}) {
    return this.show(message, 'buy', options);
  }

  search(message, options = {}) {
    return this.show(message, 'search', options);
  }

  /**
   * Show persistent toast with action
   */
  persistent(message, type = 'info', action = null) {
    return this.show(message, type, {
      persistent: true,
      action: action
    });
  }
}

// Initialize toast system
window.toastSystem = new ToastNotificationSystem();

// Global convenience functions
window.showToast = (message, type, options) => window.toastSystem.show(message, type, options);
window.showSuccess = (message, options) => window.toastSystem.success(message, options);
window.showError = (message, options) => window.toastSystem.error(message, options);
window.showWarning = (message, options) => window.toastSystem.warning(message, options);
window.showInfo = (message, options) => window.toastSystem.info(message, options);
window.showCartToast = (message, options) => window.toastSystem.cart(message, options);
window.showBuyToast = (message, options) => window.toastSystem.buy(message, options);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToastNotificationSystem;
}
