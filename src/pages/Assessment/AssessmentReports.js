import React, { Component, Fragment } from 'react';

import ReportEnrollPromissory from './ReportEnrollPromissory';
import ReportAssessmentList from './ReportAssessmentList';
import { getLoggedUserDetails } from '../../helpers/helper';

export default class AssessmentReports extends Component {
    state = {
        showReport: ""
    }
    componentDidMount = () => {

    }
    handleBtnClick = e => {
        this.setState({
            showReport: e
        });
    }
    render() {
        const { showReport } = this.state;
        let loadReport = "";
        if(showReport === "enrollPromissory") loadReport = <ReportEnrollPromissory />;
        if(showReport === "assessmentList") loadReport = <ReportAssessmentList />;
        return(
            <Fragment>
                <div className="columns">                    
                    <div className="column is-2">
                        {
                            ["ACCOUNTING", "CASHIER"].includes(getLoggedUserDetails("usertype")) ? (
                                <button className="button is-fullwidth is-info mb-3" onClick={() => this.handleBtnClick("enrollPromissory")} >
                                    Enrollment Promissory 
                                </button>
                            ) : ""
                        }                        
                        <button className="button is-fullwidth is-info" onClick={() => this.handleBtnClick("assessmentList")} >
                            Assessment Category List
                        </button>
                    </div>
                    <div className="column">
                        {loadReport}
                    </div>
                </div>                 
            </Fragment>
        )
    }

}