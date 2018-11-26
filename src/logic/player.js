import LOGIC from './index'

const PLAYER = {
    encode(track, callback) {
        if (track.data) return callback(track)
        return LOGIC.getEncoded(track)
            .then(data => Object.assign(track, { data }))
            .then(song => callback(song))
            .catch(err => console.error(err.message))
    },

    play(songs, shuffle, callback) {
        const index = shuffle ? Math.floor(Math.random() * songs.length) : 0
        if (songs[index]) this.encode(songs[index], callback)
    },

    previous(songs, current, repeat, callback) {
        let index = songs.findIndex(song => current.id === song.id)
        index = index === 0 ? (repeat ? songs.length - 1 : -1) : index - 1
        if (songs[index]) this.encode(songs[index], callback)
    },

    next(songs, current, shuffle, repeat, callback) {
        if (shuffle) return this.random(songs, repeat, callback)

        let index = songs.findIndex(song => current.id === song.id)
        index = index === songs.length - 1 ? (repeat ? 0 : -1) : index + 1
        if (songs[index]) this.encode(songs[index], callback)
    },

    random(songs, callback) {
        const index = Math.floor(Math.random() * songs.length)
        if (songs[index]) this.encode(songs[index], callback)
    }
}

export default PLAYER
