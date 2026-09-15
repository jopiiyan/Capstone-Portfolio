// Machine-tool palette: black sheet, hammertone-green linework, bone text, and
// one push-button yellow reserved for the things a visitor should press.
export const C = {
  ink: "#000000",
  paper: "#EFEADF",
  line: "#9DBBA2",
  dim: "#A3A69C",
  faint: "#2C322D",
  signal: "#F2B705",
  signalDeep: "#FFC928",
  signalSide: "#7A5C00",
};

export const signalRgba = (a) => `rgba(242,183,5,${a})`;

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
