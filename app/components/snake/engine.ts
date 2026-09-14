// Pure Snake engine — no DOM, no imports, no Math.random (rng is injected).
// Compile with tsc and unit-test with plain node.

export type Vec = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type StepEvent = "moved" | "ate" | "died";

export interface GameState {
  cols: number;
  rows: number;
  /** Head first. */
  snake: Vec[];
  /** Direction of last applied move. */
  dir: Direction;
  /**
   * Buffered turns, consumed one per tick (max QUEUE_MAX).
   * A queue (not a single slot) is what makes quick turns near walls
   * work: every keypress is remembered in order instead of the last
   * one silently overwriting the previous.
   */
  queue: Direction[];
  food: Vec;
  score: number;
  foodsEaten: number;
  alive: boolean;
  steps: number;
}

export type Rng = () => number;

export const COLS = 20;
export const ROWS = 20;
export const BASE_TICK_MS = 185;
export const MIN_TICK_MS = 110;
export const TICK_STEP_MS = 1;
export const POINTS_PER_FOOD = 10;
/** Max buffered turns. 3 covers fast double/triple turns within one tick. */
export const QUEUE_MAX = 3;

export const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export const DELTA: Record<Direction, Vec> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const sameCell = (a: Vec, b: Vec): boolean => a.x === b.x && a.y === b.y;

/** Pick a random cell not occupied by the snake. Falls back to (0,0) on a full board. */
export function randomEmptyCell(
  cols: number,
  rows: number,
  snake: Vec[],
  rng: Rng
): Vec {
  const occupied = new Set(snake.map((c) => c.y * cols + c.x));
  const free: number[] = [];
  for (let i = 0; i < cols * rows; i++) {
    if (!occupied.has(i)) free.push(i);
  }
  if (free.length === 0) return { x: 0, y: 0 };
  const pick = free[Math.floor(rng() * free.length)] as number;
  return { x: pick % cols, y: Math.floor(pick / cols) };
}

export function createGame(
  cols: number = COLS,
  rows: number = ROWS,
  rng: Rng = Math.random
): GameState {
  const cy = Math.floor(rows / 2);
  const cx = Math.floor(cols / 2);
  const snake: Vec[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  return {
    cols,
    rows,
    snake,
    dir: "right",
    queue: [],
    food: randomEmptyCell(cols, rows, snake, rng),
    score: 0,
    foodsEaten: 0,
    alive: true,
    steps: 0,
  };
}

/**
 * Queue a direction change. Each press is validated against the most
 * recent queued turn (or current direction when empty): duplicates and
 * 180° reversals are dropped, so the snake can never instantly turn
 * into its own neck. Oldest presses run first, one per tick.
 */
export function setDirection(state: GameState, dir: Direction): void {
  if (!state.alive) return;
  const last: Direction =
    state.queue.length > 0
      ? (state.queue[state.queue.length - 1] as Direction)
      : state.dir;
  if (dir === last) return;
  if (dir === OPPOSITE[last]) return;
  if (state.queue.length >= QUEUE_MAX) return;
  state.queue.push(dir);
}

/** Advance one tick. Mutates state, returns what happened. */
export function step(state: GameState, rng: Rng = Math.random): StepEvent {
  if (!state.alive) return "died";

  const turn = state.queue.shift();
  if (turn !== undefined && turn !== OPPOSITE[state.dir]) {
    state.dir = turn;
  }

  const d = DELTA[state.dir];
  const head = state.snake[0] as Vec;
  const next: Vec = { x: head.x + d.x, y: head.y + d.y };
  state.steps++;

  // Wall collision.
  if (next.x < 0 || next.y < 0 || next.x >= state.cols || next.y >= state.rows) {
    state.alive = false;
    return "died";
  }

  const eating = sameCell(next, state.food);

  // Self collision. When not eating, the tail vacates this tick,
  // so moving into the current tail cell is legal.
  const body = eating ? state.snake : state.snake.slice(0, -1);
  if (body.some((c) => sameCell(c, next))) {
    state.alive = false;
    return "died";
  }

  state.snake.unshift(next);
  if (!eating) {
    state.snake.pop();
    return "moved";
  }

  state.score += POINTS_PER_FOOD;
  state.foodsEaten++;
  state.food = randomEmptyCell(state.cols, state.rows, state.snake, rng);
  return "ate";
}

/** Milliseconds per tick — ramps down as you eat, floored at MIN_TICK_MS. */
export function tickMs(foodsEaten: number): number {
  return Math.max(MIN_TICK_MS, BASE_TICK_MS - foodsEaten * TICK_STEP_MS);
}
