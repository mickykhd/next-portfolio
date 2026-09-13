"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&";

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char: string;
}

export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  trigger = "hover",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "span" | "div";
  trigger?: "mount" | "hover";
  delay?: number;
}) {
  const [output, setOutput] = useState(text);
  const frameRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const queue: QueueItem[] = text.split("").map((ch) => {
      const start = Math.floor(Math.random() * 14);
      const end = start + Math.floor(Math.random() * 14) + 6;
      return { from: ch, to: ch, start, end, char: "" };
    });

    let frame = 0;
    const update = () => {
      let done = 0;
      let out = "";
      for (const q of queue) {
        if (frame >= q.end) {
          done++;
          out += q.to;
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "";
          }
          out += q.char;
        } else {
          out += q.from;
        }
      }
      setOutput(out);
      frame++;
      if (done < queue.length) {
        frameRef.current = requestAnimationFrame(update);
      }
    };
    frameRef.current = requestAnimationFrame(update);
  }, [text]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (trigger === "mount") {
      timerRef.current = window.setTimeout(scramble, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, delay, scramble]);

  const hoverProps =
    trigger === "hover"
      ? { onMouseEnter: scramble, onFocus: scramble }
      : {};

  return (
    <Tag className={className} {...hoverProps}>
      {output}
    </Tag>
  );
}