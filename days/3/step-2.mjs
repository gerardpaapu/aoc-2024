import * as FS from 'node:fs/promises'

const text = await FS.readFile('./input.txt', 'latin1')
const PATTERN = /do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/mg;


let match
let total = 0
let enabled = true

while ((match = PATTERN.exec(text)) != null) {
    switch (match[0]) {
        case 'do()':
            enabled = true;
            break;
        case 'don\'t()':
            enabled = false;
            break;
        default:
            if (enabled) {
                const [_, lhs, rhs] = match
                total += Number(lhs) * Number(rhs)
            }
    }
}

console.log(total)