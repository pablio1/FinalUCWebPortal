import React, {Component} from "react";

export default class ModalImage extends Component {  
    closeModal = () => {
        this.props.handleOnCloseImageModal();
    }
    render() {
        const { documentPath , showImageModal } = this.props;
        return (
            <div className={"modal " + (showImageModal ?  "is-active " : "")} onClick={this.closeModal}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <img src={documentPath} alt="" />
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
            </div>     
        );
    }
}