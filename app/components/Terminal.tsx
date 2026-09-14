"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

interface HistoryEntry {
  command: string;
  output: string[];
}

const PROMPT_USER = "visitor";
const PROMPT_HOST = "portfolio";
const PROMPT_DIR = "~";

const NEOFETCH_ART = [
  "       _____       ",
  "      / ____|      ",
  "     | |  __  ___  ",
  "     | | |_ |/ _ \\ ",
  "     | |__| |  __/ ",
  "      \\_____|\\___| ",
];

const NEOFETCH_INFO = [
  "visitor@portfolio",
  "-----------------",
  "OS: Ubuntu Linux x86_64",
  "Host: next-portfolio",
  "Kernel: 6.x-generic",
  "Shell: zsh 5.9",
  "DE: Hyprland (tiling, btw)",
  "Editor: Neovim + tmux",
  "Stack: React / Next.js / TypeScript",
  "AI: Claude Code, Codex, OpenCode",
  "Uptime: too long (touch grass never)",
];

function runCommand(raw: string): string[] {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  switch ((cmd || "").toLowerCase()) {
    case "":
      return [];
    case "help":
      return [
        "Available commands:",
        "  whoami      - who is this guy?",
        "  neofetch    - system specs (the important stuff)",
        "  skills      - tech stack",
        "  ai          - AI-native workflow",
        "  distro      - daily drivers",
        "  projects    - selected work",
        "  experience  - where he's been",
        "  contact     - how to reach him",
        "  date        - current date",
        "  snake       - play snake in the arcade",
        "  clear       - wipe the terminal",
        "  sudo ...    - go ahead, try it",
      ];
    case "whoami":
      return [
        `${profile.personal.name} — ${profile.personal.roles.join(" / ")}`,
        profile.personal.location,
      ];
    case "neofetch": {
      const lines: string[] = [];
      const rows = Math.max(NEOFETCH_ART.length, NEOFETCH_INFO.length);
      for (let i = 0; i < rows; i++) {
        const art = (NEOFETCH_ART[i] ?? "").padEnd(22, " ");
        const info = NEOFETCH_INFO[i] ?? "";
        lines.push(`${art}${info}`);
      }
      return lines;
    }
    case "skills":
      return [
        `frontend:  ${profile.skills.frontend.join(", ")}`,
        `backend:   ${profile.skills.backend.join(", ")}`,
        `ai tools:  ${profile.skills.aiTools.join(", ")}`,
        `devops:    ${profile.skills.tools.join(", ")}`,
      ];
    case "ai":
      return profile.aiWorkflow.map((t) => `${t.name} — ${t.detail}`);
    case "distro":
      return [
        "OS:     Fedora (main) / Ubuntu (servers)",
        "Editor: Neovim + tmux, shell-scripted everything",
        "/wm:     tiling WM enjoyer",
        "creed:  if it can't be done in the terminal, is it worth doing?",
      ];
    case "projects":
      return profile.projects.map(
        (p) => `${p.name} — ${p.description} [${p.tech.join(", ")}]`
      );
    case "experience":
      return profile.experience.map((j) => `${j.role} @ ${j.company} (${j.duration})`);
    case "contact":
      return [
        `email:    ${profile.personal.email}`,
        `github:   ${profile.profiles.github.url}`,
        `linkedin: ${profile.profiles.linkedin.url}`,
        "tip: click any link, or use the form below. he bites (politely).",
      ];
    case "date":
      return [new Date().toString()];
    case "snake":
      return ["__SCROLL__:arcade"];
    case "clear":
      return ["__CLEAR__"];
    case "sudo":
      return [
        `[sudo] password for ${PROMPT_USER}:`,
        "Sorry, try again. (there is no try — permission denied, nice attempt though)",
      ];
    case "vim":
    case "nvim":
    case "emacs":
      return [`${cmd}: you already are in the best editor. (it's ${cmd}, obviously)`];
    default:
      return [
        `command not found: ${cmd}`,
        `type 'help' to see what this shell understands. (try 'neofetch', it's worth it)`,
        `extra args ignored: ${args.join(" ") || "(none)"}`,
      ];
  }
}

export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "neofetch",
      output: runCommand("neofetch"),
    },
  ]);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const pastCommands = history.map((h) => h.command).filter(Boolean);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history]);

  const submit = (raw: string) => {
    const output = runCommand(raw);
    if (output.length === 1 && output[0] === "__CLEAR__") {
      setHistory([]);
    } else if (output.length === 1 && output[0] === "__SCROLL__:arcade") {
      setHistory((h) => [
        ...h,
        { command: raw, output: ["launching ./snake — scrolling you to the arcade…"] },
      ]);
      document
        .getElementById("arcade")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#arcade");
    } else {
      setHistory((h) => [...h, { command: raw, output }]);
    }
    setInput("");
    setHistoryIndex(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (pastCommands.length === 0) return;
      const next = historyIndex < pastCommands.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(next);
      setInput(pastCommands[pastCommands.length - 1 - next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        setInput(pastCommands[pastCommands.length - 1 - next] ?? "");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <div
      className="terminal"
      onClick={() => inputRef.current?.focus()}
      role="region"
      aria-label="Interactive terminal — type help to start"
    >
      <div className="terminal-titlebar">
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="browser-dot" />
        <span className="terminal-title">
          {PROMPT_USER}@{PROMPT_HOST}: {PROMPT_DIR} — zsh
        </span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {history.map((entry, i) => (
          <div key={i} className="terminal-block">
            <div className="terminal-line">
              <span className="terminal-prompt">
                {PROMPT_USER}@{PROMPT_HOST}
              </span>
              <span className="terminal-sep">:</span>
              <span className="terminal-dir">{PROMPT_DIR}</span>
              <span className="terminal-sep">$</span>
              <span className="terminal-cmd">{entry.command}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} className="terminal-out">
                {line}
              </div>
            ))}
          </div>
        ))}
        <div className="terminal-line">
          <span className="terminal-prompt">
            {PROMPT_USER}@{PROMPT_HOST}
          </span>
          <span className="terminal-sep">:</span>
          <span className="terminal-dir">{PROMPT_DIR}</span>
          <span className="terminal-sep">$</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
