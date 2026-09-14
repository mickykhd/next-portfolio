"use client";

import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  age: number;
}

const CHARS = "01<>[]{}#$%&*+=/\\|;:!?ABCDEFxyz░▒▓█▚▞▞";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const isMobile = window.innerWidth < 768;
    const FONT_SIZE = isMobile ? 14 : 16;
    const COL_GAP = 6;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let cols = 0;

    const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    const makeDrop = (col: number, startY = -20): Drop => {
      const charCount = 8 + Math.floor(Math.random() * 22);
      return {
        x: col * (FONT_SIZE + COL_GAP) + Math.random() * 4,
        y: startY,
        speed: (2 + Math.random() * 4) * (isMobile ? 0.6 : 1),
        chars: Array.from({ length: charCount }, randChar),
        age: 0,
      };
    };

    const initDrops = () => {
      cols = Math.ceil(w / (FONT_SIZE + COL_GAP));
      const target = Math.max(14, Math.floor(cols * (isMobile ? 0.14 : 0.1)));
      dropsRef.current = Array.from({ length: target }, (_, i) =>
        makeDrop(i % cols, Math.random() * h)
      );
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      initDrops();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", "Fira Code", monospace`;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const near = (x: number, y: number) => {
        const dx = x - mx;
        const dy = y - my;
        return dx * dx + dy * dy < 36000;
      };

      const drops = dropsRef.current;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += d.speed;
        d.age++;

        // occasionally mutate a char for shimmer
        if (d.age % 14 === 0) {
          d.chars[Math.floor(Math.random() * d.chars.length)] = randChar();
        }

        const mouseNear = near(d.x, d.y);

        for (let j = 0; j < d.chars.length; j++) {
          const cy = d.y - j * (FONT_SIZE + 2);
          if (cy < -FONT_SIZE || cy > h + FONT_SIZE) continue;

          if (j === 0) {
            // head: bright with glow, extra bright near mouse
            ctx.shadowColor = "rgba(51, 255, 102, 0.9)";
            ctx.shadowBlur = mouseNear ? 16 : 8;
            ctx.fillStyle = mouseNear ? "#b6ffcf" : "#9dffb4";
          } else {
            const fade = 1 - j / d.chars.length;
            ctx.shadowBlur = 0;
            ctx.fillStyle = mouseNear
              ? `rgba(51, 255, 102, ${0.28 + fade * 0.35})`
              : `rgba(51, 255, 102, ${0.05 + fade * 0.16})`;
          }
          ctx.fillText(d.chars[j], d.x, cy);
        }
        ctx.shadowBlur = 0;

        // recycle drop when fully off screen
        if (d.y - d.chars.length * (FONT_SIZE + 2) > h) {
          dropsRef.current[i] = makeDrop(
            Math.floor(Math.random() * cols),
            -Math.random() * 120
          );
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);
    }
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden />;
}