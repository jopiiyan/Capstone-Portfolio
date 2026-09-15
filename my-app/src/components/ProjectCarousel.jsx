import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Children, cloneElement, isValidElement, useState } from "react";
import { ALTERNATE, EASE_CSS, EASE_OUT } from "../motion/presets.js";
import { BODY, C, caption } from "../theme.js";

// Room around the cards inside the clipping stage, so the hover lift isn't cut off.
const LIFT_ROOM = 18;
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 400;
const CARD_W = 70; // % of the stage

// Cover flow: the front card faces the viewer, its neighbours turn inward and
// sink back into the sheet like shadows, anything further out is hidden.
const DIM = "brightness(0.6) blur(1px)";
function pose(offset) {
  const side = Math.sign(offset);
  if (offset === 0) return { x: "0%", scale: 1, rotateY: 0, z: 0, opacity: 1, filter: "brightness(1) blur(0px)", zIndex: 3 };
  if (Math.abs(offset) === 1) return { x: `${side * 55}%`, scale: 0.8, rotateY: side * -32, z: -120, opacity: 0.6, filter: DIM, zIndex: 2 };
  return { x: `${side * 90}%`, scale: 0.6, rotateY: side * -40, z: -240, opacity: 0, filter: DIM, zIndex: 1 };
}

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
 * Shows child cards as a cover flow. The slide count is simply how many valid
 * elements are passed in — add or remove a <ProjectCard> and the range, dashes
 * and controls follow. The front card's `description` prop is shown below.
 */
export default function ProjectCarousel({ children }) {
  const cards = Children.toArray(children).filter(isValidElement);
  const count = cards.length;
  const [rawIndex, setIndex] = useState(0);
  const reduce = useReducedMotion();
  // Clamp in case cards were removed while a later one was showing.
  const index = count ? Math.min(rawIndex, count - 1) : 0;

  if (!count) return null;

  const go = (n) => setIndex(n);
  const step = (d) => go((index + d + count) % count);
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
          position: "relative", overflow: "hidden", perspective: 1100,
          height: "clamp(200px, 44vh, 500px)", margin: -LIFT_ROOM,
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        {cards.map((card, n) => {
          // Shortest way round, so with 3 cards there is always one on each side.
          let offset = n - index;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const front = offset === 0;
          const peek = Math.abs(offset) === 1;
          const { zIndex, ...target } = pose(offset);

          return (
            <motion.div key={card.key ?? n}
              initial={false}
              animate={target}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              drag={front && many ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, { offset: o, velocity: v }) => {
                if (o.x < -SWIPE_DISTANCE || v.x < -SWIPE_VELOCITY) step(1);
                else if (o.x > SWIPE_DISTANCE || v.x > SWIPE_VELOCITY) step(-1);
              }}
              onClick={peek ? () => go(n) : undefined}
              aria-hidden={!front}
              aria-label={front ? `Project ${index + 1} of ${count}` : undefined}
              style={{
                position: "absolute", top: LIFT_ROOM, bottom: LIFT_ROOM,
                left: `${(100 - CARD_W) / 2}%`, width: `${CARD_W}%`, zIndex,
                touchAction: "pan-y", transformStyle: "preserve-3d",
                cursor: front ? (many ? "grab" : undefined) : "pointer",
                pointerEvents: front || peek ? "auto" : "none",
              }}
            >
              <div style={{ height: "100%", pointerEvents: front ? "auto" : "none" }}>
                {cloneElement(card, { active: front })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {many && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 4 }}>
          <StepButton label="Previous project" glyph="←" onClick={() => step(-1)} />
          <div style={{ display: "flex", gap: 6 }}>
            {cards.map((c, n) => (
              <button key={c.key ?? n} type="button" onClick={() => go(n)}
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

          {/* Always there, always blinking (static under reduced motion) */}
          <motion.span aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={reduce ? { opacity: 1 } : { opacity: [1, 0.25] }}
            transition={reduce ? undefined : { duration: 0.9, ease: EASE_CSS, ...ALTERNATE }}
            style={{ ...caption, color: C.signal, marginLeft: "auto", whiteSpace: "nowrap" }}
          >Swipe to see other projects →</motion.span>
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
