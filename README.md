#  Dayim Developers

Premium residence marketing site — React + Vite.

## Requirements

- Node.js 20+

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
npm run preview
```

`npm run build` outputs a static site to `dist/`. Serve that folder from any static host.

## Deploy

### VPS (Linveo, Ubuntu/Debian)

Nginx serves the static `dist/` build; files for this live in `deploy/`.

One-time server setup (after `ssh-copy-id root@<server-ip>`):

```bash
scp deploy/setup-server.sh deploy/nginx.conf root@<server-ip>:/root/
ssh root@<server-ip> 'bash /root/setup-server.sh'
```

Put the production `VITE_*` values in `.env.production` (see `.env.example`), then deploy from your machine:

```bash
DEPLOY_HOST=deploy@<server-ip> npm run deploy
```

Each deploy is a new folder in `/var/www/dayim/releases/` and the last 5 are kept. To roll back, point `/var/www/dayim/current` at an older release (`ln -sfn <release-dir> /var/www/dayim/current`).

HTTPS, once the domain's A records point at the server:

```bash
ssh root@<server-ip> 'certbot --nginx -d dayimdevelopers.com -d www.dayimdevelopers.com --redirect'
```

### Vercel

1. Import the repo in Vercel (framework: Vite is auto-detected via `vercel.json`).
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy.

Or CLI:

```bash
npx vercel --prod
```

### Netlify

1. Import the repo (uses `netlify.toml`).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

Or CLI:

```bash
npx netlify deploy --prod --dir=dist
```

### Any static host / Nginx

Upload the contents of `dist/` after `npm run build`. Example Nginx:

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/zrge;
  index index.html;

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Notes

- Large media (hero video) lives under `public/assets/images/` and is copied as-is into `dist`.
- Hashed JS/CSS under `/assets/` are safe to cache long-term.
- After you have a live domain, update absolute URLs in `public/sitemap.xml` and Open Graph tags in `index.html`.
