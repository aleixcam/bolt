const ParametersTable = require('../model/table/parameters')

const PARAMETERS = {
    findAll() {
        const parametersTable = new ParametersTable()
        const allParameters = parametersTable.all()
        
        const parameters = {}
        allParameters.forEach(parameter => {
            parameters[parameter.name] = parameter.value
        })

        return parameters
    },

    getByName(name) {
        const parametersTable = new ParametersTable()
        const parameter = parametersTable.where({ name }).first()
        return parameter
    },

    update(query) {
        const parametersTable = new ParametersTable()
        const parameter = parametersTable.where({
            name: query.name
        }).first()

        parameter.value = query.value
        return parametersTable.save(parameter)
    },

    delete(id) {
        const parametersTable = new ParametersTable()
        const parameter = parametersTable.get(id)
        return parametersTable.delete(parameter)
    }
}

module.exports = PARAMETERS
