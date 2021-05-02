import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';

import { convertMilitaryToStandardTime } from '../../helpers/helper';
import { getClassList, getPermitList } from '../../helpers/apiCalls';
import ClassListTable from '../elements/ClassListTable';

class SchedulesTable extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        showModal: false, selectedEdpCodeClassList: '', edpCode: '', subjectName: '', schedule: '', units: '', 
        officiallyEnrolled: null, pendingEnrolled: null, notAccepted: null,
        selectedEdpCodePermitList: '',
    }
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e);
    }
    handleGradeEntry = (type, edpCode) => {
        this.props.handleGradeEntry(type, edpCode);
    }
    handleGradeEntryExam = e => {
        this.props.handleGradeEntry(e.target.name, e.target.value);
    }
    onClickAccordion = e => {
        this.props.onClickAccordion(e);
    }
    closeModal = () => {
        this.setState({
            showModal: false
        })
    }
    removeSchedule = e => {
        this.props.removeSchedule(e);
    }
    handleOpenClassList = e => {
        const { cookies } = this.props;
        if(e) {
            this.setState({
                selectedEdpCodeClassList: e,
                showModal: true
            }, () => {
                getClassList(this.state.selectedEdpCodeClassList, cookies.get("selterm"))
                .then(response => {
                    if(response.data) {
                        const data = response.data;                    
                        this.setState({
                            edpCode: data.edp_code, 
                            subjectName: data.subject_name, 
                            schedule: data.time_info, 
                            units: data.units, 
                            officiallyEnrolled: data.official_enrolled.length > 0 ? data.official_enrolled : null, 
                            pendingEnrolled: data.pending_enrolled.length > 0 ? data.pending_enrolled : null, 
                            notAccepted: data.not_accepted.length > 0 ? data.not_accepted : null
                        });
                    }
                    else {
                        alert("No records found. Please try again.");
                    }
                });
            })
        }
    }
    handleOpenPermitList = e => {
        const { cookies } = this.props;
        if(e) {
            this.setState({
                selectedEdpCodePermitList: e,
                showModal: true
            }, () => {
                getPermitList(this.state.selectedEdpCodePermitList, cookies.get("selterm"))
                .then(response => {
                    if(response.data) {
                        const data = response.data;                
                        this.setState({
                            edpCode: data.edp_code, 
                            subjectName: data.subject_name, 
                            schedule: data.time_info, 
                            units: data.units, 
                            officiallyEnrolled: data.enrolled && data.enrolled.length > 0 ? data.enrolled : null, 
                            pendingEnrolled: null, 
                            notAccepted: null
                        });
                    }
                    else {
                        alert("No records found. Please try again.");
                    }
                });
            })
        }
    }
    render() {    
        const { subjects, accSelectedSubjectsExpand, module, gradeEntryData } = this.props;
        const {
            showModal, edpCode, subjectName, schedule, units, 
            officiallyEnrolled, pendingEnrolled, notAccepted
        } = this.state;
        // *** Start for Grade Submission ****
        let gradeSubmissionDeadline = gradeEntryData && gradeEntryData.submissionDeadline ? gradeEntryData.submissionDeadline.split(" ")[0] : "";
        let submittedGradesArr = {};
        let lateSubmittedGradesArr = {};
        // Sanitize submitted grade from report
        if(gradeEntryData && gradeEntryData.submittedGrades) {
            gradeEntryData.submittedGrades.forEach(subj => {
                let arrItem = subj.split(" - ");
                submittedGradesArr[arrItem[0]] = arrItem[1];
            });
        }
        // Sanitize late submitted grade from report
        if(gradeEntryData && gradeEntryData.lateSubmittedGrades) {
            gradeEntryData.lateSubmittedGrades.forEach(subj => {
                let arrItem = subj.split(" - ");
                lateSubmittedGradesArr[arrItem[0]] = arrItem[2];
            });
        }
        // *** End for Grade Submission ****
        const schedStatusLabel = { 0: "Undeployed", 1: "Deployed", 2: "Dissolved", 3: "Requested", 4: "Deferred", 5: "Closed" };        
        const loadSubjects = subjects ? subjects.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const edpCodeProp = schedule.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
            const splitSchedules = schedule.split_type === "S" ? subjects.filter(sched => sched.split_code === schedule[edpCodeProp] && sched.split_type!=="S") : "";
            let isfull = schedule.size >= schedule.max_size ? <i className="fas fa-exclamation has-text-danger"></i> : "";
            // *** Start -- Only for GradeEntry module **** 
            let loadExamSelectOptions = [];
            if(module === "GradeEntry" && gradeEntryData.optionExamsSetting) {                
                const optionExamsObj = gradeEntryData.optionExamsSetting[schedule.dept];
                for(let key in optionExamsObj) {
                    if(optionExamsObj.hasOwnProperty(key)) {
                        if(process.env.REACT_APP_CAMPUS === "Banilad") {
                            if(optionExamsObj[key].enable) loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);
                        }
                        else loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);
                    }
                }       
            }    
            let gradeSubmissionStatus = <span className="has-text-danger-dark">Deadline: {gradeSubmissionDeadline}</span>;
            if(submittedGradesArr.hasOwnProperty(schedule[edpCodeProp])) gradeSubmissionStatus = <span className="has-text-success-dark">SUBMITTED</span>;
            if(lateSubmittedGradesArr.hasOwnProperty(schedule[edpCodeProp])) gradeSubmissionStatus = <span className="has-text-danger-dark">Submitted {lateSubmittedGradesArr[schedule[edpCodeProp]]} Late</span>;       
            // *** End -- Only for GradeEntry module ****
            return (
                <Fragment key={index}>
                <tr className={ schedule.size >= schedule.max_size && module !== "GradeEntry" ? "has-background-danger-light" : ""}>  
                    { module !== "GradeEntry" ? <td className="valign has-text-centered is-narrow">{isfull}</td> : null }                
                    <td className="valign is-narrow">{schedule[edpCodeProp]}</td>
                    <td className="valign">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-right" data-tooltip={schedule.descriptive_title.trim()}>
                        {schedule.subject_name}
                        </span>
                    </td>
                    <td className="valign has-text-centered">{schedule.subject_type}</td>
                    <td className="valign has-text-centered">{schedule.units}</td>
                    <td className="valign has-text-right">{schedule.days}</td>
                    <td className="valign has-text-right">{convertMilitaryToStandardTime(schedule.m_begin_time)} - {convertMilitaryToStandardTime(schedule.m_end_time)}</td>
                    <td className="valign has-text-centered">{schedule.room}</td>
                    { module !== "GradeEntry" ? <td className="valign has-text-centered">{schedule.max_size}</td> : null }
                    { module !== "GradeEntry" ? <td className="valign has-text-centered">{schedule.size}</td> : null }
                    { module !== "GradeEntry" ? <td className="valign has-text-centered">{schedule.official_enrolled}</td> : null }
                    { module !== "GradeEntry" ? <td className="valign has-text-centered">{schedule.pending_enrolled}</td> : null }
                    <td className="valign has-text-centered">{schedule.section}</td>
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>
                    { module !== "GradeEntry" ? <td className="valign has-text-centered">{schedStatusLabel[schedule.status]}</td> : null }
                    { module !== "GradeEntry" ? null : <td className="valign has-text-centered has-text-weight-semibold">{gradeSubmissionStatus}</td> }
                    { 
                        module !== "GradeEntry" ? null : ( 
                            <td className="valign has-text-centered">
                                <span className={"select is-small m-0 p-0 " + (gradeEntryData.selectedExam && gradeEntryData.selectedExam[schedule[edpCodeProp]] ? "is-danger" : "") }>
                                    <select className="pt-0 pb-0" name={"selectedExam." + schedule[edpCodeProp]} value={gradeEntryData.selectedExam[schedule[edpCodeProp]]} onChange={this.handleGradeEntryExam}>
                                        <option key={0} value="">Select Exam</option>
                                        {loadExamSelectOptions}
                                    </select>
                                </span>
                            </td>
                         ) 
                    }                    
                    <td className="valign has-text-centered">
                        <div className="tags">
                            {   
                                module !== "GradeEntry" ? (
                                    <div className="tag is-small is-info is-clickable has-tooltip-top" data-tooltip="Class List" onClick={() => this.handleOpenClassList(schedule[edpCodeProp])}>
                                        <i className="fas fa-clipboard-list"></i>
                                    </div> 
                                ) : (
                                    <Fragment>
                                    <div className="tag is-small is-info is-clickable has-tooltip-top" data-tooltip="Enter Grade" onClick={() => this.handleGradeEntry("enter", schedule[edpCodeProp])}>
                                        <i className="fas fa-edit"></i>
                                    </div>
                                    <div className="tag is-small is-primary is-clickable has-tooltip-top" data-tooltip="Download E-Grade" onClick={() => this.handleGradeEntry("download", schedule[edpCodeProp])}>
                                        <i className="fas fa-file-download"></i>
                                    </div>
                                    </Fragment>
                                )                                
                            }
                            {module === "TeachersLoading" ? <div className="tag is-small is-danger is-clickable has-tooltip-top" data-tooltip="Unload" onClick={() => this.removeSchedule(schedule[edpCodeProp])}>Unload</div> : ""}  
                            {module === "MyLoads" || module === "TeachersLoadView" ? <div className="tag is-small is-primary is-clickable has-tooltip-top" data-tooltip="Permit List" onClick={() => this.handleOpenPermitList(schedule[edpCodeProp])}><i className="fas fa-stamp"></i></div> : "" }          
                        </div>                        
                    </td>
                </tr>
                {
                    splitSchedules ? splitSchedules.map((split, index) => {
                        return(
                            <tr key={index} className="has-background-link-light">     
                                { module !== "GradeEntry" ? <td></td> : null }                          
                                <td className="valign is-narrow pt-0 pb-0"><i className="fas fa-caret-right"></i> {split[edpCodeProp]}</td>
                                <td className="valign pt-0 pb-0">{split.subject_name}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.subject_type}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.units}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.days}</td>
                                <td className="valign has-text-right pt-0 pb-0">{convertMilitaryToStandardTime(split.m_begin_time)} - {convertMilitaryToStandardTime(split.m_end_time)}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.room}</td>
                                { module !== "GradeEntry" ? <td className="valign has-text-centered pt-0 pb-0">{split.max_size}</td> : null }
                                { module !== "GradeEntry" ? <td className="valign has-text-centered pt-0 pb-0">{split.size}</td> : null }
                                { module !== "GradeEntry" ? <td className="valign has-text-centered pt-0 pb-0">{split.official_enrolled}</td> : null }
                                { module !== "GradeEntry" ? <td className="valign has-text-centered pt-0 pb-0">{split.pending_enrolled}</td> : null }
                                <td className="valign has-text-centered pt-0 pb-0">{split.section}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.course_abbr}</td>
                                { module !== "GradeEntry" ? <td className="valign has-text-centered pt-0 pb-0">{schedStatusLabel[split.status]}</td> : null }
                                { module !== "GradeEntry" ? null : <td className="valign has-text-centered"></td> }
                                { module !== "GradeEntry" ? null : <td className="valign has-text-centered"></td> }
                                <td className="valign has-text-centered pt-0 pb-0"></td>
                            </tr>
                        )
                    }) : <tr></tr>
                }
                </Fragment>   
            )
        }) : ""; 
        return(  
            <Fragment>    
                <div className={"modal " + (showModal ?  "is-active " : "")}>
                    <div className="modal-background" onClick={this.closeModal}></div>
                    <div className="modal-content">
                        <ClassListTable 
                            edpCode={edpCode}
                            subjectName={subjectName}
                            schedule={schedule}
                            units={units}
                            officiallyEnrolled={officiallyEnrolled}
                            pendingEnrolled={pendingEnrolled}
                            notAccepted={notAccepted}
                        /> 
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                </div>
                <article className="message is-small m-0 pt-0">
                    <div className="message-header is-clickable" onClick={() => this.onClickAccordion("list")}>
                    <p>LIST VIEW</p>   
                    <button className="is-small p-0" aria-label="delete" onClick={() => this.onClickAccordion("list")}>
                        <span className="icon is-small">
                            <i className={accSelectedSubjectsExpand ? "fas fa-minus" : "fas fa-plus"}></i>
                        </span>
                    </button>            
                </div>
                    {
                        accSelectedSubjectsExpand ? (
                            <div className="message-body p-0">
                            <div className="table-container p-0">
                                <table className="table is-striped is-fullwidth is-size-7 is-hoverable">
                                    <thead>
                                        <tr> 
                                            { module !== "GradeEntry" ? <th className="is-narrow">Full</th> : null }                                  
                                            <th className="is-narrow">EDP Code</th>
                                            <th>Subject</th>
                                            <th className="has-text-centered">Type</th>
                                            <th className="has-text-centered">Units</th>
                                            <th className="has-text-right">Days</th>
                                            <th className="has-text-right">Time</th>
                                            <th className="has-text-centered">Room</th>
                                            { module !== "GradeEntry" ? <th className="has-text-centered is-narrow">Max Size</th> : null }  
                                            { module !== "GradeEntry" ? <th className="has-text-centered is-narrow">Size</th> : null }  
                                            { module !== "GradeEntry" ? <th className="has-text-centered is-narrow">Official</th> : null }  
                                            { module !== "GradeEntry" ? <th className="has-text-centered is-narrow">Pending</th> : null }  
                                            <th className="has-text-centered is-narrow">Section</th>
                                            <th className="has-text-centered">Course</th>
                                            <th className="has-text-centered">Status</th>
                                            { module !== "GradeEntry" ? null : <th className="has-text-centered">Exam</th> }
                                            <th className="has-text-centered">Action</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            { module !== "GradeEntry" ? <Fragment><th></th><th></th><th></th><th></th><th></th><th></th><th></th></Fragment> : <th></th> }  
                                            <th></th><th></th><th></th><th></th><th></th><th></th>
                                            <th></th><th></th><th></th><th></th><th></th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                    { loadSubjects ? loadSubjects : (    
                                                <tr>
                                                    { module !== "GradeEntry" ? <Fragment><th></th><th></th><th></th><th></th><th></th><th></th><th></th></Fragment> : <th></th> }  
                                                    <th></th><th></th><th></th><th></th><th></th><th></th>
                                                    <th></th><th></th><th></th><th></th><th></th>                                                    
                                                </tr>
                                            )
                                        }                                                                                             
                                    </tbody>
                                </table>    
                            </div>                                  
                            </div>
                        ) : ""
                    }
                </article>             
            </Fragment> 
        )
    }
}

export default withCookies(SchedulesTable);