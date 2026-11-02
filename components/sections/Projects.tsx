"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !section.current || !track.current || window.innerWidth < 760) return;
    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 100);
      gsap.to(track.current, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return <section className="projects-section" id="projects" ref={section} aria-labelledby="projects-title">
    <div className="projects-head"><div><span className="section-index">03 / SELECTED WORK</span><h2 className="section-title" id="projects-title">Proof of<br /><span className="text-outline">practice.</span></h2></div><div className="projects-note"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} /></div></div>
    <div className="projects-track" ref={track}>{profile.projects.map((project, index) => <article className={`project-card project-card-${index + 1}`} key={project.slug}>
      <Link href={`/projects/${project.slug}`} className="project-visual" aria-label={`Lihat detail ${project.title}`}>
        <Image src={project.image} alt={`Artwork untuk ${project.title}`} fill sizes="(max-width: 760px) 86vw, 58vw" priority={index === 0} />
        <span className="project-view">VIEW <MoveUpRight size={15} /></span><span className="project-number">{project.number}</span>
      </Link>
      <div className="project-info"><div><span className="project-eyebrow">{project.eyebrow}</span><h3>{project.title}</h3></div><p>{project.description}</p><div className="project-meta"><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link href={`/projects/${project.slug}`} className="project-detail-link">CASE STUDY <ArrowUpRight size={14} /></Link></div></div>
    </article>)}<div className="projects-end-card"><span className="mono-label">HAVE SOMETHING IN MIND?</span><a href="#contact">Let&apos;s make<br /><span>it happen.</span><ArrowUpRight size={32} /></a></div></div>
    <div className="projects-mobile-hint">SWIPE TO EXPLORE <span>← DRAG →</span></div>
  </section>;
}
