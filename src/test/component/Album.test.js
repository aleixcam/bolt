import React from 'react'
import ReactDOM from 'react-dom'
import Album from '../../component/Album'

it('renders without crashing', () => {
    const div = document.createElement('div')
    const album = {
        album: 'Absolution',
        artist: 'Muse',
        genre: 'Rock',
        year: '2004',
        cover: '',
        count: 0,
        disks: [],
        songs: []
    }

    ReactDOM.render(<Album album={album} titles={[]} />, div)
    ReactDOM.unmountComponentAtNode(div)
});
