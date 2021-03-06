const path = require('path')
const { Entity } = require('lilli')

class Song extends Entity {
    constructor(query) {
        super(query)

        this.id = query.id || Date.now()
        this.path = query.path
        this.filename = query.filename || path.basename(query.path).replace(/\.[^/.]+$/, '')
        this.title = query.title || null
        this.album = query.album || null
        this.artist = query.artist || null
        this.genre = query.genre || null
        this.year = query.year || null
        this.track = query.track || null
        this.disk = query.disk || null
    }
}

module.exports = Song
