import * as FS from 'node:fs/promises'

const txt = await FS.readFile('./input.txt', 'latin1')
const board = txt.split('\n').map(row => row.split(''))
const WIDTH = board[0].length
const HEIGHT = board.length
const MAX_X = WIDTH - 1
const MAX_Y = HEIGHT - 1


function get(x, y) {
    return board[y]?.[x]
}


function* all() {
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            yield [x, y]
        }
    }
}

const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, +1],
    [+0, -1],          [+0, +1],
    [+1, -1], [+1, 0], [+1, +1]
]


function slice([cx, cy], [dx, dy]) {
    let x = cx
    let y = cy

    const result = []
    while (result.length < 4) {
        result.push(get(x, y))
        x += dx
        y += dy
    }

    return result
}

function slices(x, y) {
    return DIRECTIONS.map(([dx,dy]) => slice([x, y], [dx, dy])).filter((slice) => slice.every(_ => _ != undefined))
}

function *search() {
    for (const [x, y] of all()) {
        if (get(x, y) !== 'X') {
            continue
        }

        for (const slice of slices(x, y)) {
            if (slice.join('') === 'XMAS') {
                yield slice
            }
        }
    }
}
console.log([...search()].length)