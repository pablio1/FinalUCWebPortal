import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import store from 'store2';

import { getLoggedUserDetails, getDifferenceBetweenArrayObjects, conflictChecker, getTotalUnitsTaken, peNstpCommonChecker } from '../../helpers/helper';
import { saveSubjectsSchedules, getSchedules, getStudentInfo, getStudentSavedSchedules, getOldStudentInfo } from '../../helpers/apiCalls';
import SelectedSubjects from '../../components/enrollment/SelectedSubjects';
import SearchSubjects from '../../components/enrollment/SearchSubjects';
import PaginateRecords from '../../components/elements/PaginateRecords';

class SubjectSelection extends Component {
    state = {
        showOverloadError: false, showConflictError: false, errorMsg: '', currentIdNumber: '', studentInfo: null, selectedSubjects: [], maxUnitsAllowed: 0,
        searchedSubjects: null, searchByEDPCodes: '', searchEdpCodesArr: [], searchBySubject: '', totalUnitsSelected: 0, yearLevel: 0, session: '', 
        has_nstp: 3, has_pe: 3, assignedSection: '', isSelectedPe: false, isSelectedNstp: false, department_abbr: '', totalRowsCount: 0, pageNum: 1, rowsPerPage: 20,
        disableAcceptBtn: false, disableSubmitBtn: false, 
    }
    componentDidMount = () => {
        this.setState({
            currentIdNumber: getLoggedUserDetails("idnumber"),
            department_abbr: getLoggedUserDetails("deptabbr")  
        }, () => {
            if(["O","R","S"].includes(getLoggedUserDetails("classification"))) {
                getOldStudentInfo(this.state.currentIdNumber, 0)
                .then(response => { 
                    if(response.data) { 
                        const data = response.data;
                        const campusSHS = process.env.REACT_APP_CAMPUS === "Banilad" ? "2" : "1";
                        const mdnSHS = data.mdn && data.mdn === "AM" ? 8 : 9;
                        const yearLevel = data.college.toUpperCase() === "SENIOR HIGH" ? data.year_level + campusSHS + mdnSHS : data.year_level         
                        this.setState({
                            studentInfo: data,
                            maxUnitsAllowed: data.allowed_units,
                            yearLevel: yearLevel,
                            session: data.mdn,  
                            assignedSection: data.assigned_section ? data.assigned_section : ""
                        }, () => {
                            if(this.state.studentInfo.assigned_section) this.getSectionSubjects();
                            else this.getFilteredSchedules();
                        });
                    }
                });
            }
            else {
                getStudentInfo(this.state.currentIdNumber, 0)
                .then(response => { 
                    if(response.data) { 
                        const data = response.data;
                        const campusSHS = process.env.REACT_APP_CAMPUS === "Banilad" ? "2" : "1";
                        const mdnSHS = data.mdn && data.mdn === "AM" ? 8 : 9;
                        const yearLevel = data.college.toUpperCase() === "SENIOR HIGH" ? data.year_level + campusSHS + mdnSHS : data.year_level         
                        this.setState({
                            studentInfo: data,
                            maxUnitsAllowed: data.allowed_units,
                            yearLevel: yearLevel,
                            session: data.mdn,  
                            assignedSection: data.assigned_section ? data.assigned_section : ""
                        }, () => {
                            if(this.state.studentInfo.assigned_section) this.getSectionSubjects();
                            else this.getFilteredSchedules();
                        });
                    }
                });
            }
        });     
    }
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleOnSearchEvent = e => {
        if(e.target.name === "searchByEDPCodes") {
            const { searchBySubject, studentInfo, searchByEDPCodes, yearLevel } = this.state;
            const data = {  
                course_code: studentInfo.course_code,
                year_level: yearLevel,
                subject_name: searchBySubject.toUpperCase(),
                section: studentInfo.assigned_section ? studentInfo.assigned_section : "",
                status: 1,
            };
            getSchedules(data)
            .then(response => { 
                let edpCodesArr = []; 
                if(response.data.schedules) {
                    let sanitizedEdpCodes = searchByEDPCodes.trim();
                    sanitizedEdpCodes = sanitizedEdpCodes.replace(/\s+/g, '');
                    if(sanitizedEdpCodes !== "") {
                        sanitizedEdpCodes = sanitizedEdpCodes.split(",");
                        sanitizedEdpCodes = Array.isArray(sanitizedEdpCodes) ? sanitizedEdpCodes : [sanitizedEdpCodes];
                        const retData = response.data.schedules;
                        const withSplitCodes = retData.filter(schedule => sanitizedEdpCodes.includes(schedule.split_code)).map(sched => { return sched.edpcode });
                        edpCodesArr = [...withSplitCodes, ...sanitizedEdpCodes];
                    }                   
                }
                this.setState({
                    searchEdpCodesArr: edpCodesArr,
                    pageNum: 1,
                }, () => this.getFilteredSchedules());
            });
        }
        else {
            this.setState({
                pageNum: 1,
            }, () => this.getFilteredSchedules());
        }
    }
    toggleShowErrors = e => {
        const { showOverloadError, showConflictError } = this.state;
        if(e === "overload") this.setState({ showOverloadError: !showOverloadError });
        else this.setState({ showConflictError: !showConflictError });
    }
    handleOnClickBack = e => {
        const { history } = this.props;
        history.push("/enrollment/student/steps");
    }
    handleRequestDeblock = e => {
        /*handleStudentRequest(this.state.currentIdNumber, "deblock")
        .then(response => {            
            if(response.data.success) {
                updateStudentStatus(this.state.currentIdNumber, { status: 5 })
                .then(res => {
                    if(res.data.success) { 
                        alert("Your request has been sent. Please wait for your dean to evaluate your request.");
                        const { history } = this.props;
                        history.push("/enrollment/student/steps");
                    }
                    else {
                        alert("Sending of de-blocking request failed. Please try again, if the issue persist please contact EDP office.");
                    }
                });               
            }
            else {
                handleStudentRequest(this.state.currentIdNumber, "resDeblock")
                alert("Sending of de-blocking request failed. Please try again, if the issue persist please contact EDP office.");
            }
        })  */
    }
    handleRequestOverload = e => {
        /*const { studentInfo, selectedSubjects, yearLevel } = this.state;
        const selectedSubjectEDPCodes = selectedSubjects.map((subject, index) => {
            return subject.edpcode
        }); 
        const totalUnits = sumValuesInArrayObjectByProp(selectedSubjects, "units");
        
        handleStudentRequest(this.state.currentIdNumber, "overload")
        .then(response => {            
            if(response.data.success) {
                updateStudentStatus(this.state.currentIdNumber, { status: 5 })
                .then(res => {
                    if(res.data.success) { 
                        const data = {
                            id_number: studentInfo.stud_id,
                            schedules: selectedSubjectEDPCodes,
                            total_units: parseInt(totalUnits, 10),
                            year_level: yearLevel,
                            classification: studentInfo.classification,
                            accept_section: 1
                        }
                        saveSubjectsSchedules(data)
                        .then(response => {            
                            if(response.data.success) {
                                alert("Your request has been sent. Please wait for your dean to evaluate your request.");
                                const { history } = this.props;
                                history.push("/enrollment/student/steps");
                            }
                            else {
                                alert("Sending of overloading request failed. Please try again, if the issue persist please contact EDP office.");
                            }
                        })           
                    }
                    else {
                        alert("Sending of overloading request failed. Please try again, if the issue persist please contact EDP office.");
                    }
                });               
            }
            else {
                handleStudentRequest(this.state.currentIdNumber, "resOverload")
                alert("Sending of overloading request failed. Please try again, if the issue persist please contact EDP office.");
            }
        }) */
    }
    handleAcceptProceed = e => {
        const { studentInfo, selectedSubjects  } = this.state;
        let yearLevel = this.state.year_level;   
            yearLevel = yearLevel.length > 2  ? yearLevel.substring(0, 2) : yearLevel;       
        const selectedSubjectEDPCodes = selectedSubjects.map((subject, index) => {
            const edpCodeProp = subject.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
            return subject[edpCodeProp]
        }); 
        const data = {
            id_number: studentInfo.stud_id,
            schedules: selectedSubjectEDPCodes,
            total_units: this.state.totalUnitsSelected,
            year_level: yearLevel,
            classification: studentInfo.classification,
            accept_section: 1
        }

        this.setState({
            disableAcceptBtn: true   
        }, () => {
            saveSubjectsSchedules(data)
            .then(response => {            
                if(response.data.success) {
                    alert("Step 4 Completed.");
                    this.setState({
                        disableAcceptBtn: false   
                    }, () => {
                        const { history } = this.props;
                        history.push("/enrollment/student/steps");
                    });    
                }
                else {
                    alert("Subject Schedules saving failed. Please try again, if issue persist contact EDP office.")
                    this.setState({
                        disableAcceptBtn: false   
                    });
                }
            }); 
        });               
    }

    handleOnSubmitSchedules = e => {
        const { studentInfo, selectedSubjects } = this.state;
        let yearLevel = this.state.year_level;   
            yearLevel = yearLevel.length > 2  ? yearLevel.substring(0, 2) : yearLevel;       
        const selectedSubjectEDPCodes = selectedSubjects.map((subject, index) => {
            return subject.edpcode
        }); 
        const data = {
            id_number: studentInfo.stud_id,
            schedules: selectedSubjectEDPCodes,
            total_units: this.state.totalUnitsSelected,
            year_level: yearLevel,
            classification: studentInfo.classification,
        }

        this.setState({
            disableSubmitBtn: true   
        }, () => {
            saveSubjectsSchedules(data)
            .then(response => {            
                if(response.data.success) {
                    alert("Step 4 Completed.");
                    this.setState({
                        disableSubmitBtn: false   
                    }, () => {
                        const { history } = this.props;
                        history.push("/enrollment/student/steps");
                    });  
                }
                else {
                    alert("Subject Schedules saving failed. Please try again, if issue persist contact EDP office.")
                    this.setState({
                        disableSubmitBtn: false   
                    });
                }
            }) 
        });       
    }
    handleOnAddSchedule = e => {
        const { selectedSubjects, searchedSubjects, maxUnitsAllowed, totalUnitsSelected } = this.state;
        //console.log(selectedSubjects)
        //const conflictCheck = conflictChecker(selectedSubjects, e);
        let conflictCheck = [false, ""];
        e.forEach(schedule => {
            const retCheck = conflictChecker(selectedSubjects, schedule);            
            if(retCheck[0]) conflictCheck = [true, retCheck[1]];
        });
        const retNstpPeCheck = peNstpCommonChecker(selectedSubjects, e[0]);
        const subjectUnits = getTotalUnitsTaken(e); 
        
        if(conflictCheck[0]) {
            this.setState({
                showConflictError: true,
                errorMsg: conflictCheck[1]
            }); 
        }
        else if((maxUnitsAllowed - parseInt(subjectUnits, 10)) < 0) {
            this.setState({
                showOverloadError: true,
            });
        }
        else if(retNstpPeCheck.pe) {
            alert("You already selected a PE schedule.")
        }
        else if(retNstpPeCheck.nstp) {
            alert("You already selected a NSTP schedule.")
        }
        else {
            const filteredSearchedSubjects = getDifferenceBetweenArrayObjects(searchedSubjects, e, "edpcode");
            //console.log(maxUnitsAllowed, subjectUnits)
            this.setState({
                selectedSubjects: [...selectedSubjects, ...e],
                searchedSubjects: filteredSearchedSubjects,
                maxUnitsAllowed: maxUnitsAllowed - parseInt(subjectUnits, 10),
                totalUnitsSelected: totalUnitsSelected + parseInt(subjectUnits, 10),
                showConflictError: false,
                showOverloadError: false,
                errorMsg: ""
            }); 
        }   
    }
    handleOnRemoveSchedule = e => {
        const { selectedSubjects, searchedSubjects, maxUnitsAllowed, totalUnitsSelected } = this.state;
        const filteredSelectedSubjects = getDifferenceBetweenArrayObjects(selectedSubjects, e, "edpcode");
        const subjectUnits = e.filter(sched => sched.subject_type !== "L" || sched.subject_type !== "LAB")[0].units; 
        this.setState({
            searchedSubjects: [...searchedSubjects, ...e],
            selectedSubjects: filteredSelectedSubjects,
            maxUnitsAllowed: maxUnitsAllowed + parseInt(subjectUnits, 10),
            totalUnitsSelected: totalUnitsSelected - parseInt(subjectUnits, 10),
        });    
    }
    getSectionSubjects = () => {
        const { maxUnitsAllowed, studentInfo, pageNum, rowsPerPage } = this.state;
        getStudentSavedSchedules(getLoggedUserDetails("idnumber"))
        .then(response => {  
            if(response.data) {  
                const subjectUnits = getTotalUnitsTaken(response.data.schedules);         
                this.setState({
                    selectedSubjects: response.data.schedules,
                    totalUnitsSelected : getTotalUnitsTaken(response.data.schedules),
                    has_nstp: response.data.has_nstp,
                    has_pe: response.data.has_pe,
                    maxUnitsAllowed: parseInt(maxUnitsAllowed, 10) - parseInt(subjectUnits, 10)
                }, () => this.getFilteredSchedules());
                /*}, () => {
                    const data = {
                        course_code: studentInfo.course_code,
                        department_abbr: "",
                        year_level: 0,
                        edp_codes: [],
                        subject_name: "",
                        section: "", status: 1, sort: 0, gen_ed: "", page: 1, limit: 0, 
                        no_nstp: this.state.has_nstp === 1 ? 0 : 1, 
                        no_pe: this.state.has_pe === 1 ? 0 : 1 
                    } 
                    console.log(data);
                    getSchedules(data)
                    .then(response => { 
                        if(response.data.schedules) {
                            const schedules = response.data.schedules;
                            const withoutSelectedScheds = schedules.filter(schedule => !this.state.selectedSubjects.some(sched => schedule.edpcode == sched.edpcode)); 
                            this.setState({                    
                                searchedSubjects: withoutSelectedScheds.slice((pageNum - 1) * rowsPerPage, pageNum * rowsPerPage),
                                totalRowsCount: withoutSelectedScheds.length
                            });      
                        }                        
                    });
                });*/
            }
        });
    }
    getFilteredSchedules = () => {
        const { studentInfo, searchBySubject, searchEdpCodesArr, selectedSubjects, yearLevel, has_nstp, has_pe, assignedSection, pageNum, rowsPerPage } = this.state;
            const dataSchedAll = {
                course_code: "",
                department_abbr: this.state.department_abbr,
                year_level: yearLevel,
                edp_codes: searchEdpCodesArr,
                subject_name: searchBySubject.toUpperCase(),
                section: studentInfo.assigned_section ? studentInfo.assigned_section : "",
                status: 1, sort: 0, gen_ed: "", page: 1, limit: 0, no_nstp: 0, no_pe: 0 
            }
            const nstpAndPECommon = {
                course_code: studentInfo.course_code,
                department_abbr: "",
                year_level: 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchBySubject.toUpperCase(),
                section: "", status: 1, sort: 0, gen_ed: "", page: 1, limit: 0, 
                no_nstp: has_nstp === 1 ? 0 : 1, 
                no_pe: has_pe === 1 ? 0 : 1   
            }        
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            }; 
            const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, dataSchedAll, {headers});
            const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, nstpAndPECommon, {headers});
            Promise.all([apiRequest1, apiRequest2]).then(values =>  {  
                let allWithSelectedScheds = null;          
                if (studentInfo.college.toUpperCase() === "SENIOR HIGH") allWithSelectedScheds = values[0].data.schedules; 
                else if (assignedSection && yearLevel === 1) allWithSelectedScheds = values[1].data.schedules.filter(schedule => schedule.section.charAt(0) === "1");  
                else if (assignedSection && yearLevel > 1) allWithSelectedScheds = values[1].data.schedules;    
                else allWithSelectedScheds = [...values[0].data.schedules, ...values[1].data.schedules];  
                const withoutSelectedScheds = allWithSelectedScheds.filter(schedule => !selectedSubjects.some(sched => schedule.edpcode === sched.edpcode));
                this.setState({                    
                    searchedSubjects: withoutSelectedScheds.slice((pageNum - 1) * rowsPerPage, pageNum * rowsPerPage),
                    totalRowsCount: withoutSelectedScheds.length
                });
            }).catch(error => {
                console.log(error);
            });             
    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e,
        }, () => this.getFilteredSchedules());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            rowsPerPage: e,
            pageNum: 1,
        }, () => this.getFilteredSchedules());
    }
    render() { 
        const { 
            studentInfo, selectedSubjects, showOverloadError, showConflictError, errorMsg, maxUnitsAllowed, totalRowsCount, rowsPerPage, pageNum,
            searchedSubjects, searchByEDPCodes, searchBySubject, totalUnitsSelected, has_nstp, has_pe, assignedSection, disableAcceptBtn, disableSubmitBtn
        } = this.state;
        let loadNotification = "";
        let loadSearchSubject = "";
        let showSubmitBtn = false;
        if(studentInfo) {
            if(assignedSection) {
                let loadAcceptBtn = false;
                const withNstp = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("NSTP"));
                const withPE = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."));
                if(has_nstp === 0 || has_pe === 0) loadAcceptBtn = true;
                if((withNstp && withNstp.length > 0) && (withPE && withPE.length > 0)) loadAcceptBtn = false;
                loadNotification = (
                    <div className="mb-2">
                        <div className="notification">
                            You belong in a blocked section. <strong>Section: {assignedSection}</strong>. <br />
                            {/*All subjects are fixed and if you wish to be de-blocked, you can send request to your dean to get de-blocked. <br />
                            Click the button below to send de-blocking request or accept the subjects and proceed with the next step. <br />*/}
                            { 
                                has_nstp === 0 || has_pe === 0 ?
                                "You are required to add NSTP and PE subjects. Before you click Accept and Proceed please choose an NSTP and PE schedule first." :
                                "Please click Accept and Proceed button below to continue to the next Enrollment Step."
                            }
                            <div className="buttons">
                                {/*<button className="button is-small is-info mt-2 has-text-weight-semibold"
                                        onClick={this.handleRequestDeblock}
                                        >Request de-block</button>*/}
                                {
                                    loadAcceptBtn ? ( 
                                        <button className="button is-small is-primary mt-2 has-text-weight-semibold" disabled={true} >Accept and Proceed</button>      
                                    ) : (
                                        <button className={"button is-small is-primary mt-2 has-text-weight-semibold " + (disableAcceptBtn ? "is-loading" : "")} 
                                                onClick={this.handleAcceptProceed} disabled={disableAcceptBtn}
                                        >Accept and Proceed</button>
                                    )
                                }
                            </div>                                    
                        </div>
                    </div>
                )
            }
            else {
                if(studentInfo.year_level > 1) showSubmitBtn = true;
                else {
                    const withNstp = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("NSTP"));
                    const withPE = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."));
                    if((withNstp && withNstp.length > 0) && (withPE && withPE.length > 0)) showSubmitBtn = true;
                    else showSubmitBtn = false;
                    loadNotification = (
                        <div className="mb-2">
                            <div className="notification is-danger is-light">                                
                                You are required to add NSTP and PE subjects. You cannot proceed if you will not choose NSTP and PE schedule. :                                  
                            </div>
                        </div>
                    )
                }
            }
            if(studentInfo.request_deblock === 1) {
                loadNotification = (
                    <div className="mb-2">
                        <div className="notification is-link is-light">
                            You have requested to be de-blocked. The dean is currently evaluating your request. <br /> 
                            If you wish to cancel your request and accept your current blocked schedules just click Accept and Proceed button below.
                                <div className="buttons">
                                <button className="button is-small is-primary mt-2 has-text-weight-semibold"
                                        onClick={this.handleAcceptProceed}
                                >Accept and Proceed</button>
                            </div>                                    
                        </div>
                    </div>
                )  
            }
            /*if(studentInfo.request_overload === 1) {
                loadNotification = (
                    <div className="mb-2">
                        <div className="notification is-link is-light">
                            You have requested to overload your total number of units. The dean is currently evaluating your request. <br /> 
                            If you wish to cancel your request and accept your current selected schedules just click Accept and Proceed button below.
                                <div className="buttons">
                                <button className="button is-small is-primary mt-2 has-text-weight-semibold"
                                        onClick={this.handleAcceptProceed}
                                >Accept and Proceed</button>
                            </div>                                    
                        </div>
                    </div>
                )  
            }*/

            loadSearchSubject = (
                <Fragment>
                <div className="columns">
                    <div className="column is-three-quarters-widescreen pt-1 mt-1">
                        <div className="divider is-size-6 mb-3 pb-2"></div>
                        <SearchSubjects 
                            maxUnitsAllowed={maxUnitsAllowed}
                            searchedSubjects={searchedSubjects}
                            searchByEDPCodes={searchByEDPCodes}
                            searchBySubject={searchBySubject}                 
                            handleOnAddSchedule={this.handleOnAddSchedule} 
                            handleOnChangeInput={this.handleOnChangeInput}
                            handleOnSearchEvent={this.handleOnSearchEvent}
                        />
                    </div>                    
                </div>
                <div className="columns">
                    <div className="column">
                        <PaginateRecords
                            totalRowsCount={totalRowsCount} 
                            rowsPerPage={rowsPerPage}
                            pageNum={pageNum}
                            handleOnClickPage={this.handleOnChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div> 
                </Fragment>
            );
            //if(assignedSection) loadSearchSubject = "";  
            if(has_nstp === 1 && has_pe === 1 && assignedSection) loadSearchSubject = "";                   
            if(disableSubmitBtn) loadSearchSubject = "";             
        }
        return(
            <Fragment>
                <h4 className="is-size-4 has-text-weight-bold mb-2">Subject Selection</h4>   
                <div className="buttons">
                    <button className="button is-small is-link" onClick={this.handleOnClickBack}>
                        <span className="icon is-small">
                        <i className="fas fa-angle-left"></i>
                        </span>
                        <span>Back to Enrollment Steps</span>
                    </button>            
                </div>
                {loadNotification}
                <div className="columns">
                    <div className="column is-three-quarters-widescreen pb-0 mb-0">
                        <SelectedSubjects 
                            selectedSubjects={selectedSubjects} 
                            hasSection={assignedSection ? true : false}
                            section={assignedSection}
                            has_nstp={has_nstp}
                            has_pe={has_pe}
                            showSubmitBtn={showSubmitBtn} 
                            handleOnSubmitSchedules={this.handleOnSubmitSchedules}                 
                            handleOnRemoveSchedule={this.handleOnRemoveSchedule}
                            totalUnitsSelected={totalUnitsSelected}
                        />
                    </div>
                </div>                
                {
                    showOverloadError ? (
                        <div className="columns">
                            <div className="column is-three-quarters-widescreen pb-0 mb-0">                            
                                <div className="notification is-danger">
                                    <span className="icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                    <strong>Total Units Overload Detected</strong> <br />
                                    Your total selected number of units is over the allowed maximum units. <br />
                                    If you wish to overload, please contact your Dean for approval. 
                                    {/*Click the button below to send request to the dean to allow your overload subjects. <br />
                                    <div className="buttons">
                                        <button className="button is-small is-info mt-2 has-text-weight-semibold"
                                                onClick={this.handleRequestOverload}
                                        >Request Overloading</button>
                                    </div>*/}                                    
                                </div>
                            </div>
                        </div>
                    ) : ""
                }
                {
                    showConflictError ? (
                        <div className="columns">
                            <div className="column is-three-quarters-widescreen pb-0 mb-0">                            
                                <div className="notification is-danger">
                                    <button className="delete" onClick={() => this.toggleShowErrors("conflict")}></button>
                                    <span className="icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                    <strong>Schedule Conflicts Detected!</strong> <br />
                                    {
                                        errorMsg ? errorMsg : ""
                                    }                                
                                </div>
                            </div>
                        </div>    
                    ) : ""
                }
                {loadSearchSubject}
            </Fragment>
        )
    };
}


export default withRouter(SubjectSelection)