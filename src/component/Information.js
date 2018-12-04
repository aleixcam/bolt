import React, { Component } from 'react'
import Modal from 'react-modal'
import Sidenav from './Sidenav'
import Track from './Track'
import LOGIC from '../logic'

Modal.setAppElement('#root')

class Information extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            view: 'Details',
            songs: []
        }
    }

    componentWillMount() {
        window.ipcRenderer.on('modal:information', (event, songs) => {
            this.setState({ open: true, songs }, () => {
                window.Nucleus.track("OPENED_INFORMATION")
            })
        })
    }

    handleMenuClick = view => {
        this.setState({ view })
    }

    closeModal = () => {
        this.setState({ open: false }, () => {
            window.Nucleus.track("CLOSED_INFORMATION")
        })
    }

    render() {
        return <Modal isOpen={this.state.open} className="modal" overlayClassName="modal-overlay">
            <Sidenav onClick={this.handleMenuClick} active={this.state.view}>
                <li>Details</li>
                <li>Cover</li>
                <li>File</li>
            </Sidenav>

            <section className="modal-header">
                <Track className="modal-header__track" track={this.state.song} onPlay={null} />)
                <button className="modal-header__button" onClick={this.closeModal}>
                    <span className="fas fa-times"></span>
                </button>
            </section>

            <section className="modal-body">
                <section className={'modal-body__view'+(this.state.view==='Details'?' modal-body__view--active':'')}>
                </section>
                <section className={'modal-body__view'+(this.state.view==='Cover'?' modal-body__view--active':'')}>
                </section>
                <section className={'modal-body__view'+(this.state.view==='File'?' modal-body__view--active':'')}>
                </section>
            </section>
        </Modal>
    }
}

export default Information
