"use client";

import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
  index: string;
}

interface NavbarProps {
  links: NavLink[];
  email: string;
}

export function Navbar({ links, email }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 10) {
            setVisible(true);
            setScrolled(false);
          } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setVisible(false);
          } else if (currentScrollY < lastScrollY) {
            setVisible(true);
            setScrolled(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`nav ${visible ? "nav-visible" : "nav-hidden"} ${scrolled ? "nav-scrolled" : ""}`}
      aria-label="Main navigation"
    >
      <div className="nav-inner">
        <a href="#" className="nav-logo">AB</a>
        <ol className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} data-index={link.index}>{link.label}</a>
            </li>
          ))}
        </ol>
        <a href={`mailto:${email}`} className="nav-resume">
          Get In Touch
        </a>
      </div>
    </nav>
  );
}