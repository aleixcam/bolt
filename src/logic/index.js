import pluralize from 'pluralize'

const LOGIC = {
    formatLabel(label) {
        if (typeof label !== 'string') throw Error(`Invalid argument ${label}`)

        let words = label.split('_')
        words.forEach(function(word, i) {
            words[i] = word.charAt(0).toUpperCase() + word.slice(1)
        })

        return words.join(' ')
    },

    secondsToTime(time) {
        if (typeof time !== 'number') throw Error(`Invalid argument ${time}`)

        const minutes = Math.floor(time / 60);
        const seconds = ('0' + Math.floor(time - minutes * 60)).slice(-2);
        return minutes + ':' + seconds;
    },

    setGroupContext(group) {
        const view = pluralize.singular(group)
        const renderer = 'groupBy' + this.formatLabel(group)
        const titles = ['artist', 'genre', 'year']
        titles.remove(view)
        return { view, renderer, titles }
    },

    countSongs(songs) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)

        const count = songs.length
        return count + ' ' + (count === 1 ? 'song' : 'songs')
    },

    countAlbums(albums) {
        if (!albums || !Array.isArray(albums)) throw Error(`Invalid argument ${albums}`)

        const count = albums.length
        return count + ' ' + (count === 1 ? 'album' : 'albums')
    },

    getMetadata(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getMetadata', song)
            window.ipcRenderer.on('scan:getMetadata:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

    getEncoded(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getEncoded', song)
            window.ipcRenderer.on('scan:getEncoded:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

    getFormat(song) {
        return new Promise(resolve => {
            window.ipcRenderer.send('scan:getFormat', song)
            window.ipcRenderer.on('scan:getFormat:reply'+song.id, (event, data) => {
                resolve(data)
            })
        })
    },

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

    deleteSongs(songs, callback) {
        let pending = songs.length
        songs.forEach(song => {
            window.ipcRenderer.send('songs:delete', song)
            window.ipcRenderer.on('songs:delete:reply', (event, confirm) => {
                if (confirm) pending--
                if (!pending) callback()
            })
        })
    },

    retrieveInfo(songs) {
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
        } else {
            info.path = songs[0].path
            info.encodersettings = songs[0].encodersettings
        }

        return info
    },

    retrieveCovers(songs) {
        const covers = []
        songs.forEach(song => {
            if (!covers.includes(song.cover) && song.cover.startsWith('data:image')) {
                covers.push(song.cover)
            }
        })

        return covers
    },

    retrieveFormat(song) {
        console.log(song);
    }
}

export default LOGIC
