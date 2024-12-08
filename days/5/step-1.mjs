import * as FS from 'node:fs/promises';

const txt = await FS.readFile('input.txt', 'latin1');
const [preamble, body] = txt.split('\n\n');
const allDeps = new Map();
for (const line of preamble.split('\n')) {
  const [a, b] = line.split('|');
  const before = Number(a);
  const after = Number(b);

  let deps = allDeps.get(after);
  if (!deps) {
    deps = new Set();
    allDeps.set(after, deps);
  }

  deps.add(before);
}

function isLegal(list, rules) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    for (const precedent of rules.get(item) ?? []) {
      // so ... I think the first time it appears must be
      // less than i, and if it's not there (-1) should be fine?
      if (list.indexOf(precedent) > i) {
        return false;
      }
    }
  }

  return true;
}

const solution = body
  .split('\n')
  .map((line) => line.split(',').map((n) => Number(n)))
  .filter((list) => isLegal(list, allDeps))
  .map((list) => list[Math.floor(list.length / 2)])
  .reduce((a, b) => a + b, 0);

console.log(solution);
