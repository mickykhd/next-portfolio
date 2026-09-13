"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/data/profile";

interface PaletteItem {
  label: string;
  hint: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  const doOpen = () => {
    openRef.current = true;
    setQuery("");
    setSelected(0);
    setOpen(true);
  };

  const doClose = () => {
    openRef.current = false;
    setOpen(false);
  };

  const items: PaletteItem[] = useMemo(
    () => [
      { label: "Go to About", hint: "section", action: () => scrollTo("about") },
      { label: "Go to Skills", hint: "section", action: () => scrollTo("skills") },
      { label: "Go to Playground (terminal)", hint: "section", action: () => scrollTo("playground") },
      { label: "Go to AI Stack", hint: "section", action: () => scrollTo("ai-workflow") },
      { label: "Go to Projects", hint: "section", action: () => scrollTo("projects") },
      { label: "Go to Experience", hint: "section", action: () => scrollTo("experience") },
      { label: "Go to Education", hint: "section", action: () => scrollTo("education") },
      { label: "Go to Contact", hint: "section", action: () => scrollTo("contact") },
      ...profile.projects.map((p) => ({
        label: `Open ${p.name}`,
        hint: "project",
        action: () => window.open(p.liveUrl, "_blank", "noopener"),
      })),
      {
        label: "Open GitHub",
        hint: "link",
        action: () => window.open(profile.profiles.github.url, "_blank", "noopener"),
      },
      {
        label: "Open LinkedIn",
        hint: "link",
        action: () => window.open(profile.profiles.linkedin.url, "_blank", "noopener"),
      },
      {
        label: "Copy email address",
        hint: "action",
        action: () => void navigator.clipboard?.writeText(profile.personal.email),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) {
          doClose();
        } else {
          doOpen();
        }
      } else if (e.key === "Escape") {
        doClose();
      }
    };
    const onExternalOpen = () => doOpen();
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onExternalOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onExternalOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open ]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const run = (item: PaletteItem) => {
    setOpen(false);
    item.action();
  };

  if (!open) return null;

  return (
    <div className="palette-overlay" onClick={() => setOpen(false)} role="presentation">
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="palette-input-row">
          <span className="palette-prefix">❯</span>
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Type a command — try “projects”…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected((s) => Math.min(s + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter") {
                const item = filtered[selected];
                if (item) run(item);
              }
            }}
            aria-label="Command palette input"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <kbd className="palette-esc">esc</kbd>
        </div>
        <div className="palette-list" ref={listRef} role="listbox">
          {filtered.length === 0 && (
            <div className="palette-empty">No match. Try “help” in the terminal instead.</div>
          )}
          {filtered.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === selected}
              className={`palette-item ${i === selected ? "active" : ""}`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => run(item)}
            >
              <span>{item.label}</span>
              <span className="palette-hint">{item.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}
