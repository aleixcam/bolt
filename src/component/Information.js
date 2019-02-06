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

        this.songsForm = React.createRef()
    }

    componentWillMount() {
        window.ipcRenderer.on('modal:information', (event, songs) => {
            const covers = LOGIC.retrieveCovers(songs)
            LOGIC.retrieveInfo(songs, info => {
                this.setState({ open: true, songs, covers, ...info }, () => {
                    window.Nucleus.track("OPENED_INFORMATION")
                })
            })
        })
    }

    handleOpen = () => {
        this.setState({ view: 'Details' })
    }

    handleMenuClick = view => {
        this.setState({ view })
    }

    closeModal = () => {
        const info = {}
        for (let i = 0; i < this.songsForm.current.elements.length; i++) {
            if (this.songsForm.current.elements[i].value) {
                info[this.songsForm.current.elements[i].name] = this.songsForm.current.elements[i].value
            }
        }

        if (info.disk || info.disks) {
            info.disk = {
                no: info.disk || null,
                of: info.disks || null
            }

            delete info.disks
        }

        if (info.track || info.tracks) {
            info.track = {
                no: info.track || null,
                of: info.tracks || null
            }

            delete info.tracks
        }

        this.setState({ open: false }, () => {
            window.ipcRenderer.send('songs:update', this.state.songs, info)
            window.Nucleus.track("CLOSED_INFORMATION")
        })
    }

    setInputProps = input => {
        const props = {
            name: input,
            onChange: event => this.handleValueChange(input, event)
        }

        if ((this.state[input]+'').startsWith('%')) {
            props.placeholder = this.state[input].substr(1)
        } else {
            props.defaultValue = this.state[input]
        }

        return props
    }

    handleValueChange = (value, event) => {
        this.setState({ [value]: event.target.value })
    }

    render() {
        return this.state.open && <Modal isOpen={this.state.open} className="modal" overlayClassName="modal-overlay" onAfterOpen={this.handleOpen}>
            <Sidenav onClick={this.handleMenuClick} active={this.state.view}>
                <li>Details</li>
                <li>Cover</li>
                {this.state.songs.length < 2 && (<li>File</li>)}
            </Sidenav>

            <section className="modal-header modal-header--track">
                {this.state.open && (
                    <section className="track track--current">
                        <div className="track__image track__image--current">
                            <div style={{backgroundImage: 'url("'+this.state.cover+'")'}}></div>
                        </div>
                        <div className="track__text">
                            <h1>{(this.state.title ? (this.state.title.startsWith('%') ? this.state.title.substr(1) : this.state.title) : this.state.filename) || '\xa0'}</h1>
                            <p>{(this.state.artist ? (this.state.artist.startsWith('%') ? this.state.artist.substr(1) : this.state.artist) : '\xa0')}</p>
                            <p>{(this.state.album ? (this.state.album.startsWith('%') ? this.state.album.substr(1) : this.state.album) : '\xa0')}</p>
                        </div>
                    </section>
                )}

                <button className="modal-header__button" onClick={this.closeModal}>
                    <span className="fas fa-times"></span>
                </button>
            </section>

            <section className="modal-body">
                <section className={'modal-body__view'+(this.state.view==='Details'?' modal-body__view--active':'')}>
                    <form ref={this.songsForm} className="modal-body__section">
                        <div className="modal-body__group">
                            <label className="modal-body__text">Title</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('title')} />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Artist</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('artist')} />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Album</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('album')} />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Album artist</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('albumartist')} />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Genre</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('genre')} />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Year</label>
                            <input type="text" className="modal-body__input" {...this.setInputProps('year')} />
                        </div>
                        {this.state.songs.length < 2 && (
                            <div className="modal-body__group">
                                <label className="modal-body__text">Track</label>
                                <div className="modal-body__inline">
                                    <input type="text" className="modal-body__input" {...this.setInputProps('track')} />
                                    <label className="modal-body__text">of</label>
                                    <input type="text" className="modal-body__input" {...this.setInputProps('tracks')} />
                                </div>
                            </div>
                        )}
                        {this.state.songs.length < 2 && (
                            <div className="modal-body__group">
                                <label className="modal-body__text">Disk</label>
                                <div className="modal-body__inline">
                                    <input type="text" className="modal-body__input" {...this.setInputProps('disk')} />
                                    <label className="modal-body__text">of</label>
                                    <input type="text" className="modal-body__input" {...this.setInputProps('disks')} />
                                </div>
                            </div>
                        )}
                        <div className="modal-body__group">
                            <label className="modal-body__text">Comment</label>
                            <textarea className="modal-body__input modal-body__input--textarea" {...this.setInputProps('comment')} />
                        </div>
                    </form>
                </section>

                <section className={'modal-body__view'+(this.state.view==='Cover'?' modal-body__view--active':'')}>
                    {this.state.covers && this.state.covers.length > 0 && (
                        this.state.covers.map((cover, index) => <article key={index} className="cover">
                            <div className="cover__image">
                                <div style={{backgroundImage: 'url("'+cover+'")'}}></div>
                            </div>
                        </article>)
                    )}
                </section>

                {this.state.songs.length < 2 && (
                    <section className={'modal-body__view'+(this.state.view==='File'?' modal-body__view--active':'')}>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Format</label>
                            <input type="text" className="modal-body__input" value={this.state.format} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Duration</label>
                            <input type="text" className="modal-body__input" value={this.state.duration} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Bit rate</label>
                            <input type="text" className="modal-body__input" value={this.state.bitrate} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Sample rate</label>
                            <input type="text" className="modal-body__input" value={this.state.samplerate} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Channels</label>
                            <input type="text" className="modal-body__input" value={this.state.channels} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Metadata tags</label>
                            <input type="text" className="modal-body__input" value={this.state.tag} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Encoder</label>
                            <input type="text" className="modal-body__input" value={this.state.encoder} readOnly />
                        </div>
                        <div className="modal-body__group">
                            <label className="modal-body__text">Location</label>
                            <textarea className="modal-body__input modal-body__input--textarea" value={this.state.path} readOnly />
                        </div>
                    </section>
                )}
            </section>
        </Modal>
    }
}

export default Information
