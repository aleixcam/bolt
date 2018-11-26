import React from 'react'
import ReactDOM from 'react-dom'
import Player from '../../component/Player'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Player onReference={ref => ref} song={{}} />, div)
    ReactDOM.unmountComponentAtNode(div)
});
