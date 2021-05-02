import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import * as XLSX from 'xlsx';

import { getLoggedUserDetails, sortArrayObjectsByProp, buildSubmitGradeRequest, getParsedExcelGrade, isNumeric } from '../../helpers/helper';
import { getTeachersLoad, getClassList, uploadGrades, teacherGradeReport } from '../../helpers/apiCalls';
import { optionExamsSetting } from '../../helpers/configObjects';

import SchedulesTable from '../../components/elements/SchedulesTable';
import EgradeTable from '../../components/elements/EgradeTable';

class GradeEntry extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        teachersLoad, accSelectedSubjectsExpand, edpCode, subjectName, schedule, units, studentList, department, 
        isSubmitBtnClicked, filename, isLoadingFile, selectedExam, optionExamsSetting, semester, submittedGrades, submissionDeadline
    }

    render() {
        const { 
            teachersLoad, accSelectedSubjectsExpand, edpCode, subjectName, schedule, units, studentList, department, 
            isSubmitBtnClicked, filename, isLoadingFile, selectedExam, optionExamsSetting, semester, submittedGrades, submissionDeadline
        } = this.state;
        const gradeEntryData = { selectedExam, optionExamsSetting, submittedGrades, submissionDeadline }; 
        const teacherID = getLoggedUserDetails("idnumber");
        const teacherName = getLoggedUserDetails("fullname");
        const loadSpinner = (
            <span className="icon">
                <i className="fas fa-spinner fa-pulse"></i>
            </span>
        );

        let loadExamSelectOptions = [];
        if(optionExamsSetting) {                          
            const optionExamsObj = optionExamsSetting[department];
            for(let key in optionExamsObj) {
                if(optionExamsObj.hasOwnProperty(key)) {
                    if(process.env.REACT_APP_CAMPUS === "Banilad") {
                        if(optionExamsObj[key].enable) loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);
                    }
                    else loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);                  
                }
            }       
        }    
        const loadMyLoad = teachersLoad ? (
            <Fragment> 
                <div className="columns">
                    <div className="column">
                        <SchedulesTable 
                            subjects={sortArrayObjectsByProp(teachersLoad, "edpcode")}
                            module="GradeEntry"
                            accSelectedSubjectsExpand={accSelectedSubjectsExpand}
                            gradeEntryData={gradeEntryData}
                            onClickAccordion={this.onClickAccordion}
                            handleGradeEntry={this.handleGradeEntry}
                        />
                    </div>
                </div>    
                <div className="columns">
                    <div className="column is-narrow">
                        <h4 className="has-text-weight-semibold is-size-6 pt-1">Upload E-Grade File</h4>      
                    </div>
                    <div className="column is-narrow">                   
                        <div className="file has-name is-small">
                            <label className="file-label"> 
                                <input className="file-input" type="file" accept=".xlsx, .xls" name="fileUploadInput" onChange={this.handleParseExcel} />
                                <span className="file-cta">
                                    <span className="file-icon">
                                        { isLoadingFile ? loadSpinner : <i className="fas fa-upload"></i> }
                                    </span>
                                    <span className="file-label">Click to Select File</span>
                                </span>
                                <span className="file-name">{filename}</span>
                            </label>
                        </div>
                    </div>
                    <div className="column is-narrow">                   
                        <div className="control">
                            <span className="select is-small">                                
                                <select className="pt-0 pb-0" name={"selectedExamUpload." + edpCode} value={optionExamsSetting[edpCode]} onChange={this.handleOnChangeInput}>
                                    <option key={0} value="">Select Exam</option>
                                    {loadExamSelectOptions}
                                </select>
                            </span>
                        </div>    
                    </div>
                    <div className="column is-narrow">                   
                        <button className="button is-info is-small" onClick={() => this.handleOnLoadFile(edpCode)} >                                                        
                            <span>Load File</span>         
                        </button>  
                    </div> 
                    <div className="column is-hidden-mobile"></div>
                </div>  
            </Fragment>
         ) : (
            <div className="columns is-vcentered">
                <div className="column is-center">
                    <div className="notification is-danger">
                        <strong>You currently do not have any Teaching Loads.</strong>                           
                    </div>
                </div>
            </div> 
        );
        const sortBy = department === "CL" ? "last_name" : "gender";
        const loadstudentList = studentList && studentList.length > 0 ? sortArrayObjectsByProp(studentList, sortBy).map((student, index) => {
            let { grade1, grade2 } = "";
            if(department === "CL") {
                grade1 = isNumeric(student.grade1) && student.grade1.length === 2 && !student.grade1.includes(".") ? student.grade1.charAt(0) + "." +  student.grade1.charAt(1) : student.grade1; // add .
                grade2 = isNumeric(student.grade2) && student.grade2.length === 2 && !student.grade2.includes(".") ? student.grade2.charAt(0) + "." +  student.grade2.charAt(1) : student.grade2; // add .
            }  
            else {
                grade1 = student.grade1;
                grade2 = student.grade2;
            } 
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-left">{student.last_name}</td>
                    <td className="has-text-left">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td> 
                    <td className="has-text-centered">
                        <input className="input is-small" style={{ width: "50px" }} name={"grade1." + index} type="text" 
                                value={grade1} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade1" ? false : true} />
                    </td>
                    <td className="has-text-centered">
                        <input className="input is-small" style={{ width: "50px" }} name={"grade2." + index} type="text" 
                                value={grade2} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade2" ? false : true} />
                    </td>    
                    <td className="has-text-centered">
                        { 
                            department === "JH" || department === "BE" ? (
                                <input className="input is-small" style={{ width: "50px" }} name={"grade3." + index} type="text" 
                                        value={student.grade3} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade3" ? false : true} /> 
                            ) : "" 
                        }
                    </td>
                    <td className="has-text-centered">
                        { 
                            department === "JH" || department === "BE" ? (
                                <input className="input is-small" style={{ width: "50px" }} name={"grade4." + index} type="text" 
                                        value={student.grade4} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade4" ? false : true} /> 
                            ) : "" 
                        }
                    </td>                
                </tr>
            );
        }) : "";
        let exam1Label = "Midterm";
        let exam2Label = "Final";
        let exam3Label = "3rd Grading";
        let exam4Label = "4th Grading";
        if(department === "SH") {
            if(semester === "1") {
                exam1Label = "1st QTR";
                exam2Label = "2nd QTR";
            }
            if(semester === "2") {
                exam1Label = "3rd QTR";
                exam2Label = "4th QTR";
            }
        }
        if(department === "JH" || department === "BE") {
            exam1Label = "1st Grading";
            exam2Label = "2nd Grading";
        }
        const loadInputGradeForm = loadstudentList ? (
            <article className="message is-link m-0 pt-0">                
                <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                            <tbody>
                                <tr>
                                    <th colSpan="2">EDP Code</th>
                                    <td colSpan="8" className="has-text-left">{edpCode}</td>                                                                 
                                </tr>  
                                <tr>
                                    <th colSpan="2">Subject</th>
                                    <td colSpan="8" className="has-text-left">{subjectName}</td>                                 
                                </tr>
                                <tr>
                                    <th colSpan="2">Schedule</th>
                                    <td colSpan="4" className="has-text-left">{schedule}</td>  
                                    <td colSpan="4">
                                        <div className="buttons">
                                            <button className="button is-primary is-small" onClick={this.handleCancelSubmit} >                                                        
                                                <span>Cancel</span>         
                                            </button>
                                            <button className={"button is-info is-small " + (isSubmitBtnClicked ? "is-loading" : "")} onClick={this.handleSubmitGrades} >                                                        
                                                <span>Submit</span>         
                                            </button>
                                        </div>
                                    </td>                                
                                </tr>                           
                                <tr>
                                    <th className="has-text-centered is-narrow">No.</th>
                                    <th className="has-text-centered is-narrow">ID number</th>
                                    <th className="has-text-left">Last Name</th>
                                    <th className="has-text-left">First Name</th>
                                    <th className="has-text-centered is-narrow">Course / Year</th>
                                    <th className="has-text-centered is-narrow">Gender</th>                                    
                                    <th className="has-text-centered is-narrow">{exam1Label}</th>
                                    <th className="has-text-centered is-narrow">{exam2Label}</th>
                                    <th className="has-text-centered is-narrow">{ department === "JH" || department === "BE" ? exam3Label : ""}</th>     
                                    <th className="has-text-centered is-narrow">{ department === "JH" || department === "BE" ? exam4Label : ""}</th> 
                                </tr>
                                { loadstudentList ? loadstudentList : (    
                                        <tr>
                                            <th colSpan="2">Grade Entry</th>
                                            <td colSpan="8">&nbsp;</td>                                 
                                        </tr>
                                    )
                                }                                                                                                                            
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="6">&nbsp;</th>
                                    <td colSpan="4">
                                        <div className="buttons">
                                            <button className="button is-primary is-small" onClick={this.handleCancelSubmit} >                                                        
                                                <span>Cancel</span>         
                                            </button>
                                            <button className={"button is-info is-small " + (isSubmitBtnClicked ? "is-loading" : "")} onClick={this.handleSubmitGrades} >                                                        
                                                <span>Submit</span>         
                                            </button>
                                        </div>
                                    </td>                                 
                                </tr>
                            </tfoot>
                        </table>             
                    </div>                                  
                </div>
            </article> 
        ) : "";
        return(
            <Fragment>
            <div className="columns">
                <div className="column">
                    {loadMyLoad}
                </div>
                <div className="column is-hidden-mobile is-1"></div>
                <div className="column is-hidden-mobile is-1"></div>
            </div>            
            <div className="columns">
                <div className="column is-two-thirds-desktop">
                    {
                        loadstudentList ? (
                            <EgradeTable
                                edpCode={edpCode}
                                subjectName={subjectName}
                                units={units}
                                studentList={studentList}
                                department={department}
                                teacherID={teacherID}
                                teacherName={teacherName}
                                semester={semester}
                                isHidden={true}
                            />
                        ) : ""
                    }
                    {loadInputGradeForm}
                </div>
            </div> 
            </Fragment>
        );
    }
}

export default withCookies(GradeEntry);