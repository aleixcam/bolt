import React, { Component } from 'react'
import ReactModal from 'react-modal'
import Sidenav from './Sidenav'

class Modal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sections: [],
            section: {}
        }
    }

    componentWillMount() {
        const sections = []
        this.props.children.forEach(child => {
            sections.push({
                name: child.props.name,
                content: child.props.children
            })
        })

        this.setState({ sections, section: sections[0] })
    }

    handleMenuClick = view => {
        this.setState({ section: this.state.sections.find(section => section.name === view) })
    }

    render() {
        return <ReactModal isOpen={this.props.open} className="modal" overlayClassName="modal-overlay">
            <Sidenav onClick={this.handleMenuClick} active={this.state.section.name}>
                {this.state.sections && this.state.sections.length > 0 && (
                    this.state.sections.map((section, index) => <li key={index}>{section.name}</li>)
                )}
            </Sidenav>

            <section className="modal-header">
                <h1 className="modal-header__title">{this.state.section.name}</h1>
                <button className="modal-header__button" onClick={this.props.onClose}>
                    <span className="fas fa-times"></span>
                </button>
            </section>

            <section className="modal-body">
                <section className="modal-body__section">
                    <h1 className="modal-body__title">{this.state.section.name}</h1>
                    {this.state.section.content && this.state.section.content.length > 0 && (
                        this.state.section.content.map((child, index) => {
                            const Tag = child.type
                            return <Tag key={index} {...child.props} />
                        })
                    )}
                </section>
            </section>
        </ReactModal>
    }
}

export default Modal
