"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseDirection: number;
  hue: number;
}

interface Trail {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const trailsRef = useRef<Trail[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 50 : 100;
    const CONNECTION_DISTANCE = isMobile ? 120 : 160;
    const MOUSE_RADIUS = 220;
    const MOUSE_FORCE = 0.018;

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * 0.45;
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 0.6 + Math.random() * 1.8,
          opacity: 0.2 + Math.random() * 0.5,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          hue: 160 + Math.random() * 30,
        });
      }
      particlesRef.current = particles;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const onMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const mouseActive = mouse.x > 0 && mouse.y > 0;
      if (mouseActive) {
        trailsRef.current.push({
          x: mouse.x,
          y: mouse.y,
          alpha: 0.08,
          radius: 20,
        });
      }

      const trails = trailsRef.current;
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.alpha *= 0.88;
        t.radius *= 0.93;
        if (t.alpha < 0.001) {
          trails.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.radius);
        grad.addColorStop(0, `rgba(100, 255, 218, ${t.alpha * 0.25})`);
        grad.addColorStop(0.5, `rgba(100, 255, 218, ${t.alpha * 0.08})`);
        grad.addColorStop(1, "rgba(100, 255, 218, 0)");
        ctx.fillStyle = grad;
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (mouseActive && trails.length > 0) {
        for (let i = 1; i < trails.length; i++) {
          ctx.beginPath();
          ctx.moveTo(trails[i - 1].x, trails[i - 1].y);
          ctx.lineTo(trails[i].x, trails[i].y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${Math.min(trails[i].alpha, trails[i - 1].alpha) * 0.3})`;
          ctx.lineWidth = 1;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.opacity += p.pulseDirection * 0.0025;
        if (p.opacity >= 0.65) p.pulseDirection = -1;
        if (p.opacity <= 0.2) p.pulseDirection = 1;

        const dxToMouse = mouse.x - p.x;
        const dyToMouse = mouse.y - p.y;
        const distToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);

        if (distToMouse < MOUSE_RADIUS && distToMouse > 0 && mouseActive) {
          const force = (1 - distToMouse / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dxToMouse / distToMouse) * force;
          p.vy += (dyToMouse / distToMouse) * force;
        }

        p.vx *= 0.997;
        p.vy *= 0.997;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const isNearMouse = mouseActive &&
          Math.hypot(mouse.x - p.x, mouse.y - p.y) < MOUSE_RADIUS;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isNearMouse) {
          ctx.shadowColor = "rgba(100, 255, 218, 0.7)";
          ctx.shadowBlur = 12;
          ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity * 1.5})`;
        } else {
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity})`;
        }

        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      const drawnPairs = new Set<string>();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
            if (drawnPairs.has(pairKey)) continue;
            drawnPairs.add(pairKey);

            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.22;
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const nearMouse = mouseActive &&
              Math.hypot(mouse.x - midX, mouse.y - midY) < MOUSE_RADIUS * 1.3;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (nearMouse) {
              ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 2.5})`;
              ctx.lineWidth = 1.2;
              ctx.shadowColor = "rgba(100, 255, 218, 0.4)";
              ctx.shadowBlur = 8;
            } else {
              ctx.strokeStyle = `rgba(136, 146, 176, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden />;
}