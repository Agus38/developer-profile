"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function Effects() {
  const reduced = useReducedMotion();
  const [interactive, setInteractive] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      setCursorEnabled(false);
      return;
    }
    setCursorEnabled(true);
    const target = { x: -100, y: -100 };
    const position = { x: -100, y: -100 };
    let frame = 0;
    const move = (event: MouseEvent) => { target.x = event.clientX; target.y = event.clientY; };
    const over = (event: Event) => {
      const element = event.target;
      if (element instanceof Element) setInteractive(element.closest("a, button, [role='button']") !== null);
    };
    const follow = () => {
      position.x += (target.x - position.x) * 0.16;
      position.y += (target.y - position.y) * 0.16;
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      frame = window.requestAnimationFrame(follow);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    frame = window.requestAnimationFrame(follow);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [reduced]);

  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let input: string[] = [];
    const key = (event: KeyboardEvent) => {
      input = [...input, event.key].slice(-code.length);
      if (input.join("|").toLowerCase() === code.join("|").toLowerCase()) {
        document.body.classList.add("konami-active");
        window.setTimeout(() => document.body.classList.remove("konami-active"), 1800);
        input = [];
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return <>
    <div className="film-grain" aria-hidden="true" />
    {cursorEnabled && <div ref={cursorRef} className={`custom-cursor ${interactive ? "is-interactive" : ""}`} aria-hidden="true"><span /></div>}
  </>;
}
