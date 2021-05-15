import React, { Component, Fragment} from "react";
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getCurriculum} from '../../helpers/apiCalls';
import { getGrade} from '../../helpers/helper';
import { getLoggedUserDetails, convertTabToYear, convertYearToTab,hasSubjectLab } from '../../helpers/helper';
import ViewSchedule from '../../components/elements/ViewSchedule';

export default class SuggestSubject extends Component {
    state = {
        prerequisites: null,subjects: null, grades: null, schedules: null,selectedSubject: null, internal_code: null, subjectDescription: null
        ,showModal: false,units: null
    }
    viewScheduleButtonHandle = (selected, internal, description) =>{
        const{selectedSubject,internal_code,subjectescription} = this.state;
        this.setState({
            selectedSubject: selected,
            internal_code: internal,
            subjectDescription: description,
            showModal: true
        })
        
        //console.log("checkTab",selectedSubject, internal, description);
    }
    viewButtonVisibity = (grade) => {
        var visible = false;
        if((grade > 3.0 || grade === 0 ) && grade != null){
            visible = true;
        }
        return visible;
    }
    checkPrerequisiteStatus = (internal_code) =>{
        const {prerequisites, grades} = this.state;
        var status= false;
        var countGrade = 0;
        var countRemark = 0;
        var loadRemark = prerequisites? prerequisites.filter(filt => filt.internal_code == internal_code).map((remark, index)=>{
            countRemark++;
            var loadGrade = grades ? grades.filter(fil => fil.internal_code == remark.prerequisites).map((grade, key)=>{
                if( grade.final_grade < 3)
                    countGrade++;
            }) : "";
        }) : "";
        
        if(countRemark != 0){
            if(countRemark != countGrade){
                status = false;
            }else{
                status = true;
            }
        }else{
            status = true;
        }
           
        return status;
    }
    checkPrerequisiteStatus = (internal_code) =>{
        const {prerequisites, grades} = this.state;
        var status= false;
        var countGrade = 0;
        var countRemark = 0;
        var loadRemark = prerequisites? prerequisites.filter(filt => filt.internal_code == internal_code).map((remark, index)=>{
            countRemark++; //1
            var loadGrade = grades ? grades.filter(fil => fil.internal_code == remark.prerequisites).map((grade, key)=>{
                if( grade.final_grade < 3)
                    countGrade++;
            }) : "";
        }) : "";
        
        if(countRemark != 0){
            if(countRemark != countGrade){
                status = false;
            }else{
                status = true;
            }
        }else{
            status = true;
        }
           
        return status;
    }
    componentDidMount = () =>{
        if(getLoggedUserDetails("curryear") != 0){
            var data = {
                id_number: getLoggedUserDetails("idnumber"),
                year: getLoggedUserDetails("curryear"),
                term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
            }
            getCurriculum(data)
            .then(response => {  
                if(response.data) {          
                    this.setState({
                        subjects: response.data.subjects,
                        prerequisites: response.data.prerequisites,
                        grades: response.data.grades,
                        schedules: response.data.schedules,
                        curr_year: response.data.curr_year,
                        units: response.data.units
                    });
                }
            });
        }  
    }
    closeModal = () => {
        this.setState({
            showModal: false
        })// 27 26 if(26<=27)
    }
    render() {
        
        const{subjects, grades, schedules, prerequisites,showModal,selectedSubject,internal_code,subjectDescription,units} = this.state;
        var totalUnits = 0;
        let temp = 0;
        var loadSubjects = subjects ? subjects.filter(filt => filt.split_type == 'S' && filt.year_level <= getLoggedUserDetails("yearlevel")).map((data, index)=>{
            var validateGrade = (getGrade(grades, data.internal_code) > 30 || getGrade(grades, data.internal_code) == 0 ) ? true: false;
            var getGrades = getGrade(grades, data.internal_code);
            var getPrerequisites = prerequisites ? prerequisites.filter(remark => remark.internal_code === data.internal_code).map((rem, i) => {
                return ( 
                    <span key={i} className={"ml-1 tag"+ (getGrade(grades,rem.prerequisites) < 30 && getGrade(grades,rem.prerequisites) != 0? " is-success":" is-danger")}>{rem.subject_code}</span>
                )
           }) :"";
            if(validateGrade && this.checkPrerequisiteStatus(data.internal_code)) {
                totalUnits += (hasSubjectLab(subjects,data.internal_code) + parseInt(data.units));
                if(totalUnits <= units){
                    temp = totalUnits;
                    return(
                        <Fragment>
                            <tr key={index}  className = {getGrade(grades, data.internal_code) > 3? "has-background-danger-light": ""}>
                                <td className="is-narrow">{data.subject_name}</td>
                                <td>{data.descr_1}</td>
                                <td className="has-text-centered">{data.units}</td>
                                <td className="has-text-centered">{hasSubjectLab(subjects,data.internal_code)}</td>
                                <td className="has-text-centered">{hasSubjectLab(subjects,data.internal_code) + parseInt(data.units)}</td>
                                <td className="has-text-left">{getPrerequisites}</td>
                                {/* <td className="has-text-centered">{(getGrade(grades, data.internal_code) == 0)? "": getGrade(grades, data.internal_code)}</td> */}
                                {/* <td>{  this.viewButtonVisibity(getGrades) && this.checkPrerequisiteStatus(data.internal_code)? <button className="button is-info is-small" onClick={() => this.viewScheduleButtonHandle(data.subject_name, data.internal_code, data.descr_1)}>View Schedules</button>  : "" }</td> */}
                            </tr>
                        </Fragment>
                    )
                }
            }
            
        }) : "";
        return (
        <Fragment>
            
            {
                getLoggedUserDetails("allowedunits") > 0 && 
                <article className="message mb-0 pb-0 is-small">
                    <div className="message-header">
                        <p className="has-text-weight-bold">List of Subjects to take this {process.env.REACT_APP_CURRENT_SCHOOL_TERM_FULL}</p>    
                                
                    </div>
                    <div className="message-body p-0">


                        <div className={"modal " + (showModal == true?  "is-active " : "")}>
                            <div className="modal-background" onClick={this.closeModal}></div>
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Schedule</p>
                                    <button className="delete" aria-label="close" onClick={this.closeModal}></button>
                                </header>
                                <section className="modal-card-body">
                                    <ViewSchedule 
                                        schedules = {schedules}
                                        selectedSubject = {selectedSubject}
                                        internal_code = {internal_code}
                                        subjectDescription = {subjectDescription}
                                    />
                                </section>
                            </div>
                            <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                        </div>

                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-hoverable">
                                <thead>
                                    <tr>
                                        <th className="is-narrow">Subject Code</th>
                                        <th>Descriptive Title</th>
                                        <th className="has-text-centered">Lec</th>
                                        <th className="has-text-centered">Lab</th>
                                        <th className="has-text-centered">Total Units</th>
                                        <th className="has-text-left">Pre-requisites</th>
                                        {/* <th className="has-text-centered">Grade</th> */}
                                        {/* <th className="has-text-centered">Actions</th> */}
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="has-text-centered">{temp}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                                <tbody>
                                {loadSubjects ? loadSubjects : (
                                    <tr>
                                        <td colSpan="8" className="has-text-centered is-small">No behind subject found!</td>
                                    </tr>
                                )}                                                                                           
                                </tbody>

                            </table>
                        </div>
                    </div>
                </article>
            }
            {
                getLoggedUserDetails("allowedunits") == 0 && 
                <div class="notification is-info is-light">
                    <button class="delete"></button>
                    You can only view suggested subjects once the Dean approves your registration.
                </div>
            }
        </Fragment>
        )
    };
}

