import React from 'react'

function Track(props) {
    return <li className={"track"+(props.active?" track--active":"")+(props.track.data?"":" track--unload")} onDoubleClick={() => props.onPlay(props.track)}>
        <div className="track__image">
            <div style={{backgroundImage: 'url("'+props.track.cover+'")'}}></div>
        </div>
        <div className="track__text">
            <h1>{props.track.title || props.track.filename || '\xa0'}</h1>
            <p>{props.track.artist || '\xa0'}</p>
        </div>
    </li>
}

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
