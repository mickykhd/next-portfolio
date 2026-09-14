"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  COLS,
  createGame,
  setDirection,
  step,
  tickMs,
  type Direction,
  type GameState,
} from "./snake/engine";

type Phase = "ready" | "playing" | "paused" | "over";

const CELL = 22; // logical px → 440px board
const BOARD_PX = COLS * CELL;
const HIGH_KEY = "arcade-snake-high";

const KEY_DIRS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameState>(createGame());
  const phaseRef = useRef<Phase>("ready");
  const bestRef = useRef(0);
  const accRef = useRef(0);
  const lastRef = useRef(0);
  const visibleRef = useRef(true);
  const staticRef = useRef(false); // prefers-reduced-motion → no pulse
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [speed, setSpeed] = useState(1);

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const start = useCallback(() => {
    gameRef.current = createGame();
    accRef.current = 0;
    lastRef.current = performance.now();
    setScore(0);
    setSpeed(1);
    setNewBest(false);
    setPhaseBoth("playing");
  }, [setPhaseBoth]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      setPhaseBoth("paused");
    } else if (phaseRef.current === "paused") {
      lastRef.current = performance.now();
      setPhaseBoth("playing");
    }
  }, [setPhaseBoth]);

  const pushDir = useCallback(
    (d: Direction) => {
      if (phaseRef.current === "ready" || phaseRef.current === "over") {
        start();
      }
      if (phaseRef.current === "playing") setDirection(gameRef.current, d);
    },
    [start]
  );

  // High score: localStorage read happens post-mount (rAF), so the
  // server and first client render both show 0 → SSR-safe.
  useEffect(() => {
    staticRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const raf = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(HIGH_KEY);
        const v = raw ? parseInt(raw, 10) : 0;
        if (Number.isFinite(v) && v > 0) {
          bestRef.current = v;
          setBest(v);
        }
      } catch {
        /* storage unavailable — play without persistence */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Pause when tab hidden or game scrolled out of view. visibleRef
  // doubles as the "game owns the arrow keys" flag so arrows never
  // hijack page scroll while the arcade is offscreen.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === "playing") {
        setPhaseBoth("paused");
      }
    };
    document.addEventListener("visibilitychange", onVis);
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting && phaseRef.current === "playing") {
          setPhaseBoth("paused");
        }
      },
      { threshold: 0.15 }
    );
    if (el) io.observe(el);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [setPhaseBoth]);

  // Keyboard controls. Ignores keystrokes inside form fields (terminal, palette).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      // Game owns keys only while onscreen — never hijack page scroll.
      if (!visibleRef.current) return;
      const phase = phaseRef.current;

      if (e.key === " " || e.key === "Enter") {
        if (phase === "ready" || phase === "over") {
          e.preventDefault();
          start();
        } else {
          e.preventDefault();
          togglePause();
        }
        return;
      }
      if (e.key === "Escape" && phase === "paused") {
        togglePause();
        return;
      }
      const dir = KEY_DIRS[e.key];
      if (dir) {
        e.preventDefault();
        if (phase === "ready" || phase === "over") start();
        if (phaseRef.current === "paused") togglePause();
        pushDir(dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, togglePause, pushDir]);

  // Main loop: fixed-timestep ticks, render every frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = BOARD_PX * dpr;
    canvas.height = BOARD_PX * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pre-render static backdrop (bg + grid) once.
    const bg = document.createElement("canvas");
    bg.width = BOARD_PX * dpr;
    bg.height = BOARD_PX * dpr;
    const bctx = bg.getContext("2d");
    if (bctx) {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.fillStyle = "#050807";
      bctx.fillRect(0, 0, BOARD_PX, BOARD_PX);
      bctx.strokeStyle = "rgba(51, 255, 102, 0.05)";
      bctx.lineWidth = 1;
      for (let i = 1; i < COLS; i++) {
        bctx.beginPath();
        bctx.moveTo(i * CELL + 0.5, 0);
        bctx.lineTo(i * CELL + 0.5, BOARD_PX);
        bctx.stroke();
        bctx.beginPath();
        bctx.moveTo(0, i * CELL + 0.5);
        bctx.lineTo(BOARD_PX, i * CELL + 0.5);
        bctx.stroke();
      }
    }

    let raf = 0;
    lastRef.current = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(100, now - lastRef.current);
      lastRef.current = now;

      if (phaseRef.current === "playing" && visibleRef.current) {
        const g = gameRef.current;
        accRef.current += dt;
        const interval = tickMs(g.foodsEaten);
        let guard = 0;
        while (accRef.current >= interval && guard++ < 8) {
          accRef.current -= interval;
          const ev = step(g);
          if (ev === "ate") {
            setScore(g.score);
            setSpeed(g.foodsEaten + 1);
          }
          if (ev === "died") {
            accRef.current = 0;
            if (g.score > bestRef.current) {
              bestRef.current = g.score;
              setBest(g.score);
              setNewBest(g.score > 0);
              try {
                window.localStorage.setItem(HIGH_KEY, String(g.score));
              } catch {
                /* ignore */
              }
            }
            setPhaseBoth("over");
            break;
          }
        }
      }

      // ---- render ----
      const g = gameRef.current;
      ctx.clearRect(0, 0, BOARD_PX, BOARD_PX);
      ctx.drawImage(bg, 0, 0, BOARD_PX, BOARD_PX);

      // food (pulsing unless reduced motion)
      const pulse = staticRef.current
        ? 1
        : 0.75 + 0.25 * Math.sin(now / 240);
      const fx = g.food.x * CELL;
      const fy = g.food.y * CELL;
      const pad = 4 + (staticRef.current ? 0 : (1 - pulse) * 2);
      ctx.save();
      ctx.shadowColor = "rgba(255, 182, 66, 0.9)";
      ctx.shadowBlur = 12 * pulse;
      ctx.fillStyle = "#ffb642";
      ctx.fillRect(fx + pad, fy + pad, CELL - pad * 2, CELL - pad * 2);
      ctx.restore();

      // snake: bright head, fading tail
      const n = g.snake.length;
      for (let i = n - 1; i >= 0; i--) {
        const seg = g.snake[i];
        const fade = 1 - (i / Math.max(n, 1)) * 0.65;
        if (i === 0) {
          ctx.save();
          ctx.shadowColor = "rgba(51, 255, 102, 0.9)";
          ctx.shadowBlur = 10;
          ctx.fillStyle = "#b6ffcf";
          ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
          ctx.restore();
          // eyes oriented by direction
          ctx.fillStyle = "#050807";
          const cx = seg.x * CELL + CELL / 2;
          const cy = seg.y * CELL + CELL / 2;
          const o = 5;
          const d = g.dir;
          const ex = d === "left" ? -3 : d === "right" ? 3 : 0;
          const ey = d === "up" ? -3 : d === "down" ? 3 : 0;
          const px = d === "up" || d === "down" ? o : 0;
          const py = d === "left" || d === "right" ? o : 0;
          ctx.beginPath();
          ctx.arc(cx - px + ex, cy - py + ey, 2.2, 0, Math.PI * 2);
          ctx.arc(cx + px + ex, cy + py + ey, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(51, 255, 102, ${0.25 + fade * 0.55})`;
          ctx.fillRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [setPhaseBoth]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    pushDir(
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up"
    );
  };

  return (
    <div className="arcade-wrap" ref={wrapRef}>
      <div className="arcade-screen">
        <div className="terminal-titlebar">
          <span className="browser-dot" />
          <span className="browser-dot" />
          <span className="browser-dot" />
          <span className="terminal-title">visitor@portfolio: ~/snake — zsh</span>
        </div>
        <div className="arcade-hud" aria-live="polite">
          <span>
            SCORE <strong>{score}</strong>
          </span>
          <span>
            BEST <strong>{best}</strong>
          </span>
          <span>
            SPEED <strong>x{speed}</strong>
          </span>
        </div>
        <div className="arcade-stage">
          <canvas
            ref={canvasRef}
            className="arcade-canvas"
            style={{ width: "100%", aspectRatio: "1" }}
            role="img"
            aria-label="Snake game. Use arrow keys or WASD to steer, space to pause."
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
          {phase !== "playing" && (
            <div className="arcade-overlay">
              {phase === "ready" && (
                <>
                  <p className="arcade-overlay-title">./snake</p>
                  <p className="arcade-overlay-sub">
                    arrows / WASD to steer · space to pause
                  </p>
                  <button className="btn-primary" onClick={start}>
                    Start game
                  </button>
                </>
              )}
              {phase === "paused" && (
                <>
                  <p className="arcade-overlay-title">paused</p>
                  <p className="arcade-overlay-sub">press space to resume</p>
                  <button className="btn-primary" onClick={togglePause}>
                    Resume
                  </button>
                </>
              )}
              {phase === "over" && (
                <>
                  <p className="arcade-overlay-title">game over</p>
                  <p className="arcade-overlay-sub">
                    score {score}
                    {newBest ? " — NEW BEST! 🏆" : best > 0 ? ` · best ${best}` : ""}
                  </p>
                  <button className="btn-primary" onClick={start}>
                    Play again
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="arcade-dpad" aria-label="Direction pad">
        <span />
        <button aria-label="Move up" onPointerDown={() => pushDir("up")}>▲</button>
        <span />
        <button aria-label="Move left" onPointerDown={() => pushDir("left")}>◀</button>
        <button aria-label="Move down" onPointerDown={() => pushDir("down")}>▼</button>
        <button aria-label="Move right" onPointerDown={() => pushDir("right")}>▶</button>
      </div>
      <p className="arcade-hint">
        high score lives in your browser — beat it, screenshot it, no witnesses otherwise
      </p>
    </div>
  );
}
