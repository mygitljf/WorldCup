# Architecture

The deployable MVP is a single Next.js app with an in-memory demo store.

```text
Browser -> Caddy :8080 -> Next.js web container :3000 -> in-memory demo store
```

Core modules:

- `src/domain`: virtual bankroll, bets, settlements, leaderboard projections.
- `src/server`: in-memory store and API response helpers.
- `src/app/api`: route handlers for matches, bets, leaderboard, star bonus, and health checks.
- `src/app`: user-facing pages.

This keeps the public demo deployable on one server while preserving seams for a later PostgreSQL-backed implementation.
