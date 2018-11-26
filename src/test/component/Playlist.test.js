import React from 'react'
import ReactDOM from 'react-dom'
import Playlist from '../../component/Playlist'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Playlist playlist={[]} current={{}} />, div)
    ReactDOM.unmountComponentAtNode(div)
});
