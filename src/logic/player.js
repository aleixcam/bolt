import LOGIC from './index'

const PLAYER = {

    /**
     *
     * @param {Song} track
     *
     * @returns {Promise}
     */
    encode(track, callback) {
        if (typeof callback !== 'function') throw Error('callback is not a function')

        if (track.data) return callback(track)
        return LOGIC.getEncoded(track)
            .then(data => Object.assign(track, { data }))
            .then(song => callback(song))
            .catch(err => console.error(err.message))
    },

    /**
     *
     * @param {Array} songs
     * @param {boolean} shuffle
     * @param {Function} callback
     *
     * @returns {Promise}
     */
    play(songs, shuffle, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function')

        const index = shuffle ? Math.floor(Math.random() * songs.length) : 0
        if (songs[index]) return this.encode(songs[index], callback)
    },

    /**
     *
     * @param {Array} songs
     * @param {Song} current
     * @param {boolean} repeat
     * @param {Function} callback
     *
     * @returns {Promise}
     */
    previous(songs, current, repeat, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function')

        let index = songs.findIndex(song => current.id === song.id)
        index = index === 0 ? (repeat ? songs.length - 1 : -1) : index - 1
        if (songs[index]) return this.encode(songs[index], callback)
    },

    /**
     *
     * @param {Array} songs
     * @param {Song} current
     * @param {boolean} shuffle
     * @param {boolean} repeat
     * @param {Function} callback
     *
     * @returns {Promise}
     */
    next(songs, current, shuffle, repeat, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function')

        if (shuffle) return this.random(songs, callback)

        let index = songs.findIndex(song => current.id === song.id)
        index = index === songs.length - 1 ? (repeat ? 0 : -1) : index + 1
        if (songs[index]) return this.encode(songs[index], callback)
    },

    /**
     *
     * @param {Array} songs
     * @param {Function} callback
     *
     * @returns {Promise}
     */
    random(songs, callback) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (typeof callback !== 'function') throw Error('callback is not a function')

        const index = Math.floor(Math.random() * songs.length)
        if (songs[index]) return this.encode(songs[index], callback)
    },

    /**
     *
     * @param {Array} songs
     * @param {Array} playlist
     * @param {number} current
     *
     * @returns {Array}
     */
    addNext(songs, playlist, current) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (!playlist || !Array.isArray(playlist)) throw Error(`Invalid argument ${playlist}`)
        if (typeof current !== 'number') throw Error(`Invalid argument ${current}`)

        songs.forEach(song => {
            const repeated = playlist.findIndex(track => track.id === song.id)
            if (repeated >= 0) playlist.splice(repeated, 1)
            playlist.splice(current + 1, 0, song)
        })

        return playlist
    },

    /**
     *
     * @param {Array} songs
     * @param {Array} playlist
     *
     * @returns {Array}
     */
    addLast(songs, playlist) {
        if (!songs || !Array.isArray(songs)) throw Error(`Invalid argument ${songs}`)
        if (!playlist || !Array.isArray(playlist)) throw Error(`Invalid argument ${playlist}`)

        songs.forEach(song => {
            if (playlist.findIndex(track => track.id === song.id) < 0) {
                playlist.push(song)
            }
        })

        return playlist
    }
}

export default PLAYER
