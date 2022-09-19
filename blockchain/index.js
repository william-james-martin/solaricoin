const Block = require('./block')

class Blockchain  {
    constructor() {
        this.chain = [Block.genesis()]
    }

    add(data) {
        const block = Block.mine(this.chain[this.chain.length - 1], data)
        this.chain.push(block)

        return block
    }

    isValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
        
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const previousBlock = chain[i-1]

            if (block.previousHash !== previousBlock.hash || block.hash !== Block.blockHash(block)) {
                return false
            }
        }

        return true
    }

    replace(chain) {
        if (chain.length <= this.chain.length) {
            console.log('Chain to replace is not longer than the current chain')

            return
        } else if (!this.isValid(chain)) {
            console.log('Chain to replace is not valid')

            return
        }

        console.log('Replacing chain with passed chain')
        this.chain = chain
    }
}

module.exports = Blockchain
