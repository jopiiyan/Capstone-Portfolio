import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ImageSlot from "./ImageSlot.jsx";
import { EASE_OUT } from "../motion/presets.js";
import { BODY, C, RADIUS, caption, displayH } from "../theme.js";

// Above the nav (z-index 30) — the sheet covers the whole page, nav included.
const Z = 100;
// Seconds. EXIT also times the unmount (see `mounted` below); SLIDE_DELAY holds
// the write-up back until the photo has most of its size.
const FLIGHT = 0.42;
const EXIT = 0.3;
const SLIDE = 0.4;
const SLIDE_DELAY = 0.16;

// Shared by the sheet and by the hidden proxy that is measured to find out
// where the sheet will land: the two have to size identically.
const PANEL_BOX = {
  margin: "auto", width: "min(680px, 100%)", height: "min(620px, 100%)",
  maxHeight: "100%",
};

function CloseButton({ onClick, buttonRef }) {
  return (
    <motion.button ref={buttonRef} type="button" onClick={onClick} aria-label="Close project"
      initial={{ color: C.paper, borderColor: C.faint, backgroundColor: C.ink }}
      whileHover={{ color: C.signal, borderColor: C.line }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute", top: 12, right: 12, zIndex: 3,
        width: 38, height: 38, display: "grid", placeItems: "center", padding: 0,
        border: "1px solid", borderRadius: "50%", cursor: "pointer",
        fontFamily: BODY, fontSize: 20, lineHeight: 1,
      }}
    >×</motion.button>
  );
}

/**
 * The project detail sheet: the photo across the top, the write-up under it,
 * over a darkened page. It grows out of the thumbnail that opened it.
 *
 * Rendered into document.body rather than in place, because the carousel that
 * opens it sets `perspective` and transforms its cards — either would become
 * the containing block for a fixed-position child and trap the overlay inside
 * the stage.
 *
 * `project` null means closed. The close is animated by holding the sheet
 * mounted for one fade rather than by AnimatePresence, which cannot take a
 * portal as a child — it filters anything that isn't a plain element, so the
 * sheet never reaches the page.
 */
export default function ProjectDialog({ project, originRect, onClose }) {
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  const proxyRef = useRef(null);
  // The backdrop closes on a press that both starts and ends on it. Guarding on
  // the press, not just the click, keeps two things out: a drag that began
  // inside the sheet and released outside it, and the tail of the very click
  // that opened the sheet — that one's pointerdown happened before this mounted,
  // so it never arms the flag.
  const pressedBackdrop = useRef(false);
  const open = Boolean(project);

  // The last project and the last thumbnail box, held so the sheet still has
  // something to draw, and somewhere to fly back to, on the way out. Both read
  // through to the prop first: a render-phase setState only lands on the next
  // pass, and this one still has to draw what it was handed.
  const [last, setLast] = useState(project);
  if (project && project !== last) setLast(project);
  const shown = project ?? last;

  const [lastOrigin, setLastOrigin] = useState(originRect);
  if (originRect && originRect !== lastOrigin) setLastOrigin(originRect);
  const origin = originRect ?? lastOrigin;

  // Stays true through the fade-out, so the sheet survives its own exit. Set
  // during render rather than from an effect, so opening paints in the same
  // commit — the focus effect below needs the close button to exist by then.
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setMounted(false), EXIT * 1000);
    return () => clearTimeout(t);
  }, [open]);

  /**
   * The flight: where the sheet starts, as an offset from where it lands.
   *
   * framer's `layoutId` would normally do this, but the card it flies from sits
   * in a 3D stage (`perspective` + `rotateY` in ProjectCarousel) and the sheet
   * is portalled — layout projection survives neither. Measuring is exact
   * instead: `for` ties a measurement to the thumbnail box it was taken from,
   * so a second open re-measures rather than reusing a stale one.
   */
  const [flight, setFlight] = useState(null);
  const entering = flight && flight.for === origin ? flight : null;
  // Nothing to fly from (or the visitor asked for less motion) → no measuring pass.
  const measuring = open && !reduce && Boolean(origin) && !entering;

  useLayoutEffect(() => {
    if (!measuring) return;
    const box = proxyRef.current?.getBoundingClientRect();
    if (!box?.width || !box?.height) return;
    setFlight({
      for: origin,
      x: origin.left + origin.width / 2 - (box.left + box.width / 2),
      y: origin.top + origin.height / 2 - (box.top + box.height / 2),
      // One uniform scale, taken off the width: scaling the axes separately to
      // match the thumbnail exactly would squash the photo in flight.
      scale: Math.min(Math.max(origin.width / box.width, 0.1), 1),
    });
  }, [measuring, origin]);

  // Escape closes. Separate from the effects below because `onClose` is an
  // inline arrow from the caller: re-running this on every parent render is
  // free, while re-running the scroll lock would yank focus mid-read.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Hold the page still underneath. Padding replaces the scrollbar so the
    // layout behind the sheet doesn't jump sideways as it opens.
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  // Focus waits for the measuring pass: on that first commit the close button
  // does not exist yet. On the way out focus goes back to the card that opened
  // the sheet, not to the top of the page.
  useEffect(() => {
    if (!open || measuring) return;
    const returnTo = document.activeElement;
    closeRef.current?.focus();
    return () => returnTo?.focus?.();
  }, [open, measuring]);

  if (!open && !mounted) return null;

  const enterFrom = entering
    ? { x: entering.x, y: entering.y, scale: entering.scale, opacity: 0.4 }
    : { opacity: 0, y: 18, scale: 0.97 };
  const exitTo = entering
    ? { x: entering.x, y: entering.y, scale: entering.scale, opacity: 0 }
    : { opacity: 0, y: 12, scale: 0.98 };

  return createPortal(
    (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: EXIT, ease: EASE_OUT }}
        onPointerDown={(e) => { pressedBackdrop.current = e.target === e.currentTarget; }}
        onClick={(e) => {
          if (e.target === e.currentTarget && pressedBackdrop.current) onClose();
          pressedBackdrop.current = false;
        }}
        style={{
          position: "fixed", inset: 0, zIndex: Z, display: "flex",
          padding: "clamp(12px, 2.5vw, 32px)",
          background: "rgba(4, 7, 12, 0.78)", backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)", overflowY: "auto",
          // On the way out it must not swallow clicks meant for the page.
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* One frame of an empty box the size the sheet will be. The layout
            effect above measures it and the sheet mounts in its place, both
            before the browser paints, so none of this is ever seen. */}
        {measuring ? (
          <div ref={proxyRef} aria-hidden="true"
            style={{ ...PANEL_BOX, visibility: "hidden", pointerEvents: "none" }} />
        ) : (
          <motion.div role="dialog" aria-modal="true" aria-label={shown.title}
            initial={enterFrom}
            animate={open ? { x: 0, y: 0, scale: 1, opacity: 1 } : exitTo}
            transition={{ duration: open ? FLIGHT : EXIT, ease: EASE_OUT }}
            style={{
              // `margin: auto` (in PANEL_BOX) rather than the flex centring
              // properties: on a viewport too short for the sheet, centring
              // would push its top edge — and the close button — out of reach.
              ...PANEL_BOX, position: "relative",
              // The sheet itself never scrolls, so the close button stays pinned
              // to its corner; the write-up inside it is what scrolls.
              display: "flex", flexDirection: "column", overflow: "hidden",
              background: C.ink, border: `1px solid ${C.faint}`,
              borderRadius: RADIUS, boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
            }}
          >
            <CloseButton onClick={onClose} buttonRef={closeRef} />

            {/* Cropped to fill, like the card thumbnail, so the zoom lands on
                the framing the visitor pressed. Opaque and above the copy,
                which slides out from behind it. */}
            <div style={{
              flex: "0 0 46%", minHeight: 0, position: "relative", zIndex: 2,
              background: C.ink,
            }}>
              <ImageSlot src={shown.photo || undefined} alt={shown.title}
                placeholder="Project photo" fit="cover" />
            </div>

            <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden", position: "relative" }}>
              <motion.div
                initial={reduce ? { opacity: 0 } : { y: "-100%" }}
                animate={reduce ? { opacity: open ? 1 : 0 } : { y: open ? "0%" : "-100%" }}
                transition={{
                  duration: open ? SLIDE : EXIT * 0.7,
                  delay: open && !reduce ? SLIDE_DELAY : 0,
                  ease: EASE_OUT,
                }}
                style={{
                  height: "100%", display: "flex", flexDirection: "column",
                  minHeight: 0, padding: "clamp(18px, 2.6vw, 28px)",
                }}
              >
                {/* Held above the scroll, so a long write-up never takes the
                    project's name off the sheet with it. */}
                <div style={{ flex: "0 0 auto", display: "grid", gap: 10 }}>
                  <span style={{ ...caption, color: C.signal, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Project
                  </span>
                  <h2 style={{ ...displayH, fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 0.95 }}>
                    {shown.title}
                  </h2>
                  <div style={{ height: 1, background: C.faint }} />
                </div>

                {/* tabIndex, because a scrolling box is not keyboard-scrollable
                    otherwise: Tab from the close button lands here and the arrow
                    keys then work. */}
                <div className="dialog-prose" tabIndex={0}
                  role="region" aria-label={`${shown.title} description`}
                  style={{
                    flex: "1 1 auto", minHeight: 0, overflowY: "auto",
                    overscrollBehavior: "contain", paddingTop: 12,
                    display: "grid", gap: 12, alignContent: "start",
                  }}
                >
                  <p style={{
                    fontFamily: BODY, fontSize: 17, fontWeight: 400, lineHeight: 1.6,
                    color: C.paper, margin: 0,
                  }}>{shown.description}</p>
                  {/* Optional long-form write-up; one paragraph per entry. */}
                  {toParagraphs(shown.details).map((text, i) => (
                    <p key={i} style={{
                      fontFamily: BODY, fontSize: 16, fontWeight: 400, lineHeight: 1.6,
                      color: C.dim, margin: 0,
                    }}>{text}</p>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    ),
    document.body
  );
}

// `details` may be absent, one block of prose, or already split into paragraphs.
function toParagraphs(details) {
  if (!details) return [];
  return Array.isArray(details) ? details : [details];
}
