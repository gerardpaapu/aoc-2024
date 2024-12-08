import * as FS from 'node:fs/promises';

const txt = await FS.readFile('input.txt', 'latin1');
const items = txt.split('\n').map((line) => {
  let [head, tail] = line.split(': ');
  let values = tail.split(' ').map((_) => Number(_));
  return { result: Number(head), values };
});

function simplify(arr) {
  if (arr.length <= 1) {
    return arr[0];
  }

  const [lhs, op, rhs, ...rest] = arr;
  const lhs$ = op === '*' ? lhs * rhs : lhs + rhs;
  return simplify([lhs$, ...rest]);
}

function expansions(seq) {
  if (seq.length === 1) {
    return [seq];
  }

  const [lhs, ...rest] = seq;
  return expansions(rest).flatMap((tail) => [
    [lhs, '+', ...tail],
    [lhs, '*', ...tail],
  ]);
}

function possiblyValid({ result, values }) {
  return expansions(values)
    .map(simplify)
    .some((n) => n === result);
}

const total = items
  .filter(possiblyValid)
  .map((i) => i.result)
  .reduce((a, b) => a + b, 0);
console.log(total);
