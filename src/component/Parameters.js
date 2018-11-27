import React, { Component } from 'react'
import Modal from './Modal'

class Parameters extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    componentWillMount() {
        const parameters = window.ipcRenderer.sendSync('parameters:retrieve')
        this.setState({ ...parameters })

        window.ipcRenderer.on('modal:parameters', event => {
            this.setState({ open: true }, () => {
                window.Nucleus.track("OPENED_PARAMETERS")
            })
        })
    }

    closeModal = () => {
        this.setState({ open: false }, () => {
            window.Nucleus.track("CLOSED_PARAMETERS")
        })
    }

    handleLibraryChange = event => {
        this.setState({ libraryDirectory: event.target.value })
    }

    handleParameterUpdate = updated => {
        window.ipcRenderer.send('parameters:update', {
            name: updated,
            value: this.state[updated]
        })
    }

    render() {
        return <Modal onClose={this.closeModal} open={this.state.open} default="Library">
            <section name="Library">
                <p className="modal-body__text">All operations with your music within Bolt will be done here</p>
                <input type="text" className="modal-body__input" onChange={this.handleLibraryChange} onBlur={() => this.handleParameterUpdate('libraryDirectory')} defaultValue={this.state.libraryDirectory} />
            </section>
            <section name="Notifications"></section>
            <section name="Advanced"></section>
        </Modal>
    }
}

export default Parameters
