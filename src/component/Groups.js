import React, { Component } from 'react'
import Sidenav from './Sidenav'
import Header from './Header'
import Album from './Album'
import LOGIC from '../logic'

class Groups extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            group: {}
        }
    }

    componentWillMount() {
        this.setState(LOGIC.setGroupContext(this.props.group), () => {
            this.groupGroup(this.props.songs)
        })
    }

    componentWillReceiveProps(props) {
        this.groupGroup(props.songs)
    }

    groupGroup = songs => {
        window.ipcRenderer.send(`songs:${this.state.renderer}`, songs)
        window.ipcRenderer.on(`songs:${this.state.renderer}:reply`, (event, groups) => {
            groups.forEach(group => {
                if (!group[this.state.view]) group[this.state.view] = 'Unknown'
            })

            this.setState({ groups })
            if (groups.length > 0) this.setState({ group: LOGIC.hydrateGroup(groups[0]) })
        })
    }

    handleMenuClick = view => {
        this.setState({ group: LOGIC.hydrateGroup(this.state.groups.find(group => group[this.state.view] === view)) })
    }

    render() {
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
}

export default Groups
