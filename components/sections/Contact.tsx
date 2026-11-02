"use client";

import { FormEvent, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Github, Linkedin, Send } from "lucide-react";
import { profile } from "@/data/profile";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Project inquiry — ${data.get("name")}`);
    const body = encodeURIComponent(`Hi ${profile.name},\n\n${data.get("message")}\n\nFrom: ${data.get("name")} (${data.get("email")})`);
    window.location.href = `mailto:${profile.socials.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
    event.currentTarget.reset();
  };

  return <section className="contact-section" id="contact" aria-labelledby="contact-title">
    <div className="section-topline"><span className="section-index">05 / YOUR MOVE</span><span className="section-aside">GOOD THINGS START WITH A HELLO</span></div>
    <div className="contact-heading"><p className="eyebrow"><span className="status-dot" /> OPEN TO SELECT COLLABORATIONS</p><h2 id="contact-title">Let&apos;s build<br /><span>something.</span></h2><ArrowDownRight className="contact-arrow" size={50} strokeWidth={1} /></div>
    <div className="contact-layout"><div className="contact-left"><p>Have a good problem to solve? I&apos;d love to hear what you&apos;re working on.</p><a className="contact-email" href={`mailto:${profile.socials.email}`}>{profile.socials.email}<ArrowUpRight size={17} /></a><div className="social-links"><a href={profile.socials.github} target="_blank" rel="noreferrer"><Github size={16} /> GITHUB <ArrowUpRight size={12} /></a><a href={profile.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LINKEDIN <ArrowUpRight size={12} /></a><a href={profile.socials.whatsapp} target="_blank" rel="noreferrer"><span className="whatsapp-glyph">◉</span> WHATSAPP <ArrowUpRight size={12} /></a></div></div>
      <form className="contact-form" onSubmit={submit}>
        <label><span>01 — YOUR NAME</span><input name="name" type="text" autoComplete="name" placeholder="Ada Lovelace" required /></label>
        <label><span>02 — EMAIL ADDRESS</span><input name="email" type="email" autoComplete="email" placeholder="ada@example.com" required /></label>
        <label><span>03 — WHAT’S ON YOUR MIND?</span><textarea name="message" rows={3} placeholder="Tell me a little about your project..." required /></label>
        <button className="button button-primary send-button" type="submit">{status === "sent" ? <>OPENED IN EMAIL <Check size={15} /></> : <>SEND A MESSAGE <Send size={14} /></>}</button>
        <p className="form-note">Your email app will open with the message pre-filled. No data is stored.</p>
      </form></div>
  </section>;
}
