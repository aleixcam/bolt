import PLAYER from '../../logic/player'

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

    describe('encode', () => {
        test('fail on non-function callback', () => {
            expect(() => {
                PLAYER.encode(songs, false, '')
            }).toThrow('callback is not a function');
        })
    })

    describe('play', () => {
        test('default', () => {
            PLAYER.play(songs, false, mockCallback)

            expect(mockCallback.mock.results[0].value).toBe(songs[0])
        })

        test('on shuffle', () => {
            PLAYER.play(songs, true, mockCallback)

            expect(mockCallback.mock.results[0].value).toBeInstanceOf(Object)
        })

        test('fail on non-function callback', () => {
            expect(() => {
                PLAYER.play(songs, false, '')
            }).toThrow('callback is not a function');
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.play(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.play(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })
    })

    describe('previous', () => {
        test('default', () => {
            PLAYER.previous(songs, songs[2], false, mockCallback)

            expect(mockCallback.mock.results[0].value).toEqual(songs[1])
        })

        test('on first', () => {
            PLAYER.previous(songs, songs[0], false, mockCallback)

            expect(mockCallback.mock.results.length).toBe(0)
        })

        test('on first with repeat', () => {
            PLAYER.previous(songs, songs[0], true, mockCallback)

            expect(mockCallback.mock.results[0].value).toEqual(songs[songs.length - 1])
        })

        test('fail on non-function callback', () => {
            expect(() => {
                PLAYER.previous(songs, songs[2], false, '')
            }).toThrow('callback is not a function');
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.previous(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.previous(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })
    })

    describe('next', () => {
        test('default', () => {
            PLAYER.next(songs, songs[1], false, false, mockCallback)

            expect(mockCallback.mock.results[0].value).toEqual(songs[2])
        })

        test('on last', () => {
            PLAYER.next(songs, songs[songs.length - 1], false, false, mockCallback)

            expect(mockCallback.mock.results.length).toBe(0)
        })

        test('on last with repeat', () => {
            PLAYER.next(songs, songs[songs.length - 1], false, true, mockCallback)

            expect(mockCallback.mock.results[0].value).toEqual(songs[0])
        })

        test('fail on non-function callback', () => {
            expect(() => {
                PLAYER.next(songs, songs[1], false, false, '')
            }).toThrow('callback is not a function');
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.next(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.next(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })
    })

    describe('shuffle', () => {
        test('default', () => {
            PLAYER.random(songs, mockCallback)

            expect(mockCallback.mock.results[0].value).toBeInstanceOf(Object)
        })

        test('fail on non-function callback', () => {
            expect(() => {
                PLAYER.random(songs, '')
            }).toThrow('callback is not a function');
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.random(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.random(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })
    })

    describe('add next', () => {
        test('add after current song', () => {
            expect(PLAYER.addNext(songs, songs, 2)).toBeInstanceOf(Object)
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.addNext(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.addNext(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on empty argument', () => {
            let playlist
            expect(() => {
                PLAYER.addNext(songs, playlist)
            }).toThrow(`Invalid argument ${playlist}`);
        })

        test('fail on non array argument', () => {
            let playlist = ''
            expect(() => {
                PLAYER.addNext(songs, playlist)
            }).toThrow(`Invalid argument ${playlist}`);
        })

        test('fail on empty argument', () => {
            let current
            expect(() => {
                PLAYER.addNext(songs, songs, current)
            }).toThrow(`Invalid argument ${current}`);
        })

        test('fail on non array argument', () => {
            let current = ''
            expect(() => {
                PLAYER.addNext(songs, songs, current)
            }).toThrow(`Invalid argument ${current}`);
        })
    })

    describe('add last', () => {
        test('add at the end of the current plalist', () => {
            expect(PLAYER.addLast(songs, songs)).toBeInstanceOf(Object)
        })

        test('fail on empty argument', () => {
            let songs
            expect(() => {
                PLAYER.addLast(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on non array argument', () => {
            let songs = ''
            expect(() => {
                PLAYER.addLast(songs)
            }).toThrow(`Invalid argument ${songs}`);
        })

        test('fail on empty argument', () => {
            let playlist
            expect(() => {
                PLAYER.addLast(songs, playlist)
            }).toThrow(`Invalid argument ${playlist}`);
        })

        test('fail on non array argument', () => {
            let playlist = ''
            expect(() => {
                PLAYER.addLast(songs, playlist)
            }).toThrow(`Invalid argument ${playlist}`);
        })
    })
})
