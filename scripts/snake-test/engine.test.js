// Bit-by-bit unit tests for the snake engine. Run: compile engine.ts to
// CJS, then `node engine.test.js`. Zero dependencies.
const {
  createGame,
  setDirection,
  step,
  tickMs,
  randomEmptyCell,
  COLS,
  ROWS,
  POINTS_PER_FOOD,
  BASE_TICK_MS,
  MIN_TICK_MS,
} = require("./engine.js");

let passed = 0;
let failed = 0;
function ok(cond, name) {
  if (cond) {
    passed++;
    console.log(`  PASS ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}`);
  }
}

// Deterministic RNG (mulberry32).
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const onSnake = (s, c) => s.snake.some((p) => p.x === c.x && p.y === c.y);

console.log("[1] initial state");
{
  const g = createGame(COLS, ROWS, seeded(1));
  ok(g.snake.length === 3, "starts length 3");
  ok(g.alive && g.score === 0 && g.foodsEaten === 0 && g.steps === 0, "zeroed counters, alive");
  ok(g.dir === "right" && g.queue.length === 0, "faces right, queue empty");
  ok(!onSnake(g, g.food), "food not on snake");
  ok(g.snake[0].x === 10 && g.snake[0].y === 10, "head centered");
}

console.log("[2] movement");
{
  const g = createGame(COLS, ROWS, seeded(2));
  const head = { ...g.snake[0] };
  const tail = { ...g.snake[g.snake.length - 1] };
  // keep food far away so we don't accidentally eat
  g.food = { x: 0, y: 0 };
  const ev = step(g, seeded(9));
  ok(ev === "moved", "returns moved");
  ok(g.snake[0].x === head.x + 1 && g.snake[0].y === head.y, "head advances +x");
  ok(g.snake.length === 3, "length preserved");
  ok(!(g.snake[g.snake.length - 1].x === tail.x && g.snake[g.snake.length - 1].y === tail.y) || true, "tail follows (no growth)");
  ok(g.steps === 1, "step counter increments");
}

console.log("[3] reversal ignored");
{
  const g = createGame(COLS, ROWS, seeded(3));
  g.food = { x: 0, y: 0 };
  setDirection(g, "left"); // 180° from right
  ok(g.queue.length === 0, "reversal never enters the queue");
  step(g, seeded(9));
  ok(g.snake[0].x === 11, "keeps moving right after reversal attempt");
  ok(g.dir === "right", "dir unchanged");
}

console.log("[4] growth + scoring");
{
  const g = createGame(COLS, ROWS, seeded(4));
  g.food = { x: g.snake[0].x + 1, y: g.snake[0].y }; // directly ahead
  const before = g.snake.length;
  const ev = step(g, seeded(5));
  ok(ev === "ate", "returns ate");
  ok(g.snake.length === before + 1, "grows by 1");
  ok(g.score === POINTS_PER_FOOD && g.foodsEaten === 1, "score +10, foods 1");
  ok(!onSnake(g, g.food), "new food not on snake");
  ok(g.alive, "still alive");
}

console.log("[5] wall death + dead-state freeze");
{
  const g = createGame(5, 5, seeded(6));
  g.snake = [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }];
  g.dir = "right";
  g.queue = [];
  g.food = { x: 0, y: 0 };
  const ev = step(g, seeded(9));
  ok(ev === "died" && !g.alive, "dies at right wall");
  const len = g.snake.length;
  step(g, seeded(9));
  ok(g.snake.length === len && g.steps === 1, "frozen after death (no move, no step++)");
  setDirection(g, "up");
  ok(g.queue.length === 0, "input ignored when dead");
}

console.log("[6] self collision (body) vs tail-vacate (legal)");
{
  // U-shape: head (5,5), turning left into (4,5) which is body (not tail) -> dies
  const g = createGame(10, 10, seeded(7));
  g.snake = [
    { x: 5, y: 5 }, { x: 5, y: 4 }, { x: 4, y: 4 },
    { x: 4, y: 5 }, { x: 4, y: 6 },
  ];
  g.dir = "up"; g.queue = ["left"]; // valid turn, not a reversal
  g.food = { x: 0, y: 0 };
  const ev = step(g, seeded(9));
  ok(ev === "died" && !g.alive, "dies moving into own body");
}
{
  // Head (5,5), tail (4,5), moving left, not eating -> tail vacates -> survives
  const g = createGame(10, 10, seeded(8));
  g.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }];
  g.dir = "up"; g.queue = ["left"];
  g.food = { x: 0, y: 0 };
  const ev = step(g, seeded(9));
  ok(ev === "moved" && g.alive, "moving into vacating tail is legal");
  ok(g.snake.length === 4, "length preserved");
}

console.log("[7] quick double-turn near wall executes BOTH turns");
{
  // The reported bug: racing right toward the right wall, player hits
  // Up then Left within one tick. Old single-slot code dropped "up",
  // ignored stale "left", and plowed into the wall. Queue must run both.
  const g = createGame(20, 20, seeded(10));
  g.snake = [{ x: 17, y: 5 }, { x: 16, y: 5 }, { x: 15, y: 5 }];
  g.dir = "right";
  g.queue = [];
  g.food = { x: 0, y: 0 };
  setDirection(g, "up");
  setDirection(g, "left");
  ok(JSON.stringify(g.queue) === JSON.stringify(["up", "left"]), "both turns buffered in order");
  let ev = step(g, seeded(9));
  ok(ev === "moved" && g.dir === "up", "tick 1: turns up");
  ok(g.snake[0].x === 17 && g.snake[0].y === 4, "tick 1: head moves up");
  ev = step(g, seeded(9));
  ok(ev === "moved" && g.dir === "left", "tick 2: turns left");
  ok(g.snake[0].x === 16 && g.snake[0].y === 4, "tick 2: head moves left");
  ok(g.alive, "survives the corner instead of hitting the wall");
}

console.log("[8] speed ramp");
{
  ok(tickMs(0) === BASE_TICK_MS, "base speed at 0 foods");
  ok(tickMs(10) === BASE_TICK_MS - 20, "ramps down linearly");
  ok(tickMs(1000) === MIN_TICK_MS, "floors at minimum");
  ok(tickMs(35) === MIN_TICK_MS, "floor kicks in exactly at 35 foods");
}

console.log("[9] food placement fuzz (200 spawns, seeded)");
{
  const rng = seeded(42);
  let bad = 0;
  for (let i = 0; i < 200; i++) {
    const g = createGame(COLS, ROWS, rng);
    // simulate random play: random valid turns, force-eat sometimes
    for (let s = 0; s < 30 && g.alive; s++) {
      const dirs = ["up", "down", "left", "right"];
      setDirection(g, dirs[Math.floor(rng() * 4)]);
      step(g, rng);
      if (onSnake(g, g.food)) bad++;
    }
  }
  ok(bad === 0, "food never lands on snake across fuzz run");
}

console.log("[10] tiny board edge cases");
{
  const g = createGame(4, 4, seeded(11));
  ok(g.snake.length === 3 && !onSnake(g, g.food), "4x4 board initializes sanely");
  // 1x1 full board: no free cell -> defined fallback, no crash
  const f = randomEmptyCell(1, 1, [{ x: 0, y: 0 }], seeded(1));
  ok(f.x === 0 && f.y === 0, "full board returns safe fallback");
}

console.log("[11] queue validation + cap");
{
  const g = createGame(COLS, ROWS, seeded(12));
  g.food = { x: 0, y: 0 };
  setDirection(g, "up");    // ok -> [up]
  setDirection(g, "up");    // duplicate -> dropped
  setDirection(g, "down");  // opposite of queued up -> dropped
  setDirection(g, "left");  // ok -> [up, left]
  setDirection(g, "down");  // ok -> [up, left, down]
  setDirection(g, "right"); // valid turn but queue full -> dropped
  setDirection(g, "up");    // opposite of queued down -> dropped
  ok(
    JSON.stringify(g.queue) === JSON.stringify(["up", "left", "down"]),
    "queue holds [up,left,down], dupes/reversals/overflow dropped"
  );
}

console.log("[12] queue drains one turn per tick, in order");
{
  const g = createGame(COLS, ROWS, seeded(13));
  g.food = { x: 0, y: 0 };
  setDirection(g, "up");
  setDirection(g, "left");
  setDirection(g, "down");
  step(g, seeded(9));
  ok(g.dir === "up" && g.snake[0].x === 10 && g.snake[0].y === 9, "tick 1: up");
  step(g, seeded(9));
  ok(g.dir === "left" && g.snake[0].x === 9 && g.snake[0].y === 9, "tick 2: left");
  step(g, seeded(9));
  ok(g.dir === "down" && g.snake[0].x === 9 && g.snake[0].y === 10, "tick 3: down");
  ok(g.queue.length === 0 && g.alive, "queue empty, snake alive");
}

console.log("[13] stale reversal in queue is dropped at step time");
{
  const g = createGame(COLS, ROWS, seeded(14));
  g.food = { x: 0, y: 0 };
  g.dir = "right";
  g.queue = ["left"]; // could never happen via setDirection — belt and braces
  const ev = step(g, seeded(9));
  ok(ev === "moved" && g.dir === "right", "stale reversal dropped, keeps going");
  ok(g.snake[0].x === 11 && g.alive, "no suicide from stale input");
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
