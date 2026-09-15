import { AnimatePresence, motion } from "framer-motion";
import { Children, isValidElement, useState } from "react";
import { EASE_CSS, EASE_OUT } from "../motion/presets.js";
import { BODY, C } from "../theme.js";

// Room around the card inside the clipping frame, so the hover lift isn't cut off.
const LIFT_ROOM = 18;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;

const slide = {
  enter: (dir) => ({ x: `${dir * 100}%`, opacity: 0.4 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir) => ({ x: `${-dir * 100}%`, opacity: 0.4 }),
};

function StepButton({ label, glyph, onClick }) {
  return (
    <motion.button type="button" onClick={onClick} aria-label={label}
      initial={{ color: C.line, borderColor: C.faint }}
      whileHover={{ color: C.signal, borderColor: C.line }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
      style={{
        width: 36, height: 36, display: "grid", placeItems: "center", padding: 0,
        background: "transparent", border: "1px solid", cursor: "pointer",
        fontFamily: BODY, fontSize: 18, lineHeight: 1,
      }}
    >{glyph}</motion.button>
  );
}

/**
 * Shows one child card at a time. The slide count is simply how many valid
 * elements are passed in — add or remove a <ProjectCard> and the range, dashes
 * and controls follow. The active card's `description` prop is shown below.
 */
export default function ProjectCarousel({ children }) {
  const cards = Children.toArray(children).filter(isValidElement);
  const count = cards.length;
  const [[rawIndex, dir], setPage] = useState([0, 0]);
  // Clamp in case cards were removed while a later one was showing.
  const index = count ? Math.min(rawIndex, count - 1) : 0;

  if (!count) return null;

  const step = (d) => setPage([(index + d + count) % count, d]);
  const jump = (n) => n !== index && setPage([n, n > index ? 1 : -1]);
  const many = count > 1;
  const description = cards[index].props.description;

  return (
    <div aria-roledescription="carousel" style={{ display: "grid", gap: 14 }}>
      <div
        tabIndex={many ? 0 : undefined}
        onKeyDown={many ? (e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
          if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        } : undefined}
        style={{
          position: "relative", overflow: "hidden", perspective: 900,
          height: "clamp(170px, 34vh, 400px)", margin: -LIFT_ROOM,
        }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div key={index} custom={dir}
            variants={slide} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.5, ease: EASE_OUT }}
            drag={many ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) step(1);
              else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) step(-1);
            }}
            aria-label={`Project ${index + 1} of ${count}`}
            style={{
              position: "absolute", inset: LIFT_ROOM, touchAction: "pan-y",
              cursor: many ? "grab" : undefined,
            }}
          >
            {cards[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {many && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <StepButton label="Previous project" glyph="←" onClick={() => step(-1)} />
          <div style={{ display: "flex", gap: 6 }}>
            {cards.map((c, n) => (
              <button key={c.key ?? n} type="button" onClick={() => jump(n)}
                aria-label={`Show project ${n + 1}`} aria-current={n === index}
                style={{ padding: "8px 0", border: 0, background: "transparent", cursor: "pointer" }}
              >
                <motion.span
                  style={{ display: "block", height: 3 }}
                  animate={{ width: n === index ? 26 : 14, backgroundColor: n === index ? C.signal : C.faint }}
                  transition={{ duration: 0.3, ease: EASE_CSS }}
                />
              </button>
            ))}
          </div>
          <StepButton label="Next project" glyph="→" onClick={() => step(1)} />
        </div>
      )}

      <div aria-live="polite" style={{ minHeight: "3em" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={index}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_CSS }}
            style={{
              fontFamily: BODY, fontSize: 17, fontWeight: 400, lineHeight: 1.45,
              color: C.paper, maxWidth: 540, margin: 0,
            }}
          >{description}</motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
