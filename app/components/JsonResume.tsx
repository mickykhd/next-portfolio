"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

const resumeJson = JSON.stringify(
  {
    name: profile.personal.name,
    roles: profile.personal.roles,
    location: profile.personal.location,
    email: profile.personal.email,
    skills: profile.skills,
    aiWorkflow: profile.aiWorkflow.map((t) => t.name),
    experience: profile.experience.map((j) => ({
      role: j.role,
      company: j.company,
      duration: j.duration,
    })),
    projects: profile.projects.map((p) => ({ name: p.name, url: p.liveUrl, tech: p.tech })),
    github: profile.profiles.github.url,
    linkedin: profile.profiles.linkedin.url,
  },
  null,
  2
);

export function JsonResume() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open ]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(resumeJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="nerd-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        view as JSON
      </button>
      {open && (
        <div className="palette-overlay" onClick={() => setOpen(false)} role="presentation">
          <div
            className="json-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Resume as JSON"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="json-modal-header">
              <span className="json-modal-title">resume.json</span>
              <div className="json-modal-actions">
                <button onClick={copy} className="nerd-btn" aria-live="polite">
                  {copied ? "copied ✓" : "copy"}
                </button>
                <button onClick={() => setOpen(false)} className="nerd-btn" aria-label="Close">
                  ✕
                </button>
              </div>
            </div>
            <pre className="json-modal-body">
              <code>{resumeJson}</code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
