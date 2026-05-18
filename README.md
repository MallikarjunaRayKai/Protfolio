# Portfolio — Mallikarjuna Bankoli

Vite + React, deployed to GitHub Pages at https://mallikarjunabankoli.com.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Push to `main`. The GitHub Actions workflow at `.github/workflows/deploy.yml`
builds and publishes to GitHub Pages automatically.

### One-time GitHub setup

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **Settings → Pages → Custom domain**: `mallikarjunabankoli.com` (then enable *Enforce HTTPS*).
3. DNS at your registrar:
   - `A` records for apex `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `mallikarjunaraykai.github.io`
