# SRMIST redesign concept

Live: https://srm-silk-one.vercel.app

An independent redesign concept based on SRM Institute of Science and Technology's public website. It is not the official website or application portal. It takes no applications, payments or enquiries; every such action links to an official SRMIST site.

| Route | Purpose |
| --- | --- |
| `/` | Homepage and entry point to the three journeys |
| `/admissions` | Applicant journey and official application routes |
| `/academics` | Programme finder (429 official catalogue entries) |
| `/research` | Research pathways, record, centres and contact |

Audit report: [docs/srmist-audit-as-is-to-be.md](docs/srmist-audit-as-is-to-be.md)

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

No environment variables, database or private API are needed.

1. Import this repository at https://vercel.com/new.
2. Keep the detected Next.js settings and select Deploy.

Or from the command line:

```bash
npx vercel --prod
```

## Updating content

- `data/site.ts` holds facts, routes and contacts. Change a value and its `CHECKED` date together, and keep a source for every figure.
- `data/programmes.json` holds the catalogue. Add verified entries here; the finder needs no code changes.
- Images are in `public/images`. They are official SRMIST images, used here for a non-commercial concept; see the report for sources.
- Themes are CSS variables at the top of `app/globals.css`. Dark is the default; visitors switch with the header toggle.
