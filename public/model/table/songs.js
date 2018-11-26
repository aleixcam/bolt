const { Table } = require('lilli')

class SongsTable extends Table {
    constructor(query) {
        super('songs', query)
    }
}

module.exports = SongsTable
