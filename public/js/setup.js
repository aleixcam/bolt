const path = require('path')
const fs = require('fs-extra')
const { app } = require('electron')
const PARAMETERS = require('./parameters')

const SETUP = {
    environmentSetup() {
        console.log(process.env.LILLI_DATA_DIRECTORY);
        fs.ensureDirSync(process.env.LILLI_DATA_DIRECTORY)

        const songsPath = path.join(process.env.LILLI_DATA_DIRECTORY, 'songs.json')
        const parametersPath = path.join(process.env.LILLI_DATA_DIRECTORY, 'parameters.json')
        if (!fs.existsSync(songsPath)) fs.writeFileSync(songsPath, JSON.stringify([]))
        if (!fs.existsSync(parametersPath)) fs.writeFileSync(parametersPath, JSON.stringify([]))
        this.defaultParameters({
            libraryDirectory: app.getPath('music'),
            acceptedExtensions: ['.mp3'],
            scanAlert: true,
            autoCheckVersion: true,
            betaVersions: false
        })
    },

    defaultParameters(parameters) {
        for (var name in parameters) {
            if (!PARAMETERS.getByName(name)) {
                PARAMETERS.addParameter({
                    name: name,
                    value: parameters[name]
                })
            }
        }
    }
}

module.exports = SETUP
