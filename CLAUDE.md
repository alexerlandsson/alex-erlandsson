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

- **Cuboid primitive** (`styles.css:261-329`): Reusable 3D box component using CSS transforms. Each cuboid has 6 faces (front, back, left, right, top, bottom) created via `::before`, `::after`, and `.cuboid__inner` pseudo-elements.
- **Positioning system**: Uses CSS custom properties (`--w`, `--h`, `--d`, `--x`, `--y`, `--z`) for width, height, depth, and position on a unit-based grid (`--canvas-base-unit`).
- **Avatar components**: Hair, face, t-shirt, arms, trousers, shoes, and speech bubble - each composed of multiple positioned cuboids.

### JavaScript Controllers

- **ModelRotationController** (`script.js:5-299`): Handles 3D model rotation via mouse/touch drag with momentum physics and keyboard arrow key controls.
- **DialogDragController** (`script.js:305-384`): Makes the About dialog draggable within viewport bounds.

### Styling Conventions

- BEM naming convention enforced via `stylelint-selector-bem-pattern`
- CSS custom properties for theming (light/dark mode via `prefers-color-scheme`)
- High contrast mode support via `prefers-contrast: more`
- Reduced motion support via `prefers-reduced-motion: reduce`

### File Structure

All deployable assets live in `/docs`:

- `index.html` - Single page with semantic HTML and structured data
- `styles.css` - All styles including the 3D model system
- `script.js` - Interaction controllers
