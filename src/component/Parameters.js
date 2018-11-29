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

    componentWillReceiveProps(props) {
        this.setState({ version: props.version })
    }

    closeModal = () => {
        this.setState({ open: false }, () => {
            window.Nucleus.track("CLOSED_PARAMETERS")
        })
    }

    handleLibraryChange = event => {
        this.setState({ libraryDirectory: event.target.value })
    }

    handleScanAlertChange = event => {
        this.setState({ scanAlert: event.target.checked }, () => {
            this.handleParameterUpdate('scanAlert')
        })
    }

    handleCheckVersionChange = event => {
        this.setState({ autoCheckVersion: event.target.checked }, () => {
            this.handleParameterUpdate('autoCheckVersion')
        })
    }

    handleBetaChange = event => {
        this.setState({ betaVersions: event.target.checked }, () => {
            this.handleParameterUpdate('betaVersions')
        })
    }

    handleParameterUpdate = updated => {
        window.ipcRenderer.send('parameters:update', {
            name: updated,
            value: this.state[updated]
        })
    }

    handleSearchVersion = () => {
        console.log('button');
        window.ipcRenderer.send('parameters:checkVersion')
        window.ipcRenderer.on('parameters:checkVersion:reply', (event, version) => {
            this.setState({ version }, () => {
                console.log(version);
            })
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
                        <input className="checkbox__input" type="checkbox" onChange={this.handleScanAlertChange} defaultChecked={this.state.scanAlert} />
                        <i className="checkmark fas fa-check"></i>
                    </label>
                </section>
            </section>
            <section name="Advanced">
                <section className="modal-body__section">
                    <label className="modal-body__text checkbox">Search for a new version at startup
                        <input className="checkbox__input" type="checkbox" onChange={this.handleCheckVersionChange} defaultChecked={this.state.autoCheckVersion} />
                        <i className="checkmark fas fa-check"></i>
                    </label>
                    <label className="modal-body__text checkbox">Also search for beta versions
                        <input className="checkbox__input" type="checkbox" onChange={this.handleBetaChange} defaultChecked={this.state.betaVersions} />
                        <i className="checkmark fas fa-check"></i>
                    </label>
                </section>
                <section className="modal-body__section modal-body__section--update">
                    <button className="modal-body__button" type="button" onClick={this.handleSearchVersion}>Search for Updates</button>
                    <p className="modal-body__text">{this.state.version ? `New version available (${this.state.version})` : 'You\'re up to date'}</p>
                </section>
            </section>
        </Modal>
    }
}

export default Parameters
