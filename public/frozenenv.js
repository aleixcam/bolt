const path = require('path')
const os = require('os')
const { app } = require('electron')
const isDev = require('electron-is-dev')

const appPath = os.platform() === 'win32' ? 'resources\\app.asar' : app.getAppPath()
process.env.LILLI_MODEL_DIRECTORY = isDev ? 'public/model' : path.join(appPath, 'build/model')

if (!isDev) {
    const dataPath = os.platform() === 'win32' ? 'resources' : app.getPath('appData')
    process.env.LILLI_DATA_DIRECTORY = path.join(dataPath, 'bolt')
}
