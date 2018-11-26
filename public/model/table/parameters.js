const { Table } = require('lilli')

class ParametersTable extends Table {
    constructor(query) {
        super('parameters', query)
    }
}

module.exports = ParametersTable
