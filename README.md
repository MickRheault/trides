# Trides 🏍️

**Motorcycle Routes in Thailand** — A curated repository of riding routes across the Land of Smiles.

## Tech Stack

| Layer | Tech | Deployed To |
|---|---|---|
| Frontend | [Astro](https://astro.build) (TypeScript) | [Vercel](https://vercel.com) |
| CMS | [Strapi](https://strapi.io) v5 (TypeScript) | [Railway](https://railway.app) |

## Project Structure

```
trides/
├── frontend/     ← Astro site
│   └── src/
│       ├── layouts/
│       ├── pages/
│       ├── lib/
│       └── styles/
├── cms/          ← Strapi CMS
└── README.md
```

## Local Development

### Frontend (Astro)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

### CMS (Strapi)

```bash
cd cms
npm install
npm run develop
```

Open [http://localhost:1337/admin](http://localhost:1337/admin)

On first run, Strapi will ask you to create an admin account. After that, use the Content-Type Builder to create the **Route** content type.

## Deployment

- **Frontend → Vercel**: Connect GitHub repo, set root directory to `frontend/`
- **CMS → Railway**: Connect GitHub repo, set root directory to `cms/`

## License

MIT
