import React from 'react'
import ReactDOM from 'react-dom'
import Modal from '../../component/Modal'

it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Modal>
        <section name="Section"></section>
        <section name="Advanced"></section>
    </Modal>, div)
    ReactDOM.unmountComponentAtNode(div)
});
