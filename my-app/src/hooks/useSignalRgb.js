import { useState } from "react";

const read = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--signal-rgb").trim();

/**
 * The signal colour as bare "r, g, b" channels.
 *
 * Everywhere else a colour reaches a component as `var(--token)`, which the
 * browser resolves. The hero button's glow can't work that way: it is a
 * framer-motion boxShadow keyframe, so framer has to interpolate the colour
 * itself, and it cannot parse a var(). Reading the channels back off the
 * document keeps index.css the single source of truth while still handing
 * framer a literal rgba() it can tween.
 *
 * The page has one palette, so this is read once on mount and never changes.
 */
export function useSignalRgb() {
  const [rgb] = useState(read);
  return rgb;
}
