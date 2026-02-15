declare module "granim" {
  export type GranimGradient = [string, string];

  export interface GranimState {
    gradients: GranimGradient[];
    transitionSpeed?: number;
    loop?: boolean;
  }

  export interface GranimOptions {
    element: HTMLCanvasElement | string;
    name?: string;
    direction?: "diagonal" | "left-right" | "top-bottom" | "radial";
    isPausedWhenNotInView?: boolean;
    opacity?: [number, number];
    states: Record<string, GranimState>;
  }

  export default class Granim {
    constructor(options: GranimOptions);
    pause(): void;
    play(): void;
    destroy(): void;
  }
}
