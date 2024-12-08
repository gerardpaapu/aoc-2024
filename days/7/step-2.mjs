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
  let lhs$;
  switch (op) {
    case '*':
      lhs$ = lhs * rhs;
      break;
    case '+':
      lhs$ = lhs + rhs;
      break;
    case '||':
      {
        let digits = Math.floor(Math.log10(rhs)) + 1;
        lhs$ = lhs * Math.pow(10, digits) + rhs;
      }
      break;
    default:
      throw new Error();
  }

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
    [lhs, '||', ...tail],
  ]);
}

// if you care about the environment and baby animals
// you can do it in one pass without all the recursion
// and without allocating a billion intermediary arrays
function canProduce(seq, target) {
  let results = [seq[0]];
  for (let i = 1; i < seq.length; i++) {
    const rhs = seq[i];
    const digits = Math.floor(Math.log10(rhs)) + 1;

    const next = [];
    for (const lhs of results) {
      next.push(lhs * rhs);
      next.push(lhs + rhs);
      next.push(lhs * Math.pow(10, digits) + rhs);
    }
    results = next;
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i] === target) {
      return true;
    }
  }

  return false;
}

function possiblyValid({ result, values }) {
  return canProduce(values, result);
}

const total = items
  .filter(possiblyValid)
  .map((i) => i.result)
  .reduce((a, b) => a + b, 0);

console.log(total);
