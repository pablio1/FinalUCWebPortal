import React, { Component, Fragment } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { sortArrayObjectsByProp, isNumeric } from '../../helpers/helper';

export default class EgradeTable extends Component {
 
    render() {
        const { edpCode, subjectName, units, studentList, department, teacherID, teacherName, semester, isHidden } = this.props;
        const sortBy = department === "CL" ? "last_name" : "gender";
        let grade1Label = "Midterm Grade";
        let grade2Label = "Final Grade";
        if(department === "SH") {
            if(semester === "1") {
                grade1Label = "1st Quarter";
                grade2Label = "2nd Quarter";
            }
            if(semester === "2") {
                grade1Label = "3rd Quarter";
                grade2Label = "4th Quarter";
            }
        } 
        if(["JH","BE"].includes(department)) {
            grade1Label = "1st Grading";
            grade2Label = "2nd Grading";
        } 
        const loadStudentList = studentList && studentList.length > 0 ? sortArrayObjectsByProp(studentList, sortBy).map((student, index) => {
            let { grade1, grade2 } = "";
            if(department === "CL") {
                grade1 = isNumeric(student.grade1) && student.grade1.length === 2 ? student.grade1.charAt(0) + "." +  student.grade1.charAt(1) : student.grade1; // add .
                grade2 = isNumeric(student.grade2) && student.grade2.length === 2 ? student.grade2.charAt(0) + "." +  student.grade2.charAt(1) : student.grade2; // add .
            }  
            else {
                grade1 = student.grade1;
                grade2 = student.grade2;
            } 
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-right">{student.last_name}</td>
                    <td className="has-text-right">{student.firstname}</td>
                    <td className="has-text-right">{student.gender}</td>   
                    <td>{grade1}</td>
                    <td>{grade2}</td>
                    { 
                        ["JH","BE"].includes(department) ? (
                            <Fragment>
                                <td>{student.grade3}</td>
                                <td>{student.grade4}</td>
                            </Fragment>
                        ) : null 
                    }                    
                </tr>
            );
        }) : "";
        return(
            <article className={"message is-link m-0 pt-0 " + (isHidden ? "is-hidden" : "")}>
                <div className="message-header pt-2 pb-2">
                    <p>E-Grade</p>    
                    <ReactHTMLTableToExcel
                        id="egradeExportBtn"
                        className="button is-info is-small"
                        table="egrade"
                        filename={edpCode + "-" + subjectName}
                        sheet={edpCode}
                        buttonText="Excel"
                    />                                         
                </div>
                <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table id="egrade" className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                            <tbody>
                                <tr>
                                    <td colSpan="3" className="is-narrow">E-Grade Sheet</td>   
                                    <td colSpan="3">{department === "CL" && isHidden ? "Legend for Valid Grade Entries" : ""}</td>  
                                    <td></td>
                                    { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null }                        
                                </tr>
                                <tr>
                                    <td className="is-narrow">Edp Code:</td>  
                                    <td className="is-narrow">{"_" + edpCode}</td> 
                                    <td>Units: {units}</td>  
                                    <td>{department === "CL" && isHidden ? "Midterm" : ""}</td>  
                                    <td>{department === "CL" && isHidden ? "Finals" : ""}</td>  
                                    <td></td>    
                                    <td></td>                     
                                    { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null } 
                                </tr>
                                <tr>
                                    <td className="is-narrow">Subject:</td>  
                                    <td className="is-narrow">{subjectName}</td> 
                                    <td></td>
                                    <td>{department === "CL" && isHidden ? "1.0 - 3.5" : ""}</td>  
                                    <td>{department === "CL" && isHidden ? "1.0 - 5" : ""}</td>
                                    <td></td>   
                                    <td></td> 
                                    { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null }                        
                                </tr>  
                                <tr>
                                    <td className="is-narrow">Teacher ID:</td>  
                                    <td className="is-narrow">{teacherID}</td>  
                                    <td></td>
                                    <td>{department === "CL" && isHidden ? "3W" : ""}</td>  
                                    <td>{department === "CL" && isHidden ? "NA (if midterm is NA),DR,W" : ""}</td>
                                    <td></td>  
                                    <td></td>
                                    { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null }                            
                                </tr>
                                <tr>
                                    <td className="is-narrow">Teacher Name:</td>  
                                    <td className="is-narrow">{teacherName}</td>  
                                    <td></td> 
                                    <td>{department === "CL" && isHidden ? "NG,NA,W,DR" : ""}</td>  
                                    <td></td>
                                    <td></td> 
                                    <td></td>
                                    { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null }                             
                                </tr>                                
                                <tr>
                                    <th className="has-text-centered is-narrow">SN</th>
                                    <th className="is-narrow">ID number</th>
                                    <th className="has-text-right">Last Name</th>
                                    <th className="has-text-right">First Name</th>
                                    <th className="has-text-centered is-narrow">Gender</th> 
                                    <th className="has-text-centered is-narrow">{grade1Label}</th>
                                    <th className="has-text-centered is-narrow">{grade2Label}</th> 
                                    { 
                                        ["JH","BE"].includes(department) ? (
                                            <Fragment>
                                                <th className="has-text-centered is-narrow">3rd Grading</th>
                                                <th className="has-text-centered is-narrow">4th Grading</th> 
                                            </Fragment>
                                         ) : null 
                                    }                                   
                                </tr>
                                { loadStudentList ? loadStudentList : (    
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>  
                                            { ["JH","BE"].includes(department) ? <Fragment><td></td><td></td></Fragment> : null } 
                                        </tr>
                                    )
                                }                                                                                            
                            </tbody>
                        </table>             
                    </div>                                  
                </div>
            </article>  
        )
    }
}