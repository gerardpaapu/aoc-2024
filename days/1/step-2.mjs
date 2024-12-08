import * as FS from 'node:fs/promises'


function zipWith(f) {
    return (a, b) => a.map((aa, i) => f(aa, b[i]))
}

(async () => {
    const txt = await FS.readFile('./input.txt', 'latin1')
    const pairs = txt.split('\n').map(line => line.split('   '))
    const lhs = pairs.map(([lhs]) => Number(lhs))
    const rhs = pairs.map(([_, rhs]) => Number(rhs))
    const ft = new Map()
    rhs.forEach((n) => {
        let f = ft.get(n)
        if (f == undefined) {
            ft.set(n, 1)
        } else {
            ft.set(n, f + 1)
        }
    })

    const solution = lhs.reduce((total, value) => total + value * (ft.get(value) ?? 0), 0)
    
    console.log(`solution: ${solution}`)
})().catch((e) => {
    process.exitCode = 1
    console.error(e)
})