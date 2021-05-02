import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { truncateStringAddEllipses } from '../../helpers/helper';

export default class NotificationBell extends Component {
    state = {
        isActive: false
    }
    toggleDropdown = e => {
        const { isActive } = this.state;
        this.setState({ isActive: !isActive });
    }
    handleMarkRead = e => {
        this.props.allRead();
    }
    /* ========== Notification Reponse Data ========
    "id": 1,
    "read": 0,
    "message": "Greg",
    "dte": "12/11/2020 12:00:00 am"
    */
    render() {
        const {items, route} = this.props;
        const {isActive} = this.state;        
        const unreadItems = items ? items.filter(item => item.read === 0) : [];

        const notifications = unreadItems ? unreadItems.map((item, index) => {
            let styleClass = (item.message.indexOf("has been declined") >= 0 || item.message.indexOf("has been disapproved") >= 0 || item.message.indexOf("dissolved subject:") >= 0) ? "is-danger" : "is-info";
            styleClass = (item.message.indexOf("cancelled") >= 0) ? "is-danger" : styleClass;
            styleClass = (item.message.indexOf("has been approved") >= 0) ? "is-success" : styleClass;
            return (
                <div className="dropdown-item" key={index}>
                    <Link to={route + "/" + item.id} >
                        <article className={"message is-small " + (item.read === 1 ? "" : styleClass)} >
                            <div className="message-body">
                                <span className="is-size-6">{truncateStringAddEllipses(item.message, 100)}</span>
                                <br />
                                <span className="is-size-7 has-text-weight-semibold">{item.dte}</span>
                            </div>
                        </article>
                    </Link>  
                </div>  
            )          
        }) : ""; 
        return(            
            <div className={"dropdown is-right mt-2 mr-4 pb-0 " + (isActive ?  "is-active" : "") } onClick={this.toggleDropdown}>
                <div className="dropdown-trigger is-clickable">                                            
                    <div className="" aria-haspopup="true" aria-controls="dropdown-notifications">  
                        {
                            unreadItems.length === 0 ? "" : <span title="" className="badge is-danger">{unreadItems.length}</span>
                        }                                            
                        <span><i className="fas fa-bell is-size-4"></i></span>                                            
                    </div>
                </div>
                <div className="dropdown-menu" id="dropdown-notifications" role="menu" style={{ marginRight: "-1.0rem", width: "447px" }}>
                    <div className="dropdown-content">
                        <div className="dropdown-item">
                            <button className="button is-text is-small is-fullwidth" disabled={notifications.length === 0 ? true : false}
                                onClick={this.handleMarkRead}
                            >
                                Mark all as read
                            </button>                            
                        </div>
                        <div style={{ maxHeight: "50em", overflow: "auto" }}>
                            {notifications.length > 0 ? notifications : <div className="dropdown-item has-text-centered"><strong>No New Notifications</strong></div>}
                        </div>                        
                        <div className="dropdown-item">
                            <Link to={route} className="button is-small is-fullwidth">
                                View All Notifications
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}