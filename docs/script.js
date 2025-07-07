/**
 * 3D Model Rotation Controller
 * Handles mouse/touch drag rotation with momentum and keyboard controls
 */
class ModelRotationController {
  constructor(canvas, options = {}) {
    this.canvas = canvas;

    // Configuration
    this.config = {
      rotationSensitivity: options.rotationSensitivity || 0.5,
      keyRotationStep: options.keyRotationStep || 22.5,
      friction: options.friction || 0.85,
      momentumThreshold: options.momentumThreshold || 0.1,
      scaleFactorX: options.scaleFactorX || 15,
      scaleFactorY: options.scaleFactorY || 5,
      ...options,
    };

    // State
    this.rotation = { x: 0, y: 0 };
    this.isDragging = false;
    this.previousPointer = { x: 0, y: 0 };
    this.momentum = { x: 0, y: 0 };
    this.lastDragTime = 0;
    this.animationFrameId = null;

    // Bind methods to preserve context
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragMove = this.handleDragMove.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.applyMomentum = this.applyMomentum.bind(this);

    this.init();
  }

  /**
   * Initialize the controller
   */
  init() {
    this.setupEventListeners();
    this.updateModelRotation();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Pointer events (modern browsers)
    if (window.PointerEvent) {
      document.addEventListener("pointerdown", this.handleDragStart);
    } else {
      // Fallback for older browsers
      document.addEventListener("mousedown", this.handleDragStart);
      document.addEventListener("touchstart", this.handleTouchStart);
    }

    // Keyboard controls
    document.addEventListener("keydown", this.handleKeyDown);
  }

  /**
   * Handle touch start events (fallback)
   */
  handleTouchStart(event) {
    if (event.touches.length > 0) {
      event.preventDefault();
      this.handleDragStart({
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      });
    }
  }

  /**
   * Start dragging interaction
   */
  handleDragStart(event) {
    this.stopMomentum();

    this.isDragging = true;
    this.previousPointer = { x: event.clientX, y: event.clientY };
    this.lastDragTime = Date.now();
    this.momentum = { x: 0, y: 0 };

    this.addDragEventListeners();
  }

  /**
   * Add event listeners for drag movement and end
   */
  addDragEventListeners() {
    if (window.PointerEvent) {
      document.addEventListener("pointermove", this.handleDragMove);
      document.addEventListener("pointerup", this.handleDragEnd);
    } else {
      document.addEventListener("mousemove", this.handleDragMove);
      document.addEventListener("mouseup", this.handleDragEnd);
      document.addEventListener("touchmove", this.handleDragMove);
      document.addEventListener("touchend", this.handleDragEnd);
    }
  }

  /**
   * Remove drag event listeners
   */
  removeDragEventListeners() {
    if (window.PointerEvent) {
      document.removeEventListener("pointermove", this.handleDragMove);
      document.removeEventListener("pointerup", this.handleDragEnd);
    } else {
      document.removeEventListener("mousemove", this.handleDragMove);
      document.removeEventListener("mouseup", this.handleDragEnd);
      document.removeEventListener("touchmove", this.handleDragMove);
      document.removeEventListener("touchend", this.handleDragEnd);
    }
  }

  /**
   * Handle drag movement
   */
  handleDragMove(event) {
    if (!this.isDragging) return;

    let currentX, currentY;
    const currentTime = Date.now();
    const elapsed = currentTime - this.lastDragTime;

    // Get current coordinates
    if (event.type === "touchmove") {
      event.preventDefault();
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }

    // Calculate movement delta
    const deltaX = currentX - this.previousPointer.x;
    const deltaY = currentY - this.previousPointer.y;

    // Calculate momentum
    if (elapsed > 0) {
      this.momentum.x = (deltaX / elapsed) * this.config.scaleFactorX;
      this.momentum.y = (-deltaY / elapsed) * this.config.scaleFactorY;
    }

    // Update rotation
    this.rotation.x += deltaX * this.config.rotationSensitivity;
    this.rotation.y -= deltaY * this.config.rotationSensitivity;

    this.updateModelRotation();

    // Update state for next iteration
    this.previousPointer = { x: currentX, y: currentY };
    this.lastDragTime = currentTime;
  }

  /**
   * End dragging interaction
   */
  handleDragEnd() {
    this.isDragging = false;
    this.removeDragEventListeners();

    // Start momentum animation if significant
    if (this.hasSignificantMomentum()) {
      this.startMomentum();
    }
  }

  /**
   * Check if momentum is significant enough to continue animation
   */
  hasSignificantMomentum() {
    return (
      Math.abs(this.momentum.x) > this.config.momentumThreshold ||
      Math.abs(this.momentum.y) > this.config.momentumThreshold
    );
  }

  /**
   * Start momentum animation
   */
  startMomentum() {
    this.animationFrameId = requestAnimationFrame(this.applyMomentum);
  }

  /**
   * Stop momentum animation
   */
  stopMomentum() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Apply momentum and gradually slow down
   */
  applyMomentum() {
    if (!this.hasSignificantMomentum()) {
      this.animationFrameId = null;
      return;
    }

    // Apply momentum to rotation
    this.rotation.x += this.momentum.x;
    this.rotation.y += this.momentum.y;

    // Apply friction
    this.momentum.x *= this.config.friction;
    this.momentum.y *= this.config.friction;

    this.updateModelRotation();
    this.animationFrameId = requestAnimationFrame(this.applyMomentum);
  }

  /**
   * Handle keyboard controls
   */
  handleKeyDown(event) {
    const keyActions = {
      ArrowUp: () => (this.rotation.y += this.config.keyRotationStep),
      ArrowDown: () => (this.rotation.y -= this.config.keyRotationStep),
      ArrowLeft: () => (this.rotation.x -= this.config.keyRotationStep),
      ArrowRight: () => (this.rotation.x += this.config.keyRotationStep),
    };

    const action = keyActions[event.key];
    if (action) {
      action();
      this.updateModelRotation();
    }
  }

  /**
   * Update the model's visual rotation
   */
  updateModelRotation() {
    this.canvas.style.transform = `rotateX(${this.rotation.y}deg) rotateY(${this.rotation.x}deg)`;
  }

  /**
   * Reset rotation to initial state
   */
  resetRotation() {
    this.rotation = { x: 0, y: 0 };
    this.stopMomentum();
    this.updateModelRotation();
  }

  /**
   * Get current rotation values
   */
  getRotation() {
    return { ...this.rotation };
  }

  /**
   * Set rotation values
   */
  setRotation(x, y) {
    this.rotation = { x, y };
    this.updateModelRotation();
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    this.stopMomentum();
    this.removeDragEventListeners();
    document.removeEventListener("keydown", this.handleKeyDown);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");

  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  // Create and initialize the rotation controller
  new ModelRotationController(canvas);
});
