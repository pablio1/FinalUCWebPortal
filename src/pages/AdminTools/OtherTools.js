import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { 
    fixOstspTool, forceUpdateStatus, manualEnroll, correctTotalUnits, setClosedSubjects, reactivateAdjustment, getCourses, 
    transferSection, getSections, correctLabAndLec, sendNotifDissolveSchedules, copyGradesToEvaluation
} from '../../helpers/apiCalls';
import { sortArrayObjectsByProp } from '../../helpers/helper';


class OtherTools extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        fixOstspBtnIsLoading: false, correctUnitsBtnIsLoading: false, forceUpdateStatusBtnIsLoading: false, selectForceStatus: '', idNumForceStatus: '', idNumManualEnroll: '',
        manualEnrollEDPCodes: '', manualEnrollBtnIsLoading: false, setClosedSubjectBtnIsLoading: false, idNumReactivateAdjustment: '', reactivateAdjustmentBtnIsLoading: false,
        courses: null, educLevel: 'SH', idNumTransferSection: '', transferSectionBtnIsLoading: false, selectedCourseCode: '', selectedSection: '', sections: null,
        correctLecLabBtnIsLoading: false, sendNotifDissolvedBtnIsLoading: false, copyGradesToEvaluationBtnIsLoading: false
    }
    componentDidMount = () => {
        const { cookies } = this.props; 
        getCourses({ department: this.state.educLevel, active_term: cookies.get("selterm") })
        .then(response => {
            this.setState({ courses: response.data.colleges });      
        });
    }
    handleFixOstsp = () => {
        const { cookies } = this.props; 
        this.setState({
            fixOstspBtnIsLoading: true,
        }, () => {
            fixOstspTool(cookies.get("selterm"))
            .then(response => {
                if(response.data && response.data.success) {
                    alert("Successfully removed duplicates in OSTSP table.");
                }
                else {
                    alert("Operation unsuccessful. Please try again");
                }
                this.setState({
                    fixOstspBtnIsLoading: false,
                });
            });            
        });
    }
    handleCorrectTotalUnits = () => {
        const { cookies } = this.props; 
        this.setState({
            correctUnitsBtnIsLoading: true,
        }, () => {
            correctTotalUnits(cookies.get("selterm"))
            .then(response => {
                if(response.data && response.data.success) {
                    alert("Successfully corrected total number of units for students.");
                }
                else {
                    alert("Operation unsuccessful. Please try again");
                }
                this.setState({
                    correctUnitsBtnIsLoading: false,
                });
            });            
        });
    }
    handleSetClosedSubjects = () => {   
        const { cookies } = this.props;      
        this.setState({
            setClosedSubjectBtnIsLoading: true,
        }, () => {
            setClosedSubjects(cookies.get("selterm"))
            .then(response => {
                if(response.data && response.data.success) {
                    alert("Successfully set all full subjects to Closed.");
                }
                else {
                    alert("Operation unsuccessful. Please try again");
                }
                this.setState({
                    setClosedSubjectBtnIsLoading: false,
                });
            });            
        });
    }
    handleForceUpdateStatus = () => {
        const { cookies } = this.props; 
        if(this.state.idNumForceStatus === '' || this.state.selectForceStatus === '') {
            alert("Required Fields Empty - ID Number or Status");
        }
        else {
            forceUpdateStatus(this.state.idNumForceStatus, this.state.selectForceStatus, cookies.get("selterm"))
            .then(response => {
                if(response.data.success === 1) {
                    alert("Status Successfully Updated!");                   
                }
                else {
                    alert("ID Number Invalid or not Found!");
                }
                this.setState({
                    selectForceStatus: '', 
                    idNumForceStatus: ''
                });
            });
        }
    } 
    handleOnChangeInput = e => {
        const { cookies } = this.props;
        if(e.target.name === "manualEnrollEDPCodes") {
            if(/^[0-9 _ ,]*$/.test(e.target.value)) {
                this.setState({
                    manualEnrollEDPCodes: e.target.value
                })
            } 
        }
        else if(e.target.name === "educLevel") {
            this.setState({
                educLevel : e.target.value,
                selectedSection: "",
                sections: null
            }, () => {                 
                getCourses({ department: this.state.educLevel, active_term: cookies.get("selterm") })
                .then(response => {
                    this.setState({ courses: response.data.colleges });      
                });
            })
        }
        else if(e.target.name === "selectedCourseCode") {
            this.setState({
                [e.target.name]: e.target.value
            }, () => {
                getSections({ course_code: e.target.value, active_term: cookies.get("selterm") })
                .then(response => { 
                    if(e.target.value) {
                        if(response.data && response.data.section){
                            const sortedSection = sortArrayObjectsByProp(response.data.section, "section")           
                            this.setState({
                                sections: sortedSection,
                            });
                        }
                    }
                    else {
                        this.setState({
                            selectedSection: "",
                            sections: null
                        }); 
                    }
                });
            });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    } 
    handleManualEnroll = () => {
        const { cookies } = this.props;
        if(this.state.idNumManualEnroll === '' || this.state.manualEnrollEDPCodes === '') {
            alert("Required Fields Empty - ID Number or EDP Codes");
        }
        else {
            manualEnroll(this.state.idNumManualEnroll, this.state.manualEnrollEDPCodes, cookies.get("selterm"))
            .then(response => {
                if(response.data.success === 1) {
                    alert("Student Successfully Added Schedules!");                   
                }
                else {
                    alert("Manual Enroll Failed. Please try again.");
                }
                this.setState({
                    idNumManualEnroll: '', 
                    manualEnrollEDPCodes: ''
                });
            });
        }
    }  
    handleReactivateAdjustment = () => {
        const { cookies } = this.props; 
        if(this.state.idNumReactivateAdjustment === '') {
            alert("Required Fields Empty - ID Number");
        }
        else {
            reactivateAdjustment(this.state.idNumReactivateAdjustment, cookies.get("selterm"))
            .then(response => {
                if(response.data.success === 1) {
                    alert("Adjustment Successfully Reactivated!");                   
                }
                else {
                    alert("Adjustment Reactivation Failed. Please try again.");
                }
                this.setState({
                    idNumReactivateAdjustment: ''
                });
            });
        }
    }  
    handleTransferSection = () => {
        const { cookies } = this.props;
        const data = {
            id_number: this.state.idNumTransferSection,
            course_code: this.state.selectedCourseCode,
            section: this.state.selectedSection,
            active_term: cookies.get("selterm")
        }
        transferSection(data)
        .then(response => {
            if(response.data.success === 1) {
                alert("Student Successfully Transferred!");                   
            }
            else {
                alert("Section Transfer Failed. Please try again.");
            }
            this.setState({
                idNumTransferSection: "",
                educLevel: "SH",
                selectedCourseCode: "",
                selectedSection: ""
            });
        });
    }
    handleCorrectLecLab = () => {
        this.setState({
            correctLecLabBtnIsLoading: true
        }, () => {
            correctLabAndLec()
            .then(response => {
                if(response.data.success === 1) {
                    alert("Successfully balance Lec and Lab Schedules Class Size!");                   
                }
                else {
                    alert("Class Size balancing Failed! Please try again.");
                }
                this.setState({
                    correctLecLabBtnIsLoading: false
                });
            });
        });     
    }
    handleSendNotifDissolved = () => {
        const { cookies } = this.props;
        this.setState({
            sendNotifDissolvedBtnIsLoading: true
        }, () => {
            sendNotifDissolveSchedules(cookies.get("selterm"))
            .then(response => {
                if(response.data.success === 1) {
                    alert("Successfully sent out notification to students with dissolved schedules.");                   
                }
                else {
                    alert("Sending of notifications failed! Please try again.");
                }
                this.setState({
                    sendNotifDissolvedBtnIsLoading: false
                });
            });
        }); 
    }
    handleTransferGradesEval = () => {
        const { cookies } = this.props;
        this.setState({
            copyGradesToEvaluationBtnIsLoading: true
        }, () => {
            copyGradesToEvaluation(cookies.get("selterm"))
            .then(response => {
                if(response.data.success === 1) {
                    alert("Successfully copied the grades to Grade Evaluation.");                   
                }
                else {
                    alert("Grade copy failed! Please try again.");
                }
                this.setState({
                    copyGradesToEvaluationBtnIsLoading: false
                });
            });
        }); 
    }
    render() {
        const { 
            fixOstspBtnIsLoading, forceUpdateStatusBtnIsLoading, selectForceStatus, idNumForceStatus, idNumManualEnroll, manualEnrollEDPCodes, 
            manualEnrollBtnIsLoading, correctUnitsBtnIsLoading, setClosedSubjectBtnIsLoading, idNumReactivateAdjustment, reactivateAdjustmentBtnIsLoading,
            educLevel, idNumTransferSection, transferSectionBtnIsLoading, selectedCourseCode, courses, sections, selectedSection, correctLecLabBtnIsLoading,
            sendNotifDissolvedBtnIsLoading, copyGradesToEvaluationBtnIsLoading
        } = this.state;
        const coursesOptions = courses ? courses.filter(course => course.department === educLevel).map((course, i) => {
            let courseName = "[" + course.department + "] " + course.college_name.split(" ")[0];
            return <option key={i} value={course.college_code}>{courseName}</option>
        }) : "";
        const sectionsOptions = sections ? sections.map((section, i) => {
            return <option key={i} value={section.section}>{(section.section).split(" ")[0]}</option>
        }) : ""; 
        return(
            <Fragment>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Remove duplicates</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (fixOstspBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleFixOstsp} disabled={fixOstspBtnIsLoading} >
                            Fix OSTSP 
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Correct Total Units</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (correctUnitsBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleCorrectTotalUnits} disabled={correctUnitsBtnIsLoading} >
                            Correct Total Units 
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Set Closed status all the full Subjects</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (setClosedSubjectBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleSetClosedSubjects} disabled={setClosedSubjectBtnIsLoading} >
                            Set Closed Subjects 
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Balance Lec and Lab Class Sizes</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (correctLecLabBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleCorrectLecLab} disabled={correctLecLabBtnIsLoading} >
                            {"Correct Lab & Lec"}
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Send Notif Dissolved Schedules</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (sendNotifDissolvedBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleSendNotifDissolved} disabled={sendNotifDissolvedBtnIsLoading} >
                            Send Notification
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="columns">                    
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Copy Grades to Evaluation</h4>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (copyGradesToEvaluationBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleTransferGradesEval} disabled={copyGradesToEvaluationBtnIsLoading} >
                            Copy Now
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                <div className="columns">
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Force Update Status</h4>
                    </div>
                    <div className="column is-narrow"> 
                        <div className="control">
                            <input className="input" type="text" name="idNumForceStatus" placeholder="Enter ID Number" 
                                    value={idNumForceStatus} onChange={this.handleOnChangeInput} />
                        </div>
                    </div>
                    <div className="column is-narrow">
                        <div className="control">
                            <div className="select">
                                <select name="selectForceStatus" value={selectForceStatus} onChange={this.handleOnChangeInput}>
                                    <option value="">Select Status</option>
                                    <option value="0">[0] REGISTERED</option>
                                    <option value="1">[1] APPROVED REGISTRATION REGISTRAR</option>
                                    <option value="3">[3] APPROVED REGISTRATION DEAN</option>
                                    <option value="5">[5] SELECTING SUBJECTS</option>
                                    <option value="6">[6] APPROVED SUBJECTS DEAN</option>
                                    <option value="8">[8] APPROVED BY ACCOUNTING</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (forceUpdateStatusBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleForceUpdateStatus} disabled={forceUpdateStatusBtnIsLoading} >
                            Update 
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                <div className="columns">
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Manual Enroll</h4>
                    </div>
                    <div className="column is-narrow"> 
                        <div className="control">
                            <input className="input" type="text" name="idNumManualEnroll" placeholder="Enter ID Number" 
                                    value={idNumManualEnroll} onChange={this.handleOnChangeInput} />
                        </div>
                    </div>
                    <div className="column is-3">
                        <div className="control">
                            <input name="manualEnrollEDPCodes" className="input" type="text" placeholder="Comma separated for multiple codes" 
                                    onChange={this.handleOnChangeInput} value={manualEnrollEDPCodes} />
                            </div>
                    </div>
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (manualEnrollBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleManualEnroll} disabled={manualEnrollBtnIsLoading} >
                            Enroll 
                        </button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                <div className="columns">
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Reactivate Adjustment</h4>
                    </div>
                    <div className="column is-narrow"> 
                        <div className="control">
                            <input className="input" type="text" name="idNumReactivateAdjustment" placeholder="Enter ID Number" 
                                    value={idNumReactivateAdjustment} onChange={this.handleOnChangeInput} />
                        </div>
                    </div>                   
                    <div className="column">
                        <button className={"button is-fullwidth is-info " + (reactivateAdjustmentBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleReactivateAdjustment} disabled={reactivateAdjustmentBtnIsLoading} >
                            Reactivate 
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
                    <div className="column is-vcenter is-2 pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Transfer to Other Section</h4>
                    </div>
                    <div className="column is-narrow"> 
                        <div className="control">
                            <input className="input" type="text" name="idNumTransferSection" placeholder="Enter ID Number" 
                                    value={idNumTransferSection} onChange={this.handleOnChangeInput} />
                        </div>
                    </div>  
                    <div className="column is-narrow">                   
                        <div className="control">
                            <div className="select">
                                <select name="educLevel" value={educLevel} onChange={this.handleOnChangeInput}>
                                    <option value="CL">College</option>
                                    <option value="SH">Senior High</option>                                    
                                </select>
                            </div>
                        </div>
                    </div>  
                    <div className="column is-narrow">
                        <div className="control">
                            <div className="select">
                                <select name="selectedCourseCode" value={selectedCourseCode} onChange={this.handleOnChangeInput}>
                                    {coursesOptions}
                                </select>
                            </div> 
                        </div>  
                    </div>   
                    <div className="column is-narrow">
                        <div className="control">
                            <span className="select">
                                <select name="selectedSection" value={selectedSection} onChange={this.handleOnChangeInput}>
                                    <option value="">Select Section</option>
                                    {sectionsOptions}
                                </select>
                            </span>
                        </div>
                    </div>         
                    <div className="column is-narrow">
                        <button className={"button is-fullwidth is-info " + (transferSectionBtnIsLoading ? "is-loading" : "")} 
                                onClick={this.handleTransferSection} disabled={transferSectionBtnIsLoading} >
                            Transfer 
                        </button>
                    </div>                    
                </div>
            </Fragment>
        )
    }

}

export default withCookies(OtherTools)