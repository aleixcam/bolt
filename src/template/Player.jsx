import React from 'react'

function Player() {
    return <section className="player">
        <audio ref={this.audioPlayer} src={this.props.song.data} onTimeUpdate={this.handleTimeUpdate} onEnded={this.props.onNext}></audio>
        <label className="player__time">{this.state.ahead}</label>
        <input className="player__bar" type="range" value={this.state.progress} onMouseDown={this.handlePause} onChange={this.handleChangeProgress} onMouseUp={this.setCurrentTime} />
        <span className="player__bar player__bar--progress" style={{ width: this.state.progress+'%' }}></span>
        <label className="player__time">{this.state.left}</label>
    </section>
}

export default Player;
