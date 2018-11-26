import React, { Component } from 'react'

class Sidenav extends Component {
    state = {
        class: this.props.className || 'sidenav'
    }

    checkActive = link => {
        const view = link.props.children instanceof Array ? link.props.children[0] : link.props.children
        if (view === this.props.active) {
            return {
                className: `${this.state.class}__link ${this.state.class}__link--active`,
            }
        } else {
            return {
                className: `${this.state.class}__link`,
                onClick: () => this.props.onClick(view)
            }
        }
    }

    render() {
        return <nav className={this.state.class}>
            <ul className={this.state.class+'__menu'}>
                {this.props.children && this.props.children.length > 0 && (
                    this.props.children.map((link, key) => React.cloneElement(link, {key, ...this.checkActive(link)}))
                )}
            </ul>
        </nav>
    }
}

export default Sidenav
