import React, {Component} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import store from 'store2';
import isLoggedIn from '../../helpers/isLoggedIn';
import { getLoggedUserDetails } from "../../helpers/helper";

export class Notifications extends Component {
    state= {
        notifications: null
    }
    componentDidMount() {
        if (isLoggedIn()) {
            const data = {
                id_number: getLoggedUserDetails("idnumber")
            };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            };
            axios.post(process.env.REACT_APP_API_UC_NOTIFICATIONS, data, {headers})
            .then((result) => {
                const notifications = result.data.notifications;         
                this.setState({ notifications: notifications });
                    
            });   
        }
    }
    render() {
        const { notifications } = this.state;
        const unreadNotifications = notifications ? notifications.filter(item => item.read === 0) : [];
        const notificationList = notifications ? notifications.map((item, index) => {
            let styleClass = (item.message.indexOf("has been declined") >= 0 || item.message.indexOf("has been disapproved") >= 0 || item.message.indexOf("dissolved subject:") >= 0) ? "is-danger" : "is-info";
            styleClass = (item.message.indexOf("cancelled") >= 0) ? "is-danger" : styleClass;
            styleClass = (item.message.indexOf("has been approved") >= 0) ? "is-success" : styleClass;
            return (    
                <Link to={"/notifications/" + item.id} key={index}>
                    <article className={"message is-small mt-1 " + (item.read === 1 ? "" : styleClass) } >
                        <div className="message-body pt-1 pb-1">
                            <span className="is-size-6">{item.message}</span>
                            <br />
                            <span className="is-size-7 has-text-weight-semibold">{item.dte}</span>
                        </div>    
                    </article>
                </Link>
            ) 
        }) : ""; 
        return (
            <div className="container is-fluid is-marginless is-paddingless" id="notifications">
                <div className="box is-content is-full-height ml-1" id="">
                    <div className="columns">
                        <div className="column is-4">                       
                            <button className="button is-info mb-2" disabled={unreadNotifications.length > 0 ? false : true}>
                                <span className="icon is-small">
                                    <i className="fas fa-check"></i>
                                </span>
                                <span>Mark All As Read</span>
                            </button>
                            {notificationList}
                        </div>
                        <div className="column">
                            
                        </div>    
                    </div>
                </div>
            </div>        
        );
    }
}

export const NotificationsHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-bell"></i> Notifications
    </div> 
);

export class Notification extends Component {  
    state = {
        notification: null,
        isActive: true
    }  
    componentDidMount() {
        const { match: { params } } = this.props;
        const dataGet = {
            id_number: getLoggedUserDetails("idnumber")
        };
        const dataRead = {
            id_number: "",
            notif_id: parseInt(params.notifID, 10)
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_NOTIFICATIONS, dataGet, {headers});
        const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_READ_NOTIFICATION, dataRead, {headers});
        Promise.all([apiRequest1, apiRequest2]).then(values =>  {
            if(values[0].data) {
                const notifications = values[0].data.notifications;         
                const notification = notifications.filter(item => item.id === parseInt(params.notifID, 10));
                this.setState({ notification: notification[0] });   
            } 
            if(values[1].data.success) {

            }  
        }).catch(error => {
            console.log(error);
        });

        /* DEPRECEATED
        axios.all([
            axios.post(process.env.REACT_APP_API_UC_NOTIFICATIONS, dataGet, {headers}),
            axios.post(process.env.REACT_APP_API_UC_READ_NOTIFICATION, dataRead, {headers})
        ])
        .then(axios.spread((getNotif, readNotif) => {
            if(getNotif.data) {
                const notifications = getNotif.data.notifications;         
                const notification = notifications.filter(item => item.id === parseInt(params.notifID, 10));
                this.setState({ notification: notification[0] });   
            } 
            if(readNotif.data.success) {

            } 
        })); */

    }
    closeModal = history => () => {
        const { isActive } = this.state;
        this.setState({ isActive: !isActive }, () => history.goBack() );
        //history.goBack();
        //history.goBack();
        //history.push('/');
    }
    render() {
        const { history } = this.props;
        const { isActive, notification } = this.state;
        const notifMsg = (notification) ? notification.message : "";
        const notifStatus = (notification) ? notification.read : "";
        const notifDate = (notification) ? notification.dte : "";
        let styleClass = (notifMsg.indexOf("has been declined") >= 0 || notifMsg.indexOf("has been disapproved") >= 0 || notifMsg.indexOf("dissolved subject:") >= 0) ? "is-danger" : "is-info";
        styleClass = (notifMsg.indexOf("cancelled") >= 0) ? "is-danger" : styleClass;
        styleClass = (notifMsg.indexOf("has been approved") >= 0) ? "is-success" : styleClass;

        return (
            <div className={"modal " + (isActive ?  "is-active " : "")}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <article className={"message " + (notifStatus === 1 ? "" : styleClass)}>
                        <div className="message-header">
                            <p>Notification</p>
                            <button className="delete" aria-label="delete" onClick={this.closeModal(history)}></button>
                        </div>
                        <div className="message-body">
                            <span className="is-size-6">{notifMsg}</span>
                            <br />
                            <span className="is-size-7 has-text-weight-semibold">{notifDate}</span>
                        </div>
                    </article>
                </div>
            </div>     
        );
    }
}