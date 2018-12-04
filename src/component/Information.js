import React, { Component } from 'react'
import Modal from 'react-modal'
import Sidenav from './Sidenav'
import LOGIC from '../logic'

Modal.setAppElement('#root')

class Information extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            view: 'Details'
        }
    }

    componentWillMount() {
        window.ipcRenderer.on('modal:information', (event, songs) => {
            const information = LOGIC.retrieveInfo(songs)
            this.setState({ open: true, ...information }, () => {
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

    setDefaultValue = input => {
        return (this.state[input]+'').startsWith('%') ? {placeholder: this.state[input].substr(1)} : {defaultValue: this.state[input]}
    }

    render() {
        return <Modal isOpen={this.state.open} className="modal" overlayClassName="modal-overlay">
            <Sidenav onClick={this.handleMenuClick} active={this.state.view}>
                <li>Details</li>
                <li>Cover</li>
                <li>File</li>
            </Sidenav>

            <section className="modal-header modal-header--track">
                {this.state.open && (
                    <section className="track track--current">
                        <div className="track__image track__image--current">
                            <div style={{backgroundImage: 'url("'+this.state.cover+'")'}}></div>
                        </div>
                        <div className="track__text">
                            <h1>{(this.state.title.startsWith('%') ? this.state.title.substr(1) : this.state.title) || '\xa0'}</h1>
                            <p>{this.state.artist || '\xa0'}</p>
                            <p>{this.state.album || '\xa0'}</p>
                        </div>
                    </section>
                )}

                <button className="modal-header__button" onClick={this.closeModal}>
                    <span className="fas fa-times"></span>
                </button>
            </section>

            {this.state.open && (
                <section className="modal-body">
                    <section className={'modal-body__view'+(this.state.view==='Details'?' modal-body__view--active':'')}>
                        <form className="modal-body__section">
                            <div className="modal-body__group">
                                <label className="modal-body__text">Title</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeTitle} {...this.setDefaultValue('title')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Artist</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeArtist} {...this.setDefaultValue('artist')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Album</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeAlbum} {...this.setDefaultValue('album')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Album artist</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeAlbumartist} {...this.setDefaultValue('albumartist')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Genre</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeGenre} {...this.setDefaultValue('genre')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Year</label>
                                <input type="text" className="modal-body__input" onChange={this.handleChangeYear} {...this.setDefaultValue('year')} />
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Track</label>
                                <div className="modal-body__inline">
                                    <input type="text" className="modal-body__input" onChange={this.handleChangeTrack} {...this.setDefaultValue('track')} />
                                    <label className="modal-body__text">of</label>
                                    <input type="text" className="modal-body__input" onChange={this.handleChangeTracks} {...this.setDefaultValue('tracks')} />
                                </div>
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Disk</label>
                                <div className="modal-body__inline">
                                    <input type="text" className="modal-body__input" onChange={this.handleChangeDisk} {...this.setDefaultValue('disk')} />
                                    <label className="modal-body__text">of</label>
                                    <input type="text" className="modal-body__input" onChange={this.handleChangeDisks} {...this.setDefaultValue('disks')} />
                                </div>
                            </div>
                            <div className="modal-body__group">
                                <label className="modal-body__text">Comment</label>
                                <textarea className="modal-body__input modal-body__input--textarea" onChange={this.handleChangeComment} {...this.setDefaultValue('comment')} />
                            </div>
                        </form>
                    </section>
                    <section className={'modal-body__view'+(this.state.view==='Cover'?' modal-body__view--active':'')}>
                    </section>
                    <section className={'modal-body__view'+(this.state.view==='File'?' modal-body__view--active':'')}>
                    </section>
                </section>
            )}
        </Modal>
    }
}

export default Information
