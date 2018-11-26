import React, { Component } from 'react'
import Sidenav from './Sidenav'
import Albums from './Albums'
import Songs from './Songs'
import Groups from './Groups'
import Player from './Player'
import Parameters from './Parameters'
import Playlist from './Playlist'
import LOGIC from '../logic'
import PLAYER from '../logic/player'
import createSelection from '../logic/selection'

class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            songs: [],
            selection: createSelection(),
            view: 'Albums',
            currentSong: {},
            currentPlaylist: [],
            open: false,
            playing: false,
            shuffle: false,
            repeat: 1
        }
    }

    componentWillMount() {
        this.retrieveSongs()
        window.ipcRenderer.on('scan:end', event => this.retrieveSongs())
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleMainClick)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleMainClick)
    }

    retrieveSongs = () => {
        const songs = window.ipcRenderer.sendSync('songs:retrieve')
        this.setState({ songs })
    }

    handleMenuClick = view => {
        this.setState({ view })
    }


    /******************************************************************************************/
    /**** MAIN ********************************************************************************/
    /******************************************************************************************/

    setAlbumsReference = ref => {
        this.sectionAlbums = ref
    }

    alignAlbums = () => {
        if (this.state.view === 'Albums') {
            let px, columns = 0
            let width = this.sectionAlbums.current.offsetWidth - (parseFloat(getComputedStyle(this.sectionAlbums.current).paddingLeft) + parseFloat(getComputedStyle(this.sectionAlbums.current).paddingRight))

            do {
                columns++
                px = Math.floor(width / columns)
            } while (px > 200)
            this.sectionAlbums.current.style.gridTemplateColumns = "repeat(" + columns + ", " + columns + "fr)"
        }
    }

    handleCurrentClick = () => {
        this.setState({open: !this.state.open}, this.alignAlbums)
    }

    handleClosePlaylist = () => {
        this.setState({open: false}, this.alignAlbums)
    }

    handleMainClick = event => {
        let result = false;
        for (var i = 0; i < event.path.length; i++) {
            if (event.path[i].classList && event.path[i].classList.contains('selectable')) {
                result = true
                break
            }
        }

        if (!result) {
            this.state.selection.getSelection().forEach(s => s.classList.remove('selected'))
            this.state.selection.clearSelection()
        }
    }


    /******************************************************************************************/
    /**** PLAYER ******************************************************************************/
    /******************************************************************************************/

    setPlayerReference = ref => {
        this.audioPlayer = ref
    }

    handlePlay = (songs, shuffle = false) => {
        const selection = this.state.selection.getSelection()
        selection.forEach(selected => {
            Array.from(selected.children).forEach(child => {
                if (child.nodeName === 'INPUT' && child.type === 'hidden') {
                    const song = this.state.songs.find(song => song.id === parseInt(child.defaultValue, 10))
                    if (song && !songs.find(playing => song.id === playing.id)) {
                        songs.push(song)
                    }
                }
            })
        })

        shuffle = this.state.shuffle || shuffle
        PLAYER.play(songs, shuffle, song => {
            this.setState({ playing: true, currentSong: song, currentPlaylist: songs, shuffle }, () => {
                this.audioPlayer.current.currentTime = 0
                this.audioPlayer.current.play()
            })
        })
    }

    handlePlayPause = () => {
        if (this.state.currentPlaylist.length <= 0) this.handlePlay(this.state.songs)
        this.audioPlayer.current.paused ? this.audioPlayer.current.play() : this.audioPlayer.current.pause()
        this.setState({ playing: !this.audioPlayer.current.paused })
    }

    handleShuffle = () => {
        this.setState({ shuffle: !this.state.shuffle })
    }

    handleRepeat = () => {
        this.setState({ repeat: this.state.repeat === 2 ? 0 : this.state.repeat + 1 })
    }

    handleBackwards = () => {
        if (this.audioPlayer.current.currentTime > 5) {
            this.audioPlayer.current.currentTime = 0
        } else {
            PLAYER.previous(this.state.currentPlaylist, this.state.currentSong, this.state.repeat, song => {
                this.setState({ currentSong: song }, () => {
                    this.audioPlayer.current.currentTime = 0
                    this.audioPlayer.current.play()
                })
            })
        }
    }

    handleForwards = () => {
        PLAYER.next(this.state.currentPlaylist, this.state.currentSong, this.state.shuffle, this.state.repeat, song => {
            this.setState({ currentSong: song }, () => {
                this.audioPlayer.current.currentTime = 0
                this.audioPlayer.current.play()
            })
        })
    }

    handleNext = () => {
        this.audioPlayer.current.currentTime = 0
        if (this.state.repeat === 2) {
            this.audioPlayer.current.play()
        } else {
            PLAYER.next(this.state.currentPlaylist, this.state.currentSong, this.state.shuffle, this.state.repeat, song => {
                this.setState({ currentSong: song }, () => {
                    this.audioPlayer.current.play()
                })
            })
        }

        this.setState({ playing: !this.audioPlayer.current.paused })
    }

    handleChangeCurrent = track => {
        LOGIC.getEncoded(track)
            .then(data => Object.assign(track, { data }))
            .then(song => this.setState({ currentSong: song }, () => this.audioPlayer.current.play()))
    }

    render() {
        return <div className={this.state.open ? "app open" : "app"}>
            <Sidenav onClick={this.handleMenuClick} active={this.state.view}>
                <li>Albums<span className="fas fa-square"></span></li>
                <li>Artists<span className="fas fa-male"></span></li>
                <li>Songs<span className="fas fa-music"></span></li>
                <li>Genres<span className="fas fa-drum"></span></li>
                <li>Years<span className="far fa-calendar"></span></li>
            </Sidenav>

            <main className="main">
                <section className="main-header">
                    <h1 className="main-header__title">{this.state.view}</h1>
                </section>

                <section className="main__body">
                    {this.state.view === 'Albums' ? <Albums onReference={this.setAlbumsReference} onAlign={this.alignAlbums} onPlay={this.handlePlay} songs={this.state.songs} /> : ''}
                    {this.state.view === 'Artists' ? <Groups onPlay={this.handlePlay} group="artists" songs={this.state.songs} /> : ''}
                    {this.state.view === 'Songs' ? <Songs onPlay={this.handlePlay} songs={this.state.songs} /> : ''}
                    {this.state.view === 'Genres' ? <Groups onPlay={this.handlePlay} group="genres" songs={this.state.songs} /> : ''}
                    {this.state.view === 'Years' ? <Groups onPlay={this.handlePlay} group="decades" songs={this.state.songs} /> : ''}
                </section>
            </main>

            <section className="control control--player">
                <button className="control__button control__button--small" onClick={this.handleBackwards}>
                    <span className="fas fa-backward"></span>
                </button>
                <button className="control__button" onClick={this.handlePlayPause}>
                    <span className={this.state.playing ? "fas fa-pause" : "fas fa-play"}></span>
                </button>
                <button className="control__button control__button--small" onClick={this.handleForwards}>
                    <span className="fas fa-forward"></span>
                </button>
            </section>

            <Player onReference={this.setPlayerReference} onNext={this.handleNext} song={this.state.currentSong} />

            <aside className={"current"+(this.state.currentPlaylist.length>0?"":" current--empty")}>
                <section className="track track--current" onClick={this.handleCurrentClick}>
                    <div className="track__image track__image--current">
                        <div style={{backgroundImage: 'url("'+this.state.currentSong.cover+'")'}}></div>
                    </div>
                    <div className="track__text">
                        <h1>{this.state.currentSong.title}</h1>
                        <p>{this.state.currentSong.artist}</p>
                        <p>{this.state.currentSong.album}</p>
                    </div>
                </section>

                <Playlist playlist={this.state.currentPlaylist} current={this.state.currentSong} onChange={this.handleChangeCurrent} />

                <section className="control control--playlist">
                    <button className={"control__button"+(this.state.shuffle?" control__button--active":"")} onClick={this.handleShuffle}>
                        <span className="fas fa-random"></span>
                    </button>
                    <button className={"control__button"+(this.state.repeat?" control__button--active":"")} onClick={this.handleRepeat}>
                        <span className={"fas fa-sync-alt"+(this.state.repeat === 2 ? " one" : "")}></span>
                    </button>
                    <button className={"control__button"+(this.state.currentPlaylist.length>0?"":" control__button--disabled")} onClick={this.handleClosePlaylist}>
                        <span className="fas fa-chevron-down"></span>
                    </button>
                </section>
            </aside>

            <Parameters />
        </div>
    }
}

export default App
