"use client";

import { useEffect, useState } from "react";

interface NavLink {
  label: string;
  href: string;
  index: string;
}

interface NavbarProps {
  links: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href^=\"#\"]");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      e.preventDefault();
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", href);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            history.replaceState(null, "", `#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`nav ${visible ? "nav-visible" : "nav-hidden"} ${scrolled ? "nav-scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          <a href="#" className="nav-logo">AB</a>
          <ol className="nav-links nav-desktop">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} data-index={link.index}>{link.label}</a>
              </li>
            ))}
          </ol>
          <a href="#contact" className="nav-resume nav-desktop">
            Get In Touch
          </a>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          </button>
        </div>
      </nav>

      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <ol className="mobile-nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} data-index={link.index} onClick={closeMenu}>{link.label}</a>
            </li>
          ))}
        </ol>
        <a href="#contact" className="btn-primary" onClick={closeMenu}>
          Get In Touch
        </a>
      </div>
    </>
  );
}