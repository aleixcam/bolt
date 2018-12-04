import React from 'react'

function Track(props) {
    return <li className={"track"+(props.active?" track--active":"")+(props.track.data?"":" track--unload")} onDoubleClick={() => props.onPlay(props.track)}>
        <div className="track__image">
            <div style={{backgroundImage: 'url("'+props.track.cover+'")'}}></div>
        </div>
        <div className="track__text">
            <h1>{props.track.title || '\xa0'}</h1>
            <p>{props.track.artist || '\xa0'}</p>
        </div>
    </li>
}

export default Track
