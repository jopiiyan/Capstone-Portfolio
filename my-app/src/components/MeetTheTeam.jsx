import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE_OUT } from "../motion/presets.js";
import { MEET_EXIT, MEET_VH } from "../scene/armScene.js";
import { BODY, C, DISPLAY, displayH } from "../theme.js";

const SLOGAN = "Seven engineers, one build team.";

// MEET_VH viewports tall with a one-viewport sticky stage, so it stays pinned
// for MEET_VH - 1 of them. The arm has already come apart on the hero's exit,
// so the whole pin belongs to the copy.
//
// The copy then fades out across the start of the tail, so it is gone before
// the team stage — rising into view underneath — reaches the middle of the
// screen. MEET_EXIT is shared with the canvas, which clears the particle field
// just behind it. All of it is in section-travel units (see armScene.js).

/**
 * How far the section has travelled, in viewports: 0 the moment the stage
 * pins, 1 the moment it lets go, 2 once it has scrolled clear. Measured from
 * the live rect on each scroll, the same way useArmScene reads the scroll
 * position, so the copy and the canvas cannot drift apart. Writing a
 * MotionValue keeps all of it off React's render path.
 */
function usePinProgress(ref) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      // top runs 0 → -vh while the stage is pinned.
      const top = el.getBoundingClientRect().top;
      const vh = Math.max(1, window.innerHeight);
      progress.set(Math.max(0, Math.min(MEET_VH, -top / vh)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, progress]);

  return progress;
}

// Where each line arrives, in section travel. The pin runs 0 → 0.8, so the
// copy starts almost as soon as the stage catches and still has a beat to hold
// before the exit. The loose particles stay up behind all of it.
const CUE = {
  slogan: [0.04, 0.20],
  heading: [0.22, 0.42],
  arrow: [0.46, 0.60],
};

/** Fades and lifts its children across [from, to] of the pin's scroll range. */
function Reveal({ progress, range, lift = 20, style, children }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [lift, 0]);

  if (reduce) return <div style={style}>{children}</div>;
  return <motion.div style={{ ...style, opacity, y }}>{children}</motion.div>;
}

export default function MeetTheTeam({ onAdvance }) {
  const ref = useRef(null);
  const progress = usePinProgress(ref);
  const exit = useTransform(progress, MEET_EXIT, [1, 0]);
  // Once it has faded, stop it swallowing clicks meant for the team stage.
  const exitHits = useTransform(progress, (v) => (v > MEET_EXIT[1] ? "none" : "auto"));

  return (
    <section ref={ref} data-screen-label="Meet the team" style={{
      position: "relative", zIndex: 1, height: `${MEET_VH * 100}vh`, scrollSnapAlign: "start",
    }}>
      <motion.div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        display: "grid", alignContent: "center", justifyItems: "center", gap: "clamp(18px, 3vh, 34px)",
        padding: "clamp(90px, 13vh, 120px) 36px clamp(40px, 7vh, 72px)",
        textAlign: "center", opacity: exit, pointerEvents: exitHits,
      }}>
        <Reveal progress={progress} range={CUE.slogan} style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center",
        }}>
          <span style={{ width: "clamp(20px, 6vw, 64px)", height: 1, background: C.line, opacity: 0.6 }} />
          <span style={{
            fontFamily: DISPLAY, fontSize: "clamp(22px, 3.4vh, 34px)", fontWeight: 600,
            letterSpacing: "0.04em", lineHeight: 1.1, color: C.line,
          }}>{SLOGAN}</span>
          <span style={{ width: "clamp(20px, 6vw, 64px)", height: 1, background: C.line, opacity: 0.6 }} />
        </Reveal>

        <Reveal progress={progress} range={CUE.heading} lift={28}>
          <h2 style={{
            ...displayH, fontSize: "clamp(64px, min(11vw, 17vh), 190px)", lineHeight: 0.84,
          }}>Meet the team</h2>
        </Reveal>

        <Reveal progress={progress} range={CUE.arrow} lift={14}>
          <motion.button type="button" onClick={onAdvance}
            aria-label="Go to the project showcase"
            initial={{ color: C.line, borderColor: C.faint }}
            whileHover={{ color: C.signal, borderColor: C.line }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 14,
              padding: "12px 20px", background: "transparent", border: "1px solid",
              cursor: "pointer", fontFamily: BODY, fontSize: 15, fontWeight: 500, lineHeight: 1,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">↓</span>
            <span style={{ color: "inherit" }}>Project showcase</span>
          </motion.button>
        </Reveal>
      </motion.div>
    </section>
  );
}
