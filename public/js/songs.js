const SongsTable = require('../model/table/songs')

const SONGS = {
    addSong(obj) {
        const songsTable = new SongsTable()
        const song = songsTable.newEntity(obj)
        return songsTable.save(song)
    },

    findAll() {
        const songsTable = new SongsTable()
        const songs = songsTable
            .order({ title: 'asc', artist: 'asc', album: 'asc', disk: 'asc', track: 'asc' })
            .all()

        return songs
    },

    groupByAlbums(songs) {
        const songsTable = new SongsTable(songs)
        const albums = songsTable
            .order({ artist: 'asc', album: 'asc', disk: 'asc', track: 'asc', title: 'asc' })
            .group(['album'])

        return albums
    },

    groupByArtists(songs) {
        const songsTable = new SongsTable(songs)
        const artists = songsTable
            .order({ artist: 'asc', album: 'asc', disk: 'asc', track: 'asc', title: 'asc' })
            .group(['artist', 'album'])

        return artists
    },

    groupByGenres(songs) {
        const songsTable = new SongsTable(songs)
        const genres = songsTable
            .order({ genre: 'asc', album: 'asc', disk: 'asc', track: 'asc', title: 'asc' })
            .group(['genre', 'album'])

        return genres
    },

    groupByDecades(songs) {
        const songsTable = new SongsTable(songs)
        const years = songsTable
            .order({ year: 'desc', album: 'asc', disk: 'asc', track: 'asc', title: 'asc' })
            .group(['year', 'album'])

        const decades = []
        years.push(years.shift())
        years.forEach(year => {
            const decadeYear = Math.floor(year.year / 10) * 10
            let index = decades.findIndex(decade => decade.decade === decadeYear)
            if (index < 0) {
                decades.push({
                    decade: decadeYear || null,
                    albums: year.albums
                })
            } else {
                decades[index].albums = decades[index].albums.concat(year.albums)
            }
        })

        return decades
    },

    update(song, query) {
        const songsTable = new SongsTable()
        song = songsTable.get(song.id)
        console.log(query);
        for (var key in query) {
            if (song.hasOwnProperty(key)) {
                switch (key) {
                    case 'year':
                        song[key] = parseInt(query[key])
                        break;
                    case 'disk':
                    case 'track':
                        song[key] = parseInt(query[key].no)
                        break;
                    default:
                        song[key] = query[key]
                }
            }
        }

        return songsTable.save(song)
    },

    delete(song) {
        const songsTable = new SongsTable()
        return songsTable.delete(song)
    }
}

module.exports = SONGS
