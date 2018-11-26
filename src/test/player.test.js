import PLAYER from '../logic/player'

describe('player', () => {
    let mockCallback, songs = []
    for (var i = 0; i < 5; i++) {
        songs.push({
            id: i,
            data: 'dummy'
        })
    }

    beforeEach(() => {
        mockCallback = jest.fn(track => track)
    })

    test('play', () => {
        PLAYER.play(songs, false, mockCallback)

        expect(mockCallback.mock.results[0].value).toBe(songs[0])
    })

    test('shuffle play', () => {
        PLAYER.play(songs, true, mockCallback)

        expect(mockCallback.mock.results[0].value).toBeInstanceOf(Object)
    })

    test('previous', () => {
        PLAYER.previous(songs, songs[2], false, mockCallback)

        expect(mockCallback.mock.results[0].value).toEqual(songs[1])
    })

    test('previous on first', () => {
        PLAYER.previous(songs, songs[0], false, mockCallback)

        expect(mockCallback.mock.results.length).toBe(0)
    })

    test('previous on first with repeat', () => {
        PLAYER.previous(songs, songs[0], true, mockCallback)

        expect(mockCallback.mock.results[0].value).toEqual(songs[songs.length - 1])
    })

    test('next', () => {
        PLAYER.next(songs, songs[1], false, false, mockCallback)

        expect(mockCallback.mock.results[0].value).toEqual(songs[2])
    })

    test('next on last', () => {
        PLAYER.next(songs, songs[songs.length - 1], false, false, mockCallback)

        expect(mockCallback.mock.results.length).toBe(0)
    })

    test('next on last with repeat', () => {
        PLAYER.next(songs, songs[songs.length - 1], false, true, mockCallback)

        expect(mockCallback.mock.results[0].value).toEqual(songs[0])
    })

    test('shuffle', () => {
        PLAYER.random(songs, mockCallback)

        expect(mockCallback.mock.results[0].value).toBeInstanceOf(Object)
    })
})
