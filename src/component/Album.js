import React from 'react'
import { ContextMenuTrigger } from "react-contextmenu";
import Header from './Header'

function Album(props) {
    return <article className="album">
        <section className="cover">
            <div className="cover__image">
                <div style={{backgroundImage: 'url("'+props.album.cover+'")'}}></div>
            </div>
            <p className="cover__title">{props.album.count}</p>
        </section>
        <section className="album-songs">
            <Header onPlay={() => props.onPlay(props.album.songs)} onRandom={() => props.onPlay(props.album.songs, true)} title={props.album.album}>
                {props.titles.map((title, index) => <span key={index}>{props.album[title]}</span>)}
            </Header>

            {props.album.disks.map((disk, index) => <ul key={index} className="album-songs__disk">
                {disk && <li className="song song--disk">{`Disk ${disk}`}</li>}
                {props.album.songs.reduce((filtered, song) => {
                    if (song.disk === disk) {
                        filtered.push(<ContextMenuTrigger key={song.id} id="song">
                            <li className="song selectable" onDoubleClick={() => props.onPlay([song])}>
                                <p className="song__track">{song.track}</p>
                                <p className="song__title">{song.title}</p>
                                <input type="hidden" value={song.id} />
                            </li>
                        </ContextMenuTrigger>)
                    }

                    return filtered;
                }, [])}
            </ul>)}
        </section>
    </article>
}

export default Album
