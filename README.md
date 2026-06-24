# WorldCup Simulator

Virtual-only 2026 World Cup bankroll simulator. Every demo user starts with `$1,000` in virtual credits, places mock market-odds bets, settles matches, and competes on a Top 15 profit leaderboard.

Live Demo: http://42.123.114.169:8080

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

## Quick Start

```bash
corepack pnpm install
corepack pnpm dev
```

Open http://localhost:3000.

## Docker Or Node Fallback

```bash
bash oneClickDeploymentScript.sh
bash scripts/deploy/smoke-check.sh http://127.0.0.1:8080
```

## Useful Commands

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Deployment Notes

- Public entry is served on port `8080`; Docker+Caddy is preferred, and `oneClickDeploymentScript.sh` falls back to a Node standalone process when Docker networking is unavailable.
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
