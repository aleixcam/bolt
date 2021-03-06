import LOGIC from '../../logic'

describe('formating key into a label', () => {
    test('format username to equal Username', () => {
        expect(LOGIC.formatLabel('username')).toBe('Username')
    })

    test('format confirm_password to equal Confirm Password', () => {
        expect(LOGIC.formatLabel('confirm_password')).toBe('Confirm Password')
    })

    test('success on empty string', () => {
        expect(LOGIC.formatLabel('')).toBe('')
    })

    test('fail on empty argument', () => {
        let label
        expect(() => {
            LOGIC.formatLabel(label)
        }).toThrow(`Invalid argument ${label}`);
    })

    test('fail on non string argument', () => {
        let label = 123
        expect(() => {
            LOGIC.formatLabel(label)
        }).toThrow(`Invalid argument ${label}`);
    })
})

describe('format seconds into readable time', () => {
    test('format 300 to equal 5:00', () => {
        expect(LOGIC.secondsToTime(300)).toBe('5:00')
    })

    test('success on 0 seconds', () => {
        expect(LOGIC.secondsToTime(0)).toBe('0:00')
    })

    test('fail on empty argument', () => {
        let time
        expect(() => {
            LOGIC.secondsToTime(time)
        }).toThrow(`Invalid argument ${time}`);
    })

    test('fail on non integer argument', () => {
        let time = '30'
        expect(() => {
            LOGIC.secondsToTime(time)
        }).toThrow(`Invalid argument ${time}`);
    })
})

describe('count songs and albums', () => {
    let arr
    describe('count 0', () => {
        beforeEach(() => {
            arr = []
        })

        test('songs', () => {
            expect(LOGIC.countSongs(arr)).toBe('0 songs')
        })

        test('albums', () => {
            expect(LOGIC.countAlbums(arr)).toBe('0 albums')
        })
    })

    describe('count 1', () => {
        beforeEach(() => {
            arr = [1]
        })

        test('songs', () => {
            expect(LOGIC.countSongs(arr)).toBe('1 song')
        })

        test('albums', () => {
            expect(LOGIC.countAlbums(arr)).toBe('1 album')
        })
    })

    describe('count +1', () => {
        beforeEach(() => {
            arr = [1, 2, 3, 4, 5]
        })

        test('songs', () => {
            expect(LOGIC.countSongs(arr)).toBe('5 songs')
        })

        test('albums', () => {
            expect(LOGIC.countAlbums(arr)).toBe('5 albums')
        })
    })

    describe('fail on non array', () => {
        beforeEach(() => {
            arr = ''
        })

        test('songs', () => {
            expect(() => {
                LOGIC.countSongs(arr)
            }).toThrow(`Invalid argument ${arr}`);
        })

        test('albums', () => {
            expect(() => {
                LOGIC.countAlbums(arr)
            }).toThrow(`Invalid argument ${arr}`);
        })
    })
})

describe('delete songs', () => {
    test('fail on empty argument', () => {
        let songs
        expect(() => {
            LOGIC.deleteSongs(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })

    test('fail on non array argument', () => {
        let songs = ''
        expect(() => {
            LOGIC.deleteSongs(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })

    test('fail on non-function callback', () => {
        expect(() => {
            LOGIC.deleteSongs([], '')
        }).toThrow('callback is not a function');
    })
})

describe('retrieve information from songs', () => {
    test('fail on empty argument', () => {
        let songs
        expect(() => {
            LOGIC.retrieveInfo(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })

    test('fail on non array argument', () => {
        let songs = ''
        expect(() => {
            LOGIC.retrieveInfo(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })

    test('fail on non-function callback', () => {
        expect(() => {
            LOGIC.retrieveInfo([], '')
        }).toThrow('callback is not a function');
    })
})

describe('retrieve covers from songs', () => {
    let songs
    beforeEach(() => {
        songs = [
            {
                id: 1,
                cover: 'data:image/asdf'
            },
            {
                id: 2,
                cover: 'placeholder'
            },
            {
                id: 3,
                cover: 'data:image/qwerty'
            }
        ]
    })

    test('retrieve only real encoded images', () => {
        const expected = ['data:image/asdf', 'data:image/qwerty']
        expect(LOGIC.retrieveCovers(songs)).toEqual(expect.arrayContaining(expected))
    })

    test('empty array with no songs passed', () => {
        expect(LOGIC.retrieveCovers([])).toEqual(expect.arrayContaining([]))
    })

    test('fail on empty argument', () => {
        let songs
        expect(() => {
            LOGIC.retrieveCovers(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })

    test('fail on non array argument', () => {
        let songs = ''
        expect(() => {
            LOGIC.retrieveCovers(songs)
        }).toThrow(`Invalid argument ${songs}`);
    })
})
