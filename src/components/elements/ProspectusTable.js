import React, { Component, Fragment } from 'react';
import {hasSubjectLab, getGrade,getLoggedUserDetails } from '../../helpers/helper';
export default class ProspectusTable extends Component {

    
    state = {
        selectedSubject: null, internal_code: null, subjectDescription: null,
        grade: 2.9
    }
    viewScheduleButtonHandle = (selected, internal, description) =>{
        const{selectedSubject,internal_code,subjectescription} = this.state;
        this.setState({
            selectedSubject: selected,
            internal_code: internal,
            subjectDescription: description
        })
        this.props.viewScheduleButtonHandle(selected, internal, description);
        console.log("checkTab",selectedSubject, internal, description);
    }
    viewButtonVisibity = (grade) => {
        var visible = false;
        if((grade > 3.0 || grade === 0 ) && grade != null && this.props.selectedTab <= getLoggedUserDetails("yearlevel")){
            visible = true;
        }
        return visible;
    }
    checkPrerequisiteStatus = (internal_code) =>{
        const {requisites, grades} = this.props;
        var status= false;
        var countGrade = 0;
        var countRemark = 0;
        var loadRemark = requisites? requisites.filter(filt => filt.internal_code == internal_code).map((remark, index)=>{
            countRemark++; //1
            var loadGrade = grades ? grades.filter(fil => fil.internal_code == remark.requisites).map((grade, key)=>{
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
  render() {
      const{grade} = this.state
      const {subjects,selectedTab, requisites, grades,semesters} = this.props;
      
      var countRemark = 0;
      const semArray  = ['', 'First', 'Second','Summer'];
      var loadSemesters = semesters ? semesters.map((sem, first)=>{
        var totalUnits = 0;
        var filteredSummerSubjects = subjects.filter(filt => filt.year_level == selectedTab && filt.semester == sem), countSummer = filteredSummerSubjects.length;

        var loadSubjects = subjects? subjects.filter(filt => filt.year_level == selectedTab 
            && filt.semester == sem && (filt.split_type == "S")).map((sub, index) => {
                let labUnit = hasSubjectLab(subjects, sub.internal_code);
               totalUnits = labUnit + parseInt(sub.units)+ totalUnits;
               var getGrades = getGrade(grades, sub.internal_code);
               var getPrerequisites = requisites ? requisites.filter(remark => remark.internal_code === sub.internal_code).map((rem, i) => {
                    return ( 
                        <span key={i} className={"ml-1 tag"+ (getGrade(grades,rem.requisites) <= 30 && getGrade(grades,rem.requisites) != 0? " is-success":" is-danger")}>{rem.subject_code}</span>
                    )
               }) :"";
               return(
                <Fragment key={index}>
                    <tr className = {getGrades > 3? "has-background-danger-light": ""}>
                        <td>{sub.subject_name}</td>
                        <td>{sub.descr_1}</td>
                        <td className="has-text-centered">{sub.units}</td>
                        <td className="has-text-centered">{labUnit}</td>
                        <td className="has-text-centered">{parseInt(sub.units)+ labUnit}</td>
                        <td>{getPrerequisites}</td>
                        <td className={"has-text-centered has-text-weight-bold "+ (getGrades > 30 ? "has-text-danger":"has-text-info")} >{getGrades !== 0 && getGrades}</td>
                        <td>{  this.viewButtonVisibity(getGrades) && this.checkPrerequisiteStatus(sub.internal_code)? <button className="button is-info is-small" onClick={() => this.viewScheduleButtonHandle(sub.subject_name, sub.internal_code, sub.descr_1)}>View Schedules</button>  : "" }</td>
                    </tr> 
                </Fragment>

            )
        }):"";
        return(
            <Fragment key={first}>
                {(countSummer != 0 && sem == 3) &&
                    <div>
                        <div className="message-header">
                            <p className="has-text-weight-bold">{semArray[sem]} {sem == 3?'':'Semester'}</p>   
                        </div>
                        <div className="message-body p-0">
                            <div className="table-container is-size-7">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                            <th className="is-narrow">Subject Code</th>
                                            <th>Descriptive Title</th>
                                            <th className="has-text-centered">Lec</th>
                                            <th className="has-text-centered">Lab</th>
                                            <th className="has-text-centered">Total Units</th>
                                            <th className="has-text-left">Pre-requisites</th>
                                            <th className="has-text-centered">Grade</th>
                                            <th className="has-text-centered">Actions</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                            <td className="has-text-centered has-text-weight-bold">{totalUnits}</td>
                                            <td></td>
                                            <td colSpan="2" className="is-narrow">                                        
                                            </td>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        {loadSubjects}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
                {sem != 3 &&
                    <div>
                        <div className="message-header">
                            <p className="has-text-weight-bold">{semArray[sem]} {sem == 3?'':'Semester'}</p>   
                        </div>
                        <div className="message-body p-0">
                            <div className="table-container is-size-7">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                            <th className="is-narrow">Subject Code</th>
                                            <th>Descriptive Title</th>
                                            <th className="has-text-centered">Lec</th>
                                            <th className="has-text-centered">Lab</th>
                                            <th className="has-text-centered">Total Units</th>
                                            <th className="has-text-left">Pre-requisites</th>
                                            <th className="has-text-centered">Grade</th>
                                            <th className="has-text-centered">Actions</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                            <td className="has-text-centered has-text-weight-bold">{totalUnits}</td>
                                            <td></td>
                                            <td colSpan="2" className="is-narrow">                                        
                                            </td>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                        {loadSubjects}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        )
      }):"";
    return (
        <Fragment>
            <article className="message mb-0 pb-0 is-small">
                {loadSemesters}
            </article>
        </Fragment>
    );
  }
}
