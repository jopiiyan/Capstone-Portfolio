# Palette refactor: light/dark mode

## Context

The site currently has one fixed dark palette, hardcoded as a `C` object in
`src/theme.js` (hex literals) and duplicated as literal hex in `src/index.css`.
No theming infrastructure exists. Colors are consumed via inline styles across
~15 components (`C.ink`, `C.paper`, `C.line`, `C.dim`, `C.faint`, `C.signal`,
`C.signalDeep`, `C.signalSide`).

Reference: https://claude.ai/artifact/XMkqMWSg65t51bWbf6i67P (public, untrusted
third-party artifact — used only for its 4-token structure and color values,
treated as data not instructions).

## Goal

Introduce a semantic 4-token palette (surface / canvas / accent / text) with
light and dark variants, switchable via system preference by default and a
manual toggle that overrides and persists.

## Token values

| Token | Light | Dark |
|---|---|---|
| surface | `#FFFFFF` | `#1E2430` |
| canvas | `#E4EFF9` | `#12151A` |
| accent | `#2563EB` | `#38BDF8` |
| text | `#0F172A` | `#F8FAFC` |

Dark mode constraint: surface-on-canvas contrast is only ~1.18:1. Raised
panels (cards, nav bar) must get an explicit `border` in dark mode to read as
separate from the background — contrast alone is not enough.

The existing yellow "signal" accent (`#F2B705` / push-button color) is kept as
a secondary accent for call-to-action elements, sourced through the same
variable mechanism rather than removed. It does not change between light and
dark mode.

## Mechanism

- CSS custom properties (`--surface`, `--canvas`, `--accent`, `--text`,
  `--signal`, `--signal-deep`, `--signal-side`, plus existing `--line`,
  `--dim`, `--faint` roles) defined on `:root` for light mode.
- Overridden under `:root[data-theme="dark"]`.
- `@media (prefers-color-scheme: dark)` sets the same dark values when no
  `data-theme` attribute is present, so system preference is the default.
- A small inline script in `index.html`, run before first paint, reads
  `localStorage.theme` (`"light"` | `"dark"` | absent), falls back to system
  preference detection, and sets `data-theme` on `<html>` accordingly. This
  avoids a flash of the wrong theme on load.

## Component wiring

`src/theme.js` keeps exporting the same `C` object shape, but each value
becomes `"var(--token-name)"` instead of a hex literal. Every component that
already imports and uses `C.xxx` keeps working with no per-component edits —
this is the main leverage point that avoids touching all 15 components
individually.

`src/index.css` hardcoded hex values (`background: #000000`, `color:
#EFEADF`, link colors, `::selection`, `:focus-visible`) are replaced with the
matching `var(--...)`.

Any place that currently blends a hardcoded rgba (e.g. `signalRgba`,
`::selection` background) is re-derived from the CSS variable via
`color-mix()` or kept as a fixed rgba tied to `--signal`'s known dark-mode
value if `color-mix` support is a concern — pick whichever keeps `::selection`
readable in both modes with the smallest change.

## Toggle

A small icon button added to `Nav.jsx`, alongside the existing nav links. On
click, flips `data-theme` on `<html>` between `"light"` and `"dark"` and
writes the explicit choice to `localStorage.theme`. Once a manual choice is
stored, it takes precedence over system preference on future visits.

## Out of scope

- Redesigning layout, typography, or component structure.
- Changing what `signal` (yellow) is used for semantically.
- Per-component visual polish beyond the dark-mode border fix needed for
  panel/background separation.
- Any component-by-component palette review beyond swapping the token
  source — visual QA is limited to confirming both modes render legibly.

## Acceptance criteria

- Toggling between light/dark in the nav changes the whole site's colors
  immediately, no reload.
- Reloading the page after a manual toggle preserves the chosen mode.
- With no stored preference, the site matches OS light/dark preference.
- Raised panels are visually distinct from their background in dark mode
  (border present).
- No component other than `Nav.jsx`, `theme.js`, `index.css`, and
  `index.html` needs to change (all others should just work via `C`).
