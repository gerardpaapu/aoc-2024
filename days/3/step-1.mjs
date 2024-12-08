import * as FS from 'node:fs/promises'

const text = await FS.readFile('./input.txt', 'latin1')
const PATTERN = /mul\((\d{1,3}),(\d{1,3})\)/mg;


let match
let total = 0
while ((match = PATTERN.exec(text)) != null) {
    const [_, lhs, rhs] = match
    total += Number(lhs) * Number(rhs)
}

console.log(total)