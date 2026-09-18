import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // storage unavailable (private browsing, disabled storage) - theme
      // still applies for this page load, just won't persist
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return [theme, toggleTheme];
}
