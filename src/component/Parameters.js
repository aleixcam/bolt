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

    handleLibraryChange = event => {
        console.log();
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
                <section className="modal-body__section">
                    <p className="modal-body__text">Bolt library directory:</p>
                    <input type="text" className="modal-body__input" onChange={this.handleLibraryChange} onBlur={() => this.handleParameterUpdate('libraryDirectory')} defaultValue={this.state.libraryDirectory} />
                </section>
                <section className="modal-body__section">
                    <label className="modal-body__text checkbox">Show an alert when the library has finished its update
                        <input className="checkbox__input" type="checkbox" onChange={this.handleScanAlertChange} checked={this.state.scanAlert}/>
                        <i className="checkmark fas fa-check"></i>
                    </label>
                </section>
            </section>
            <section name="Advanced">
                <section className="modal-body__section modal-body__section--update">
                    <button className="modal-body__button" type="button">Search for Updates</button>
                    <p className="modal-body__text">You're up to date</p>
                </section>
                <section className="modal-body__section">
                    <label className="modal-body__text checkbox">Search for a new version at startup
                        <input className="checkbox__input" type="checkbox" onChange={this.handleCheckVersionChange} checked={this.state.autoCheckVersion}/>
                        <i className="checkmark fas fa-check"></i>
                    </label>
                    <label className="modal-body__text checkbox">Also search for beta versions
                        <input className="checkbox__input" type="checkbox" onChange={this.handleBetaChange} checked={this.state.betaVersions}/>
                        <i className="checkmark fas fa-check"></i>
                    </label>
                </section>
            </section>
        </Modal>
    }
}

export default Parameters
