import * as FS from "node:fs/promises";

const txt = await FS.readFile("./input.txt", "latin1");
const grid = txt.split("\n").map((_, y) =>
  _.trim()
    .split("")
    .map((n, x) => ({
      x,
      y,
      h: Number(n),
      exits: 0,
    }))
);

const NEIGHBOURHOOD = [
  [+0, -1],
  [-1, +0],
  [+1, +0],
  [+0, +1],
];

function* neighbours(ox, oy) {
  for (const [xx, yy] of NEIGHBOURHOOD) {
    const x = ox + xx;
    const y = oy + yy;
    if (0 <= y && y < grid.length && 0 <= x && x < grid[y].length) {
      yield grid[y][x];
    }
  }
}

const byHeight = [[], [], [], [], [], [], [], [], [], []];

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    const cell = grid[y][x];
    byHeight[cell.h].push(cell);
  }
}

let score = 0;
for (let h = 9; h >= 0; h--) {
  for (const node of byHeight[h]) {
    const { x, y } = node;
    if (node.h === 9) {
      node.exits = 1;
      continue;
    }

    for (const n of neighbours(x, y)) {
      if (n.h === node.h + 1) {
        node.exits += n.exits;
      }
    }

    if (node.h === 0) {
      score += node.exits;
    }
  }
}

console.log(score);
// console.log([...all()].length)
