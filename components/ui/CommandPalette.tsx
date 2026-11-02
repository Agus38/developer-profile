"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Search } from "lucide-react";

const destinations = [
  { label: "Home", href: "#home", key: "01" },
  { label: "Tentang", href: "#about", key: "02" },
  { label: "Keahlian", href: "#skills", key: "03" },
  { label: "Proyek", href: "#projects", key: "04" },
  { label: "Pengalaman", href: "#experience", key: "05" },
  { label: "Kontak", href: "#contact", key: "06" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = destinations.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return <>
    <button type="button" className="palette-trigger" onClick={() => setOpen(true)} aria-label="Buka command palette"><Command size={14} /><span>NAVIGATE</span><kbd>⌘ K</kbd></button>
    <AnimatePresence>
      {open && <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <motion.div className="palette-panel" role="dialog" aria-modal="true" aria-label="Navigasi cepat" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>
          <div className="palette-search"><Search size={17} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ke mana kita pergi?" /><kbd>ESC</kbd></div>
          <p className="mono-label palette-label">JUMP TO SECTION</p>
          {filtered.map((item) => <a className="palette-item" href={item.href} key={item.key} onClick={() => setOpen(false)}><span className="palette-num">{item.key}</span>{item.label}<ArrowUpRight size={15} /></a>)}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </>;
}
