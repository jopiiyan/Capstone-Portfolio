// Machine-tool palette, now driven by the four semantic tokens in index.css.
// The push-button colour ("signal") tracks the accent, so the things a visitor
// should press are the one saturated colour on the page in either mode.
export const C = {
  // Page sits on canvas; cards and raised panels sit on ink (the lighter
  // surface in light mode, the lighter panel in dark). Keeping the two distinct
  // is what makes a card read as raised — see the palette design spec.
  canvas: "var(--canvas)",
  ink: "var(--surface)",
  accent: "var(--accent)",
  paper: "var(--text)",
  line: "var(--line)",
  dim: "var(--dim)",
  faint: "var(--faint)",
  signal: "var(--signal)",
  signalDeep: "var(--signal-deep)",
  signalSide: "var(--signal-side)",
  onSignal: "var(--on-signal)",
};

// One radius for card-like surfaces. Deliberately not applied to TermBlock or
// BracketFrame: those draw a DIN-rail terminal and a drawing's registration
// corners, and rounding them stops them depicting the thing they depict.
export const RADIUS = 14;

export const DISPLAY = "'Big Shoulders Display', 'Arial Narrow', ui-sans-serif, sans-serif";
export const BODY = "'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif";

// Small caption: sentence case, readable weight.
export const caption = {
  fontFamily: BODY, fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: C.dim,
};

export const displayH = {
  fontFamily: DISPLAY, fontWeight: 800, lineHeight: 0.9,
  letterSpacing: "-0.005em", margin: 0, color: C.paper,
};

export const body = {
  fontFamily: BODY, fontWeight: 400, lineHeight: 1.55, color: C.paper,
};
