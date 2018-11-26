const path = require('path')
const fs = require('fs-extra')
const mm = require('music-metadata')
const PARAMETERS = require('./parameters')
const SONGS = require('./songs')

const SCAN = {
    _scanDirectory(dir, ext, callback) {
    	let results = []
    	fs.readdir(dir, (err, list) => {
    		if (err) return callback(err)

    		let pending = list.length
    		if (!pending) return callback(null, results)
    		list.forEach(file => {
    			file = path.resolve(dir, file)
    			fs.stat(file, (err, stat) => {
    				if (stat && stat.isDirectory()) {
    					this._scanDirectory(file, ext, (err, res) => {
    						results = results.concat(res)
    						if (!--pending) callback(null, results)
    					})
    				} else {
    					if (ext.includes(path.extname(file))) results.push(file)
    					if (!--pending) callback(null, results)
    				}
    			})
    		})
    	})
    },

    _organizeLibrary(dir, songs, callback) {
        songs.forEach(src => {
            this.getMetadata(src, (err, data) => {
                if (err) return callback(err.message)

                const dst = path.join(dir, data.artist, data.album, data.title + path.extname(src))
                fs.move(src, dst, { overwrite: true }, err => {
                    if (err) return callback(err.message)

                    callback(null, {path: dst, ...data})
                })
            })
        })
    },

    getMetadata(path, callback) {
        return mm.parseFile(path)
            .then(metadata => callback(null, metadata.common))
            .catch(err => callback(err.message))
    },

    getEncoded(path) {
        const song = fs.readFileSync(path)
        return `data:audio/mp3;base64,${Buffer.from(song).toString('base64')}`
    },

    scanLibrary(callback) {
        const libraryDirectory = PARAMETERS.getByName('libraryDirectory').value
    	const boltDirectory = libraryDirectory + 'Bolt/'
    	const extensions = PARAMETERS.getByName('acceptedExtensions').value

        fs.ensureDirSync(boltDirectory)
    	this._scanDirectory(boltDirectory, extensions, (err, songs) => {
    		if (err) throw Error(err)

            let pending = songs.length
            if (!pending) callback()

            this._organizeLibrary(libraryDirectory, songs, (err, song) => {
                if (err) throw Error(err)

                SONGS.addSong({
                    path: song.path,
                    title: song.title,
                    album: song.album,
                    artist: song.artist,
                    genre: song.genre[0],
                    year: song.year,
                    track: song.track.no,
                    disk: song.disk.no
                })

                if (!--pending) {
                    callback()
                    fs.emptyDir(boltDirectory)
                }
            })
    	})
    },
}

module.exports = SCAN
