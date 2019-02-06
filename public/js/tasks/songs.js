const SONGS = require('../songs')
const SCAN = require('../scan')

const TASKS = {
    findAll(event) {
        const songs = SONGS.findAll()
        event.sender.send('songs:findAll:reply', songs)
    },

    groupByAlbums(event, songs) {
        const albums = SONGS.groupByAlbums(songs)
        event.sender.send('songs:groupByAlbums:reply', albums)
    },

    groupByArtists(event, songs) {
        const artists = SONGS.groupByArtists(songs)
        event.sender.send('songs:groupByArtists:reply', artists)
    },

    groupByGenres(event, songs) {
        const genres = SONGS.groupByGenres(songs)
        event.sender.send('songs:groupByGenres:reply', genres)
    },

    groupByDecades(event, songs) {
        const decades = SONGS.groupByDecades(songs)
        event.sender.send('songs:groupByDecades:reply', decades)
    },

    delete(event, song) {
        const confirm = SONGS.delete(song)
        event.sender.send('songs:delete:reply', confirm)
    },

    update(songs, info, callback) {
        let pending = songs.length
        console.log('task');
        songs.forEach(song => {
            SCAN.editMetadata(song, info, path => {
                SONGS.update(song, {path, ...info})
                if (!--pending) callback()
            })
        })
    },

    information(event, songs) {
        let pending = songs.length
        songs.forEach((song, index) => {
            SCAN.getMetadata(song.path, (err, data) => {
                if (err) throw Error(err)

                const genre = data.genre && data.genre[0]
                delete data.genre

                const cover = data.picture ? `data:${data.picture[0].format};base64,${Buffer.from(data.picture[0].data).toString('base64')}` : './img/placeholder.png'
                delete data.picture

                const comment = data.comment && data.comment[0]
                delete data.comment

                songs[index] = {...song, ...data, genre, cover, comment}
                if (!--pending) view.main.webContents.send('modal:information', songs)
            })
        })
    }
}

module.exports = TASKS
