---
name: css-cuboids
description: Create CSS-only 3D cuboids and voxel models using CSS transforms. Use when building 3D objects, voxel art, isometric graphics, or any decorative 3D element using pure CSS. Triggers include requests to create CSS 3D shapes, voxel characters, isometric illustrations, CSS cubes, or any 3D decorative element without WebGL/Canvas.
---

# CSS Cuboids / Voxel Models

Create 3D objects using CSS transforms and custom properties. Each cuboid is a 6-faced box positioned in 3D space.

## Core Concept

The system uses a unit-based coordinate grid where:
- **Scene** defines perspective and overall dimensions
- **Canvas** is the 3D container that can be rotated/transformed
- **Cuboids** are positioned using `--x`, `--y`, `--z` coordinates and sized with `--w`, `--h`, `--d`

## Coordinate System

```
        Y- (up)
          |
          |
          +------ X+ (right)
         /
        /
       Z+ (toward viewer)
```

Origin is **top-left-back** corner of the canvas. All values are in grid units (multiplied by `--canvas-base-unit`).

## Quick Start

1. Copy base CSS from `assets/cuboid-base.css`
2. Set canvas dimensions via `--canvas-width`, `--canvas-height`, `--canvas-depth`
3. Create cuboids with position (`--x`, `--y`, `--z`), size (`--w`, `--h`, `--d`), and color (`--c`)

## Cuboid Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--x` | `0` | X position (grid units from left) |
| `--y` | `0` | Y position (grid units from top) |
| `--z` | `0` | Z position (grid units from back) |
| `--w` | `1` | Width (grid units) |
| `--h` | `1` | Height (grid units) |
| `--d` | `1` | Depth (grid units) |
| `--c` | — | Color (any CSS color value) |

## HTML Structure

```html
<div class="scene">
  <figure class="canvas" role="img">
    <!-- Each cuboid needs inner span for front/top/bottom faces -->
    <div class="cuboid my-part" style="--x:0; --y:0; --z:0; --w:2; --h:3; --d:1; --c:#3b82f6;">
      <span class="cuboid__inner"></span>
    </div>
    <figcaption class="canvas__description">Description for accessibility</figcaption>
  </figure>
</div>
```

## Creating Objects

**Workflow:**
1. Sketch the object on paper or mentally as stacked blocks
2. Identify each distinct rectangular part
3. Assign position and dimensions to each part
4. Group related parts with semantic class names

**Example - Single cuboid definition:**
```css
.cuboid {
  --w: 2;   /* Width: 2 units */
  --h: 1;   /* Height: 1 unit */
  --d: 3;   /* Depth: 3 units */
  --x: 2;   /* Position: 2 units from left */
  --y: 0;   /* Position: 0 units from top */
  --z: 1;   /* Position: 1 unit from back */
  --c: #000; /* Color: black */
}
```

**Example - Multiple related parts (shorthand):**
```css
.cuboid--1   { --x:1; --y:0; --z:0; --w:5; --h:5; --d:1; --c:#00ffff; }
.cuboid--2 { --x:0; --y:1; --z:1; --w:7; --h:5; --d:2; --c:#ff00ff; }
.cuboid--3  { --x:1; --y:2; --z:3; --w:5; --h:3; --d:1; --c:#ffff00; }
```

## Animation

The canvas can be rotated for interactivity. For drag-to-rotate interactivity, apply `rotateX()` and `rotateY()` transforms via JavaScript.

## Best Practices

1. **Use CSS custom properties for colors** - Define color palette at canvas level for easy theming
2. **Name parts semantically** - Use BEM-style classes like `.cuboid__bottom--left`
3. **Minimize cuboid count** - Merge adjacent same-color blocks where possible
4. **Always include `aria-hidden="true"`** on decorative cuboids
5. **Provide `figcaption.sr-only`** for accessibility

## Reference Files

- **Base CSS**: See `assets/cuboid-base.css` for copy-paste foundation
- **Full Example**: See `references/avatar-example.md` for complete character implementation
