"use client";

import { useEffect, useState } from "react";

const BOOT_LINES: string[] = [
  "ashru-OS 6.9.12-fedora tty1",
  "",
  "[  0.000012] BIOS-provided physical RAM map verified",
  "[  0.104351] Loading kernel modules: neovim, tmux, zsh, git, docker .......... [OK]",
  "[  0.213774] Mounting /dev/portfolio at /home/visitor .......... [OK]",
  "[  0.322189] Spawning react runtime (next.js 16, turbopack) .......... [OK]",
  "[  0.418902] Attaching AI agents: claude-code, codex, opencode, muse .......... [OK]",
  "[  0.512455] MCP servers online: 3/3 .......... [OK]",
  "[  0.601378] Enabling CRT phosphor renderer at 60Hz .......... [OK]",
  "[  0.699201] WARNING: coffee levels at 12% — refill recommended",
  "",
  "Welcome to ashru-OS. Login: visitor (auto)",
  "",
  "Last login: from a tiling WM near Khordha, Odisha",
];

export function BootSequence() {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const shouldSkip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      Boolean(sessionStorage.getItem("booted"));

    const total = 90 + BOOT_LINES.length * 110 + 500;
    const timers: number[] = [];

    if (!shouldSkip) {
      BOOT_LINES.forEach((line, i) => {
        timers.push(
          window.setTimeout(() => {
            setLines((prev) => [...prev, line]);
          }, 90 + i * 110)
        );
      });
    }

    timers.push(
      window.setTimeout(
        () => {
          sessionStorage.setItem("booted", "1");
          setDone(true);
        },
        shouldSkip ? 0 : total
      )
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  if (done) return null;

  return (
    <div
      className={`boot-overlay ${lines.length ? "booting" : "idle"}`}
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <div key={i} className="boot-line">
          {line}
        </div>
      ))}
      <div className="boot-line">█</div>
    </div>
  );
}