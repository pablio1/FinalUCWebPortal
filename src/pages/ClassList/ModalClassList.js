import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';


export default class ModalClassList extends Component {
    state = {
        showModal: true
    }
    closeModal = () => {
        this.setState({
            showModal: false
        })
    }
    render() {
        const { showModal } = this.state;
        return (
            <div className={"modal " + (showModal ?  "is-active " : "")}>
                <div className="modal-background" onClick={this.closeModal}></div>
                <div className="modal-content">
                    
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
            </div>
        )
    }
               
}