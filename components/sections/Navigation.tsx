"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPalette } from "@/components/ui/CommandPalette";

const links = [{ href: "#about", label: "About" }, { href: "#projects", label: "Work" }, { href: "#experience", label: "Journey" }];

export function Navigation() {
  return <header className="site-header">
    <Link href="#home" className="wordmark" aria-label={`${profile.name}, kembali ke atas`}><span className="wordmark-mark">R<span>/</span>P</span><span className="wordmark-label">INDEPENDENT<br />DEVELOPER</span></Link>
    <nav className="desktop-nav" aria-label="Navigasi utama">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <div className="nav-actions"><CommandPalette /><ThemeToggle /><a className="nav-contact" href="#contact">LET’S TALK <ArrowUpRight size={13} /></a></div>
  </header>;
}
