import * as FS from 'node:fs/promises';

const txt = await FS.readFile('input.txt', 'latin1');

const GUARD_UP = '^';
const GUARD_DOWN = 'v';
const GUARD_LEFT = '<';
const GUARD_RIGHT = '>';
const GUARDS = [GUARD_UP, GUARD_DOWN, GUARD_LEFT, GUARD_RIGHT];

const map = txt.split('\n').map((_) => _.split(''));

let seen = 0;
loop: for (;;) {
  // console.log(map.map((line) => line.join('')).join('\n'));
  // console.log('-----------');
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      if (!GUARDS.includes(cell)) {
        continue;
      }

      switch (cell) {
        case GUARD_UP:
          if (y > 0 && map[y - 1][x] === '#') {
            map[y][x] = GUARD_RIGHT;
            continue;
          }
          break;
        case GUARD_DOWN:
          if (y < map.length - 1 && map[y + 1][x] === '#') {
            map[y][x] = GUARD_LEFT;
            continue;
          }
          break;
        case GUARD_LEFT:
          if (x > 0 && map[y][x - 1] === '#') {
            map[y][x] = GUARD_UP;
            continue;
          }
          break;
        case GUARD_RIGHT:
          if (x < map[y].length - 1 && map[y][x + 1] === '#') {
            map[y][x] = GUARD_DOWN;
            continue;
          }
          break;
      }
      seen++;
      map[y][x] = 'X';

      if (cell === GUARD_UP) {
        if (y <= 0) {
          break loop;
        }
        if (map[y - 1][x] === 'X') {
          seen--;
        }
        map[y - 1][x] = GUARD_UP;
        continue loop;
      }

      if (cell === GUARD_DOWN) {
        if (y >= map.length - 1) {
          break loop;
        }
        if (map[y + 1][x] === 'X') {
          seen--;
        }
        map[y + 1][x] = GUARD_DOWN;
        continue loop;
      }

      if (cell === GUARD_LEFT) {
        if (x <= 0) {
          break loop;
        }
        if (map[y][x - 1] === 'X') {
          seen--;
        }
        map[y][x - 1] = GUARD_LEFT;
        continue loop;
      }

      if (cell === GUARD_RIGHT) {
        if (x >= map[y].length - 1) {
          break loop;
        }
        if (map[y][x + 1] === 'X') {
          seen--;
        }
        map[y][x + 1] = GUARD_RIGHT;
        continue loop;
      }
    }
  }
}

console.log(seen);
