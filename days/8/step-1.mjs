import * as FS from 'node:fs/promises';

const txt = await FS.readFile('input.txt', 'latin1');
const grid = txt.split('\n').map((line) => line.split(''));
const antinodes = grid.map((line) => line.map((_) => '.'));

const antennas = grid.flatMap((row, y) =>
  row.flatMap((c, x) => (c === '.' ? [] : [[c, x, y]]))
);

const frequencies = new Set(antennas.map(([hz]) => hz));
for (const hz of frequencies) {
  const as = antennas.filter(([f]) => f === hz);
  for (const [[_, ax, ay], [__, bx, by]] of allPairs(as)) {
    const [dx, dy] = [bx - ax, by - ay];
    {
      const [x, y] = [ax - dx, ay - dy];
      if (0 <= y && y < antinodes.length && 0 <= x && x < antinodes[y].length) {
        antinodes[y][x] = '#';
      }
    }
    {
      const [x, y] = [bx + dx, by + dy];
      if (0 <= y && y < antinodes.length && 0 <= x && x < antinodes[y].length) {
        antinodes[y][x] = '#';
      }
    }
  }
}

function allPairs(arr) {
  if (arr.length < 2) {
    return [];
  }

  const [first, ...rest] = arr;
  return [...rest.map((rhs) => [first, rhs]), ...allPairs(rest)];
}

function view(grid, antinodes) {
  let output = [];
  for (let y = 0; y < grid.length; y++) {
    let row = [];
    output.push(row);
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== '.') {
        row.push(grid[y][x]);
      } else {
        row.push(antinodes[y][x]);
      }
    }
  }

  return output.map((line) => line.join('')).join('\n');
}

// console.log(view(grid, antinodes));
console.log(antinodes.flat().filter((_) => _ === '#').length);
