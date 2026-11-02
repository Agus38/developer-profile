"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
    });
    return () => tween.scrollTrigger?.kill();
  }, []);

  return <div className="scroll-progress" ref={bar} aria-hidden="true" />;
}
