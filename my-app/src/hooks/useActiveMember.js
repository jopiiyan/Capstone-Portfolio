import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The IntersectionObserver half of the source's `componentDidMount`: a rail of
 * full-viewport trigger divs sits behind the sticky stage, and whichever one
 * straddles the viewport midline decides the active member. This `active` index
 * is the page's only piece of real React state.
 *
 * The triggers are read off the rail container rather than collected through
 * seven per-index callback refs — the container ref is a plain ref object, so
 * it is guaranteed populated by the time this effect runs, with no dependency
 * on ref attach/detach ordering across renders.
 */
export function useActiveMember(count, applySnap) {
  const [active, setActive] = useState(0);
  const railRef = useRef(null);
  const trigsRef = useRef([]);
  const snapTimerRef = useRef(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const els = Array.from(rail.children);
    trigsRef.current = els;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = els.indexOf(e.target);
        if (i >= 0) setActive((prev) => (i === prev ? prev : i));
      });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  // Snap has to be off for the duration of the smooth scroll, or the snap
  // points fight the animation and it lands on the wrong member.
  const goTo = useCallback((i) => {
    const el = trigsRef.current[i];
    if (!el) return;
    document.documentElement.style.scrollSnapType = "none";
    clearTimeout(snapTimerRef.current);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    snapTimerRef.current = setTimeout(() => applySnap(), 900);
  }, [applySnap]);

  useEffect(() => () => clearTimeout(snapTimerRef.current), []);

  return { active, railRef, goTo };
}
