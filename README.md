# matthew-magno-website

My portfolio site. React + Vite, no UI libraries. The look follows Apple's Human Interface Guidelines: system type, system colors, Liquid Glass-style materials, and automatic light and dark mode.

## Editing content

All copy (apps, experience, toolbox, links) is in `src/data.js`. App icons are in `public/icons/` and the résumé PDF is `public/Matthew_Magno_Resume.pdf`.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy-static-site.yml`, which builds the site and publishes `dist/` to GitHub Pages. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.
