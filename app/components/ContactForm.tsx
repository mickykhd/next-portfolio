"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ashrumochan7@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          _subject: "Portfolio Contact Form Submission",
        }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form-success">
        <p>Thanks for reaching out! I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required placeholder="Your name" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="your@email.com" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required rows={5} placeholder="What would you like to discuss?" />
      </div>
      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p className="form-error">Something went wrong. Please email me directly.</p>
      )}
    </form>
  );
}