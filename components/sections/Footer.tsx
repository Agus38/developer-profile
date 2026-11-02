"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { profile } from "@/data/profile";
import { formatTime } from "@/lib/utils";

export function Footer() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const update = () => setTime(formatTime(profile.timezone));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return <footer className="site-footer"><a href="#home" className="footer-mark">R<span>/</span>P</a><span>DESIGNED & BUILT WITH INTENTION · © {new Date().getFullYear()} {profile.name.toUpperCase()}</span><span className="footer-time">{profile.location.toUpperCase()}&nbsp;&nbsp; {time}</span><a href="#home" className="back-top">BACK TO TOP <ArrowUp size={14} /></a></footer>;
}
