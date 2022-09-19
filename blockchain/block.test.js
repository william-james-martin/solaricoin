const Block = require('./block.js')
const { DIFF } = require('../config')

describe('solaricoin block' , () => {
    let data, previousBlock, block

    beforeEach(() => {
        data = '-----'
        previousBlock = Block.genesis()
        block = Block.mine(previousBlock, data)
    })

    it('sets `data`', () => {
        expect(block.data).toEqual(data)
    })

    it('sets `previousHash`', () => {
        expect(block.previousHash).toEqual(previousBlock.hash)
    })

    it('generates hash with `diff` set', () => {
        expect(block.hash.substring(0, block.diff)).toEqual('1'.repeat(block.diff))
    })

    it('lowers diff when blocks are mined too slowly', () => {
        // 1 hour
        expect(Block.adjustDiff(block, block.timestamp+360000)).toEqual(block.diff-1)
    })

    it('increases diff when blocks are mined too quickly', () => {
        // 1 hour
        expect(Block.adjustDiff(block, block.timestamp+1)).toEqual(block.diff+1)
    })
})
