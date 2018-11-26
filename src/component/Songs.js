import React, { Component } from 'react'
import LOGIC from '../logic'

class Songs extends Component {
    constructor(props){
        super(props)
        this.state = {
            columns: ['title', 'album', 'artist', 'genre', 'year']
        }
    }

    formatLabel = label => {
        return LOGIC.formatLabel(label)
    }

    render() {
        return <table className="songs" cellSpacing="0" cellPadding="0">
            <thead className="songs-head">
                <tr className="column">
                    {this.state.columns.map(column => {
                        return <th key={column} className="column__cell">{this.formatLabel(column)}</th>
                    })}
                </tr>
            </thead>
            <tbody className="songs-body">
                {this.props.songs && this.props.songs.length > 0 && (
                    this.props.songs.map((song, index) => {
                        return <tr key={song.id} className={'selectable song '+(index % 2 ? 'song--even' : 'song--odd')} onDoubleClick={() => this.props.onPlay([song])}>
                            <input type="hidden" value={song.id} />
                            {this.state.columns.map(column => {
                                return <td key={column} className={"song__cell song__cell--"+column}>{song[column]}</td>
                            })}
                        </tr>
                    })
                )}
            </tbody>
        </table>
    }
}

export default Songs
