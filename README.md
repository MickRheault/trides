# Trides 🏍️

A motorcycle route discovery website for Thailand. Explore rides by region and difficulty, view interactive maps and elevation profiles, and download GPX tracks for your next trip.

**Live website:** [thmaps.com](https://thmaps.com)

## Features

- Route browsing with region and difficulty filters.
- Detailed ride guides with distance, riding time, road types, and suitable motorcycles.
- Interactive Leaflet maps, elevation profiles, points of interest, and GPX downloads.
- Photo galleries and route content managed through Strapi.

## Built with

| Component | Technology |
| --- | --- |
| Website | Astro, TypeScript, custom CSS |
| Maps | Leaflet and Leaflet Elevation |
| CMS | Strapi 5, SQLite locally or PostgreSQL in production |
| Hosting | Vercel for the website, Railway for the CMS |
| Media | Strapi uploads with optional Cloudinary storage |

The Astro website fetches published Strapi content at build time. Rebuild it after content changes. Bundled demo routes and GPX tracks provide a preview when CMS content is unavailable.

## Run locally

Use Node.js 24 and npm. From the repository root:

```bash
git clone https://github.com/MickRheault/trides.git
cd trides
npm ci
npm ci --prefix frontend
npm ci --prefix cms
cp frontend/.env.example frontend/.env
cp cms/.env.example cms/.env
```

Replace the placeholder CMS secrets in `cms/.env` with generated values. Set `STRAPI_URL=http://localhost:1337` in `frontend/.env`.

Start each service in a separate terminal:

```bash
npm run cms   # Strapi: http://localhost:1337/admin
npm run fe    # Website: http://localhost:4321
```

Create a Strapi admin account on first launch. Content types are already defined in `cms/src/api`; add and publish routes, upload media, and enable public read permissions for the route and related content types.

## Development commands

Run these from the repository root after installing dependencies:

| Command | Purpose |
| --- | --- |
| `npm test` | Frontend API-helper and CMS schema tests |
| `npm run lint` | Frontend and CMS lint checks |
| `npm run build` | Generate the static website in `frontend/dist` |
