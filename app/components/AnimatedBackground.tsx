"use client";

import { useEffect, useRef } from "react";
import Granim from "granim";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const granimInstance = new Granim({
      element: canvasRef.current,
      name: "background-gradient",
      direction: "radial",
      isPausedWhenNotInView: true,
      opacity: [1, 1],
      states: {
        "default-state": {
          gradients: [
            ["#0b2f4f", "#5ddcff"],
            ["#111827", "#9333ea"],
            ["#0f1b2d", "#10b981"],
          ],
          transitionSpeed: 4500,
        },
      },
    });

    return () => {
      granimInstance.destroy();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="stellar-canvas" aria-hidden />;
}
