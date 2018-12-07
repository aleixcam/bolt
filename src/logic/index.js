import pluralize from 'pluralize'

const LOGIC = {

    /**
     *
     * @param {string} track
     *
     * @returns {string}
     */
    formatLabel(label) {
        if (typeof label !== 'string') throw Error(`Invalid argument ${label}`)

        let words = label.split('_')
        words.forEach(function(word, i) {
            words[i] = word.charAt(0).toUpperCase() + word.slice(1)
        })

        return words.join(' ')
    },

    /**
     *
     * @param {number} time
     *
     * @returns {string}
     */
    secondsToTime(time) {
        if (typeof time !== 'number') throw Error(`Invalid argument ${time}`)

        const minutes = Math.floor(time / 60);
        const seconds = ('0' + Math.floor(time - minutes * 60)).slice(-2);
        return minutes + ':' + seconds;
    },

    /**
     *
     * @param {string} group
     *
     * @returns {Object}
     */
    setGroupContext(group) {
        const view = pluralize.singular(group)
        const renderer = 'groupBy' + this.formatLabel(group)
        const titles = ['artist', 'genre', 'year']
        titles.remove(view)
        return { view, renderer, titles }
    },

    /**
     *
     * @param {Array} songs
     *
     * @returns {string}
     */
    countSongs(songs) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)

        const count = songs.length
        return count + ' ' + (count === 1 ? 'song' : 'songs')
    },

    /**
     *
     * @param {Array} albums
     *
     * @returns {string}
     */
    countAlbums(albums) {
        if (!albums || !Array.isArray(albums)) throw Error(`Invalid argument ${albums}`)

        const count = albums.length
        return count + ' ' + (count === 1 ? 'album' : 'albums')
    },

    /**
     *
     * @param {Song} song
     *
     * @returns {Promise}
     */
    getMetadata(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getMetadata', song)
            window.ipcRenderer.on('scan:getMetadata:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

    /**
     *
     * @param {Song} song
     *
     * @returns {Promise}
     */
    getEncoded(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getEncoded', song)
            window.ipcRenderer.on('scan:getEncoded:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

    /**
     *
     * @param {Song} song
     *
     * @returns {Promise}
     */
    getFormat(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getFormat', song)
            window.ipcRenderer.on('scan:getFormat:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

    /**
     *
     * @param {Object} album
     *
     * @returns {Object}
     */
    hydrateAlbum(album) {
        if (!album.album) album.album = 'Unknown album'
        album.artist = album.songs[0].albumartist || 'Unknown artist'
        album.genre = album.songs[0].genre
        album.year = album.songs[0].year
        album.cover = album.songs[0].cover
        album.count = this.countSongs(album.songs)
        album.disks = [...new Set(album.songs.map(song => song.disk))]
        return album
    },

    /**
     *
     * @param {Object} group
     *
     * @returns {Object}
     */
    hydrateGroup(group) {
        group.songs = []
        group.albums.forEach((album, index) => {
            group.albums[index] = this.hydrateAlbum(album)
            group.songs = group.songs.concat(album.songs)
        })

        group.countAlbums = this.countAlbums(group.albums)
        group.countSongs = this.countSongs(group.songs)
        return group
    },

    /**
     *
     * @param {Array} songs
     * @param {Function} callback
     */
    deleteSongs(songs, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function');

        let pending = songs.length
        songs.forEach(song => {
            window.ipcRenderer.send('songs:delete', song)
            window.ipcRenderer.on('songs:delete:reply', (event, confirm) => {
                if (confirm) pending--
                if (!pending) callback()
            })
        })
    },

    /**
     *
     * @param {Array} songs
     * @param {Function} callback
     */
    retrieveInfo(songs, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function');

        const info = {
            title: songs[0].title,
            artist: songs[0].artist,
            album: songs[0].album,
            albumartist: songs[0].albumartist,
            cover: songs[0].cover,
            genre: songs[0].genre,
            year: songs[0].year,
            disk: songs[0].disk.no,
            disks: songs[0].disk.of,
            track: songs[0].track.no,
            tracks: songs[0].track.of,
            comment: songs[0].comment
        }

        songs.forEach(song => {
            if (song.artist !== info.artist) info.artist = '%Various artists'
            if (song.album !== info.album) info.album = '%Various albums'
            if (song.albumartist !== info.albumartist) info.albumartist = '%Various album artists'
            if (song.genre !== info.genre) info.genre = '%Various genres'
            if (song.year !== info.year) info.year = '%Various years'
            if (song.comment !== info.comment) info.comment = '%Various comments'
        })

        if (songs.length > 1) {
            info.title = '%' + this.countSongs(songs)
            callback(info)
        } else {
            info.path = songs[0].path
            info.filename = songs[0].filename
            this.getFormat(songs[0])
                .then(data => {
                    info.format = data.dataformat.toUpperCase()
                    info.duration = this.secondsToTime(data.duration)
                    info.bitrate = `${data.bitrate / 100} kbps`
                    info.samplerate = `${data.sampleRate / 100} kHz`
                    info.channels = data.numberOfChannels
                    info.tag = data.tagTypes[0]
                    info.encoder = data.encoder
                    callback(info)
                })
        }
    },

    /**
     *
     * @param {Array} songs
     *
     * @returns {Array}
     */
    retrieveCovers(songs) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)

        const covers = []
        songs.forEach(song => {
            if (!covers.includes(song.cover) && song.cover.startsWith('data:image')) {
                covers.push(song.cover)
            }
        })

        return covers
    }
}

export default LOGIC
