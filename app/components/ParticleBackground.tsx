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
  const lastTouchRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 2);

    const PARTICLE_COUNT = isMobile ? 30 : 60;
    const CONNECTION_DISTANCE = isMobile ? 100 : 150;
    const MOUSE_RADIUS = isMobile ? 180 : 220;
    const MOUSE_FORCE = isMobile ? 0.025 : 0.018;
    const USE_TRAILS = !isMobile && !prefersReducedMotion;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.05 + Math.random() * 0.2;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 0.6 + Math.random() * 1.8,
          opacity: 0.2 + Math.random() *
0.5,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }
      particlesRef.current = particles;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastTouchRef.current < 32) return;
      lastTouchRef.current = now;
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

    const connDistSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    const mouseRadSq = MOUSE_RADIUS * MOUSE_RADIUS;

    const animate = () => {
      if (!ctx || !canvas) return;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, w, h);

      const mouseActive = mouse.x > 0 && mouse.y > 0;
      const mx = mouse.x;
      const my = mouse.y;

      if (USE_TRAILS && mouseActive) {
        const trails = trailsRef.current;
        trails.push({ x: mx, y: my, alpha: 0.08, radius: 20 });
        for (let i = trails.length - 1; i >= 0; i--) {
          const t = trails[i];
          t.alpha *= 0.88;
          t.radius *= 0.93;
          if (t.alpha < 0.001) { trails.splice(i, 1); continue; }
          ctx.globalAlpha = t.alpha * 0.25;
          ctx.fillStyle = "rgba(100, 255, 218, 1)";
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const particles = particlesRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.opacity += p.pulseDirection * (isMobile ? 0.004 : 0.0025);
        if (p.opacity >= 0.65) p.pulseDirection = -1;
        if (p.opacity <= 0.2) p.pulseDirection = 1;

        if (mouseActive) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx += (Math.random() - 0.5) * 0.005;
        p.vy += (Math.random() - 0.5) * 0.005;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 0.35;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Draw connections (use squared distance first then sqrt only for valid pairs)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < connDistSq) {
            const dist = Math.sqrt(distanceSq);
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.22;
            const midX = (particles[i].x + particles[j].x) * 0.5;
            const midY = (particles[i].y + particles[j].y) * 0.5;
            const nearMouse = mouseActive && (mx - midX) * (mx - midX) + (my - midY) * (my - midY) < mouseRadSq * 1.69;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            if (nearMouse) {
              ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 2.5})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(136, 146, 176, ${opacity})`;
              ctx.lineWidth = 0.5;
            }
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles (batch by glow vs non-glow)
      // Non-glow
      ctx.fillStyle = "hsla(160, 60%, 70%, 1)";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const isNearMouse = mouseActive && (mx - p.x) * (mx - p.x) + (my - p.y) * (my - p.y) < mouseRadSq;
        if (isNearMouse) continue;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glow near-mouse
      if (mouseActive && !isMobile) {
        ctx.fillStyle = "rgba(100, 255, 218, 1)";
        ctx.shadowColor = "rgba(100, 255, 218, 0.7)";
        ctx.shadowBlur = 12;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const isNearMouse = (mx - p.x) * (mx - p.x) + (my - p.y) * (my - p.y) < mouseRadSq;
          if (!isNearMouse) continue;
          ctx.globalAlpha = Math.min(1, p.opacity * 1.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
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
