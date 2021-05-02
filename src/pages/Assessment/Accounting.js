import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

import AssessmentReports from './AssessmentReports';
import AssessmentView from './AssessmentView';

class Accounting extends Component {
    state = {
        selectedTab: "assessments",
    }
    handleOnClickTab = e => {
        this.setState({
            selectedTab: e,
        });
    }
    render() {
        if (!["ACCOUNTING", "CASHIER", "DEAN", "CHAIRPERSON", "ACAD"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { selectedTab } = this.state;
        const loadAssessmentReports = (
            <AssessmentReports 

            />
        );
        const loadAssessmentView = (
            <AssessmentView 

            />
        );
        return (
            <div className="box ml-1">
                <div className="buttons has-addons is-centered">   
                    <button name="assessments" className={"button " + (selectedTab === "assessments" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("assessments")}>
                        <span className="icon is-small">
                            <i className="fas fa-cash-register"></i>
                        </span>
                        <span>Assessments</span>
                    </button>             
                    <button name="reports" className={"button " + (selectedTab === "reports" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("reports")}>
                        <span className="icon is-small">
                            <i className="fas fa-chart-bar"></i>
                        </span>
                        <span>Reports</span>
                    </button>                      
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div> 
                { selectedTab === "reports" ? loadAssessmentReports : "" }    
                { selectedTab === "assessments" ? loadAssessmentView : "" }           
            </div>       
        );
    }
}

export default withRouter(Accounting)

export class AccountingHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Assessment
            </div> 
        )
    }
    
}