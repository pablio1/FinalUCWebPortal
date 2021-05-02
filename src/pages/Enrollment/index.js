import React, { Component, Fragment } from 'react';
import { getLoggedUserDetails } from "../../helpers/helper";

import Registrar from './Registrar';
import Student from './Student'
import Dean from './Dean'
import Cashier from './Cashier'
import Accounting from './Accounting'
import EDP from './EDP'
import Faculty from './Faculty'


export class Enrollment extends Component { 
    render() {
        let showPanel = "";
        switch(getLoggedUserDetails("usertype")) {         
            case "EDP": showPanel = <EDP />; break;
            case "DEAN": showPanel = <Dean />; break;
            case "ACAD": showPanel = <Dean />; break;
            case "CHAIRPERSON": showPanel = <Dean />; break;
            case "COOR": showPanel = <Dean />; break;
            case "CASHIER": showPanel = <Cashier />; break;
            case "FACULTY": showPanel = <Faculty />; break;
            case "STUDENT": showPanel = <Student />; break;
            case "REGISTRAR": showPanel = <Registrar />; break;
            case "ACCOUNTING": showPanel = <Accounting />; break;
            default: return <div>---</div>   
        }
        return (           
            <Fragment>
                {showPanel}
            </Fragment>    
        );
    };
}

export class EnrollmentHeader extends Component {

    render() {
        const userType = getLoggedUserDetails("usertype");
        let defaultCrumb = "";
        if(["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType)) defaultCrumb = "/ Registration";
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Enrollment {defaultCrumb}
            </div> 
        )
    }
    
}

export class EnrollmentDeanHeader extends Component {
    render() {
        const { match: { params } } = this.props;
        const subHead = params.subhead
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Enrollment / {subHead.charAt(0).toUpperCase() + subHead.slice(1)}
            </div> 
        );
    }   
}

export class EnrollmentSubHeader extends Component {
    render() {
        const { match: { params } } = this.props;
        let loadSubHead = params.subhead;
        if(params.subhead === "updatecontacts") loadSubHead = "Update Details";
        else if(params.subhead === "updateverifyemail") loadSubHead = "Update & Verify Email";
        else if(params.subhead === "setbalance") loadSubHead = "Set Balance";
        else loadSubHead = params.subhead.charAt(0).toUpperCase() + params.subhead.slice(1)
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Enrollment / {loadSubHead}
            </div> 
        );
    }   
}