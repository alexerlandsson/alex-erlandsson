# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Alex Erlandsson (https://alexerlandsson.com) - a static site built with vanilla HTML, CSS, and JavaScript featuring a CSS-only 3D avatar model. Hosted via GitHub Pages from the `/docs` directory.

## Commands

```bash
# Format all files with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Lint CSS files
npm run lint:css

# Lint CSS with auto-fix
npm run lint:css:fix

# Run all linting
npm run lint
```

Pre-commit hooks (via husky) automatically run stylelint and prettier checks on staged files.

## Architecture

### CSS 3D Model System

The centerpiece is a pure CSS 3D avatar built with a cuboid-based rendering system:

- **Cuboid primitive** (`.cuboid` in `styles.css`): Reusable 3D box component using CSS transforms. Each cuboid has 6 faces (front, back, left, right, top, bottom) created via `::before`, `::after`, and `.cuboid__inner` pseudo-elements. Side, top and bottom faces are shaded from the cuboid's single `--c` colour with `color-mix()`.
- **Positioning system**: Uses CSS custom properties (`--w`, `--h`, `--d`, `--x`, `--y`, `--z`) for width, height, depth, and position on a unit-based grid (`--canvas-base-unit`, derived from the viewport so the figure always fits its cell).
- **Avatar components**: Plinth, hair, face, t-shirt, arms, trousers, shoes, and speech bubble - each composed of multiple positioned cuboids.
- **Rotation**: `.canvas` composes its transform from `--yaw` and `--pitch` custom properties. The intro spin keyframes read the same properties, so the animation lands on whatever pose the controller holds.

### JavaScript Controllers

- **ModelRotationController** (`script.js`): Handles 3D model rotation via pointer drag with momentum physics (scoped to the `.scene` element) and arrow keys (only while `.scene` has focus). It writes `--yaw`/`--pitch` on `.canvas` rather than an inline transform.

### Styling Conventions

- BEM naming convention enforced via `stylelint-selector-bem-pattern`
- Type: Familjen Grotesk (display and body), Geist Mono (labels, handles), Geist Pixel Square (speech bubble only). All self-hosted in `docs/assets/font`.
- Layout: a hairline grid (header / 7:5 split main / footer link cells) that collapses to one column below 60rem
- CSS custom properties for theming (light/dark mode via `prefers-color-scheme`)
- High contrast mode support via `prefers-contrast: more`
- Reduced motion support via `prefers-reduced-motion: reduce`

### File Structure

All deployable assets live in `/docs`:

- `index.html` - Single page with semantic HTML and structured data (header, intro + about, figure, footer links)
- `styles.css` - All styles including the 3D model system
- `script.js` - Rotation controller
