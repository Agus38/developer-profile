"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPalette } from "@/components/ui/CommandPalette";

const links = [{ href: "#about", label: "About" }, { href: "#projects", label: "Work" }, { href: "#experience", label: "Journey" }];

export function Navigation() {
  const profile = useProfile();
  const initials = profile.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2);

  return <header className="site-header">
    <Link href="#home" className="wordmark" aria-label={`${profile.name}, kembali ke atas`}><span className="wordmark-mark">{initials[0] ?? "D"}<span>/</span>{initials[1] ?? "V"}</span><span className="wordmark-label">INDEPENDENT<br />DEVELOPER</span></Link>
    <nav className="desktop-nav" aria-label="Navigasi utama">{links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
    <div className="nav-actions"><CommandPalette /><ThemeToggle /><a className="nav-contact" href="#contact">LET’S TALK <ArrowUpRight size={13} /></a></div>
  </header>;
}
