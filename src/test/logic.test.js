import LOGIC from '../logic'
import SongsTable from '../../public/model/table/songs'

describe('formating key into a label', () => {
    test('format username to equal Username', () => {
        expect(LOGIC.formatLabel('username')).toBe('Username')
    })

    test('format confirm_password to equal Confirm Password', () => {
        expect(LOGIC.formatLabel('confirm_password')).toBe('Confirm Password')
    })

    test('not fail on empty string', () => {
        expect(LOGIC.formatLabel('')).toBe('')
    })

    test('fail on empty argument', () => {
        expect(() => {
            LOGIC.formatLabel()
        }).toThrow('Invalid argument passed as label');
    })

    test('fail on non string argument', () => {
        expect(() => {
            LOGIC.formatLabel(123)
        }).toThrow('Invalid argument passed as label');
    })
})

describe('format seconds into readable time', () => {
    test('format 300 to equal 5:00', () => {
        expect(LOGIC.secondsToTime(300)).toBe('5:00')
    })

    test('fail on empty argument', () => {
        expect(() => {
            LOGIC.secondsToTime()
        }).toThrow('Invalid argument passed as time');
    })

    test('fail on non integer argument', () => {
        expect(() => {
            LOGIC.secondsToTime('300')
        }).toThrow('Invalid argument passed as time');
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
})
