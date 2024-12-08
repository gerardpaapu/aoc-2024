import * as FS from 'node:fs/promises'

const txt = await FS.readFile('./input.txt', 'latin1')
const records = txt.split('\n').map(_ => _.split(' ').map(_ => Number(_)))

function pairwise(arr, f) {
    return arr.slice(1).map((item, i) => f(arr[i], item))
}


function * removals(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield [...arr.slice(0, i), ...arr.slice(i + 1)]
    }
}

function isGoodPair(a, b) {
    const diff = Math.abs(b - a)
    return diff >= 1 && diff <= 3
}

function isPerfectRecord(record) {
    return pairwise(record, isGoodPair).every(_ => _) && (
        pairwise(record, (a, b) => a > b).every(_ => _)
        || pairwise(record, (a, b) => a < b).every(_ => _)
    )
}

function isSafeRecord(record) {
    return [...removals(record)].some(isPerfectRecord)
}

console.log(records.filter(isSafeRecord).length)