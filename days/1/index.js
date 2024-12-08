import * as FS from 'node:fs/promises'


function zipWith(f) {
    return (a, b) => a.map((aa, i) => f(aa, b[i]))
}


(async () => {
    const txt = await FS.readFile('./input.txt', 'latin1')
    console.log(txt)
    const pairs = txt.split('\n').map(line => line.split('\t'))
    const lhs = pairs.map(([lhs]) => Number(lhs)).toSorted()
    const rhs = pairs.map(([_, rhs]) => Number(lhs)).toSorted()
    const solution = zipWith((a, b) => Math.abs(b - a))(lhs, rhs).reduce((a, b) => a + b, 0)
    return solution
})().catch((e) => {
    process.exitCode = 1
    console.error(e)
})