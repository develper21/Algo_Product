/**
 * Image Gallery Module
 * Handles image switching, thumbnail navigation, and zoom functionality
 */

class ImageGallery {
  constructor() {
    this.currentImages = null;
    this.currentImageIndex = 0;
    this.isZoomEnabled = true;
    
    // DOM element references
    this.elements = {
      mainImage: document.getElementById('mainImage'),
      thumbnailContainer: document.getElementById('thumbnailContainer'),
      zoomLens: document.getElementById('zoomLens'),
      zoomResult: document.getElementById('zoomResult'),
      mainImageContainer: document.querySelector('.main-image-container')
    };
    
    // Zoom properties
    this.zoomConfig = {
      lensWidth: 100,
      lensHeight: 100,
      resultWidth: 400,
      resultHeight: 400,
      zoomLevel: 3
    };
    
    // Touch properties for mobile
    this.touchConfig = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    };
    
    console.log('ImageGallery initialized');
  }

  /**
   * Initialize gallery with new set of images
   */
  initializeGallery(images) {
    if (!images || !images.main || !images.thumbnails) {
      console.error('Invalid images data provided to gallery');
      return;
    }
    
    this.currentImages = images;
    this.currentImageIndex = 0;
    
    // Render main image
    this.renderMainImage();
    
    // Render thumbnails
    this.renderThumbnails();
    
    // Setup zoom functionality
    this.setupZoom();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
    
    console.log('Gallery initialized with images:', images);
  }

  /**
   * Render main image
   */
  renderMainImage() {
    if (!this.elements.mainImage || !this.currentImages) return;
    
    const imageUrl = this.currentImages.main;
    
    // Add loading state
    this.elements.mainImage.classList.add('loading');
    
    // Create new image to preload
    const img = new Image();
    img.onload = () => {
      this.elements.mainImage.src = imageUrl;
      this.elements.mainImage.alt = `Product Image ${this.currentImageIndex + 1}`;
      this.elements.mainImage.classList.remove('loading');
      
      // Update zoom image
      this.updateZoomImage(imageUrl);
    };
    
    img.onerror = () => {
      console.error('Failed to load main image:', imageUrl);
      this.elements.mainImage.classList.remove('loading');
      // Fallback to placeholder
      this.elements.mainImage.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
    };
    
    img.src = imageUrl;
  }

  /**
   * Render thumbnail gallery
   */
  renderThumbnails() {
    if (!this.elements.thumbnailContainer || !this.currentImages) return;
    
    const thumbnails = this.currentImages.thumbnails || [];
    
    // Clear existing thumbnails
    this.elements.thumbnailContainer.innerHTML = '';
    
    // Create thumbnail elements
    thumbnails.forEach((thumbnailUrl, index) => {
      const thumbnail = this.createThumbnail(thumbnailUrl, index);
      this.elements.thumbnailContainer.appendChild(thumbnail);
    });
    
    // Set first thumbnail as active
    if (thumbnails.length > 0) {
      this.setActiveThumbnail(0);
    }
    
    console.log('Thumbnails rendered:', thumbnails.length);
  }

  /**
   * Create individual thumbnail element
   */
  createThumbnail(url, index) {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    thumbnail.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Thumbnail ${index + 1}`;
    img.loading = 'lazy';
    
    // Add click event listener
    thumbnail.addEventListener('click', () => {
      this.selectImage(index);
    });
    
    // Add keyboard support
    thumbnail.setAttribute('tabindex', '0');
    thumbnail.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.selectImage(index);
      }
    });
    
    thumbnail.appendChild(img);
    
    return thumbnail;
  }

  /**
   * Select image by index
   */
  selectImage(index) {
    if (!this.currentImages || index < 0 || index >= this.currentImages.thumbnails.length) {
      return;
    }
    
    this.currentImageIndex = index;
    
    // Update main image
    this.renderMainImage();
    
    // Update active thumbnail
    this.setActiveThumbnail(index);
    
    console.log('Image selected:', index);
  }

  /**
   * Set active thumbnail styling
   */
  setActiveThumbnail(index) {
    const thumbnails = this.elements.thumbnailContainer.querySelectorAll('.thumbnail');
    
    thumbnails.forEach((thumbnail, i) => {
      if (i === index) {
        thumbnail.classList.add('active');
      } else {
        thumbnail.classList.remove('active');
      }
    });
  }

  /**
   * Setup zoom functionality
   */
  setupZoom() {
    if (!this.elements.mainImageContainer || !this.elements.zoomLens || !this.elements.zoomResult) {
      console.warn('Zoom elements not found, zoom disabled');
      this.isZoomEnabled = false;
      return;
    }
    
    // Check if device supports hover (disable zoom on touch devices)
    if ('ontouchstart' in window) {
      this.isZoomEnabled = false;
      console.log('Touch device detected, zoom disabled');
      return;
    }
    
    // Mouse enter - show zoom lens
    this.elements.mainImageContainer.addEventListener('mouseenter', () => {
      if (this.isZoomEnabled) {
        this.elements.zoomLens.style.display = 'block';
        this.elements.zoomResult.style.display = 'block';
      }
    });
    
    // Mouse leave - hide zoom lens
    this.elements.mainImageContainer.addEventListener('mouseleave', () => {
      this.elements.zoomLens.style.display = 'none';
      this.elements.zoomResult.style.display = 'none';
    });
    
    // Mouse move - update zoom position
    this.elements.mainImageContainer.addEventListener('mousemove', (event) => {
      if (this.isZoomEnabled) {
        this.handleMouseMove(event);
      }
    });
    
    console.log('Zoom functionality setup complete');
  }

  /**
   * Handle mouse movement for zoom effect
   * This is the core zoom calculation logic
   */
  handleMouseMove(event) {
    const container = this.elements.mainImageContainer;
    const lens = this.elements.zoomLens;
    const result = this.elements.zoomResult;
    
    // Get container position and dimensions
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
    // Get mouse position relative to container
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    
    // Calculate lens position (centered on mouse)
    let lensX = mouseX - (this.zoomConfig.lensWidth / 2);
    let lensY = mouseY - (this.zoomConfig.lensHeight / 2);
    
    // Constrain lens within container bounds
    lensX = Math.max(0, Math.min(lensX, containerWidth - this.zoomConfig.lensWidth));
    lensY = Math.max(0, Math.min(lensY, containerHeight - this.zoomConfig.lensHeight));
    
    // Position lens
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    
    // Calculate zoom result background position
    // The key calculation: map lens position to background position
    const bgX = (lensX / containerWidth) * 100;
    const bgY = (lensY / containerHeight) * 100;
    
    // Apply background position and size to zoom result
    result.style.backgroundPosition = `${bgX}% ${bgY}%`;
    result.style.backgroundSize = `${containerWidth * this.zoomConfig.zoomLevel}px ${containerHeight * this.zoomConfig.zoomLevel}px`;
  }

  /**
   * Update zoom image when main image changes
   */
  updateZoomImage(imageUrl) {
    if (!this.elements.zoomResult || !this.isZoomEnabled) return;
    
    // Set background image for zoom result
    this.elements.zoomResult.style.backgroundImage = `url(${imageUrl})`;
    
    // Preload zoom image for smooth experience
    const img = new Image();
    img.src = imageUrl;
  }

  /**
   * Setup keyboard navigation for gallery
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Only handle keys when gallery is focused or user is interacting
      const isGalleryFocused = this.elements.mainImageContainer.matches(':focus-within') ||
                              document.activeElement === this.elements.mainImage;
      
      if (!isGalleryFocused) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.navigatePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.navigateNext();
          break;
        case 'Escape':
          event.preventDefault();
          this.resetZoom();
          break;
      }
    });
  }

  /**
   * Navigate to previous image
   */
  navigatePrevious() {
    if (!this.currentImages || this.currentImages.thumbnails.length <= 1) return;
    
    const newIndex = this.currentImageIndex === 0 
      ? this.currentImages.thumbnails.length - 1 
      : this.currentImageIndex - 1;
    
    this.selectImage(newIndex);
  }

  /**
   * Navigate to next image
   */
  navigateNext() {
    if (!this.currentImages || this.currentImages.thumbnails.length <= 1) return;
    
    const newIndex = (this.currentImageIndex + 1) % this.currentImages.thumbnails.length;
    this.selectImage(newIndex);
  }

  /**
   * Reset zoom state
   */
  resetZoom() {
    if (this.elements.zoomLens) {
      this.elements.zoomLens.style.display = 'none';
    }
    if (this.elements.zoomResult) {
      this.elements.zoomResult.style.display = 'none';
    }
  }

  /**
   * Enable/disable zoom functionality
   */
  setZoomEnabled(enabled) {
    this.isZoomEnabled = enabled;
    
    if (!enabled) {
      this.resetZoom();
    }
  }

  /**
   * Get current image index
   */
  getCurrentImageIndex() {
    return this.currentImageIndex;
  }

  /**
   * Get total number of images
   */
  getImageCount() {
    return this.currentImages ? this.currentImages.thumbnails.length : 0;
  }

  /**
   * Check if zoom is enabled
   */
  isZoomActive() {
    return this.isZoomEnabled;
  }

  /**
   * Get current images
   */
  getCurrentImages() {
    return this.currentImages;
  }

  /**
   * Add touch support for mobile devices
   * (Enhanced mobile experience)
   */
  setupTouchSupport() {
    if (!this.elements.mainImageContainer) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.elements.mainImageContainer.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    });
    
    this.elements.mainImageContainer.addEventListener('touchend', (event) => {
      touchEndX = event.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  /**
   * Handle swipe gestures for mobile navigation
   */
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.navigateNext();
      } else {
        // Swipe right - previous image
        this.navigatePrevious();
      }
    }
  }

  /**
   * Add accessibility features
   */
  setupAccessibility() {
    if (!this.elements.mainImage) return;
    
    // Add ARIA labels
    this.elements.mainImage.setAttribute('role', 'img');
    this.elements.mainImage.setAttribute('aria-label', `Product image ${this.currentImageIndex + 1} of ${this.getImageCount()}`);
    
    // Add live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'gallery-live-region';
    document.body.appendChild(liveRegion);
    
    // Update live region when image changes
    this.updateLiveRegion = (index) => {
      liveRegion.textContent = `Showing image ${index + 1} of ${this.getImageCount()}`;
    };
  }

  /**
   * Update accessibility live region
   */
  updateAccessibilityInfo() {
    if (this.updateLiveRegion) {
      this.updateLiveRegion(this.currentImageIndex);
    }
    
    if (this.elements.mainImage) {
      this.elements.mainImage.setAttribute('aria-label', `Product image ${this.currentImageIndex + 1} of ${this.getImageCount()}`);
    }
  }

  /**
   * Destroy gallery and clean up event listeners
   */
  destroy() {
    // Remove event listeners
    if (this.elements.mainImageContainer) {
      this.elements.mainImageContainer.removeEventListener('mouseenter', () => {});
      this.elements.mainImageContainer.removeEventListener('mouseleave', () => {});
      this.elements.mainImageContainer.removeEventListener('mousemove', () => {});
    }
    
    // Clear DOM references
    Object.keys(this.elements).forEach(key => {
      this.elements[key] = null;
    });
    
    // Clear data
    this.currentImages = null;
    this.currentImageIndex = 0;
    
    // Remove live region
    const liveRegion = document.getElementById('gallery-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }
    
    console.log('ImageGallery destroyed');
  }
}

// Make available globally
window.ImageGallery = ImageGallery;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageGallery;
}
