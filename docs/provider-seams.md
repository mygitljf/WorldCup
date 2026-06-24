# Provider Seams

The current MVP uses deterministic mock fixtures, odds, users, and results.

Future production adapters can replace the in-memory demo with:

- PostgreSQL and Drizzle for durable ledger storage.
- Auth.js for GitHub login.
- GitHub REST `GET /user/starred/{owner}/{repo}` for star verification.
- Licensed sports data APIs for fixtures, odds, and results.

The UI labels odds as market/bookmaker odds, not FIFA official odds.
