import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(localStorage.getItem("theme_mode") || "light"); // light | dark
  const [accent, setAccent] = useState(localStorage.getItem("theme_accent") || "blue"); // blue|pink|green|purple

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme_mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("theme_accent", accent);
    // map accent -> CSS var --brand
    const map = {
      blue: "37 99 235",
      pink: "236 72 153",
      green: "34 197 94",
      purple: "168 85 247",
    };
    document.documentElement.style.setProperty("--brand", map[accent] || map.blue);
  }, [accent]);

  const value = useMemo(() => ({ mode, setMode, accent, setAccent }), [mode, accent]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}