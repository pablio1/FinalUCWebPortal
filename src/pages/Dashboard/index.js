import React, { Component, Fragment } from 'react';
import { getLoggedUserDetails } from "../../helpers/helper";

import Registrar from './Registrar';
import Student from './Student';
import Dean from './Dean';
import Cashier from './Cashier';
import Accounting from './Accounting';
import EDP from './EDP';
import Faculty from './Faculty';


export class Dashboard extends Component { 
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
        const adminPanel = (
            <div>Admin</div>
        );
        return (           
            <Fragment>
                {showPanel}
            </Fragment>    
        );
    };
}

export const DashboardHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-edit"></i> Dashboard
    </div> 
);