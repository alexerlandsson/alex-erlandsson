/**
 * 3D Model Rotation Controller
 *
 * Rotates the figure with pointer drag (with momentum) and arrow keys.
 * Pointer events are scoped to the scene element, so text elsewhere on the
 * page can still be selected. Arrow keys only act while the scene has focus,
 * so page scrolling is never hijacked.
 */
class ModelRotationController {
  constructor(scene, canvas, options = {}) {
    this.scene = scene;
    this.canvas = canvas;

    this.config = {
      rotationSensitivity: 0.5,
      keyRotationStep: 22.5,
      friction: 0.85,
      momentumThreshold: 0.1,
      scaleFactorX: 15,
      scaleFactorY: 5,
      initialYaw: -22,
      initialPitch: 8,
      onFirstInteraction: null,
      ...options,
    };

    // State
    this.yaw = this.config.initialYaw; // rotateY, driven by horizontal movement
    this.pitch = this.config.initialPitch; // rotateX, driven by vertical movement
    this.isDragging = false;
    this.hasInteracted = false;
    this.previousPointer = { x: 0, y: 0 };
    this.momentum = { x: 0, y: 0 };
    this.lastDragTime = 0;
    this.animationFrameId = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.applyMomentum = this.applyMomentum.bind(this);

    this.init();
  }

  init() {
    this.scene.addEventListener("pointerdown", this.handlePointerDown);
    this.scene.addEventListener("keydown", this.handleKeyDown);
    this.render();
  }

  /**
   * The first interaction ends the intro animation and hides the hint.
   */
  markInteracted() {
    if (this.hasInteracted) return;
    this.hasInteracted = true;
    this.canvas.classList.add("canvas--settled");

    if (typeof this.config.onFirstInteraction === "function") {
      this.config.onFirstInteraction();
    }
  }

  handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();
    this.scene.focus({ preventScroll: true });
    this.scene.setPointerCapture(event.pointerId);
    this.stopMomentum();
    this.markInteracted();

    this.isDragging = true;
    this.previousPointer = { x: event.clientX, y: event.clientY };
    this.lastDragTime = event.timeStamp;
    this.momentum = { x: 0, y: 0 };

    this.scene.addEventListener("pointermove", this.handlePointerMove);
    this.scene.addEventListener("pointerup", this.handlePointerUp);
    this.scene.addEventListener("pointercancel", this.handlePointerUp);
  }

  handlePointerMove(event) {
    if (!this.isDragging) return;

    const elapsed = event.timeStamp - this.lastDragTime;
    const deltaX = event.clientX - this.previousPointer.x;
    const deltaY = event.clientY - this.previousPointer.y;

    if (elapsed > 0) {
      this.momentum.x = (deltaX / elapsed) * this.config.scaleFactorX;
      this.momentum.y = (-deltaY / elapsed) * this.config.scaleFactorY;
    }

    this.yaw += deltaX * this.config.rotationSensitivity;
    this.pitch -= deltaY * this.config.rotationSensitivity;
    this.render();

    this.previousPointer = { x: event.clientX, y: event.clientY };
    this.lastDragTime = event.timeStamp;
  }

  handlePointerUp(event) {
    this.isDragging = false;

    if (this.scene.hasPointerCapture(event.pointerId)) {
      this.scene.releasePointerCapture(event.pointerId);
    }

    this.scene.removeEventListener("pointermove", this.handlePointerMove);
    this.scene.removeEventListener("pointerup", this.handlePointerUp);
    this.scene.removeEventListener("pointercancel", this.handlePointerUp);

    if (!this.reducedMotion.matches && this.hasSignificantMomentum()) {
      this.startMomentum();
    }
  }

  hasSignificantMomentum() {
    return (
      Math.abs(this.momentum.x) > this.config.momentumThreshold ||
      Math.abs(this.momentum.y) > this.config.momentumThreshold
    );
  }

  startMomentum() {
    this.animationFrameId = requestAnimationFrame(this.applyMomentum);
  }

  stopMomentum() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  applyMomentum() {
    if (!this.hasSignificantMomentum()) {
      this.animationFrameId = null;
      return;
    }

    this.yaw += this.momentum.x;
    this.pitch += this.momentum.y;
    this.momentum.x *= this.config.friction;
    this.momentum.y *= this.config.friction;

    this.render();
    this.animationFrameId = requestAnimationFrame(this.applyMomentum);
  }

  handleKeyDown(event) {
    const step = this.config.keyRotationStep;
    const keyActions = {
      ArrowUp: () => (this.pitch += step),
      ArrowDown: () => (this.pitch -= step),
      ArrowLeft: () => (this.yaw -= step),
      ArrowRight: () => (this.yaw += step),
    };

    const action = keyActions[event.key];
    if (!action) return;

    event.preventDefault();
    this.stopMomentum();
    this.markInteracted();
    action();
    this.render();
  }

  /**
   * Write the rotation as custom properties. The stylesheet composes the
   * transform from them, which lets the CSS intro animation start from the
   * same pose the controller ends up at.
   */
  render() {
    this.canvas.style.setProperty("--yaw", `${this.yaw}deg`);
    this.canvas.style.setProperty("--pitch", `${this.pitch}deg`);
  }

  resetRotation() {
    this.yaw = this.config.initialYaw;
    this.pitch = this.config.initialPitch;
    this.stopMomentum();
    this.render();
  }

  destroy() {
    this.stopMomentum();
    this.scene.removeEventListener("pointerdown", this.handlePointerDown);
    this.scene.removeEventListener("keydown", this.handleKeyDown);
    this.scene.removeEventListener("pointermove", this.handlePointerMove);
    this.scene.removeEventListener("pointerup", this.handlePointerUp);
    this.scene.removeEventListener("pointercancel", this.handlePointerUp);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.getElementById("scene");
  const canvas = document.getElementById("canvas");

  if (!scene || !canvas) {
    console.error("Scene or canvas element not found");
    return;
  }

  new ModelRotationController(scene, canvas);
});
