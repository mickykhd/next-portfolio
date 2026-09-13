"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedHeroProps {
  name: string;
  tagline: string;
  highlightWord: string;
  description: string;
  ctaButtons: React.ReactNode;
  marqueeItems: string[];
}

export function AnimatedHero({
  name,
  tagline,
  highlightWord,
  description,
  ctaButtons,
  marqueeItems,
}: AnimatedHeroProps) {
  const [eyebrowVisible, setEyebrowVisible] = useState(false);
  const [nameChars, setNameChars] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const glitchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const EYEBROW_DELAY = 0;
    const NAME_START = 300;
    const CHAR_DURATION = 55;
    const TAGLINE_START = NAME_START + name.length * CHAR_DURATION + 150;
    const DESC_START = TAGLINE_START + 300;
    const CTA_START = DESC_START + 300;

    frameRef.current = requestAnimationFrame(function animate(now) {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;

      if (elapsed >= EYEBROW_DELAY) setEyebrowVisible(true);
      if (elapsed >= NAME_START) {
        const chars = Math.min(
          name.length,
          Math.floor((elapsed - NAME_START) / CHAR_DURATION) + 1
        );
        setNameChars(chars);
      }
      if (elapsed >= TAGLINE_START) setTaglineVisible(true);
      if (elapsed >= DESC_START) setDescVisible(true);
      if (elapsed >= CTA_START) setCtaVisible(true);

      if (elapsed < CTA_START + 600) {
        frameRef.current = requestAnimationFrame(animate);
      }
    });

    // random ambient glitch pulses
    const scheduleGlitch = () => {
      glitchTimerRef.current = window.setTimeout(() => {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 220);
        scheduleGlitch();
      }, 2500 + Math.random() * 4500);
    };
    scheduleGlitch();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    };
  }, [name.length]);

  const nameDisplay = name.slice(0, nameChars);
  const cursorVisible = nameChars < name.length;
  const taglineParts = tagline.split(highlightWord);
  const marquee = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <section className="hero" id="about">
        <div className="ascii-wall" aria-hidden="true">
          {`██████╗  █████╗ ██████╗ ██╗  ██╗    ██████╗ ██╗   ██╗███████╗███████╗██████╗
██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝    ██╔══██╗██║   ██║██╔════╝██╔════╝██╔══██╗
██████╔╝███████║██████╔╝█████╔╝     ██████╔╝██║   ██║███████╗█████╗  ██████╔╝
██╔══██╗██╔══██║██╔══██╗██╔═██╗     ██╔══██╗██║   ██║╚════██║██╔══╝  ██╔══██╗
██████╔╝██║  ██║██║  ██║██║  ██╗    ██████╔╝╚██████╔╝███████║███████╗██║  ██║
╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝`}
        </div>

        <p className={`hero-eyebrow ${eyebrowVisible ? "visible" : ""}`}>
          whoami
        </p>

        <h1
          className={`hero-name ${glitching ? "glitching" : ""}`}
          aria-label={name}
          data-text={name}
        >
          <span aria-hidden="true">
            {nameDisplay}
            {cursorVisible && <span className="type-cursor" />}
          </span>
          <noscript>{name}</noscript>
        </h1>

        <p className={`hero-tagline ${taglineVisible ? "visible" : ""}`}>
          {taglineParts[0]}
          {taglineParts.length > 1 && (
            <>
              <span className="highlight">{highlightWord}</span>
              {taglineParts[1]}
            </>
          )}
        </p>

        <p className={`hero-description ${descVisible ? "visible" : ""}`}>
          {description}
        </p>

        <div className={`hero-cta ${ctaVisible ? "visible" : ""}`}>
          {ctaButtons}
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {marquee.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}