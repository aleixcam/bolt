import React from 'react'
import Sidenav from '../component/Sidenav'
import Header from './Header'
import Album from './Album'

function Groups() {
    return <section className="groups">
        <Sidenav onClick={this.handleMenuClick} active={this.state.group[this.state.view]}>
            {this.state.groups && this.state.groups.length > 0 && (
                this.state.groups.map((group, index) => <li key={index}>{group[this.state.view]}</li>)
            )}
        </Sidenav>

        {this.state.group && Object.keys(this.state.group).length > 0 && <section className="groups-body">
            <Header onPlay={() => this.props.onPlay(this.state.group.songs)} onRandom={() => this.props.onPlay(this.state.group.songs, true)} title={this.state.group[this.state.view]}>
                <span>{this.state.group.countAlbums}</span>
                <span>{this.state.group.countSongs}</span>
            </Header>

            <section className="groups-body-albums">
                {this.state.group.albums.map((album, index) => <Album key={index} onPlay={this.props.onPlay} album={album} titles={this.state.titles} />)}
            </section>
        </section>}
    </section>
}

export default Groups;
