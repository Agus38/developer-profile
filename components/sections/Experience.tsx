"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".timeline-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".timeline-list", start: "top 68%", end: "bottom 72%", scrub: 0.5 } });
      gsap.fromTo(".timeline-item", { opacity: 0.25, y: 28 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".timeline-list", start: "top 75%", end: "bottom 62%", scrub: 0.3 } });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return <section className="section experience-section" id="experience" ref={section} aria-labelledby="experience-title">
    <div className="section-topline"><span className="section-index">04 / THE JOURNEY</span><span className="section-aside">A WORK IN PROGRESS</span></div>
    <div className="experience-heading"><h2 className="section-title" id="experience-title">Built along<br /><span className="text-outline">the way.</span></h2><p>Every chapter adds a new perspective. Here are a few of the moments that shaped how I work.</p></div>
    <div className="timeline-list"><svg className="timeline-svg" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path className="timeline-base" d="M1 0 V100" /><path className="timeline-path" d="M1 0 V100" pathLength="1" /></svg>
      {profile.experience.map((item, index) => <article className={`timeline-item ${index % 2 ? "timeline-right" : "timeline-left"}`} key={`${item.year}-${item.title}`}><span className="timeline-dot" /><span className="timeline-year">{item.year}</span><div className="timeline-content"><span className="timeline-counter">0{index + 1} / CHAPTER</span><h3>{item.title}</h3><p>{item.desc}</p></div></article>)}
    </div>
  </section>;
}
