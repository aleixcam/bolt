const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')
const ParametersTable = require('../model/table/parameters')

const PARAMETERS = {
    environmentSetup() {
        fs.ensureDirSync(process.env.LILLI_DATA_DIRECTORY)
        
        const songsPath = path.join(process.env.LILLI_DATA_DIRECTORY, 'songs.json')
        const parametersPath = path.join(process.env.LILLI_DATA_DIRECTORY, 'parameters.json')
        if (!fs.existsSync(songsPath)) fs.writeFileSync(songsPath, JSON.stringify([]))
        if (!fs.existsSync(parametersPath)) fs.writeFileSync(parametersPath, JSON.stringify([]))

        if (!this.getByName('libraryDirectory')) {
            libraryDirectory = this.addParameter({
                name: 'libraryDirectory',
                value: app.getPath('music')
            })
        }

        if (!this.getByName('acceptedExtensions')) {
            this.addParameter({
                name: 'acceptedExtensions',
                value: [".mp3"]
            })
        }
    },

    addParameter(obj) {
        const parametersTable = new ParametersTable()
        const parameter = parametersTable.newEntity(obj)
        return parametersTable.save(parameter)
    },

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
