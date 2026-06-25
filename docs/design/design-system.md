# WorldCup Simulator Design System

## 1. Direction

Sports-data command center with a warm stadium atmosphere: dark pitch surfaces, cream cards, sharp lime highlights, and transparent no-real-money disclaimers.

## 2. Tokens

- Background: `pitch` `#0d2419`
- Surface: `cream` `#f6efe1`
- Primary: `turf` `#17633f`
- Accent: `lime` `#b7ff5a`
- Warning accent: `clay` `#d56f3e`
- Text: `ink` `#101512`

## 3. Typography

- Use system UI with tight headings and readable body copy.
- Hero headings use bold, condensed rhythm through tracking and max-width, not decorative fonts.
- Numeric money and odds values use tabular figures.

## 4. Layout

- Max content width: `1180px`.
- Main cards use rounded `24px` corners and soft panel shadows.
- Mobile stacks every table-like section into cards to avoid horizontal scroll.

## 5. Components

- Buttons: solid turf, lime hover, visible focus ring.
- Status pills: compact rounded labels for open, locked, settled, won, lost, void.
- Bet slip: always shows stake, locked odds, potential payout, and virtual-only warning.
- Leaderboard rows: rank, user, profit, win rate, settled bets, public history link.

## 6. Motion

- Keep motion subtle: opacity and transform only.
- No layout-shifting animations.

## 7. Accessibility

- Every interactive control needs a label.
- Focus states must be visible on dark and cream surfaces.
- No color-only state communication.
- Disclaimers appear on home, betting, rewards, and README.
