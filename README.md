# Alex Erlandsson

This is the repository for my personal website https://alexerlandsson.com hosted with _GitHub Pages_.

![Screenshot](assets/screenshot.png)

## Overviwe

This is a very simple, personal website built with vanilla HTML, CSS, and JavaScript. It is a static site with no backend or build tools—completely free of frameworks and libraries.

## Formatting & Linting

This project follows consistent code formatting and style guidelines using industry-standard tools. These tools are configured to run automatically via [husky](https://typicode.github.io/husky/) pre-commit hooks to maintain code quality.

### Code Formatting

[Prettier](https://prettier.io/) is used for consistent formatting across all files.

```bash
npm run format
```

Alternatively, you can use this script to check fromatting without making changes:

```bash
npm run format:check
```

### CSS Linting

[stylelint](https://stylelint.io/) ensures CSS code quality and consistency.

```bash
npm run lint:css
```

## Deployment

Hosted via **GitHub Pages**, built from the `/docs` directory on the `master` branch. No CI/CD pipeline is used.
