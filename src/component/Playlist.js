import React from 'react'
import Track from './Track'

function Playlist(props) {
    return <nav className="playlist">
        <ul className="playlist__menu">
            {props.playlist && props.playlist.length > 0 && (
                props.playlist.map(track => <Track key={track.id} track={track} active={track.id === props.current.id} onPlay={props.onChange} />)
            )}
        </ul>
    </nav>
}

export default Playlist
