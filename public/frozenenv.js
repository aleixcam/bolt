const isDev = require('electron-is-dev')

process.env.LILLI_MODEL_DIRECTORY = isDev ? 'public/model' : 'build/model'
process.env.LILLI_DATA_DIRECTORY = isDev ? 'public/data' : 'build/data'
