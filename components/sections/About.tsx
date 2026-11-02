"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CountUp } from "@/components/ui/CountUp";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const profile = useProfile();
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = profile.bio.split(" ");

  useEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-word", { opacity: 0.16 }, { opacity: 1, stagger: 0.035, ease: "none", scrollTrigger: { trigger: ".about-copy", start: "top 78%", end: "bottom 55%", scrub: 0.5 } });
      gsap.fromTo(".stat-value", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".stats-row", start: "top 85%" } });
      gsap.fromTo(".about-portrait", { clipPath: "inset(18% 0 0 0)", y: 35 }, { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".about-portrait", start: "top 82%" } });
    }, section);
    return () => ctx.revert();
  }, [profile.bio, profile.stats, reduced]);

  return <section className="section about-section" id="about" ref={section} aria-labelledby="about-title">
    <div className="section-topline"><span className="section-index">01 / ABOUT</span><span className="section-aside">A LITTLE CONTEXT, A LOT OF CURIOSITY</span></div>
    <div className="about-layout">
      <div className="about-copy-column">
        <h2 className="section-title" id="about-title">Building with<br /><span className="text-outline">intention.</span></h2>
        <p className="about-copy">{words.map((word, index) => <span className="about-word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>)}</p>
        <a href="#contact" className="text-link">MORE ABOUT MY APPROACH <ArrowUpRight size={15} /></a>
      </div>
      <div className="about-portrait-wrap">
        <div className={`about-portrait ${profile.avatar ? "has-image" : ""}`} role="img" aria-label={`Foto profil ${profile.name}`}>{profile.avatar && <Image className="portrait-photo" src={profile.avatar} alt="" fill unoptimized sizes="(max-width: 760px) 75vw, 325px" />}<div className="portrait-sun" /><div className="portrait-arc arc-one" /><div className="portrait-arc arc-two" /><div className="portrait-caption mono-label">FIG. 01 — CREATIVE SYSTEMS</div><div className="portrait-coordinate mono-label">{profile.location.toUpperCase()}</div></div>
        <div className="portrait-note"><span>CURIOUS BY DEFAULT</span><span className="note-star">✳</span></div>
      </div>
    </div>
    <div className="stats-row">{profile.stats.map((stat, index) => <div className="stat-item" key={stat.label}><span className="stat-value" aria-label={`${stat.value}${index === 2 ? "" : "+"}`}><CountUp value={stat.value} /><sup>{index === 2 ? "" : "+"}</sup></span><span className="stat-label">{stat.label}</span></div>)}</div>
  </section>;
}
