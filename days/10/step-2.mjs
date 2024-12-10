import * as FS from 'node:fs/promises'

const txt = await FS.readFile('./input.txt', 'latin1')
const grid = txt.split('\n').map(_ => _.trim().split('').map(n => Number(n)))

function * search(path) {
    const [[x, y, h]] = path
    if (h === 9) {
        yield path
        return
    }

    for (const [nx, ny, nh] of neighbours(x, y)) {
        if (nh !== h + 1) {
            continue
        }

        yield * search([[nx, ny, nh], ...path])
    }
}

const NEIGHBOURHOOD = [
    [+0, -1],
    [-1, +0], [+1, +0],
    [+0, +1]
]

function *neighbours(ox, oy) {
    for (const [xx, yy] of NEIGHBOURHOOD) {
        const x = ox + xx
        const y = oy + yy
        if (0 <= y && y < grid.length && 0 <= x && x < grid[y].length ) {
            yield [x, y, grid[y][x]]
        }
    }
}

function* all() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 0) {
                const paths = [...search([[x, y, 0]])]
                yield paths.length
            }
        }
    }
}


function drawPaths(paths) {
    const result = []
    for (let y = 0; y < grid.length; y++) {
        result[y] = []
        for (let x = 0; x < grid.length; x++) {
            result[y][x] = '.'
        }
    }

    for (const path of paths) {
        for (const [x, y] of path) {
            result[y][x] = grid[y][x]
        }
    }

    return result.map(_ => _.join('')).join('\n')
}

let total = 0
for (const score of all()) {
    total += score
}

console.log(total)
// console.log([...all()].length)

