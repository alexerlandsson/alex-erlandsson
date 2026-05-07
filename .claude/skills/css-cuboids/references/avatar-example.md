# Avatar Example

Complete implementation of a voxel character avatar.

## Canvas Configuration

```css
.scene {
  --canvas-base-unit: min(1rem, 2.5vh);
  --canvas-width: 7;
  --canvas-height: 23;
  --canvas-depth: 5;
}
```

## Color Palette

Define colors at canvas level for easy theming:

```css
.canvas {
  --color-hair: oklch(35% 0.05 50);
  --color-skin: oklch(75% 0.08 70);
  --color-shirt: oklch(55% 0.2 250);
  --color-trousers: oklch(30% 0.02 260);
  --color-shoes: oklch(25% 0.02 50);
}
```

## Part Definitions

### Hair

```css
/* Hair builds from back to front in Z layers */
.avatar__hair { --c: var(--color-hair); }
.avatar__hair--top    { --x:1; --y:0; --z:1; --w:5; --h:1; --d:3; }
.avatar__hair--middle { --x:0; --y:1; --z:0; --w:7; --h:3; --d:1; }
.avatar__hair--back   { --x:1; --y:1; --z:0; --w:5; --h:4; --d:1; }
```

### Face

```css
/* Face uses 3 depth layers for 3D shape */
.avatar__face { --c: var(--color-skin); }
.avatar__face--front  { --x:1; --y:4; --z:3; --w:5; --h:3; --d:1; }
.avatar__face--middle { --x:0; --y:2; --z:2; --w:7; --h:5; --d:1; }
.avatar__face--back   { --x:1; --y:1; --z:1; --w:5; --h:5; --d:1; }
.avatar__face--nose   { --x:3; --y:4; --z:4; --w:1; --h:1; --d:1; }
```

### T-Shirt

```css
.avatar__tshirt { --c: var(--color-shirt); }
.avatar__tshirt--body      { --x:0; --y:7;  --z:1; --w:7; --h:6; --d:3; }
.avatar__tshirt--arm-right { --x:0; --y:7;  --z:2; --w:1; --h:3; --d:1; }
.avatar__tshirt--arm-left  { --x:6; --y:7;  --z:2; --w:1; --h:3; --d:1; }
```

### Arms (Skin)

```css
.avatar__arm { --c: var(--color-skin); }
.avatar__arm--right { --x:0; --y:10; --z:2; --w:1; --h:3; --d:1; }
.avatar__arm--left  { --x:6; --y:10; --z:2; --w:1; --h:3; --d:1; }
```

### Trousers

```css
.avatar__trousers { --c: var(--color-trousers); }
.avatar__trousers--waist     { --x:0; --y:13; --z:1; --w:7; --h:2; --d:3; }
.avatar__trousers--leg-right { --x:0; --y:15; --z:1; --w:3; --h:5; --d:3; }
.avatar__trousers--leg-left  { --x:4; --y:15; --z:1; --w:3; --h:5; --d:3; }
```

### Shoes

```css
.avatar__shoes { --c: var(--color-shoes); }
.avatar__shoes--top.avatar__shoes--right    { --x:0; --y:20; --z:1; --w:3; --h:1; --d:3; }
.avatar__shoes--bottom.avatar__shoes--right { --x:0; --y:21; --z:0; --w:3; --h:2; --d:4; }
.avatar__shoes--top.avatar__shoes--left     { --x:4; --y:20; --z:1; --w:3; --h:1; --d:3; }
.avatar__shoes--bottom.avatar__shoes--left  { --x:4; --y:21; --z:0; --w:3; --h:2; --d:4; }
```

## Complete HTML Structure

```html
<div class="scene">
  <figure class="canvas" id="canvas" role="img">
    <!-- Hair -->
    <div class="cuboid avatar__hair avatar__hair--top" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__hair avatar__hair--middle" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__hair avatar__hair--back" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <!-- Face -->
    <div class="cuboid avatar__face avatar__face--front" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__face avatar__face--middle" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__face avatar__face--back" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__face avatar__face--nose" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <!-- T-Shirt -->
    <div class="cuboid avatar__tshirt avatar__tshirt--body" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__tshirt avatar__tshirt--arm avatar__tshirt--arm-right" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__tshirt avatar__tshirt--arm avatar__tshirt--arm-left" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <!-- Arms -->
    <div class="cuboid avatar__arm avatar__arm--right" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__arm avatar__arm--left" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <!-- Trousers -->
    <div class="cuboid avatar__trousers avatar__trousers--waist" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__trousers avatar__trousers--leg avatar__trousers--leg-right" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__trousers avatar__trousers--leg avatar__trousers--leg-left" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <!-- Shoes -->
    <div class="cuboid avatar__shoes avatar__shoes--top avatar__shoes--right" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__shoes avatar__shoes--bottom avatar__shoes--right" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__shoes avatar__shoes--top avatar__shoes--left" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>
    <div class="cuboid avatar__shoes avatar__shoes--bottom avatar__shoes--left" aria-hidden="true">
      <span class="cuboid__inner"></span>
    </div>

    <figcaption class="sr-only">
      3D voxel representation of a person.
    </figcaption>
  </figure>
</div>
```

## Interactive Rotation (Optional)

Add mouse/touch drag rotation with momentum:

```js
const canvas = document.getElementById('canvas');
const sensitivity = 0.5;
const friction = 0.85;
const momentumThreshold = 0.1;

let isDragging = false;
let rotation = { x: 0, y: 0 };
let momentum = { x: 0, y: 0 };
let prev = { x: 0, y: 0 };
let lastDragTime = 0;
let frameId = null;

function updateRotation() {
  canvas.style.transform =
    `rotateX(${rotation.y}deg) rotateY(${rotation.x}deg)`;
}

function applyMomentum() {
  if (
    Math.abs(momentum.x) < momentumThreshold &&
    Math.abs(momentum.y) < momentumThreshold
  ) {
    frameId = null;
    return;
  }

  rotation.x += momentum.x;
  rotation.y += momentum.y;
  momentum.x *= friction;
  momentum.y *= friction;

  updateRotation();
  frameId = requestAnimationFrame(applyMomentum);
}

document.addEventListener('pointerdown', (e) => {
  if (frameId) cancelAnimationFrame(frameId);
  isDragging = true;
  prev = { x: e.clientX, y: e.clientY };
  lastDragTime = Date.now();
  momentum = { x: 0, y: 0 };

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
});

function onMove(e) {
  if (!isDragging) return;
  const now = Date.now();
  const elapsed = now - lastDragTime;
  const dx = e.clientX - prev.x;
  const dy = e.clientY - prev.y;

  if (elapsed > 0) {
    momentum.x = (dx / elapsed) * 15;
    momentum.y = (-dy / elapsed) * 5;
  }

  rotation.x += dx * sensitivity;
  rotation.y -= dy * sensitivity;
  updateRotation();

  prev = { x: e.clientX, y: e.clientY };
  lastDragTime = now;
}

function onUp() {
  isDragging = false;
  document.removeEventListener('pointermove', onMove);
  document.removeEventListener('pointerup', onUp);
  frameId = requestAnimationFrame(applyMomentum);
}
```

Keyboard rotation (optional addition):

```js
document.addEventListener('keydown', (e) => {
  const step = 22.5;
  const actions = {
    ArrowUp:    () => rotation.y += step,
    ArrowDown:  () => rotation.y -= step,
    ArrowLeft:  () => rotation.x -= step,
    ArrowRight: () => rotation.x += step,
  };
  if (actions[e.key]) {
    actions[e.key]();
    updateRotation();
  }
});
```
