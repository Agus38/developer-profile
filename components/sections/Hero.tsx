"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { formatTime } from "@/lib/utils";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), { ssr: false, loading: () => null });

export function Hero() {
  const profile = useProfile();
  const reduced = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [clock, setClock] = useState("--:--");
  const [lowPower, setLowPower] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setRoleIndex((index) => (index + 1) % profile.role.length), 2600);
    return () => window.clearInterval(id);
  }, [profile.role, reduced]);

  useEffect(() => {
    const update = () => setClock(formatTime(profile.timezone));
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, [profile.timezone]);

  useEffect(() => {
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    setLowPower(window.matchMedia("(pointer: coarse)").matches || navigator.hardwareConcurrency <= 4 || (deviceMemory !== undefined && deviceMemory <= 4));
  }, []);

  const nameWords = profile.name.split(" ");

  return <section className="hero-section" id="home" aria-labelledby="hero-title">
    <div className="hero-grid" aria-hidden="true" />
    {!reduced && !lowPower && <ParticleField />}
    <div className="hero-orb" aria-hidden="true" />
    <div className="hero-main">
      <p className="eyebrow hero-eyebrow"><span className="status-dot" /> AVAILABLE FOR SELECT PROJECTS <span className="eyebrow-line" /> {profile.location.toUpperCase()}</p>
      <h1 id="hero-title" className="hero-title" aria-label={profile.name}>{nameWords.map((word, wordIndex) => <span className="hero-word" key={`${word}-${wordIndex}`} aria-hidden="true">{word.split("").map((letter, letterIndex) => {
        const index = nameWords.slice(0, wordIndex).join("").length + letterIndex + wordIndex;
        return <span className="hero-letter" key={`${letter}-${letterIndex}`} style={{ animationDelay: reduced ? "0s" : `${0.045 * index}s` }}>{letter}</span>;
      })}</span>)}</h1>
      <div className="hero-role-line"><span className="role-prefix">I AM A</span><span className="role-text" key={profile.role[roleIndex]}>{profile.role[roleIndex]}</span><span className="typing-caret" aria-hidden="true" /></div>
      <p className="hero-tagline">{profile.tagline}</p>
      <div className="hero-actions">
        <MagneticLink href="#projects" className="button button-primary">EXPLORE MY WORK <ArrowUpRight size={15} /></MagneticLink>
        <MagneticLink href="#contact" className="button button-ghost">LET’S CONNECT <span className="button-arrow">↗</span></MagneticLink>
      </div>
    </div>
    <div className="hero-side-note mono-label"><span>SCROLL TO EXPLORE</span><span className="side-line" /></div>
    <div className="hero-bottom"><span>BASED IN {profile.location.toUpperCase()}</span><span className="hero-time">LOCAL TIME&nbsp; {clock}</span><a href="#about" className="scroll-cue" aria-label="Scroll ke bagian tentang saya"><span>SCROLL</span><ArrowDown size={14} /></a><span>EST. 2022 — {new Date().getFullYear()}</span></div>
  </section>;
}
