import React from 'react'
import ReactDOM from 'react-dom'
import Songs from '../../component/Songs'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Songs songs={[]} />, div)
    ReactDOM.unmountComponentAtNode(div)
});
