import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

import StudentView from './StudentView';
import StaffViewTabs from './StaffViewTabs';

class Egrade extends Component {
    render() {
        let showPanel = "";
        switch(getLoggedUserDetails("usertype")) {         
            case "STUDENT": showPanel = <StudentView />; break;
            case "FACULTY": showPanel = <StaffViewTabs />; break;
            case "DEAN": showPanel = <StaffViewTabs />; break;
            case "CHAIRPERSON": showPanel = <StaffViewTabs />; break;
            case "COOR": showPanel = <StaffViewTabs />; break;
            case "ACAD": showPanel = <StaffViewTabs />; break;
            case "LINKAGE": showPanel = <StaffViewTabs />; break;
            case "EDP": showPanel = <StaffViewTabs />; break;
            case "ADMIN": showPanel = <StaffViewTabs />; break;
            case "ACCOUNTING": showPanel = <StaffViewTabs />; break;
            case "CASHIER": showPanel = <StaffViewTabs />; break;
            case "REGISTRAR": showPanel = <StaffViewTabs />; break;
            default: return <div>---</div>   
        }
        return (           
            <Fragment>
                {showPanel}
            </Fragment>    
        );
    }
}

export default withRouter(Egrade)

export class EgradeHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-table"></i> E-Grade
            </div> 
        )
    }
    
}