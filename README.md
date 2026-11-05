# SRMIST redesign concept

Live: https://srm-silk-one.vercel.app

An independent redesign concept based on SRM Institute of Science and Technology's public website. It is not the official website or application portal. It takes no applications, payments or enquiries; every such action links to an official SRMIST site.

| Route | Purpose |
| --- | --- |
| `/` | Homepage and entry point to the three journeys |
| `/admissions` | Applicant journey and official application routes |
| `/academics` | Programme finder (429 official catalogue entries) with "Describe what you enjoy" suggestions |
| `/research` | Research pathways, record, centres and contact |

Every page also has the **SRM Guide**, a compact assistant (bottom right) that points visitors to the right page here or on the official SRMIST site. Both the Guide and programme suggestions call one server route, `app/api/assistant/route.ts`.

Audit report: [docs/srmist-audit-as-is-to-be.md](docs/srmist-audit-as-is-to-be.md)

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### AI features (optional)

The site works without any key: the Guide and programme suggestions then show **keyword matches from the catalogue**, clearly labelled "not AI". To turn on AI suggestions locally:

```bash
cp .env.example .env.local
```

Then set `OPENAI_API_KEY` in `.env.local` and restart `npm run dev`. `.env*` files are git-ignored (only `.env.example` is tracked), so the key stays on your machine.

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | For AI | Server-only OpenAI API key. Never prefix it with `NEXT_PUBLIC_`. |
| `OPENAI_MODEL` | No | Chat model to use. Defaults to `gpt-4.1-mini`; it must support JSON-schema structured outputs. |
| `OPENAI_BASE_URL` | No | OpenAI-compatible API base URL. Defaults to `https://api.openai.com/v1`. |

How the AI is kept grounded and safe:

- The key is read only in the server route; nothing AI-related runs or is stored in the browser.
- The model receives the visitor's question (max 400 characters, with emails and phone numbers removed), up to four short previous turns, and at most 20 candidate programmes and 8 candidate pages chosen locally from `data/programmes.json` and `lib/site-pages.ts`.
- A JSON schema restricts the model to those candidate ids; the route checks them again and drops anything else. Names, links, fees and intake always come from the catalogue, never from the model, and the model is told not to state eligibility, fees, deadlines, intake, rankings or outcomes.
- Requests over 6 KB or with invalid fields are rejected. Calls time out after 12 seconds. On timeout, provider error or a best-effort per-IP limit (20 AI calls per 10 minutes per server instance), the route falls back to labelled keyword matches.
- Questions are not logged or stored by this site. OpenAI requests are sent with `store: false`.

## Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

No database is needed. Environment variables are optional; without them the AI features run in keyword mode.

1. Import this repository at https://vercel.com/new.
2. Keep the detected Next.js settings.
3. To turn on AI, open **Project → Settings → Environment Variables** and add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) for the **Production** environment, plus **Preview** if preview deployments should use AI too. Mark the key as **Sensitive**.
4. Deploy, or redeploy an existing deployment: environment variable changes apply only to new deployments.

From the command line:

```bash
npx vercel env add OPENAI_API_KEY production
```

```bash
npx vercel env add OPENAI_MODEL production
```

Or from the command line:

```bash
npx vercel --prod
```

## Updating content

- `data/site.ts` holds facts, routes and contacts. Change a value and its `CHECKED` date together, and keep a source for every figure.
- `data/programmes.json` holds the catalogue. Add verified entries here; the finder needs no code changes.
- Images are in `public/images`. They are official SRMIST images, used here for a non-commercial concept; see the report for sources.
- Themes are CSS variables at the top of `app/globals.css`. Dark is the default; visitors switch with the header toggle.
- `lib/site-pages.ts` lists every page the SRM Guide may suggest. Add a page there (with keywords) to make it findable; the Guide cannot link anywhere else.
- `lib/catalogue.ts` holds the interest keywords used for local matching and for choosing AI candidates.

## Responsive, motion and browser support

- Long scroll scenes are shortened on phones, and each has a skip link. The campus gallery is a 3D carousel that advances every few seconds and never takes over page scrolling. It pauses on hover, focus, touch and when off screen, has a pause button, swipe, previous/next buttons and arrow keys, and does not autoplay with reduced motion.
- `prefers-reduced-motion` replaces pinned and animated scenes with static layouts.
- Without JavaScript, pinned scenes collapse to ordinary sections (see the `fx-*` classes in `app/globals.css`) and the Guide is not shown.
- Viewport heights use `--vh` (`svh` with a `vh` fallback). Targets: current Chrome, Edge, Firefox and Safari.
