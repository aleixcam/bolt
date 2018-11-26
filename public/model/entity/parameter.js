const { Entity } = require('lilli')

class Parameter extends Entity {
    constructor(query) {
        super(query)

        this.id = query.id || Date.now()
        this.name = query.name
        this.value = query.value || null
    }
}

module.exports = Parameter
