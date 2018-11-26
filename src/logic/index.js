import pluralize from 'pluralize'

const LOGIC = {
    formatLabel(label) {
        let words = label.split('_')
        words.forEach(function(word, i) {
            words[i] = word.charAt(0).toUpperCase() + word.slice(1)
        })

        return words.join(' ')
    },

    secondsToTime(time) {
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
        const count = songs.length
        return count + ' ' + (count === 1 ? 'song' : 'songs')
    },

    countAlbums(albums) {
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

    hydrateAlbum(album) {
        album.artist = album.songs[0].albumartist
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
    }
}

export default LOGIC
