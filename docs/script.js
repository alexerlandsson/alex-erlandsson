document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  
  // Current rotation values
  let rotationX = 0;
  let rotationY = 0;
  
  // For tracking mouse/touch movement
  let isDragging = false;
  let previousMouseX = 0;
  let previousMouseY = 0;
  
  // Sensitivity factor for rotation (adjust as needed)
  const ROTATION_SENSITIVITY = 0.5;
  
  // Momentum variables
  let momentumX = 0;
  let momentumY = 0;
  let lastDragTime = 0;
  const FRICTION = 0.85; // Friction factor (0-1): higher means less friction
  const MOMENTUM_THRESHOLD = 0.1; // Stop rotation when momentum falls below this
  const SCALE_FACTOR_X = 15; // Scale factor for better feel on the X-axis
  const SCALE_FACTOR_Y = 5; // Scale factor for better feel on the Y-axis
  let animationFrameId = null;
  
  // For multi-touch detection
  let touchPointsCount = 0;
  let activePointerIds = new Set();
  
  // Function to update the model rotation
  function updateModelRotation() {
    canvas.style.transform = `rotateX(${rotationY}deg) rotateY(${rotationX}deg)`;
  }
  
  // Apply momentum and gradually slow down
  function applyMomentum() {
    if (Math.abs(momentumX) < MOMENTUM_THRESHOLD && Math.abs(momentumY) < MOMENTUM_THRESHOLD) {
      // Stop animation when momentum is very low
      animationFrameId = null;
      return;
    }
    
    // Apply momentum to rotation
    rotationX += momentumX;
    rotationY += momentumY;
    
    // Apply friction to gradually reduce momentum
    momentumX *= FRICTION;
    momentumY *= FRICTION;
    
    // Update the model's rotation
    updateModelRotation();
    
    // Continue animation
    animationFrameId = requestAnimationFrame(applyMomentum);
  }
  
  // Start dragging
  function handleDragStart(x, y, pointerId = null) {
    // Don't start dragging if multiple touch/pointer points are active
    if (touchPointsCount > 1 || activePointerIds.size > 1) return;
    
    // Stop any ongoing momentum animation
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    isDragging = true;
    previousMouseX = x;
    previousMouseY = y;
    lastDragTime = Date.now();
    momentumX = 0;
    momentumY = 0;
    
    // Add event listeners for move and end events
    if (window.PointerEvent) {
      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
      document.addEventListener('pointercancel', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.addEventListener('touchcancel', handleDragEnd);
    }
  }
  
  // During dragging
  function handleDragMove(event) {
    // Immediately end dragging if we detect multiple touches
    if ((event.touches && event.touches.length > 1) || 
        touchPointsCount > 1 || 
        activePointerIds.size > 1) {
      handleDragEnd();
      return;
    }
    
    if (!isDragging) return;
    
    // Prevent default behavior like scrolling
    if (event.cancelable !== false) {
      event.preventDefault();
    }
    
    let currentX, currentY;
    const currentTime = Date.now();
    const elapsed = currentTime - lastDragTime;
    
    // Get current pointer/touch coordinates
    if (event.type === 'touchmove') {
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }
    
    // Calculate the movement delta
    const deltaX = currentX - previousMouseX;
    const deltaY = currentY - previousMouseY;
    
    // Calculate momentum (speed = distance / time)
    if (elapsed > 0) {
      momentumX = deltaX / elapsed * SCALE_FACTOR_X;
      momentumY = -deltaY / elapsed * SCALE_FACTOR_Y; // Negative because Y rotation is inverted
    }
    
    // Update rotation (note that horizontal movement affects Y-axis rotation and vice versa)
    rotationX += deltaX * ROTATION_SENSITIVITY;
    rotationY -= deltaY * ROTATION_SENSITIVITY;
    
    // Update the model's rotation
    updateModelRotation();
    
    // Save current position and time for next move event
    previousMouseX = currentX;
    previousMouseY = currentY;
    lastDragTime = currentTime;
  }
  
  // End dragging
  function handleDragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Start momentum animation
    if (Math.abs(momentumX) > MOMENTUM_THRESHOLD || Math.abs(momentumY) > MOMENTUM_THRESHOLD) {
      animationFrameId = requestAnimationFrame(applyMomentum);
    }
    
    // Remove event listeners
    if (window.PointerEvent) {
      document.removeEventListener('pointermove', handleDragMove);
      document.removeEventListener('pointerup', handleDragEnd);
      document.removeEventListener('pointercancel', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    }
  }
  
  // Handle touch events for browsers without pointer events
  function handleTouchStart(event) {
    touchPointsCount = event.touches.length;
    
    // End any existing drag if multiple touches detected
    if (touchPointsCount > 1) {
      if (isDragging) {
        handleDragEnd();
      }
      return;
    }
    
    // Only start dragging for single touch
    if (touchPointsCount === 1) {
      handleDragStart(event.touches[0].clientX, event.touches[0].clientY);
    }
  }
  
  function handleTouchChange(event) {
    touchPointsCount = event.touches.length;
    
    // If dragging but now have multiple touches, stop dragging
    if (isDragging && touchPointsCount > 1) {
      handleDragEnd();
    }
  }
  
  // Handle pointer events for modern browsers
  function handlePointerDown(event) {
    // Track this pointer
    activePointerIds.add(event.pointerId);
    
    // End any existing drag if multiple pointers detected
    if (activePointerIds.size > 1) {
      if (isDragging) {
        handleDragEnd();
      }
      return;
    }
    
    // Only start dragging for single pointer (mouse or first touch)
    if (activePointerIds.size === 1) {
      handleDragStart(event.clientX, event.clientY, event.pointerId);
    }
  }
  
  function handlePointerUp(event) {
    // Stop tracking this pointer
    activePointerIds.delete(event.pointerId);
  }
  
  // Set up event listeners
  if (window.PointerEvent) {
    // Modern browsers with pointer events
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  } else {
    // Fallback for older browsers
    document.addEventListener('mousedown', (event) => {
      handleDragStart(event.clientX, event.clientY);
    });
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchChange);
    document.addEventListener('touchcancel', handleTouchChange);
  }
  
  // Initial render of the model
  updateModelRotation();
});