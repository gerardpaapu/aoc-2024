import * as FS from 'node:fs/promises';

const txt = await FS.readFile('input.txt', 'latin1');

const UNVISITED = 0;
const UP = 1 << 0;
const RIGHT = 1 << 1;
const DOWN = 1 << 2;
const LEFT = 1 << 3;

const GUARD_UP = '^';
const GUARD_DOWN = 'v';
const GUARD_LEFT = '<';
const GUARD_RIGHT = '>';
const GUARDS = [GUARD_UP, GUARD_DOWN, GUARD_LEFT, GUARD_RIGHT];

let map = [];
let guard;
{
  const raw = txt.split('\n').map((_) => _.split(''));
  for (let y = 0; y < raw.length; y++) {
    let out = [];
    for (let x = 0; x < raw[y].length; x++) {
      const cell = raw[y][x];
      out.push(cell === '#' ? 1 : 0);
      if (cell === GUARD_DOWN) {
        guard = [x, y, DOWN];
      }
      if (cell === GUARD_LEFT) {
        guard = [x, y, LEFT];
      }
      if (cell === GUARD_UP) {
        guard = [x, y, UP];
      }
      if (cell === GUARD_DOWN) {
        guard = [x, y, RIGHT];
      }
    }
    map.push(out);
  }
}

function printMap(map, path) {
  console.log(
    map
      .map((line, y) =>
        line
          .map((cell, x) => {
            const [gx, gy] = guard;
            if (x == gx && y === gy) {
              return '^';
            }

            let p = path[y][x];
            if (p & (LEFT | RIGHT) && p & (UP | DOWN)) {
              return '+';
            }

            if (p & (LEFT | RIGHT)) {
              return '-';
            }

            if (p & (UP | DOWN)) {
              return '|';
            }

            if (cell == 2) {
              return 'O';
            }
            if (cell == 1) {
              return '#';
            }
            return '.';
          })
          .join('')
      )
      .join('\n')
  );
}

function printPath(path) {
  console.log(
    path
      .map((line) => line.map((cell) => (cell ? '#' : '.')).join(''))
      .join('\n')
  );
}

// printMap(map);
// console.log(guard);

function walk(map, [gx, gy, dir]) {
  let path = map.map((row) => row.map((_) => UNVISITED));
  for (;;) {
    // mark that we have been at this point of the path facing this
    // direction
    if (path[gy][gx] & dir) {
      return [path, 'LOOP'];
    }

    path[gy][gx] |= dir;

    switch (dir) {
      case UP:
        if (gy <= 0) {
          return [path, 'EXIT', 'UP'];
        }

        if (map[gy - 1][gx]) {
          // rotate
          dir = RIGHT;
        } else {
          gy--;
        }
        break;

      case DOWN:
        if (gy >= map.length - 1) {
          return [path, 'EXIT', 'DOWN'];
        }

        if (map[gy + 1][gx]) {
          // rotate
          dir = LEFT;
        } else {
          gy++;
        }
        break;

      case LEFT:
        if (gx <= 0) {
          return [path, 'EXIT', 'LEFT'];
        }

        if (map[gy][gx - 1]) {
          // rotate
          dir = UP;
        } else {
          gx--;
        }

        break;
      case RIGHT:
        if (gx >= map[gy].length - 1) {
          return [path, 'EXIT'];
        }

        if (map[gy][gx + 1]) {
          // rotate
          dir = DOWN;
        } else {
          gx++;
        }
        break;
    }
  }
}

function insertObstacle(map, x, y) {
  return map.map((row, i) =>
    row.map((cell, j) => {
      if (j === x && i === y) {
        return 2;
      }
      return cell;
    })
  );
}

let loops = 0;
let exits = 0;
const [basePath, status, dir] = walk(map, guard);
// printMap(map, basePath);
for (let y = 0; y < basePath.length; y++) {
  for (let x = 0; x < basePath[y].length; x++) {
    let [gx, gy] = guard;
    if (x === gx && y === gy) {
      continue;
    }

    // if the obstacle is not in the guards path
    // it can't change their path right?
    if (basePath[y][x] === 0) {
      continue;
    }

    const newMap = insertObstacle(map, x, y);
    const [_path, status, dir] = walk(newMap, guard);

    if (status === 'LOOP') {
      loops++;
    } else {
      exits++;
    }
  }
}

// console.log({ loops, exits });

console.log(loops);
