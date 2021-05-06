import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import store from 'store2';

import { getLoggedUserDetails, conflictChecker, getTotalUnitsTaken, peNstpCommonChecker, getSplitCodePair } from '../../helpers/helper';
import { saveSubjectsSchedules, getSchedules, getStudentInfo, getStudentSavedSchedules, getOldStudentInfo, getSections, getCourses, saveSubjectAdjustments } from '../../helpers/apiCalls';
import SelectedSubjects from '../../components/enrollment/SelectedSubjects';
import SearchSubjects from '../../components/enrollment/SearchSubjects';
import PaginateRecords from '../../components/elements/PaginateRecords';
import Suggestion from '../../components/elements/SuggestSubject';

class SubjectSelection extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        showOverloadError: false, showConflictError: false, errorMsg: '', currentIdNumber: '', studentInfo: null, selectedSubjects: [], maxUnitsAllowed: 0,
        searchedSubjects: null, searchByEDPCodes: '', searchEdpCodesArr: [], searchBySubject: '', filterBySection: '', filterByCourse: '',
        totalUnitsSelected: 0, yearLevel: 0, session: '', 
        has_nstp: 3, has_pe: 3, assignedSection: '', isSelectedPe: false, isSelectedNstp: false, department_abbr: '', totalRowsCount: 0, pageNum: 1, rowsPerPage: 20,
        disableAcceptBtn: false, disableSubmitBtn: false, sections: '', courses: '',
        selectionType: '', adjustOrigSubjects: null, viewSuggestion: false
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        const { match: { params } } = this.props;
        const selectionType = params.type; //determine if enrollment or adjustment
        const department = getLoggedUserDetails("deptabbr") === "SHS" ? "SH" : "CL";
        const coursesToGet = selectionType === "enrollment" ? { department_abbr: getLoggedUserDetails("deptabbr"), active_term: cookies.get("selterm") } : { department: department, active_term: cookies.get("selterm") };
        getCourses(coursesToGet)
        .then(response => {
            if(response.data && response.data.colleges) {
                this.setState({
                    courses: response.data.colleges.length > 0 ? response.data.colleges : "",
                    filterByCourse: selectionType === "enrollment" ? "" : getLoggedUserDetails("coursecode")
                }, () => {
                    if(selectionType === "adjustment") {
                        getSections({ college_abbr: "", course_code: this.state.filterByCourse, active_term: cookies.get("selterm") })
                        .then(response => {
                            if(response.data && response.data.section) {
                                this.setState({
                                    sections: response.data.section.length > 0 ? response.data.section : "",
                                    pageNum: 1
                                });
                            }
                        });
                    }   
                });
            }
        });
        this.setState({
            currentIdNumber: getLoggedUserDetails("idnumber"),
            department_abbr: getLoggedUserDetails("deptabbr"),
            selectionType: selectionType  
        }, () => {
            if(["O","R","S"].includes(getLoggedUserDetails("classification"))) {
                getOldStudentInfo(this.state.currentIdNumber, 0, cookies.get("selterm"))
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
                            if(this.state.studentInfo.assigned_section || selectionType === "adjustment") this.getSectionSubjects();
                            else this.getFilteredSchedules();                           
                        });
                    }
                });
            }
            else {
                getStudentInfo(this.state.currentIdNumber, 0, cookies.get("selterm"))
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
                            if(this.state.studentInfo.assigned_section || selectionType === "adjustment") this.getSectionSubjects();
                            else this.getFilteredSchedules();
                        });
                    }
                });
            }
        });     
    }
    handleOnClickSuggestion = () => {
        const {viewSuggestion} = this.state;
        this.setState({
            viewSuggestion: !viewSuggestion
        })
    }
    handleOnChangeInput = e => {
        const { cookies } = this.props;
        this.setState({
            [e.target.name] : e.target.value
        }, () => {
            if(e.target.name === "filterByCourse") {
                getSections({ college_abbr: "", course_code: this.state.filterByCourse, active_term: cookies.get("selterm") })
                .then(response => {
                    if(response.data && response.data.section) {
                        this.setState({
                            sections: response.data.section.length > 0 ? response.data.section : "",
                            pageNum: 1
                        }, () => this.getFilteredSchedules());
                    }
                });            
            }
            if (e.target.name === "filterBySection") {
                this.setState({
                    pageNum: 1
                }, () => this.getFilteredSchedules());          
            }
        });        

    }
    handleOnSearchEvent = e => {
        const { cookies } = this.props;
        if(e.target.name === "searchByEDPCodes") {             
            const { 
                studentInfo, searchBySubject, searchByEDPCodes, selectedSubjects, has_nstp, has_pe, 
                filterByCourse, filterBySection, selectionType 
            } = this.state;
            let sanitizedEdpCodes = searchByEDPCodes.trim();
            sanitizedEdpCodes = sanitizedEdpCodes.replace(/\s+/g, '');
            if(sanitizedEdpCodes !== "") {
                const dataSchedAll = {
                    course_code: filterByCourse,
                    department_abbr: selectionType === "enrollment" ? this.state.department_abbr : "",
                    year_level: selectionType === "enrollment" ? 9 : 0,
                    subject_name: searchBySubject.toUpperCase(),
                    section: selectionType === "enrollment" ? (studentInfo.assigned_section ? studentInfo.assigned_section : filterBySection) : "",
                    status: selectionType === "enrollment" ? 1 : 9, 
                    sort: 0, gen_ed: "", page: 1, limit: 0, no_nstp: 0, no_pe: 0, edp_codes: [],
                    active_term: cookies.get("selterm")
                }
                const nstpAndPECommon = {
                    course_code: studentInfo.course_code,
                    department_abbr: "",
                    year_level: 0,
                    subject_name: searchBySubject.toUpperCase(),
                    section: "", status: 1, sort: 0, gen_ed: "", page: 1, limit: 0, 
                    no_nstp: selectionType === "enrollment" ? (has_nstp === 1 ? 0 : 1) : 1, 
                    no_pe: selectionType === "enrollment" ? (has_pe === 1 ? 0 : 1) : 1,
                    edp_codes: [],
                    active_term: cookies.get("selterm")   
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
                    else { 
                        const edpCodes = new Set(values[0].data.schedules.map(schedule => schedule.edpcode));
                        allWithSelectedScheds = [...values[0].data.schedules, ...values[1].data.schedules.filter(schedule => !edpCodes.has(schedule.edpcode))];
                    }                               
                    if(selectionType === "adjustment") allWithSelectedScheds = allWithSelectedScheds.filter(schedule => schedule.status > 0); //return only deployed subjects
                    const withoutSelectedScheds = allWithSelectedScheds.filter(schedule => !selectedSubjects.some(sched => schedule.edpcode === sched.edpcode));

                    sanitizedEdpCodes = sanitizedEdpCodes.split(",");
                    sanitizedEdpCodes = Array.isArray(sanitizedEdpCodes) ? sanitizedEdpCodes : [sanitizedEdpCodes];

                    let withSplitCodes = [];
                    sanitizedEdpCodes.forEach((schedule, index) => {
                        withSplitCodes = [...withSplitCodes, ...getSplitCodePair(withoutSelectedScheds, schedule)];
                    })
                    this.setState({
                        searchEdpCodesArr: [...withSplitCodes, ...sanitizedEdpCodes],
                        pageNum: 1,
                    }, () => this.getFilteredSchedules());

                }).catch(error => {
                    console.log(error);
                });
            }
            this.setState({
                searchEdpCodesArr: [],
                pageNum: 1,
            }, () => this.getFilteredSchedules());

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
    
    handleAcceptProceed = e => {
        const { cookies } = this.props;
        const { studentInfo, selectedSubjects,  } = this.state;
        const selectedSubjectEDPCodes = selectedSubjects.map((subject, index) => {
            const edpCodeProp = subject.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
            return subject[edpCodeProp]
        }); 
        let yearLevel = this.state.yearLevel;   
            yearLevel = yearLevel.length > 2  ? yearLevel.substring(0, 2) : yearLevel;       
        const data = {
            id_number: studentInfo.stud_id,
            schedules: selectedSubjectEDPCodes,
            total_units: this.state.totalUnitsSelected,
            year_level: yearLevel,
            classification: studentInfo.classification,
            accept_section: 1,
            active_term: cookies.get("selterm")
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
        const { cookies } = this.props;
        const { studentInfo, selectedSubjects, adjustOrigSubjects, selectionType } = this.state;

        if(selectionType === "enrollment") {            
            let yearLevel = this.state.yearLevel;   
                yearLevel = yearLevel.length > 2  ? yearLevel.substring(0, 2) : yearLevel;       
            const withNstp = selectedSubjects ? selectedSubjects.filter(schedule => schedule.subject_name.startsWith("NSTP")) : [];
            const withPE = selectedSubjects ? selectedSubjects.filter(schedule => schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E.")) : [];
            let proceed = true;
            if((yearLevel === 1 || yearLevel === 2) && (withNstp.length === 0 || withPE.length === 0)) {
                let confirmMsg = "You did not select ";
                confirmMsg += withNstp.length === 0 && withPE.length === 0 ? "an NSTP and PE schedules. " : "";
                confirmMsg += withNstp.length === 0 && withPE.length > 0 ? "an NSTP schedule. " : "";
                confirmMsg += withNstp.length > 0 && withPE.length === 0 ? "a PE schedule. " : "";
                confirmMsg += "Are you sure you want to proceed without selecting? Click Ok to proceed, Cancel to select.";
                if(window.confirm(confirmMsg)) proceed = true;
                else proceed = false;                 
            } 
            else {
                const confirmMsg1 = "Are you sure to want to submit? If all subjects are correct and good to go, please press OK. If you want to double check and make more changes press Cancel";
                if(window.confirm(confirmMsg1)) proceed = true;
                else proceed = false;
            }
            if(proceed) {
                const selectedSubjectEDPCodes = selectedSubjects.map((schedule, index) => {
                    const edpCodeProp = schedule.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
                    return schedule[edpCodeProp]
                }); 
                const data = {
                    id_number: studentInfo.stud_id,
                    schedules: selectedSubjectEDPCodes,
                    total_units: this.state.totalUnitsSelected,
                    year_level: yearLevel,
                    classification: studentInfo.classification,
                    active_term: cookies.get("selterm")
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
        } 
        else if(selectionType === "adjustment") {             
            const adjustOrigEDPCodes = adjustOrigSubjects.map((schedule, index) => {
                return schedule.edpcode
            });
            const selectedEDPCodes = selectedSubjects.map((schedule, index) => {
                return schedule.edpcode
            }); 
            const data = {
                id_number: studentInfo.stud_id,
                addEdpCodes: selectedEDPCodes.filter(edpCode => !adjustOrigEDPCodes.includes(edpCode)),
                deleteEdpCodes: adjustOrigEDPCodes.filter(edpCode => !selectedEDPCodes.includes(edpCode))
            }
            this.setState({
                disableSubmitBtn: true   
            }, () => {
                saveSubjectAdjustments(data)
                .then(response => {           
                    if(response.data.success) {
                        alert("Schedules Adjustments Completed.");
                        this.setState({
                            disableSubmitBtn: false   
                        }, () => {
                            const { history } = this.props;
                            history.push("/enrollment/student/steps");
                        });  
                    }
                    else {
                        alert("Schedules adjustments saving failed. Please try again, if issue persist contact EDP office.")
                        this.setState({
                            disableSubmitBtn: false   
                        });
                    }
                }) 
            });
            
        }    
    }
    handleOnAddSchedule = e => {
        const { selectedSubjects, searchedSubjects, maxUnitsAllowed, totalUnitsSelected, pageNum } = this.state;
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
        else if((maxUnitsAllowed - parseInt(subjectUnits, 10)) < 0 ) {
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
            const edpCodeProp = e[0].hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
            //const filteredSearchedSubjects = getDifferenceBetweenArrayObjects(searchedSubjects, e, edpCodeProp);
            const filteredSearchedSubjects = searchedSubjects.filter(subject => !e.some(subj => subj[edpCodeProp] === subject[edpCodeProp]));
            this.setState({
                selectedSubjects: [...selectedSubjects, ...e],
                searchedSubjects: filteredSearchedSubjects,
                maxUnitsAllowed: maxUnitsAllowed - parseInt(subjectUnits, 10),
                totalUnitsSelected: totalUnitsSelected + parseInt(subjectUnits, 10),
                showConflictError: false,
                showOverloadError: false,
                errorMsg: "",
            }, () => this.getFilteredSchedules()); 
        }   
    }
    handleOnRemoveSchedule = e => {
        const { selectedSubjects, searchedSubjects, maxUnitsAllowed, totalUnitsSelected } = this.state;    
        //const filteredSelectedSubjects = getDifferenceBetweenArrayObjects(selectedSubjects, e, edpCodeProp);
        //const subjectUnits = e.filter(sched => sched.subject_type !== "L" || sched.subject_type !== "LAB")[0].units; 
        const filteredSelectedSubjects = selectedSubjects.filter(subject => !e.some(subj => subj.edpcode === subject.edpcode));      
        const subjectUnits = getTotalUnitsTaken(e); 
        this.setState({
            searchedSubjects: [...searchedSubjects, ...e],
            selectedSubjects: filteredSelectedSubjects,
            maxUnitsAllowed: maxUnitsAllowed + parseInt(subjectUnits, 10),
            totalUnitsSelected: totalUnitsSelected - parseInt(subjectUnits, 10),
        }, () => this.getFilteredSchedules());    
    }
    getSectionSubjects = () => {
        const { cookies } = this.props;
        const { maxUnitsAllowed } = this.state;
        getStudentSavedSchedules(getLoggedUserDetails("idnumber"), cookies.get("selterm"))
        .then(response => {  
            if(response.data) {  
                const subjectUnits = getTotalUnitsTaken(response.data.schedules);       
                this.setState({
                    selectedSubjects: response.data.schedules.map(({edp_code, ...rest}) => ({...rest, edpcode: edp_code})), //Change prop name edp_code to edpcode to match search subjects
                    adjustOrigSubjects: response.data.schedules.map(({edp_code, ...rest}) => ({...rest, edpcode: edp_code})),
                    totalUnitsSelected : getTotalUnitsTaken(response.data.schedules),
                    has_nstp: response.data.has_nstp,
                    has_pe: response.data.has_pe,
                    maxUnitsAllowed: parseInt(maxUnitsAllowed, 10) - parseInt(subjectUnits, 10), 
                }, () => this.getFilteredSchedules());
            }
        });
    }
    getFilteredSchedules = () => {
        const { cookies } = this.props;
        const { 
            studentInfo, searchBySubject, searchEdpCodesArr, selectedSubjects, yearLevel, has_nstp, has_pe, 
            assignedSection, pageNum, rowsPerPage, filterByCourse, filterBySection, selectionType 
        } = this.state;
            const dataSchedAll = {
                course_code: filterByCourse,
                department_abbr: selectionType === "enrollment" ? this.state.department_abbr : "",
                year_level: selectionType === "enrollment" ? 9 : 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchBySubject.toUpperCase(),
                section: selectionType === "enrollment" ? (studentInfo.assigned_section ? studentInfo.assigned_section : filterBySection) : "",
                status: selectionType === "enrollment" ? 1 : 9, 
                sort: 0, gen_ed: "", page: 1, limit: 0, no_nstp: 0, no_pe: 0,
                active_term: cookies.get("selterm") 
            }
            const nstpAndPECommon = {
                course_code: studentInfo.course_code,
                department_abbr: "",
                year_level: 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchBySubject.toUpperCase(),
                section: "", status: 1, sort: 0, gen_ed: "", page: 1, limit: 0, 
                no_nstp: selectionType === "enrollment" ? (has_nstp === 1 ? 0 : 1) : 1, 
                no_pe: selectionType === "enrollment" ? (has_pe === 1 ? 0 : 1) : 1,
                active_term: cookies.get("selterm")   
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
                else if (assignedSection && yearLevel === 1 && selectionType === "enrollment") allWithSelectedScheds = values[1].data.schedules.filter(schedule => schedule.section.charAt(0) === "1");  
                else if (assignedSection && yearLevel > 1 && selectionType === "enrollment") allWithSelectedScheds = values[1].data.schedules;    
                else {
                    //allWithSelectedScheds = [...values[0].data.schedules, ...values[1].data.schedules];  
                    const edpCodes = new Set(values[0].data.schedules.map(schedule => schedule.edpcode));
                    allWithSelectedScheds = [...values[0].data.schedules, ...values[1].data.schedules.filter(schedule => !edpCodes.has(schedule.edpcode))];
                }                             
                allWithSelectedScheds = allWithSelectedScheds.filter(schedule => parseInt(schedule.size, 10) < parseInt(schedule.max_size, 10));  
                if(selectionType === "adjustment") allWithSelectedScheds = allWithSelectedScheds.filter(schedule => schedule.status === 1); //return only deployed subjects
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
            studentInfo, selectedSubjects, showOverloadError, showConflictError, errorMsg, maxUnitsAllowed, totalRowsCount, rowsPerPage, pageNum, sections, courses,
            searchedSubjects, searchByEDPCodes, searchBySubject, totalUnitsSelected, has_nstp, has_pe, assignedSection, disableAcceptBtn, disableSubmitBtn, yearLevel,
            filterBySection, filterByCourse, selectionType, adjustOrigSubjects,viewSuggestion
        } = this.state;
        let loadNotification = "";
        let loadSearchSubject = "";
        let showSubmitBtn = false;
        if(studentInfo) {
            if(assignedSection && selectionType === "enrollment") {
                let loadAcceptBtn = true;
                const withNstp = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("NSTP"));
                const withPE = selectedSubjects.filter(schedule => schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."));

                //if(has_nstp === 0 || has_pe === 0) loadAcceptBtn = false; 
                //if((withNstp && withNstp.length > 0) && (withPE && withPE.length > 0)) loadAcceptBtn = true;
                let nstpPeMsg = "Please click Accept and Proceed button below to continue to the next Enrollment Step.";
                if(has_nstp === 0 && has_pe === 0 && yearLevel === 1) {
                    if((withNstp && withNstp.length > 0) && (withPE && withPE.length > 0)) loadAcceptBtn = true;
                    else loadAcceptBtn = false;
                    nstpPeMsg = "You are required to add NSTP and PE subjects. Before you click Accept and Proceed please choose an NSTP and PE schedule first.";
                }
                if(has_nstp === 1 && has_pe === 0 && yearLevel === 1) {
                    if(withPE && withPE.length > 0) loadAcceptBtn = true;
                    else loadAcceptBtn = false;
                    nstpPeMsg = "You are required to add a PE subject. Before you click Accept and Proceed please choose a PE schedule first.";
                }
                if(has_nstp === 0 && has_pe === 1 && yearLevel === 1) {
                    if(withNstp && withNstp.length > 0) loadAcceptBtn = true;
                    else loadAcceptBtn = false;
                    nstpPeMsg = "You are required to add an NSTP subjects. Before you click Accept and Proceed please choose an NSTP schedule first.";
                }
                if(yearLevel > 1) loadAcceptBtn = true;
                loadNotification = (
                    <div className="mb-2">
                        <div className="notification">
                            You belong in a blocked section. <strong>Section: {assignedSection}</strong>. <br />
                            {nstpPeMsg}
                            <div className="buttons">
                                {
                                    loadAcceptBtn ? (
                                        <button className={"button is-small is-primary mt-2 has-text-weight-semibold " + (disableAcceptBtn ? "is-loading" : "")} 
                                                onClick={this.handleAcceptProceed} disabled={disableAcceptBtn}
                                        >Accept and Proceed</button>
                                    ) : ( 
                                        <button className="button is-small is-primary mt-2 has-text-weight-semibold" disabled={true} >Accept and Proceed</button>      
                                    ) 
                                }
                            </div>                                    
                        </div>
                    </div>
                )
            }
            else if(selectionType === "adjustment") {              
                if(selectedSubjects && adjustOrigSubjects) {
                    const filter1 = selectedSubjects.filter(subject => !adjustOrigSubjects.some(subj => subj.edpcode === subject.edpcode));    
                    const filter2 = adjustOrigSubjects.filter(subject => !selectedSubjects.some(subj => subj.edpcode === subject.edpcode));  
                    if(filter1.length > 0 || filter2.length > 0) showSubmitBtn = true;
                    else showSubmitBtn = false;
                } 
            }
            else {
                showSubmitBtn = true;
                /*if(studentInfo.year_level > 1) showSubmitBtn = true;
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
                }*/
            }
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
                            filterBySection={filterBySection}   
                            filterByCourse={filterByCourse}    
                            sections={sections ? sections : ""}    
                            courses={courses}         
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
            if(selectionType === "enrollment") {
                if(has_nstp === 1 && has_pe === 1 && assignedSection) loadSearchSubject = "";               
                if(disableSubmitBtn) loadSearchSubject = "";     
            }
        }
        return(
            <Fragment>
                <div className={"modal " + (viewSuggestion == true?  "is-active " : "")}>
                    <div className="modal-background" onClick={this.handleOnClickSuggestion}></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                           <Suggestion />
                        </section>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                </div>
                <h4 className="is-size-4 has-text-weight-bold mb-2">Subject Selection</h4>   
                <div className="buttons">
                    <button className="button is-small is-link" onClick={this.handleOnClickBack}>
                        <span className="icon is-small">
                        <i className="fas fa-angle-left"></i>
                        </span>
                        <span>Back to Enrollment Steps</span>
                    </button>     
                    <button className="button is-small is-info" onClick={this.handleOnClickSuggestion}>
                        <span className="icon is-small">
                        <i className="fas fa-angle-left"></i>
                        </span>
                        <span>Suggestions</span>
                    </button>          
                </div>
                {selectionType === "enrollment" ? loadNotification : ""}
                <div className="columns">
                    <div className="column is-three-quarters-widescreen pb-0 mb-0">
                        <SelectedSubjects 
                            selectedSubjects={selectedSubjects} 
                            hasSection={selectionType === "enrollment" ? (assignedSection ? true : false) : false}
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

export default withCookies(withRouter(SubjectSelection))
//export default withRouter(SubjectSelection)