import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudyLoad from '../../components/elements/StudyLoad';
import { getStudentSavedSchedules, getStudentInfo, getStudentStatus, getOldStudentInfo } from '../../helpers/apiCalls';
import { getLoggedUserDetails } from '../../helpers/helper';

class StudyLoadStudent extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        subjects: null, studentInfo: null, enrollmentStatus: [], enrollmentCancelled: false
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        getStudentSavedSchedules(getLoggedUserDetails("idnumber"), cookies.get("selterm"))
        .then(response => { 
            if(response.data) {          
                this.setState({
                    subjects: response.data.schedules,
                });
            }
        });
        if(["O","R","S"].includes(getLoggedUserDetails("classification"))){
            getOldStudentInfo(getLoggedUserDetails("idnumber"), 0, cookies.get("selterm"))
            .then(response => {            
                if(response.data) {
                    this.setState({
                        studentInfo: response.data, 
                    }, () => {
                        getStudentStatus(this.state.studentInfo.stud_id, cookies.get("selterm"))
                        .then(response => {                            
                            this.setState({
                                enrollmentStatus: response.data.status, 
                                enrollmentCancelled: response.data.is_cancelled === 1 ? true : false
                            });
                        });
                    }); 
                }
            })
        }
        else {
            getStudentInfo(getLoggedUserDetails("idnumber"), 0, cookies.get("selterm")) 
            .then(response => {            
                if(response.data) {
                    this.setState({
                        studentInfo: response.data, 
                    }, () => {
                        getStudentStatus(this.state.studentInfo.stud_id, cookies.get("selterm"))
                        .then(response => {
                            console.log(response.data)
                            this.setState({
                                enrollmentStatus: response.data.status,
                                enrollmentCancelled: response.data.is_cancelled === 1 ? true : false 
                            });
                        });
                    }); 
                }
            }) 
        }  
    }
    render() {   
        const { cookies } = this.props;  
        const { subjects, studentInfo, enrollmentStatus, enrollmentCancelled } = this.state;
        const selectSubjectStatus = enrollmentStatus.length > 0 ? enrollmentStatus.filter(status => status.step === 4) : "";
        const isSelectedSubjects = selectSubjectStatus ? (selectSubjectStatus[0].done && selectSubjectStatus[0].approved ? true : false) : false;   
        return (
                <div className="box">
                    <div className="columns">
                        <div className="column is-half-widescreen pt-1 mt-1">
                            { isSelectedSubjects && !enrollmentCancelled ? (
                                <StudyLoad
                                    subjects={subjects}
                                    studentInfo={studentInfo}
                                    enrollmentStatus={enrollmentStatus}
                                    schoolTerm={cookies.get("selterm")}
                                />
                                ) : (
                                    <div className="mb-2">
                                        <div className="notification is-link is-light">
                                            You can only view your study load once you have successfully selected your subjects during enrollment period.                                    
                                        </div>
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>
                </div>     
        );
    };
}

export default withCookies(StudyLoadStudent)

export const StudyLoadHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-book-reader"></i> Study Load
    </div> 
);