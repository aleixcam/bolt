import React from 'react'
import ReactModal from 'react-modal'
import Sidenav from './Sidenav'

ReactModal.setAppElement('#root')

function Modal() {
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

export default Modal
