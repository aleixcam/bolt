import React from 'react'
import Cover from './Cover'

function Albums() {
    return <section ref={this.sectionAlbums} className="albums">
        {this.state.albums && this.state.albums.length > 0 && (
            this.state.albums.map((album, index) => {
                return <Cover key={index} album={album} onDoubleClick={this.props.onPlay} />
            })
        )}
    </section>
}

export default Albums;
