const path = require('path')
const { app } = require('electron')
const isDev = require('electron-is-dev')

process.env.LILLI_MODEL_DIRECTORY = isDev ? 'public/model' : path.join(app.getAppPath(), 'build/model')
if (!isDev) process.env.LILLI_DATA_DIRECTORY = path.join(app.getPath('appData'), 'bolt')
