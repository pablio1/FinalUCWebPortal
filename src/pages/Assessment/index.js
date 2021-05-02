import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

import Accounting from './Accounting';
import Student from './Student';

class Assessment extends Component {
    render() {
        let showPanel = "";
        switch(getLoggedUserDetails("usertype")) {         
            case "ACCOUNTING": showPanel = <Accounting />; break;
            case "CASHIER": showPanel = <Accounting />; break;
            case "DEAN": showPanel = <Accounting />; break;
            case "CHAIRPERSON": showPanel = <Accounting />; break;
            case "ACAD": showPanel = <Accounting />; break;
            case "STUDENT": showPanel = <Student />; break;
            default: return <div>---</div>   
        }
        return (           
            <Fragment>
                {showPanel}
            </Fragment>    
        );
    }
}

export default withRouter(Assessment)

export class AssessmentHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Assessment
            </div> 
        )
    }
    
}