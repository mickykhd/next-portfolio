"use client";

import { useEffect, useRef } from "react";

const TUX_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2c-2 0-3.2 1.8-3.2 4.2 0 1.6-.4 2.6-1.3 3.9C6.3 11.8 5 13 5 15c0 2.8 2.5 5 6 5s7-2.2 7-5c0-2-1.3-3.2-2.5-4.9-.9-1.3-1.3-2.3-1.3-3.9C14.2 3.8 14 2 12 2Z" />
    <circle cx="10.3" cy="6" r="0.4" fill="currentColor" />
    <circle cx="13.7" cy="6" r="0.4" fill="currentColor" />
    <path d="M12 8.2v1.6" />
    <path d="M8 18.5c-1.2 1-1.5 2.5-.8 3 .7.5 1.8-.2 2.3-1.2" />
    <path d="M16 18.5c1.2 1 1.5 2.5.8 3-.7.5-1.8-.2-2.3-1.2" />
  </svg>
);

const UBUNTU_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="4.2" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="5.2" cy="15.9" r="2.1" fill="currentColor" stroke="none" />
    <circle cx="18.8" cy="15.9" r="2.1" fill="currentColor" stroke="none" />
    <path d="M12 6.3v11.4" opacity="0" />
    <path d="M10.9 5.6 6.3 13.6" />
    <path d="M13.1 5.6l4.6 8" />
  </svg>
);

export function Footer({ name }: { name: string }) {
  const year = new Date().getFullYear();
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const el = uptimeRef.current;
      if (!el) return;
      const s = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      el.textContent = `session ${hh}:${mm}:${ss}`;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-status" aria-label="System status">
        <span className="status-dot" />
        <span className="status-os">
          {TUX_SVG}
          fedora
        </span>
        <span className="status-sep">•</span>
        <span className="status-os">
          {UBUNTU_SVG}
          ubuntu
        </span>
        <span className="status-sep">•</span>
        <span>neovim</span>
        <span className="status-sep">•</span>
        <span>tmux</span>
        <span className="status-sep">•</span>
        <span>next.js</span>
        <span className="status-sep">•</span>
        <span ref={uptimeRef}>session --:--:--</span>
      </div>
      <div className="footer-credit">
        &copy; {year} Designed &amp; Built by {name}{" "}
        <span className="footer-heart" aria-label="with love">♥</span>
      </div>
    </footer>
  );
}