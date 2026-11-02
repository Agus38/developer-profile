"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";

export function ThemeToggle() {
  const profile = useProfile();
  const [theme, setTheme] = useState<"green" | "red">(profile.theme);

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-theme");
    const next = saved === "red" || saved === "green" ? saved : profile.theme;
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, [profile.theme]);

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
