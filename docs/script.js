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
  
  // Function to update the model rotation
  function updateModelRotation() {
    canvas.style.transform = `rotateX(${rotationY}deg) rotateY(${rotationX}deg)`;
  }
  
  // Start dragging
  function handleDragStart(x, y) {
    isDragging = true;
    previousMouseX = x;
    previousMouseY = y;
    
    // Add event listeners for move and end events
    if (window.PointerEvent) {
      document.addEventListener('pointermove', handleDragMove);
      document.addEventListener('pointerup', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
    }
  }
  
  // During dragging
  function handleDragMove(event) {
    if (!isDragging) return;
    
    let currentX, currentY;
    
    // Get current pointer/touch coordinates
    if (event.type === 'touchmove') {
      event.preventDefault();
      currentX = event.touches[0].clientX;
      currentY = event.touches[0].clientY;
    } else {
      currentX = event.clientX;
      currentY = event.clientY;
    }
    
    // Calculate the movement delta
    const deltaX = currentX - previousMouseX;
    const deltaY = currentY - previousMouseY;
    
    // Update rotation (note that horizontal movement affects Y-axis rotation and vice versa)
    rotationX += deltaX * ROTATION_SENSITIVITY;
    rotationY -= deltaY * ROTATION_SENSITIVITY;
    
    // No limit on rotation - this allows continuous rotation in any direction
    
    // Update the model's rotation
    updateModelRotation();
    
    // Save current position for next move event
    previousMouseX = currentX;
    previousMouseY = currentY;
  }
  
  // End dragging
  function handleDragEnd() {
    isDragging = false;
    
    // Remove event listeners
    if (window.PointerEvent) {
      document.removeEventListener('pointermove', handleDragMove);
      document.removeEventListener('pointerup', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    }
  }
  
  // Set up event listeners for drag start on the entire document
  if (window.PointerEvent) {
    // Modern browsers with pointer events
    document.addEventListener('pointerdown', (event) => {
      handleDragStart(event.clientX, event.clientY);
    });
  } else {
    // Fallback for older browsers
    document.addEventListener('mousedown', (event) => {
      handleDragStart(event.clientX, event.clientY);
    });
    
    document.addEventListener('touchstart', (event) => {
      if (event.touches.length > 0) {
        event.preventDefault();
        handleDragStart(event.touches[0].clientX, event.touches[0].clientY);
      }
    });
  }
  
  // Initial render of the model
  updateModelRotation();
});