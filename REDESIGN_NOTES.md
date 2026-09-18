# ArogyaDarpan frontend redesign

## What changed

- Replaced the visual-heavy patient header with a simple white, blue and slate interface.
- Rebuilt language selection, consent and patient check-in screens.
- Added functional language switching for the main patient journey across all listed languages.
- Fixed translation fallback behavior when a key is missing.
- Simplified the clinical interview shell and removed decorative navigation, telemetry and artificial status signals.
- Replaced remote logo artwork with the local ArogyaDarpan emblem.
- Reworded misleading live/certified ABDM labels as prototype or sandbox states.
- Updated the Vite React plugin so a normal `npm install` resolves successfully.

## Important ABDM note

ABHA verification is still a sandbox-style demo using local patient profiles. Real verification requires ABDM sandbox credentials and backend API integration. Do not present the current demo as a live or certified ABDM connection.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
```
