import * as FS from 'node:fs/promises'

const txt = await FS.readFile('./example.txt', 'latin1')
const board = txt.split('\n').map(row => row.split(''))
const WIDTH = board[0].length
const HEIGHT = board.length
const MAX_X = WIDTH - 1
const MAX_Y = HEIGHT - 1


function get(x, y) {
    return board[y][x]
}

function * neighbours(x, y) {
    if (y > 0 && x > 0)     { yield [x - 1, y - 1] }
    if (y > 0)              { yield [x, y - 1] }
    if (y > 0 && x - MAX_X) { yield [x + 1, y - 1] }

    if (x > 0)     { yield [x - 1, y] }
    if (x < MAX_X) { yield [x + 1, y] }
    
    if (y < MAX_Y && x > 0)     { yield [x - 1, y + 1] }
    if (y < MAX_Y)              { yield [x, y + 1] }
    if (y < MAX_Y && x - MAX_X) { yield [x + 1, y + 1] }
}

function* all() {
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            yield [x, y]
        }
    }
}

function searchFrom(cs, letters, path) {
    if (letters.length === 0) {
        return [path]
    }

    const [first, ...rest] = letters
    let found = []
    for (let [x, y] of cs) {
        const value = get(x, y)
        if (value !== first) {
            continue
        }

        found.push(...searchFrom(neighbours(x, y), rest, [...path, [x, y]]))
    }

    return found
}

function draw(path) {
    let result = board.map(_ => _.map(_ => '.'))
    for (let [x, y] of path) {
        result[y][x] = get(x, y)
    }

    return result.map(_ => _.join('')).join('\n')
}

const found = searchFrom(all(), 'XMAS'.split(''), [])
for (const solution of found) {
    console.log(draw(solution))
    console.log('-----------')
}

// console.log(get(0, 9))