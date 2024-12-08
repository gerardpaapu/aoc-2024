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
    const precedents = rules.get(item);
    if (precedents == null) {
      continue;
    }
    for (const precedent of precedents) {
      // so ... I think the first time it appears must be
      // less than i, and if it's not there (-1) should be fine?
      if (list.indexOf(precedent) > i) {
        return false;
      }
    }
  }

  return true;
}

function tsort(list, rules) {
  function go(list, sorted) {
    if (list.length === 0) {
      return sorted;
    }

    let next = [];
    let sorted$ = [];
    for (const item of list) {
      if (
        [...(rules.get(item) ?? [])].every(
          (d) => !list.includes(d) || sorted.includes(d)
        )
      ) {
        // all of this items dependencies are satisfied
        sorted$.push(item);
      } else {
        next.push(item);
      }
    }

    return go(next, [...sorted, ...sorted$]);
  }

  return go(list, []);
}

const solution = body
  .split('\n')
  .map((line) => line.split(',').map((n) => Number(n)))
  .filter((list) => !isLegal(list, allDeps))
  .map((list) => tsort(list, allDeps))
  .map((list) => list[Math.floor(list.length / 2)])
  .reduce((a, b) => a + b, 0);

console.log(solution);

// console.log(solution.map((list) => tsort(list, allDeps)));
