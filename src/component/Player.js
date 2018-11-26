import React, { Component } from 'react'
import LOGIC from '../logic'

class Player extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            ahead: '-:--',
            left: '-:--',
        }

        this.audioPlayer = React.createRef()
    }

    componentDidMount() {
        this.props.onReference(this.audioPlayer)
    }

    handleTimeUpdate = event => {
        if (!!this.audioPlayer.current.duration) {
            this.setState({
                progress: (event.target.currentTime / event.target.duration) * 100,
                ahead: LOGIC.secondsToTime(event.target.currentTime),
                left: '-' + LOGIC.secondsToTime(event.target.duration - event.target.currentTime)
            })
        }
    }

    handlePause = () => {
        this.audioPlayer.current.pause()
    }

    handleChangeProgress = event => {
        if (!!this.audioPlayer.current.duration) {
            this.setState({ progress: event.target.value })
        }
    }

    setCurrentTime = () => {
        if (!!this.audioPlayer.current.duration) {
            this.audioPlayer.current.currentTime = (this.audioPlayer.current.duration / 100) * this.state.progress
            this.audioPlayer.current.play()
        }
    }

    render() {
        return <section className="player">
            <audio ref={this.audioPlayer} src={this.props.song.data} onTimeUpdate={this.handleTimeUpdate} onEnded={this.props.onNext}></audio>
            <label className="player__time">{this.state.ahead}</label>
            <input className="player__bar" type="range" value={this.state.progress} onMouseDown={this.handlePause} onChange={this.handleChangeProgress} onMouseUp={this.setCurrentTime} />
            <span className="player__bar player__bar--progress" style={{ width: this.state.progress+'%' }}></span>
            <label className="player__time">{this.state.left}</label>
        </section>
    }
}

export default Player
