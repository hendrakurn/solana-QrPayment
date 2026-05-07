# /imported — MCP Stitch source of truth

This directory contains the raw, untouched export from MCP Stitch project
`projects/18073327113733925519` (Design System Implementation). It is the
authoritative reference for the SolPay UI refactor.

## Read-only

Do **not** edit any file in this directory. Treat it as a snapshot. The actual
application code lives in `/fe`. All audits, diffs, and refactors must compare
against this folder.

## Layout

```
imported/
├── README.md                       # this file
├── metadata/
│   └── manifest.json               # full screen + design-system manifest
├── design-system/
│   ├── v1-guidelines.md            # styleGuidelines for SolPay Design System
│   ├── v1-tokens.yaml              # parsed tokens (Plus Jakarta Sans)
│   ├── v2-guidelines.md            # styleGuidelines for SolPay V2
│   └── v2-tokens.yaml              # parsed tokens (Manrope)
├── screens/
│   ├── 01-home-v2.html             # SolPay Home V2 markup
│   ├── 02-wallet-v2.html           # My Wallet V2 markup
│   ├── 03-history-v2.html          # Transaction History V2 markup
│   ├── 04-confirm-v2.html          # Confirm Payment V2 markup
│   └── 05-scanner-v2.html          # Tap to Pay Scanner V2 markup
└── screenshots/
    ├── 01-home-v2.jpg              # rendered preview
    ├── 02-wallet-v2.jpg
    ├── 03-history-v2.jpg
    ├── 04-confirm-v2.jpg
    └── 05-scanner-v2.jpg
```

## How this was fetched

1. `mcp__stitch__list_projects` — discovered project
2. `mcp__stitch__get_screen` — for each of the 5 V2 screens
3. `mcp__stitch__list_design_systems` — for both attached design systems
4. HTML and PNG payloads downloaded from `htmlCode.downloadUrl` / `screenshot.downloadUrl`

## Token highlights

- **Background primary:** `#000915` (deepest layer)
- **Surface secondary (cards):** `#1C1C1D`
- **Action / primary CTA:** `#0088FF` (with glow `0 0 20px rgba(0,136,255,0.4)`)
- **Accent purple (AI):** `#5220D8`
- **Accent gold/yellow (status, fees):** `#EE9F0A`
- **Text primary:** `#F6F6F6`
- **On-surface-variant (muted):** `#c0c6d6`
- **Outline variant (borders):** `#404754`
- **Roundness:** ROUND_EIGHT (default 0.5rem, xl 1.5rem)
- **Container margin:** 20px
- **Headline / body font (rendered HTML):** Outfit (note: design-system metadata says Manrope/Plus Jakarta Sans, but the rendered V2 HTMLs all import `Outfit:wght@400;500;600;700`)
- **Type scale:** hero 32/40 -0.02em, section 24/32, body 16/24, caption 12/16 0.01em
