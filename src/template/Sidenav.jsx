import React from 'react'

function Sidenav() {
    return <nav className={this.state.class}>
        <ul className={this.state.class+'__menu'}>
            {this.props.children && this.props.children.length > 0 && (
                this.props.children.map((link, key) => React.cloneElement(link, {key, ...this.checkActive(link)}))
            )}
        </ul>
    </nav>
}

export default Sidenav;
