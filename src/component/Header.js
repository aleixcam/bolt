import React from 'react'

function Header(props) {
    return <section className="header">
        <div className="header-title">
            <h2 className="header__title">{props.title}</h2>
            {props.children && props.children.length > 0 && (
                props.children.map((child, index) => {
                    return child.props.children ? <small key={index} className="header__small">{child.props.children}</small> : ''
                })
            )}
        </div>
        <div className="header-buttons">
            <button className="header__button"><span className="fas fa-play" onClick={props.onPlay}></span></button>
            <button className="header__button"><span className="fas fa-random" onClick={props.onRandom}></span></button>
        </div>
    </section>
}

export default Header
