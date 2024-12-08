import * as FS from 'node:fs/promises'

const txt = await FS.readFile('./input.txt', 'latin1')
const records = txt.split('\n').map(_ => _.split(' ').map(_ => Number(_)))

function pairwise(f) {
    return (arr) => arr.slice(1).map((item, i) => f(arr[i], item))
}

function isGoodPair(a, b) {
    const diff = Math.abs(b - a)
    return diff >= 1 && diff <= 3
}

function isSafeRecord(record) {
    return pairwise(isGoodPair)(record).every(_ => _) && (
        pairwise((a, b) => a > b)(record).every(_ => _)
        || pairwise((a, b) => a < b)(record).every(_ => _)
    )
}

console.log(records.filter(isSafeRecord).length)