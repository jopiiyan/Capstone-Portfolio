// Eases lifted from the design's CSS. Spelled out as bezier arrays because
// framer-motion's named eases are NOT the same curves as the CSS keywords —
// CSS `ease` is cubic-bezier(.25,.1,.25,1), framer's "easeInOut" is (.42,0,.58,1).
export const EASE_CSS = [0.25, 0.1, 0.25, 1];        // CSS `ease`
export const EASE_OUT = [0.16, 0.84, 0.24, 1];       // rise / brk / enL* / enR*
export const EASE_SWEEP = [0.35, 0.65, 0.25, 1];     // swRL* / swLR*

// `animation-direction: alternate` maps to repeatType "reverse" (WAAPI's
// `direction: alternate`), not "mirror" — "mirror" falls off the accelerated
// path and re-eases each leg instead of time-reversing it.
export const ALTERNATE = { repeat: Infinity, repeatType: "reverse" };

// @keyframes rise — hero copy block
export const rise = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE_OUT },
};

// @keyframes enLA/enLB/enRA/enRB — the A/B suffixes in the source exist only to
// force the CSS animation to restart on member change; in React that's `key`.
export const enterX = (fromLeft, delay = 0) => ({
  initial: { opacity: 0, x: fromLeft ? -56 : 56 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.64, delay, ease: EASE_OUT },
});

// @keyframes swRLA/swRLB/swLRA/swLRB — x is one eased segment; opacity has four
// stops, so each of its three segments gets its own pass of the same bezier,
// exactly as CSS applies a timing function between adjacent keyframes.
export const sweep = (dir, delay) => ({
  initial: { x: `${dir * 100}%`, opacity: 0 },
  animate: { x: `${-dir * 100}%`, opacity: [0, 1, 1, 0] },
  transition: {
    x: { duration: 1.1, delay, ease: EASE_SWEEP },
    opacity: {
      duration: 1.1,
      delay,
      times: [0, 0.16, 0.84, 1],
      ease: [EASE_SWEEP, EASE_SWEEP, EASE_SWEEP],
    },
  },
});

// transition: opacity 400ms ease — stacked portrait / project-shot layers
export const crossFade = { duration: 0.4, ease: EASE_CSS };

// The source declares no transition on its `style-hover` rules, so hover is
// instantaneous. Swap the duration to 0.15 for a softer feel.
export const HOVER_INSTANT = { duration: 0 };
