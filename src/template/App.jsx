import React from 'react'
import Sidenav from '../component/Sidenav'
import Albums from '../component/Albums'
import Songs from '../component/Songs'
import Groups from '../component/Groups'
import Player from '../component/Player'
import Parameters from '../component/Parameters'
import Playlist from './Playlist'

function App() {
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

export default App;
