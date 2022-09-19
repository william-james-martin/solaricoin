const Blockchain = require('./index')
const Block = require('./block')

describe('solaricoin blockchain', () => {
    let blockchain, blockchainValid

    beforeEach(() => {
        blockchain = new Blockchain()
        blockchainValid = new Blockchain()
    })

    it('has genesis', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it('adds a block', () => {
        const data = '-----'
        blockchain.add(data)

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data)
    })

    it('validates a correct chain', () => {
        blockchainValid.add('-----')

        expect(blockchain.isValid(blockchainValid.chain)).toBe(true)
    })

    it('invalidates a chain with incorrect genesis', () => {
        blockchainValid.chain[0].data = ''

        expect(blockchain.isValid(blockchainValid.chain)).toBe(false)
    })

    it('invalidates a corrupt chain', () => {
        blockchainValid.add('-----')
        blockchainValid.chain[1].data = ''

        expect(blockchain.isValid(blockchainValid.chain)).toBe(false)
    })

    it('replaces chain with a valid chain', () => {
        blockchainValid.add('new')
        blockchain.replace(blockchainValid.chain)

        expect(blockchain.chain).toEqual(blockchainValid.chain)
    })

    it('does not replace chain with one that is less than or equal length', () => {
        blockchain.add('-----')
        blockchain.replace(blockchainValid.chain)

        expect(blockchain.chain).not.toEqual(blockchainValid.chain)
    })
})
