import * as FS from 'node:fs/promises'

const txt = await FS.readFile('input.txt', 'latin1')
const grid = txt.split('\n').map((line, y) => line.trim().split('').map((species, x) => ({ species, x, y, region: undefined })))

function * neighbours(x, y) {
    if (x > 0) yield [x - 1, y]
    if (y > 0) yield [x, y - 1]
    if (y < grid.length - 1) yield [x, y + 1]
    if (x < (grid[y].length - 1)) yield [x + 1, y]
}

const regions = []

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x]
        if (cell.region != undefined) {
            continue
        }

        let region = regions.length
        cell.region = region
        regions[region] = []
        regions[region].push(cell)

        let seeds = [[x, y]]
    
        while (seeds.length > 0) {
            let next = []
            for (const [x, y] of seeds) {
                for (const [nx, ny] of neighbours(x, y)) {
                    const candidate = grid[ny][nx]
                
                    if (candidate.region == undefined && candidate.species === cell.species) {
                        candidate.region = region
                        regions[region].push(candidate)
                        next.push([nx, ny])
                    }
                }
            }
            seeds = next
        }
    }
}

function perimeter(cells) {
    let fence = 0
    for (const{ x, y, region } of cells) {
        if (x <= 0 || grid[y][x - 1].region !== region) fence++
        if (y <= 0 || grid[y - 1][x].region !== region) fence++
        if (y >= grid.length - 1|| grid[y + 1][x].region !== region) fence++
        if (x >= grid[y].length - 1 || grid[y][x + 1].region !== region) fence++
    }

    return fence
}

function costOf(region) {
    return region.length * perimeter(region)
}

{
let total = 0
for (const region of regions) {
    let cost = costOf(region)
    total += cost
    // console.log(region[0].species, region.length, perimeter(region), cost)
}


console.log({ total })
}

function fencing(cells) {
    for (const cell of cells) {
        const { x, y , region } = cell
        cell.fence ??= {}
        if (x <= 0 || grid[y][x - 1].region !== region) {
            cell.fence.left = true
        }
        if (y <= 0 || grid[y - 1][x].region !== region) {
            cell.fence.up = true
        }
        if (y >= grid.length - 1|| grid[y + 1][x].region !== region) {
            cell.fence.down = true
        }

        if (x >= grid[y].length - 1 || grid[y][x + 1].region !== region) {
            cell.fence.right = true
        }
    }

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x]
            cell.fence ??= {}

            if (cell.region !== cells[0].region) {
                continue
            }

            if (cell.fence.up) {
                // delete all the up fences in a row after this one
                for (let i = x + 1; i < grid[y].length && grid[y][i].region === cell.region && grid[y][i].fence.up; i++) {
                    grid[y][i].fence.up = false
                }
            }

            if (cell.fence.left) {
                // delete all the left fences in a row after this one
                for (let i = y + 1; i < grid.length && grid[i][x].region === cell.region && grid[i][x].fence.left; i++) {
                    grid[i][x].fence.left = false
                }
            }


            if (cell.fence.right) {
                // delete all the right fences in a row after this one
                for (let i = y + 1; i < grid.length && grid[i][x].region === cell.region && grid[i][x].fence.right; i++) {
                    grid[i][x].fence.right = false
                }
            }


            if (cell.fence.down) {
                // delete all the up fences in a row after this one
                for (let i = x + 1; i < grid[y].length && grid[y][i].region === cell.region && grid[y][i].fence.down; i++) {
                    grid[y][i].fence.down = false
                }
            }
        }
    }

    let fence = 0;
    for (const cell of cells) {
        if (cell.fence.left) fence++
        if (cell.fence.right) fence++
        if (cell.fence.up) fence++
        if (cell.fence.down) fence++
    }
    return fence
}


{
    let total = 0
    for (const region of regions) {
        let cost = region.length * fencing(region)
        total += cost
        console.log(region[0].species, region.length, fencing(region), cost)
    }
    
    
    console.log({ total })
    }