import React, {Component} from "react";

export default class ModalNotification extends Component { 
    state = {
        isActive: true
    } 
    closeModal = () => {
        this.setState({
            isActive: false
        })
    }
    render() {
        const { isActive , notifMessage, notifType, notifDate  } = this.props;
        const style = { danger: "is-danger", warning: "is-warning", success: "is-success", info: "is-info" };
        return (
            <div className={"modal " + (isActive ?  "is-active " : "")}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <article className={"message " + style[notifType]}>
                        <div className="message-header">
                            <p>Notification</p>
                            <button className="delete" aria-label="delete" onClick={this.closeModal}></button>
                        </div>
                        <div className="message-body">
                            <span className="is-size-6">{notifMessage}</span>
                            <br />
                            {notifDate ? <span className="is-size-7 has-text-weight-semibold">{notifDate}</span> : ""}
                        </div>
                    </article>
                </div>
            </div>     
        );
    }
}