"use client";

import { useEffect } from "react";
import { Loader } from "@/components/ui/Loader";
import { Effects } from "@/components/ui/Effects";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ProfileProvider } from "@/components/ProfileContext";
import type { Profile } from "@/data/profile";

export function Portfolio({ profile }: { profile: Profile }) {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.documentElement.classList.toggle("reduced-motion", query.matches);
    const update = () => document.documentElement.classList.toggle("reduced-motion", query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return <ProfileProvider value={profile}><LenisProvider><Loader /><Effects /><ScrollProgress /><div className="letterbox-bar letterbox-top" aria-hidden="true" /><div className="letterbox-bar letterbox-bottom" aria-hidden="true" /><Navigation /><main><Hero /><About /><Skills /><Projects /><Experience /><Contact /></main><Footer /></LenisProvider></ProfileProvider>;
}
