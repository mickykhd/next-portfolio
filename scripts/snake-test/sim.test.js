// Long-run stability: greedy-AI plays full games. Asserts invariants hold
// across thousands of ticks: no crashes, food always on free cells,
// score == foods*10, snake stays in bounds while alive.
const { createGame, setDirection, step } = require("./engine.js");

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

let failed = 0;
const check = (cond, name) => {
  if (!cond) {
    failed++;
    console.log(`  FAIL ${name}`);
  }
};

// Greedy: steer toward food, never reverse (engine guards anyway).
function autoPilot(g) {
  const h = g.snake[0];
  const dx = g.food.x - h.x;
  const dy = g.food.y - h.y;
  const horiz = dx !== 0 ? (dx > 0 ? "right" : "left") : null;
  const vert = dy !== 0 ? (dy > 0 ? "down" : "up") : null;
  // prefer the axis with bigger gap
  if (horiz && vert) {
    setDirection(g, Math.abs(dx) >= Math.abs(dy) ? horiz : vert);
  } else if (horiz) setDirection(g, horiz);
  else if (vert) setDirection(g, vert);
}

console.log("[sim] 20 full games, greedy autopilot");
let totalTicks = 0;
let totalEaten = 0;
let deaths = 0;
for (let game = 0; game < 20; game++) {
  const rng = seeded(1000 + game);
  const g = createGame(20, 20, rng);
  let ticks = 0;
  while (g.alive && ticks < 3000) {
    autoPilot(g);
    step(g, rng);
    ticks++;
    // invariants after every tick
    const cells = new Set(g.snake.map((c) => `${c.x},${c.y}`));
    check(cells.size === g.snake.length, `g${game} t${ticks}: no duplicate cells`);
    check(g.score === g.foodsEaten * 10, `g${game} t${ticks}: score consistent`);
    if (g.alive) {
      check(g.snake.every((c) => c.x >= 0 && c.y >= 0 && c.x < 20 && c.y < 20), `g${game} t${ticks}: in bounds`);
      check(!cells.has(`${g.food.x},${g.food.y}`), `g${game} t${ticks}: food free`);
    }
  }
  totalTicks += ticks;
  totalEaten += g.foodsEaten;
  if (!g.alive) deaths++;
  // dead-state freeze: 5 more steps change nothing
  const snap = JSON.stringify(g.snake);
  for (let k = 0; k < 5; k++) step(g, rng);
  check(JSON.stringify(g.snake) === snap, `g${game}: frozen after death`);
}
console.log(`  ${totalTicks} ticks, ${totalEaten} foods eaten, ${deaths}/20 games ended in death`);
console.log(failed === 0 ? "SIM OK — no invariant violations" : `${failed} violations`);
process.exit(failed ? 1 : 0);
