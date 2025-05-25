document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");

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
  function handleDragStart(x, y) {
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
      document.addEventListener("pointermove", handleDragMove);
      document.addEventListener("pointerup", handleDragEnd);
    } else {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDragMove);
      document.addEventListener("touchend", handleDragEnd);
    }
  }

  // During dragging
  function handleDragMove(event) {
    if (!isDragging) return;

    let currentX, currentY;
    const currentTime = Date.now();
    const elapsed = currentTime - lastDragTime;

    // Get current pointer/touch coordinates
    if (event.type === "touchmove") {
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

    // Calculate momentum (speed = distance / time)
    if (elapsed > 0) {
      momentumX = (deltaX / elapsed) * SCALE_FACTOR_X;
      momentumY = (-deltaY / elapsed) * SCALE_FACTOR_Y; // Negative because Y rotation is inverted
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
    isDragging = false;

    // Start momentum animation
    if (Math.abs(momentumX) > MOMENTUM_THRESHOLD || Math.abs(momentumY) > MOMENTUM_THRESHOLD) {
      animationFrameId = requestAnimationFrame(applyMomentum);
    }

    // Remove event listeners
    if (window.PointerEvent) {
      document.removeEventListener("pointermove", handleDragMove);
      document.removeEventListener("pointerup", handleDragEnd);
    } else {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    }
  }

  // Set up event listeners for drag start on the entire document
  if (window.PointerEvent) {
    // Modern browsers with pointer events
    document.addEventListener("pointerdown", (event) => {
      handleDragStart(event.clientX, event.clientY);
    });
  } else {
    // Fallback for older browsers
    document.addEventListener("mousedown", (event) => {
      handleDragStart(event.clientX, event.clientY);
    });

    document.addEventListener("touchstart", (event) => {
      if (event.touches.length > 0) {
        event.preventDefault();
        handleDragStart(event.touches[0].clientX, event.touches[0].clientY);
      }
    });
  }

  // Initial render of the model
  updateModelRotation();
});
