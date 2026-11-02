"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useProfile } from "@/components/ProfileContext";
import { formatTime } from "@/lib/utils";

export function Footer() {
  const profile = useProfile();
  const initials = profile.name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2);
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => setTime(formatTime(profile.timezone));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, [profile.timezone]);

  return <footer className="site-footer"><a href="#home" className="footer-mark">{initials[0] ?? "D"}<span>/</span>{initials[1] ?? "V"}</a><span>DESIGNED & BUILT WITH INTENTION · © {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span className="footer-time">{profile.location.toUpperCase()}&nbsp;&nbsp; {time}</span><a href="/admin" className="footer-admin">ADMIN <ArrowUp size={12} /></a><a href="#home" className="back-top">BACK TO TOP <ArrowUp size={14} /></a></footer>;
}
