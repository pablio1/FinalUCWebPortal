import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

import StaffView from './StaffView';
import GradeEntry from './GradeEntry';
import Report from './Report';

class StaffViewTabs extends Component {
    state = {
        selectedTab: "staffview"
    }
    handleOnClickTab = e => {
        this.setState({
            selectedTab: e,
        });
    }
    render() {
        if (["STUDENT"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { selectedTab } = this.state;
        const loadStaffView = (
            <StaffView />
        );
        const loadGradeEntry = (
            <GradeEntry />
        );
        const loadReport = (
            <Report />
        );
        return (
            <div className="box ml-1" style={{ minHeight: "600px" }}>
                <div className="buttons has-addons is-centered">   
                    <button name="staffview" className={"button " + (selectedTab === "staffview" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("staffview")}>
                        <span className="icon is-small">
                            <i className="fas fa-table"></i>
                        </span>
                        <span>Grade View</span>
                    </button>             
                    <button name="gradeentry" className={"button " + (selectedTab === "gradeentry" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("gradeentry")}>
                        <span className="icon is-small">
                            <i className="fas fa-edit"></i>
                        </span>
                        <span>Grade Entry</span>
                    </button>
                    {
                        ["DEAN","REGISTRAR","ACAD","EDP"].includes(getLoggedUserDetails("usertype")) ? (
                            <button name="report" className={"button " + (selectedTab === "report" ? "is-info is-selected" : "")} 
                                    onClick={() => this.handleOnClickTab("report")}>
                                <span className="icon is-small">
                                    <i className="fas fa-chart-bar"></i>
                                </span>
                                <span>Report</span>
                            </button>
                        ) : ""
                    }                      
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div> 
                { selectedTab === "staffview" ? loadStaffView : "" }  
                { selectedTab === "gradeentry" ? loadGradeEntry : "" }  
                { selectedTab === "report" ? loadReport : "" }           
            </div>       
        );
    }
}

export default withRouter(StaffViewTabs)
