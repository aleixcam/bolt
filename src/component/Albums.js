import React, { Component } from 'react'
import LOGIC from '../logic'

function Cover(props) {
    return <article className="cover">
        <div className="cover__image" onDoubleClick={() => props.onDoubleClick(props.album.songs)}>
            <div className="selectable" style={{backgroundImage: 'url("'+props.album.cover+'")'}}>
                {props.album.songs.map(song => <input key={song.id} type="hidden" value={song.id} />)}
            </div>
        </div>
        <small className="cover__title cover__title--small">{props.album.artist}</small>
        <h4 className="cover__title">{props.album.album}</h4>
    </article>
}

class Albums extends Component {
    constructor(props) {
        super(props)
        this.state = {
            albums: []
        }

        this.sectionAlbums = React.createRef()
    }

    componentWillMount() {
        window.ipcRenderer.send('songs:groupByAlbums', this.props.songs)
        window.ipcRenderer.on('songs:groupByAlbums:reply', (event, albums) => {
            albums.forEach((album, index) => {
                albums[index] = LOGIC.hydrateAlbum(album)
            })

            console.log(albums);
            this.setState({ albums })
        })
    }

    componentDidMount() {
        this.props.onReference(this.sectionAlbums)
        this.props.onAlign()
        window.addEventListener('resize', this.props.onAlign)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.props.onAlign)
    }

    render() {
        return <section ref={this.sectionAlbums} className="albums">
            {this.state.albums && this.state.albums.length > 0 && (
                this.state.albums.map((album, index) => {
                    return <Cover key={index} album={album} onDoubleClick={this.props.onPlay} />
                })
            )}
        </section>
    }
}

export default Albums
