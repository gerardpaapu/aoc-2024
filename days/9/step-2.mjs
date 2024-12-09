import * as FS from 'node:fs/promises'

const txt = await FS.readFile('input.txt', 'latin1')
const ns = txt.split('').map(_ => Number(_))

const EMPTY = -1;

const memory = [];
const index = [];
let idx = 0;
let fn = 0;
for (let i = 0; i < ns.length; i++) {
    index.push({ fn, length: ns[i] })
    memory.push(index[fn])
    idx += ns[i]
    fn++;

    if (i < ns.length - 1) {
        i++
        memory.push({ fn: EMPTY, length: ns[i] })
        idx += ns[i]
    }
}


for (let i = index.length - 1; i >= 0; i--) {
    // console.log(drawMemory())
    let file = index[i];

    let spot = memory.findIndex((span) => span.fn === -1 && span.length >= file.length);
    if (spot === -1 || spot >= memory.indexOf(file)) {
        continue;
    }

    const emptySpan = memory[spot]
    const surplus = { fn: EMPTY, length: emptySpan.length - file.length }
    memory.splice(spot, 1, { fn: file.fn, length: file.length }, surplus)

    // delete the old slot
    let toDelete = memory.lastIndexOf(file)
    if (toDelete !== spot) {
        memory[toDelete] = { fn: EMPTY, length: file.length }
    }

    compact();
}

function compact() {
    for (let i = memory.length - 1; i >= 0; i--) {
        
        if (memory[i].fn !== EMPTY) {
            continue
        } 

        let count = 1
        let total = memory[i].length;

        while (--i >= 0 && memory[i].fn === EMPTY) {
            count++
            total += memory[i].length
        }
        memory[i + 1].length = total
        memory.splice(i + 2, count - 1)
    }
}

function drawMemory() {
    let out = ''
    for (const item of memory) {
        for (let i = 0; i < item.length; i++) {
            if (item.fn === -1) {
                out += '.'
            } else {
                out += String(item.fn)
            }
        }
    }
    return out;
}


// let emptyIdx = -1
// let tailIdx = expanded.length - 1;
// while ((emptyIdx = expanded.indexOf(EMPTY)) !== -1 && emptyIdx < tailIdx) {
//     while (expanded[tailIdx] === EMPTY) {
//         tailIdx--
//     }
//     expanded[emptyIdx] = expanded[tailIdx]
//     expanded[tailIdx] = EMPTY
//     tailIdx--
// }

let checksum = 0
let ptr = 0
for (let i = 0; i < memory.length; i++) {
    for (let j = 0; j < memory[i].length; j++) {
        if (memory[i].fn !== EMPTY) {
            checksum += ptr * memory[i].fn
        }
        ptr++

    }
}

console.log(`solution: ${checksum}`)