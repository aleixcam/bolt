require('./frozenenv')
const path = require('path')
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const isDev = require('electron-is-dev')
const Nucleus = require('electron-nucleus')('5bf7104364ad4a01c40ce731')

const SETUP = require('./js/setup')
const PARAMETERS = require('./js/parameters')
const SONGS = require('./js/songs')
const SCAN = require('./js/scan')
const GitHub = require('./js/github')

const git = new GitHub()
let preloaderWindow
let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
		width: 1280,
		height: 854,
		show: false,
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, 'preload.js')
		}
    })

	if (isDev) {
        mainWindow.loadURL('http://localhost:3000')
	} else {
        mainWindow.loadURL('file://' + path.join(__dirname, '../build/index.html'))
	}

    mainWindow.on("closed", () => (mainWindow = null))

	mainWindow.once('ready-to-show', () => {
        preloaderWindow.hide()
		mainWindow.show()

        if (PARAMETERS.getByName('autoCheckVersion').value) {
            git.checkVersion()
                .then(version => mainWindow.webContents.send('alert:newVerson', version))
        }
	})
}

function createPreloaderWindow() {
	preloaderWindow = new BrowserWindow({
		width: 240,
		height: 240,
		show: false,
		frame: false,
		resizable: false
	})

	if (isDev) {
		preloaderWindow.loadURL('file://' + path.join(__dirname, './preloader.html'))
	} else {
		preloaderWindow.loadURL('file://' + path.join(__dirname, '../build/preloader.html'))
	}

    preloaderWindow.on('closed', () => (preloaderWindow = null))

	preloaderWindow.once('ready-to-show', () => {
		preloaderWindow.show()
	})
}

function createMainMenu() {
	const template = [
		{
			label: 'File',
			submenu: [
                { role: 'about' },
                { type: 'separator' },
                {
                    label: 'Preferences',
                    accelerator: 'CmdOrCtrl+,',
                    click () { mainWindow.webContents.send('modal:parameters') }
                },
                { type: 'separator' },
                {
                    label: 'Update Library',
                    click () { updateLibrary() }
                },
                { type: 'separator' },
                { role: 'quit' }
            ]
		},
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'pasteandmatchstyle' },
				{ role: 'delete' },
				{ role: 'selectall' }
			]
		},
		{
			label: 'View',
			submenu: [
				{ role: 'reload' },
				{ role: 'forcereload' },
				{ role: 'toggledevtools' },
				{ type: 'separator' },
				{ role: 'resetzoom' },
				{ role: 'zoomin' },
				{ role: 'zoomout' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' }
			]
		},
		{
			role: 'window',
			submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
		},
		{
			role: 'help',
			submenu: [
				{
                    label: 'Learn More',
					click() { require('electron').shell.openExternal('https://github.com/aleixcam/bolt') }
				}
			]
		}
	]

	Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

function updateLibrary() {
    const alert = PARAMETERS.getByName('scanAlert').value
    mainWindow.webContents.send('alert:scanStart', alert)
    SCAN.scanLibrary(() => {
        Nucleus.track("SCANNED_LIBRARY")
        mainWindow.webContents.send('alert:scanEnd', alert)
    })
}

app.on('ready', () => {
	createPreloaderWindow()
    SETUP.environmentSetup()

    SCAN.scanLibrary(() => {
        createMainWindow()
        createMainMenu()
    })

	ipcMain.on('songs:retrieve', function(event) {
		const songs = SONGS.findAll()

		let pending = songs.length
        if (!pending) event.returnValue = []

		songs.forEach((song, index) => {
			SCAN.getMetadata(song.path, (err, data) => {
				if (err) {
                    SONGS.delete(song)
                } else {
                    const cover = data.picture ? `data:${data.picture[0].format};base64,${Buffer.from(data.picture[0].data).toString('base64')}` : './img/placeholder.png'
    				songs[index].albumartist = data.albumartist
    				songs[index].cover = cover
    				songs[index].rating = data.rating && data.rating[0].rating
                }

				if (!--pending) event.returnValue = songs
			})
		})
	})

	ipcMain.on('parameters:retrieve', function(event) {
		event.returnValue = PARAMETERS.findAll()
	})

	ipcMain.on('parameters:update', function(event, query) {
        Nucleus.track("CHANGED_PARAMETER_"+query.name.toUpperCase())
		const parameter = PARAMETERS.update(query)
		event.sender.send('parameters:update:reply', parameter)
	})

	ipcMain.on('parameters:checkVersion', function(event) {
        git.checkVersion()
            .then(version => event.sender.send('parameters:checkVersion:reply', version))
	})

	ipcMain.on('songs:findAll', function(event) {
		const songs = SONGS.findAll()
		event.sender.send('songs:findAll:reply', songs)
	})

	ipcMain.on('songs:groupByAlbums', function(event, songs) {
		const albums = SONGS.groupByAlbums(songs)
		event.sender.send('songs:groupByAlbums:reply', albums)
	})

	ipcMain.on('songs:groupByArtists', function(event, songs) {
		const artists = SONGS.groupByArtists(songs)
		event.sender.send('songs:groupByArtists:reply', artists)
	})

	ipcMain.on('songs:groupByGenres', function(event, songs) {
		const genres = SONGS.groupByGenres(songs)
		event.sender.send('songs:groupByGenres:reply', genres)
	})

	ipcMain.on('songs:groupByDecades', function(event, songs) {
		const decades = SONGS.groupByDecades(songs)
		event.sender.send('songs:groupByDecades:reply', decades)
	})

	ipcMain.on('songs:delete', function(event, song) {
		const confirm = SONGS.delete(song)
		event.sender.send('songs:delete:reply', confirm)
	})

	ipcMain.on('songs:information', function(event, songs) {
        let pending = songs.length
		songs.forEach((song, index) => {
			SCAN.getMetadata(song.path, (err, data) => {
                if (err) console.error(err.message)

                const genre = data.genre && data.genre[0]
                delete data.genre

                const cover = data.picture ? `data:${data.picture[0].format};base64,${Buffer.from(data.picture[0].data).toString('base64')}` : './img/placeholder.png'
                delete data.picture

                songs[index] = {...song, ...data, genre, cover}
				if (!--pending) mainWindow.webContents.send('modal:information', songs)
			})
		})
	})

	ipcMain.on('scan:getEncoded', function(event, song) {
		try {
			if (!song || typeof song !== 'object') throw Error('Invalid argument passed as song')
			if (!song.id || typeof song.id !== 'number') throw Error('Invalid id value in song argument')
			if (!song.path || typeof song.path !== 'string') throw Error('Invalid path value in song argument')

			const data = SCAN.getEncoded(song.path)
			event.sender.send('scan:getEncoded:reply'+song.id, data)
		} catch (e) {
			event.sender.send('electron:error', e.message)
		}
	})

	ipcMain.on('scan:getMetadata', function(event, song) {
		try {
			if (!song || typeof song !== 'object') throw Error('Invalid argument passed as song')
			if (!song.id || typeof song.id !== 'number') throw Error('Invalid id value in song argument')
			if (!song.path || typeof song.path !== 'string') throw Error('Invalid path value in song argument')

	        SCAN.getMetadata(song.path, (err, data) => {
				if (err) throw Error(err)

				event.sender.send('scan:getMetadata:reply'+song.id, data)
	        })
		} catch (e) {
			event.sender.send('electron:error', e.message)
		}
	})
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createMainWindow()
})
