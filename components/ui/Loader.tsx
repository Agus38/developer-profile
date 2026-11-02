"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const lines = ["> initializing portfolio...", "> loading creative systems...", "> ready to explore."];

export function Loader() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (window.sessionStorage.getItem("intro-seen") || reducedMotion) return;
    setVisible(true);
    const timeout = window.setTimeout(() => {
      window.sessionStorage.setItem("intro-seen", "true");
      setVisible(false);
    }, 2100);
    return () => window.clearTimeout(timeout);
  }, [reducedMotion]);

  const skip = () => {
    window.sessionStorage.setItem("intro-seen", "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="intro-loader" initial={{ clipPath: "inset(0 0 0 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div className="loader-content">
            <span className="mono-label">R/P — PERSONAL PORTFOLIO</span>
            <div className="boot-lines">{lines.map((line, i) => <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.35 }}>{line}</motion.p>)}</div>
            <div className="loader-track"><motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.7, ease: "easeInOut" }} /></div>
            <button className="skip-button" type="button" onClick={skip}>SKIP INTRO <span>↗</span></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
