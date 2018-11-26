import React from 'react'
import ReactDOM from 'react-dom'
import Sidenav from '../../component/Sidenav'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Sidenav />, div)
    ReactDOM.unmountComponentAtNode(div)
});
