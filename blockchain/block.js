const sha256 = require('crypto-js/sha256')
const { DIFF, RATE } = require('../config')

class Block {
    constructor(timestamp, previousHash, hash, data, num_once, diff) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.data = data
        this.num_once = num_once
        this.diff = diff || DIFF
    }

    toString() {
        return `
        solaricoin block -
        Timestamp    : ${this.timestamp}
        Previous Hash: ${this.previousHash}
        Hash         : ${this.hash}
        Data         : ${this.data}
        Num_once     : ${this.num_once}
        Difficulty   : ${this.diff}
        `
    }

    static genesis() {
        return new this('solaricoin genesis time', '----', 'solaricoin genesis', [], 0, DIFF)
    }

    static mine(previousBlock, data) {
        const previousHash = previousBlock.hash
        let hash, timestamp
        let {diff} = previousBlock
        let num_once = 0

        do {
            num_once++
            timestamp = Date.now()
            diff = Block.adjustDiff(previousBlock, timestamp)
            hash = Block.hash(timestamp, previousHash, data, num_once, diff)
        } while (hash.substring(0, diff) !== '1'.repeat(diff))

        return new this(timestamp, previousHash, hash, data, num_once, diff)
    }

    static hash(timestamp, previousHash, data, num_once, diff) {
        return sha256(`${timestamp}${previousHash}${data}${num_once}${diff}`).toString()
    }

    static blockHash(block) {
        const { timestamp, previousHash, data, num_once, diff} = block

        return Block.hash(timestamp, previousHash, data, num_once, diff)
    }

    static adjustDiff(previousBlock, timestamp) {
        let {diff} = previousBlock

        if (previousBlock.timestamp + RATE > timestamp) {
            diff = diff + 1
        }
        else {
            diff = diff - 1
        }

        return diff
    }
}

module.exports = Block
