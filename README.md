# Matthew Magno Website

Personal portfolio site built with React.

## Why you might see a 404 on GitHub Pages
Common causes:
- Pages source is not set to **GitHub Actions**.
- Workflow did not run on your default branch.
- You opened the wrong URL format.

## Correct deployment setup
This repo includes a workflow at `.github/workflows/deploy-static-site.yml` that builds and publishes `build/`.

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to your default branch (`main` or `master`) or run the workflow manually.

## Correct URL format
- Project repo: `https://<username>.github.io/<repo-name>/`
- User/org repo named exactly `<username>.github.io`: `https://<username>.github.io/`

## Optional branch-based setup (not recommended here)
If you choose branch publishing, do not use repo root unless root contains built static files.

## Local build
```bash
npm ci
npm run build
```
