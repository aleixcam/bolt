import React, { Component } from 'react'
import Modal from 'react-modal'
import Sidenav from './Sidenav'

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
                console.log(this.state.songs)
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

            <section className="modal-header modal-header--track">
                {this.state.songs && this.state.songs.length > 0 && (
                    <section className="track track--current">
                        <div className="track__image track__image--current">
                            <div style={{backgroundImage: 'url("'+this.state.songs[0].cover+'")'}}></div>
                        </div>
                        <div className="track__text">
                            <h1>{this.state.songs[0].title || '\xa0'}</h1>
                            <p>{this.state.songs[0].artist || '\xa0'}</p>
                            <p>{this.state.songs[0].album || '\xa0'}</p>
                        </div>
                    </section>
                )}
                
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
