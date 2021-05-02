import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { exportCSVFile } from '../../helpers/helper';
import { exportUsersForLMS, exportCoursesForLMS, exportEnrolledForLMS, exportTeachersForLMS } from '../../helpers/apiCalls';


class LmsTools extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        selectStudTypeExportLMS: 0, studExportLMSBtnIsLoading: false, selectSchedTypeExportLMS: 0, schedExportLMSBtnIsLoading: false, 
        selectSubjectTypeExportLMS: 0, subjectExportLMSBtnIsLoading: false, teachersExportLMSBtnIsLoading: false
    }
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    studExportLMS = () => {
        const { cookies } = this.props;
        this.setState({
            studExportLMSBtnIsLoading: true
        }, () => {
            exportUsersForLMS(this.state.selectStudTypeExportLMS, cookies.get("selterm"))
            .then(response => {            
                if(response.data.users && response.data.users.length > 0) {
                    const data = response.data.users;
                    const filename = this.state.selectStudTypeExportLMS === "1" ? "lms_old_students_list" : "lms_new_students_list";
                    const fields = {
                        username: "USERNAME",
                        firstname: "FIRSTNAME",
                        lastname: "LASTNAME",
                        email: "EMAIL",
                        password: "PASSWORD",
                        cohort1: "COHORT1",
                        cohort2: "COHORT2",
                        cohort3: "COHORT3"
                    }
                    exportCSVFile(fields, data, filename);
                }
                this.setState({
                    studExportLMSBtnIsLoading: false
                });
            }); 
        });
    }
    schedExportLMS = () => {
        const { cookies } = this.props;
        this.setState({
            schedExportLMSBtnIsLoading: true
        }, () => {
            exportCoursesForLMS(this.state.selectSchedTypeExportLMS, cookies.get("selterm"))
            .then(response => {         
                if(response.data.courses && response.data.courses.length > 0) {
                    const data = response.data.courses;
                    const filename = this.state.selectSchedTypeExportLMS === "1" ? "lms_dissolved_courses" : "lms_active_courses";
                    const fields = {
                        shortname: "SHORTNAME",
                        fullname: "FULLNAM",
                        category: "CATEGORY",
                        idnumber: "IDNUMBER"  
                    }
                    exportCSVFile(fields, data, filename);
                }
                this.setState({
                    schedExportLMSBtnIsLoading: false
                });
            }); 
        });
    }
    subjectExportLMS = () => {
        const { cookies } = this.props;
        this.setState({
            subjectExportLMSBtnIsLoading: true
        }, () => {
            exportEnrolledForLMS(this.state.selectSubjectTypeExportLMS, cookies.get("selterm"))
            .then(response => {         
                    if(response.data.enrolled && response.data.enrolled.length > 0) {
                    const data = response.data.enrolled;
                    const filename = this.state.selectSubjectTypeExportLMS === "1" ? "lms_deleted_subjects" : "lms_added_subjects";
                    const fields = null;
                    exportCSVFile(fields, data, filename);
                }
                this.setState({
                    subjectExportLMSBtnIsLoading: false
                });
            }); 
        });
    }
    teachersExportLMS = () => {
        const { cookies } = this.props;
        this.setState({
            teachersExportLMSBtnIsLoading: true
        }, () => {
            exportTeachersForLMS(this.state.selectSubjectTypeExportLMS, cookies.get("selterm"))
            .then(response => {         
                    if(response.data.teachers && response.data.teachers.length > 0) {
                    const data = response.data.teachers;
                    const filename = "lms_teachers";
                    const fields = {
                        username: "USERNAME",
                        course1: "COURSE1",
                        role1: "ROLE1"
                    };
                    exportCSVFile(fields, data, filename);
                }
                this.setState({
                    teachersExportLMSBtnIsLoading: false
                });
            }); 
        });
    }
    render() {
        const { 
            selectStudTypeExportLMS, studExportLMSBtnIsLoading, selectSchedTypeExportLMS, schedExportLMSBtnIsLoading, 
            selectSubjectTypeExportLMS, subjectExportLMSBtnIsLoading, teachersExportLMSBtnIsLoading
        } = this.state;
        return(
            <Fragment>
            <div className="columns">                    
                <div className="column is-vcenter is-2">
                    <h4 className="has-text-weight-semibold is-size-6"> Export Users for LMS</h4>
                </div>
                <div className="column">
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="selectStudTypeExportLMS" value={selectStudTypeExportLMS} onChange={this.handleOnChangeInput}>
                                    <option value="0">New Students</option>
                                    <option value="1">Old Students</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div className="column">
                    <button className={"button is-fullwidth is-info " + (studExportLMSBtnIsLoading ? "is-loading" : "")} 
                            onClick={this.studExportLMS} disabled={studExportLMSBtnIsLoading} >
                        Export to CSV
                    </button>
                </div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
            </div>
            <div className="">
                <div className="divider is-size-6 mt-0 pt-0"></div>
            </div>
            <div className="columns">                    
                <div className="column is-vcenter is-2">
                    <h4 className="has-text-weight-semibold is-size-6"> Export Courses for LMS</h4>
                </div>
                <div className="column">
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="selectSchedTypeExportLMS" value={selectSchedTypeExportLMS} onChange={this.handleOnChangeInput}>
                                    <option value="0">Active Schedules</option>
                                    <option value="1">Dissolved</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div className="column">
                    <button className={"button is-fullwidth is-info " + (schedExportLMSBtnIsLoading ? "is-loading" : "")} 
                            onClick={this.schedExportLMS} disabled={schedExportLMSBtnIsLoading} >
                        Export to CSV
                    </button>
                </div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
            </div>
            <div className="">
                <div className="divider is-size-6 mt-0 pt-0"></div>
            </div>
            <div className="columns">                    
                <div className="column is-vcenter is-2">
                    <h4 className="has-text-weight-semibold is-size-6"> Export Enrolled Courses for LMS</h4>
                </div>
                <div className="column">
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="selectSubjectTypeExportLMS" value={selectSubjectTypeExportLMS} onChange={this.handleOnChangeInput}>
                                    <option value="0">Added Subjects</option>
                                    <option value="1">Removed Subjects</option>
                                </select>
                            </div>
                        </div>
                    </div>
                <div className="column">
                    <button className={"button is-fullwidth is-info " + (subjectExportLMSBtnIsLoading ? "is-loading" : "")} 
                            onClick={this.subjectExportLMS} disabled={subjectExportLMSBtnIsLoading} >
                        Export to CSV
                    </button>
                </div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
            </div>
            <div className="">
                <div className="divider is-size-6 mt-0 pt-0"></div>
            </div>
            <div className="columns">                    
                <div className="column is-vcenter is-2">
                    <h4 className="has-text-weight-semibold is-size-6"> Export Teachers for LMS</h4>
                </div>
                <div className="column">
                    <button className={"button is-fullwidth is-info " + (teachersExportLMSBtnIsLoading ? "is-loading" : "")} 
                            onClick={this.teachersExportLMS} disabled={teachersExportLMSBtnIsLoading} >
                        Export to CSV
                    </button>
                </div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
                <div className="column is-hidden-mobile"></div>
            </div>
            </Fragment>
        );
    }

}

export default withCookies(LmsTools)