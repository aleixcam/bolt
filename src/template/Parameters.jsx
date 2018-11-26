import React from 'react'
import Modal from '../component/Modal'

function Parameters() {
    return <Modal onClose={this.closeModal} open={this.state.open} default="Library">
        <section name="Library">
            <p className="modal-body__text">All operations with your music within Bolt will be done here</p>
            <input type="text" className="modal-body__input" onChange={this.handleLibraryChange} onBlur={() => this.handleParameterUpdate('libraryDirectory')} defaultValue={this.state.libraryDirectory} />
        </section>
        <section name="Notifications"></section>
        <section name="Advanced"></section>
    </Modal>
}

export default Parameters;
