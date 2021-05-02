import React, {Component} from "react";

export class Modal extends Component {  
    state = {
        isActive: true
    }  
    closeModal = history => () => {
        const { isActive } = this.state;
        this.setState({ isActive: !isActive });
        history.push(this.props.route);
    }
    render() {
        const { history, content } = this.props;
        return (
            <div className={"modal " + (isActive ?  "is-active " : "")}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    {content}    
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.closeModal(history)}></button>
            </div>     
        );
    }
}