# WorldCup Simulator

Virtual-only 2026 World Cup bankroll simulator. Every demo user starts with `$1,000` in virtual credits, places mock market-odds bets, settles matches, and competes on a Top 15 profit leaderboard.

[Live Demo](http://47.95.124.205)

## Legal Disclaimer

This project is for entertainment and education only. It does not support real-money gambling, deposits, withdrawals, cash-out, prizes, fiat payments, crypto payments, financial advice, betting advice, or FIFA/bookmaker affiliation.

## Features

- Mock 2026 World Cup fixtures and market odds.
- Virtual bankroll ledger with `$1,000` initial credits.
- Virtual betting with locked odds snapshots.
- Demo settlement and Top 15 current-profit leaderboard.
- Public history pages for ranked users.
- GitHub star bonus simulation for an extra virtual `$1,000`.
- Docker Compose deployment on a single server.

## Tech Stack

| Area | Stack | Purpose |
| --- | --- | --- |
| Web framework | Next.js 15 App Router | Server-rendered pages, API route handlers, standalone production build. |
| UI runtime | React 19 | Interactive client components for bet slips, reward claiming, and navigation. |
| Language | TypeScript strict mode | End-to-end type safety with `noUncheckedIndexedAccess` and exact optional property checks. |
| Styling | Tailwind CSS | Responsive football-stadium visual system, layout utilities, and component styling. |
| API layer | Next.js Route Handlers | Health, readiness, matches, bets, leaderboard, user history, settlement, and reward endpoints. |
| Input validation | Zod | Request parsing for bet placement and demo settlement payloads. |
| Domain logic | Pure TypeScript services | Virtual bankroll accounting, locked-odds betting, match settlement, leaderboard ranking, and GitHub star bonus rules. |
| Data store | In-memory mock store | MVP demo persistence seeded from mock 2026 World Cup fixtures and users. |
| Result handling | Typed result helpers | Explicit success/failure flows for business rules without throwing for expected domain outcomes. |
| Formatting | Shared TypeScript utilities | Money formatting and exhaustive-state helpers used across API and UI. |
| Unit testing | Vitest + jsdom | Business logic and utility tests for betting, leaderboard, star bonus, and money formatting. |
| Linting/formatting | Biome | Fast lint checks, import hygiene, no explicit `any`, and consistent code style. |
| Type checking | `tsc --noEmit` | Strict compile-time verification before deployment. |
| Safety checks | Shell verification scripts | Tracked-secret scanning and TypeScript file LOC guard. |
| Container deploy | Docker Compose + Caddy | Preferred single-server deployment path with Caddy reverse proxy and Next standalone output. |
| Live runtime | Node standalone + systemd | Current ECS deployment runs the Next standalone server on port `80` with `worldcup.service`. |
| Package manager | pnpm via Corepack | Reproducible installs from `pnpm-lock.yaml`. |

## Quick Start

```bash
corepack pnpm install
corepack pnpm dev
```

Open http://localhost:3000.

## Docker Or Node Fallback

```bash
bash scripts/deploy/one-click-deploy.sh
bash scripts/deploy/smoke-check.sh http://127.0.0.1
```

## Useful Commands

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Deployment Notes

- Public entry is served on port `80`; Docker+Caddy via `deploy/docker-compose.yml` is preferred, and `scripts/deploy/one-click-deploy.sh` falls back to a Node standalone process when Docker networking is unavailable.
- Keep `deployServer.md`, `.env`, server credentials, API keys, database dumps, and logs out of git.
- The current MVP uses an in-memory demo store, so data resets when the container restarts.
- Production persistence should replace the demo store with PostgreSQL and Drizzle.

## API Highlights

- `GET /api/health`
- `GET /api/ready`
- `GET /api/matches`
- `POST /api/bets`
- `GET /api/leaderboard?limit=15`
- `POST /api/rewards/github-star/claim`
- `POST /api/demo/settle`
