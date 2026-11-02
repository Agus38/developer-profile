"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"green" | "red">("green");

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const next = saved === "red" ? "red" : "green";
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  const toggle = () => {
    const next = theme === "green" ? "red" : "green";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("portfolio-theme", next);
  };

  return (
    <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label={`Ganti ke tema ${theme === "green" ? "merah" : "hijau"}`} title="Ganti tema">
      {theme === "green" ? <Moon size={16} /> : <Sun size={16} />}
      <span>{theme === "green" ? "GREEN" : "RED"}</span>
    </button>
  );
}
