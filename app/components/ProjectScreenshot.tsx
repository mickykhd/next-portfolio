"use client";

import { useCallback, useRef, useState } from "react";

interface ProjectScreenshotProps {
  url: string;
  name: string;
}

const gradients = [
  "linear-gradient(135deg, #0f1b38, #112240)",
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #0f1b2d, #1a1a3e)",
  "linear-gradient(135deg, #112240, #0a192f)",
];

export function ProjectScreenshot({ url, name }: ProjectScreenshotProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const gradientIndex = name.length % gradients.length;

  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=600&h=340`;

  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    if (node) {
      imgRef.current = node;
      if (node.complete && node.naturalWidth > 0) {
        setImgLoaded(true);
      }
    }
  }, []);

  return (
    <div className="project-preview-area">
      <div
        className="project-mockup-bg"
        style={{ background: gradients[gradientIndex] }}
      />
      {!imgFailed && (
        <img
          ref={setImgRef}
          src={screenshotUrl}
          alt={`${name} preview`}
          className={`project-screenshot ${imgLoaded ? "loaded" : ""}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}