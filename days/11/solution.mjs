import * as FS from 'node:fs/promises'


const txt = await FS.readFile('input.txt', 'latin1')
const initial = txt.split(' ').map(_ => Number(_))
console.log(txt)
const lookup = new Map()



const step = (stone) => {
    if (stone === 0) {
        return [1]
    }
    const digits = Math.floor(Math.log10(stone)) + 1
    if (digits % 2 === 0) {
        const r = stone % Math.pow(10, digits * 0.5)
        const d = (stone - r) / Math.pow(10, digits * 0.5)
        return [d, r]
    }

    return [stone * 2024]
}

const lengthOf = (stone, iterations) => {
    const key = `lengthOf(${stone}, ${iterations})`
    if (lookup.has(key)) {
        return lookup.get(key)
    }

    if (iterations === 0) {
        return 1
    }

    const total = solve(step(stone), iterations - 1)
    lookup.set(key, total)

    return total
}

const solve = (stones, iterations) => {
    let total = 0;
    for (const stone of stones) {
        total += lengthOf(stone, iterations)
    }
    return total
}


console.log(`step-1`, solve(initial, 25))
console.log(`step-2`, solve(initial, 75))