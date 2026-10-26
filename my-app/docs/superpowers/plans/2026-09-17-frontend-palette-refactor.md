# Frontend Palette Refactor (Light/Dark Mode) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's single hardcoded dark palette with a 4-token (surface/canvas/accent/text) light+dark system, switchable by OS preference and a persistent manual toggle, without redesigning any component.

**Architecture:** CSS custom properties defined on `:root` (light values) and overridden under `:root[data-theme="dark"]` and a `prefers-color-scheme: dark` media fallback. `src/theme.js`'s existing `C` object is repointed from hex literals to `var(--token)` strings, so every component already consuming `C.xxx` gets the new system for free. A tiny blocking inline script in `index.html` sets `data-theme` on `<html>` before first paint (from `localStorage`, falling back to system preference). A new `useTheme` hook drives a toggle button added to `Nav.jsx`.

**Tech Stack:** React 19 + Vite, plain CSS (no CSS-in-JS, no Tailwind), no test runner is configured in this project (`package.json` has no jest/vitest) — verification is `npm run build`, `npm run lint`, and manual browser checks.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-17-frontend-palette-refactor-design.md`
- Token values (exact, from spec): light `surface #FFFFFF / canvas #E4EFF9 / accent #2563EB / text #0F172A`; dark `surface #1E2430 / canvas #12151A / accent #38BDF8 / text #F8FAFC`.
- `signal`/`signalDeep`/`signalSide` (yellow CTA colors: `#F2B705` / `#FFC928` / `#7A5C00`) stay fixed hex, identical in both modes — do not remap these to light/dark pairs.
- Raised/card panels must stay visually separated via `border`, not contrast alone (dark surface-on-canvas contrast is only ~1.18:1). All existing card-like components (`ProjectCard`, `TermBlock`, `BracketFrame`, `MemberCard`) already render a `border` using `C.line`/`C.faint` — keep that pattern, don't remove borders.
- Do not touch layout, typography, or component markup beyond what's specified in the tasks below.
- No component other than `Nav.jsx`, `PushButton.jsx` (one line, see Task 2), `theme.js`, `index.css`, and `index.html` should need edits — if a task finds itself editing anything else, stop and reconsider before proceeding.

---

### Task 1: CSS custom properties + no-flash theme script

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS custom properties `--surface`, `--canvas`, `--accent`, `--text`, `--line`, `--dim`, `--faint`, `--signal`, `--signal-deep`, `--signal-side`, `--on-signal`, readable by any CSS or by `theme.js` via `var(--name)` strings (Task 2 depends on these exact names).
- Produces: `document.documentElement` always has a `data-theme` attribute set to `"light"` or `"dark"` before first paint.

- [ ] **Step 1: Add the blocking theme-detection script to `index.html`**

Add this `<script>` as the first thing inside `<head>`, before the font `<link>` tags, in `index.html`:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var theme =
        stored === "light" || stored === "dark"
          ? stored
          : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  })();
</script>
```

- [ ] **Step 2: Add the token definitions to `src/index.css`**

Replace the top of `src/index.css` (everything before the `*, *::before, *::after` rule stays; insert this block immediately before it):

```css
:root {
  --surface: #FFFFFF;
  --canvas: #E4EFF9;
  --accent: #2563EB;
  --text: #0F172A;
  --line: #64748B;
  --dim: #94A3B8;
  --faint: #D7E3EF;
  --signal: #F2B705;
  --signal-deep: #FFC928;
  --signal-side: #7A5C00;
  --on-signal: #0F172A;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --surface: #1E2430;
    --canvas: #12151A;
    --accent: #38BDF8;
    --text: #F8FAFC;
    --line: #94A3B8;
    --dim: #7C8AA0;
    --faint: #2A3242;
  }
}

:root[data-theme="dark"] {
  --surface: #1E2430;
  --canvas: #12151A;
  --accent: #38BDF8;
  --text: #F8FAFC;
  --line: #94A3B8;
  --dim: #7C8AA0;
  --faint: #2A3242;
}
```

- [ ] **Step 3: Replace hardcoded colors in `src/index.css` with the new variables**

In the existing rules further down the file, replace:

```css
html { scroll-behavior: smooth; background: #000000; }
body {
  margin: 0; background: #000000; color: #EFEADF;
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}
a { color: #F2B705; text-decoration: none; }
a:hover { color: #EFEADF; }
::selection { background: rgba(157, 187, 162, 0.4); }
:focus-visible { outline: 2px solid #F2B705; outline-offset: 3px; }
```

with:

```css
html { scroll-behavior: smooth; background: var(--surface); }
body {
  margin: 0; background: var(--surface); color: var(--text);
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
}
a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--text); }
::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
```

- [ ] **Step 4: Verify the build still compiles**

Run: `npm run build`
Expected: build succeeds with no errors (CSS-only + static HTML changes, nothing that affects JS compilation).

- [ ] **Step 5: Commit**

```bash
git add index.html src/index.css
git commit -m "feat: add light/dark CSS token system with no-flash theme script"
```

---

### Task 2: Repoint `theme.js` to the CSS tokens, fix button-text contrast

**Files:**
- Modify: `src/theme.js`
- Modify: `src/components/PushButton.jsx:17-18`

**Interfaces:**
- Consumes: CSS custom property names from Task 1 (`--surface`, `--text`, `--line`, `--dim`, `--faint`, `--signal`, `--signal-deep`, `--signal-side`, `--on-signal`).
- Produces: `C` object keeps its existing keys (`ink`, `paper`, `line`, `dim`, `faint`, `signal`, `signalDeep`, `signalSide`) so no other component's imports change, plus a new key `C.onSignal` that Task 2 also wires into `PushButton.jsx`.

**Why `PushButton.jsx` needs a one-line change:** the button's label currently reads `color: C.ink`. Once `C.ink` becomes `var(--surface)` (mode-dependent — white in light mode), white text on the yellow signal button becomes unreadable in light mode. The label needs a color that's dark in both modes, since it always sits on the yellow signal background. `C.onSignal` (`var(--on-signal)`, fixed at `#0F172A`, not overridden in dark mode) is that color.

- [ ] **Step 1: Update `src/theme.js`**

Replace the `C` export with:

```js
export const C = {
  ink: "var(--surface)",
  paper: "var(--text)",
  line: "var(--line)",
  dim: "var(--dim)",
  faint: "var(--faint)",
  signal: "var(--signal)",
  signalDeep: "var(--signal-deep)",
  signalSide: "var(--signal-side)",
  onSignal: "var(--on-signal)",
};
```

Leave `signalRgba`, `DISPLAY`, `BODY`, `caption`, `displayH`, `body` untouched — `signalRgba` stays hardcoded to the numeric yellow since `signal` doesn't change between modes.

- [ ] **Step 2: Fix the button label color in `src/components/PushButton.jsx`**

Change line 18 from:

```js
color: C.ink, textDecoration: "none",
```

to:

```js
color: C.onSignal, textDecoration: "none",
```

- [ ] **Step 3: Verify the build still compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open the printed local URL in a browser.
Expected: page renders (dark mode, since no stored preference yet and most dev machines default OS dark or light — either is fine here), yellow "Contact us" button label text is dark and legible, not washed out.

- [ ] **Step 5: Commit**

```bash
git add src/theme.js src/components/PushButton.jsx
git commit -m "feat: repoint theme tokens to CSS variables, fix button text contrast"
```

---

### Task 3: Theme toggle in the nav

**Files:**
- Create: `src/hooks/useTheme.js`
- Modify: `src/components/Nav.jsx`

**Interfaces:**
- Consumes: `document.documentElement` `data-theme` attribute convention from Task 1; `C.faint`, `C.paper` from `theme.js` (Task 2).
- Produces: `useTheme()` hook exporting `[theme, toggleTheme]` where `theme` is `"light" | "dark"` and `toggleTheme` is a zero-arg function — no other file needs this yet, but name it exactly this way in case a later task wants it.

- [ ] **Step 1: Create `src/hooks/useTheme.js`**

```js
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // storage unavailable (private browsing, disabled storage) - theme
      // still applies for this page load, just won't persist
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return [theme, toggleTheme];
}
```

- [ ] **Step 2: Wire the toggle into `src/components/Nav.jsx`**

Add the import at the top, alongside the existing ones:

```js
import { useTheme } from "../hooks/useTheme.js";
```

Inside `Nav`, add before the `return`:

```js
const [theme, toggleTheme] = useTheme();
```

In the JSX, add a toggle button right before `<PushButton href="#contact" size="sm">Contact us</PushButton>`:

```jsx
<button
  type="button"
  onClick={toggleTheme}
  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
  style={{
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.faint}`,
    background: "transparent", color: C.paper, cursor: "pointer", padding: 0,
    fontSize: 15, lineHeight: 1,
  }}
>
  {theme === "dark" ? "☀" : "☾"}
</button>
```

- [ ] **Step 3: Verify the build still compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the local URL.
1. Click the new toggle button in the nav — the whole page's colors should flip immediately (background, text, borders, button).
2. Reload the page — it should come back in the mode you last picked (check `localStorage.theme` in devtools Application tab).
3. In devtools, clear `localStorage`, then toggle the OS/browser dark-mode setting (or devtools' "Emulate CSS media feature prefers-color-scheme") and reload — the page should follow that system setting.
4. Look at any card-like element (project cards, member cards) in dark mode — confirm the border is visible enough to tell the card apart from the page background.

Expected: all four checks pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTheme.js src/components/Nav.jsx
git commit -m "feat: add light/dark mode toggle to nav"
```

---

### Task 4: Lint pass and final sweep for leftover hardcoded colors

**Files:**
- Read-only check across `src/`

**Interfaces:**
- None — this is a verification-only task, no new interfaces.

- [ ] **Step 1: Run the linter**

Run: `npm run lint`
Expected: no new errors introduced by this refactor (pre-existing warnings unrelated to color, if any, are out of scope).

- [ ] **Step 2: Grep for any color literal that should have become a variable**

Run:
```bash
grep -rn "#[0-9A-Fa-f]\{3,8\}" src/index.css src/theme.js
```
Expected output: only the `:root` / `[data-theme="dark"]` / media-query blocks in `src/index.css` (the token definitions themselves) — no other hex literals in either file. If `theme.js` shows any hex value other than inside `signalRgba`'s numeric arguments, that key was missed in Task 2 and must be fixed before continuing.

- [ ] **Step 3: Full production build**

Run: `npm run build`
Expected: succeeds cleanly.

- [ ] **Step 4: Commit (only if Step 2 required a fix; otherwise skip)**

```bash
git add -A
git commit -m "fix: catch remaining hardcoded colors from palette refactor"
```

## Definition of Done

- `npm run build` and `npm run lint` both pass.
- Toggling the nav button flips the whole site's colors with no reload.
- The chosen mode survives a page reload (`localStorage.theme`).
- With `localStorage` cleared, the site matches the OS/browser color-scheme preference.
- The yellow "Contact us" button's label text is legible in both modes.
- Dark-mode cards/panels remain visually separated from the page background via their existing borders.
- No file outside `index.html`, `src/index.css`, `src/theme.js`, `src/components/PushButton.jsx`, `src/components/Nav.jsx`, and the new `src/hooks/useTheme.js` was modified.
