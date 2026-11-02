"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setCount(value);
      return;
    }

    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let start = 0;
    let started = false;
    const animate = (time: number) => {
      if (!started) { start = time; started = true; }
      const progress = Math.min((time - start) / 1150, 1);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frame = window.requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  return <span ref={ref} aria-hidden="true">{count}</span>;
}
