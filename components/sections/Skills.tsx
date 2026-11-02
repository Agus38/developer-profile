"use client";

import { ArrowUpRight, Braces, Layers3, Wrench } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";

const groups = [
  { key: "frontend" as const, title: "Interface & experience", code: "01", Icon: Layers3 },
  { key: "backend" as const, title: "Logic & systems", code: "02", Icon: Braces },
  { key: "tools" as const, title: "Workflow & tooling", code: "03", Icon: Wrench },
];

export function Skills() {
  const profile = useProfile();
  const updateSpotlight = (event: React.MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--mouse-y", `${event.clientY - bounds.top}px`);
  };

  return <section className="section skills-section" id="skills" aria-labelledby="skills-title">
    <div className="section-topline"><span className="section-index">02 / CAPABILITIES</span><span className="section-aside">TOOLS ARE JUST THE BEGINNING</span></div>
    <div className="skills-heading"><h2 className="section-title" id="skills-title">A flexible<br /><span className="text-outline">toolkit.</span></h2><p className="skills-intro">From the first sketch to the final deploy — the right tool for the right part of the process.</p></div>
    <div className="skills-grid">{groups.map(({ key, title, code, Icon }) => <article className="skill-card" key={key} onMouseMove={updateSpotlight}>
      <div className="skill-card-head"><span className="skill-code">{code} — 03</span><Icon size={19} strokeWidth={1.4} /><ArrowUpRight size={15} className="skill-corner" /></div>
      <h3>{title}</h3><div className="skill-tags">{profile.skills[key].map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="skill-card-foot"><span>FOCUS AREA</span><span className="skill-indicator" /></div>
    </article>)}</div>
    <div className="now-building"><span className="now-live"><i /> CURRENTLY BUILDING</span><span>{profile.currentlyBuilding}</span><span className="now-arrow">↗</span></div>
  </section>;
}
