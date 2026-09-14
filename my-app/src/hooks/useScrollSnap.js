import { useCallback, useEffect } from "react";

/** The source's `applySnap()` / `componentWillUnmount` pair. */
export function useScrollSnap(enabled) {
  const applySnap = useCallback(() => {
    document.documentElement.style.scrollSnapType = enabled ? "y proximity" : "";
  }, [enabled]);

  useEffect(() => {
    applySnap();
    return () => { document.documentElement.style.scrollSnapType = ""; };
  }, [applySnap]);

  return applySnap;
}
