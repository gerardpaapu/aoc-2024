import * as FS from 'node:fs/promises'

const txt = await FS.readFile('input.txt', 'latin1')
const ns = txt.split('').map(_ => Number(_))

const EMPTY = -1;
const expanded = [];
let totalEmpty = 0;
let id = 0;
for (let i = 0; i < ns.length; i += 2) {
    let j = i + 1;
    for (let fp = 0; fp < ns[i]; fp++) {
        expanded.push(id);
    }

    for (let ep = 0; ep < ns[j]; ep++) {
        expanded.push(EMPTY)
    }
    totalEmpty += ns[j];
    id++;
}

let emptyIdx = -1
let tailIdx = expanded.length - 1;
while ((emptyIdx = expanded.indexOf(EMPTY)) !== -1 && emptyIdx < tailIdx) {
    while (expanded[tailIdx] === EMPTY) {
        tailIdx--
    }
    expanded[emptyIdx] = expanded[tailIdx]
    expanded[tailIdx] = EMPTY
    tailIdx--
}

let checksum = 0
for (let i = 0; i < expanded.length; i++) {
    if (expanded[i] === EMPTY) {
        continue
    }
    checksum += i * expanded[i]
}

console.log(`solution: ${checksum}`)