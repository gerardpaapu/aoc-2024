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

function takeCross(x, y) {
    // x, y is the top left
    if (x + 2 <= MAX_X && y + 2 <= MAX_Y) {
        return [
            get(x, y),
            get(x + 1, y + 1),
            get(x + 2, y + 2),
            get(x, y + 2),
            get(x + 1, y + 1),
            get(x + 2, y)
        ].join('')
    }

    return undefined
}

function *search() {
    for (const [x, y] of all()) {
        let cross = takeCross(x, y)
        switch (cross) {
            case 'SAMSAM':
            case 'SAMMAS':
            case 'MASSAM':
            case 'MASMAS':
            yield cross
            break;
        }
    }
}

console.log([...search()].length)