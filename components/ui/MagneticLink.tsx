"use client";

import { AnchorHTMLAttributes, MouseEvent, ReactNode, useRef } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; magnetic?: boolean };

export function MagneticLink({ children, magnetic = true, onMouseMove, onMouseLeave, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    onMouseMove?.(event);
    if (!magnetic || window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.14;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.14;
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const leave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translate3d(0, 0, 0)";
    onMouseLeave?.(event);
  };

  return <a ref={ref} {...props} onMouseMove={move} onMouseLeave={leave}>{children}</a>;
}
