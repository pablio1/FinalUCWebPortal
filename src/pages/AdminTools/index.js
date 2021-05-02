import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

import CreateUserForm from './CreateUserForm';
import CancelEnrollment from './CancelEnrollment';
import ResetPassword from './ResetPassword';
import EditSchedule from './EditSchedule';
import EditStudentInfo from './EditStudentInfo';
import OtherTools from './OtherTools';

class AdminTools extends Component {
    state = {
        selectedTab: "createuser"
    }
    handleOnClickTab = e => {
        this.setState({
            selectedTab: e,
        });
    }
    render() {
        if (!["ADMIN", "EDP"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { selectedTab } = this.state;
        const loadCreateUserForm = (
            <div className="columns">
                <div className="column is-one-third-widescreen">
                    <CreateUserForm />
                </div>
            </div>
        );
        const loadEditStudentInfo = (
            <div className="columns">
                <div className="column is-one-third-widescreen">
                    <EditStudentInfo />
                </div>
            </div>
        );
        const loadCancelEnrollment = (
            <CancelEnrollment />
        );
        const loadResetPassword = (
            <ResetPassword />
        );
        const loadEditSchedule = (
            <EditSchedule />
        );
        const loadOtherTools = (
            <OtherTools />
        );
        return (
            <div className="box ml-1">
                <div className="buttons has-addons is-centered">                
                    <button name="createuser" className={"button " + (selectedTab === "createuser" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("createuser")}>
                        <span className="icon is-small">
                            <i className="fas fa-user-plus"></i>
                        </span>
                        <span>Create New User</span>
                    </button>
                    <button name="editStudentInfo" className={"button " + (selectedTab === "editStudentInfo" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("editStudentInfo")}>
                        <span className="icon is-small">
                            <i className="fas fa-edit"></i>
                        </span>
                        <span>Edit Student Info</span>
                    </button>
                    <button name="resetpassword" className={"button " + (selectedTab === "resetpassword" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("resetpassword")}>
                        <span className="icon is-small">
                            <i className="fas fa-lock"></i>
                        </span>
                        <span>Reset Password</span>
                    </button> 
                    <button name="editSchedule" className={"button " + (selectedTab === "editSchedule" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("editSchedule")}>
                        <span className="icon is-small">
                            <i className="fas fa-edit"></i>
                        </span>
                        <span>Edit Schedule</span>
                    </button>  
                    <button name="cancelEnrollment" className={"button " + (selectedTab === "cancelEnrollment" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("cancelEnrollment")}>
                        <span className="icon is-small">
                            <i className="fas fa-window-close"></i>
                        </span>
                        <span>Cancel Enrollment</span>
                    </button> 
                    <button name="otherTools" className={"button " + (selectedTab === "otherTools" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("otherTools")}>
                        <span className="icon is-small">
                            <i className="fas fa-tools"></i>
                        </span>
                        <span>Other Tools</span>
                    </button>                       
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div> 
                { selectedTab === "createuser" ? loadCreateUserForm : "" }
                { selectedTab === "cancelEnrollment" ? loadCancelEnrollment: "" }
                { selectedTab === "resetpassword" ? loadResetPassword: "" } 
                { selectedTab === "editSchedule" ? loadEditSchedule: "" } 
                { selectedTab === "otherTools" ? loadOtherTools: "" }   
                { selectedTab === "editStudentInfo" ? loadEditStudentInfo : ""}              
            </div>       
        );
    }
}

export default withRouter(AdminTools)

export class AdminToolsHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Admin Tools
            </div> 
        )
    }
    
}