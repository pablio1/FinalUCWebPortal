import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';

import { convertTermToReadable, getGradeDescriptorCode, isNumeric } from '../../helpers/helper';

export default class GradesTable extends Component {
    state = {
        collapseGrade: null
    }
    componentDidMount = () => {
        const { studentGrades } = this.props;
        if(studentGrades && studentGrades.length > 0) { 
            let terms = studentGrades.map(grade => {
                return parseInt(grade.term, 10)
            });
            terms = [...new Set(terms)];
            let accordionLabel = {};
            for(let i = 0; i < terms.length; i++) {
                accordionLabel[i] = false;
            }
            this.setState({
                collapseGrade: accordionLabel
            })
        }
    }
    handleHeaderClick = e => {
        let prevCollapseGrade = this.state.collapseGrade;
        prevCollapseGrade[e] = !prevCollapseGrade[e]
        this.setState({
            collapseGrade: prevCollapseGrade
        });
    }
    render() {   
        const { studentGrades, college } = this.props;
        const { collapseGrade } = this.state;
        let terms = [];
        let loadGradeTable = "";
        if(studentGrades && studentGrades.length > 0) { 
            terms = studentGrades.map(grade => {
                return parseInt(grade.term, 10)
            });

            terms = [...new Set(terms)]
            terms = terms.sort((a, b) => b - a);

            //Check grade if SHS format 50 above
            let counterSHS = 0;
            let counterJHS = 0;
            for(let j = 0; j < terms.length; j++) {
                const toCheckGrades = studentGrades.filter(grade => parseInt(grade.term, 10) === terms[j]);
                for(let i = 0; i < toCheckGrades.length; i++) {
                    if('midterm_grade' in toCheckGrades[i]) {
                        if(/^[a-zA-Z]+$/.test(toCheckGrades[i].midterm_grade)) {}
                        else {
                            if(parseInt(toCheckGrades[i].midterm_grade, 10) > 50) counterSHS++;
                        }
                        if(/^[a-zA-Z]+$/.test(toCheckGrades[i].final_grade)) {}
                        else {
                            if(parseInt(toCheckGrades[i].final_grade, 10) > 50) counterSHS++;
                        }
                    }
                    else counterJHS++;
                }
            }
            const isSHS = counterSHS > 0 ? true : false;
            const isJHS = counterJHS > 0 ? true : false; //If JHS/BED

            let labelG1 = "Midterm";
            let labelG2 = "Finals";
            if(isSHS) {
                labelG1 = "1st Qtr";
                labelG2 = "2nd Qtr";
            }
            if(isJHS) {
                labelG1 = "1st Grd";
                labelG2 = "2nd Grd";
            }

            loadGradeTable = terms.map((term, index) => {
                const termGrades = studentGrades.filter(grade => parseInt(grade.term, 10) === term);
                const loadGrades = termGrades.map((grade, i) => {
                    let rowStyle = "";
                    let finalStyle = "";
                    let midterm = "";
                    let final = "";
                    let finalGrade = ""; // For SHS / 3rd grading for JHS/BED
                    let loadGradeCols = "";
                    if(isSHS) {
                        midterm = grade.midterm_grade;
                        final = grade.final_grade;

                        if(midterm && final) {
                            if(isNumeric(midterm) && isNumeric(final)) {
                                finalGrade = (parseFloat(midterm) + parseFloat(final)) / 2; // Final
                                rowStyle = finalGrade < 75 ? "has-background-danger-light" : "";
                                finalStyle = finalGrade < 75 ? "has-text-danger has-text-weight-bold" : "";
                            }
                            else {                            
                                if(!isNumeric(final)) {
                                    finalGrade = grade.final_grade;
                                    rowStyle = "has-background-danger-light";
                                    finalStyle = "has-text-danger has-text-weight-bold";
                                }
                                else {
                                    rowStyle = "";
                                    finalStyle = "";
                                }
                            }
                        }
                        loadGradeCols = (
                            <Fragment>
                            <td><span>{getGradeDescriptorCode(midterm, grade.subject_name)}</span></td>
                            <td><span>{getGradeDescriptorCode(final, grade.subject_name)}</span></td>
                            <td><span className={finalStyle}>{getGradeDescriptorCode(finalGrade, grade.subject_name)}</span></td>
                            </Fragment>
                        );
                    }
                    else if(isJHS) {
                        let grade1 = grade.grade_1;
                        let grade2 = grade.grade_2;
                        let grade3 = grade.grade_3;
                        let grade4 = grade.grade_4;
                        let gradeFinal = "";

                        if(grade1 && grade2 && grade3 && grade4) {
                            if(isNumeric(grade1) && isNumeric(grade2) && isNumeric(grade3) && isNumeric(grade4)) {
                                gradeFinal = (parseFloat(grade1) + parseFloat(grade2) + parseFloat(grade3) + parseFloat(grade4)) / 4; // Final Average
                                rowStyle = gradeFinal < 75 ? "has-background-danger-light" : "";
                                finalStyle = gradeFinal < 75 ? "has-text-danger has-text-weight-bold" : "";
                            }
                            else {
                                rowStyle = "";
                                finalStyle = ""
                            }
                        }  

                        loadGradeCols = (
                            <Fragment>
                            <td><span>{getGradeDescriptorCode(grade1, grade.subject_name)}</span></td>
                            <td><span>{getGradeDescriptorCode(grade2, grade.subject_name)}</span></td>
                            <td><span>{getGradeDescriptorCode(grade3, grade.subject_name)}</span></td>
                            <td><span>{getGradeDescriptorCode(grade4, grade.subject_name)}</span></td>
                            <td><span>{getGradeDescriptorCode(gradeFinal, grade.subject_name)}</span></td>
                            </Fragment>
                        );
                    }
                    else {
                        if(/^[a-zA-Z]+$/.test(grade.midterm_grade) || /^[a-zA-Z]+$/.test(grade.final_grade) || grade.midterm_grade === "3W" || grade.final_grade === "3W") {
                            midterm = /^[a-zA-Z]+$/.test(grade.midterm_grade) ? grade.midterm_grade : grade.midterm_grade.trim().charAt(0) + "." + grade.midterm_grade.trim().charAt(1);                           
                            if(/^[a-zA-Z]+$/.test(grade.final_grade)) {
                                final = grade.final_grade;
                                rowStyle = final ? "has-background-danger-light" : "";
                                finalStyle = "has-text-danger has-text-weight-bold";
                            }
                            else {
                                final = grade.final_grade.trim().charAt(0) + "." + grade.final_grade.trim().charAt(1);
                                rowStyle = parseInt(grade.final_grade, 10) > 30  ? "has-background-danger-light" : "";
                                finalStyle = parseInt(grade.final_grade, 10) > 30  ? "has-text-danger has-text-weight-bold" : "";
                            }
                        }
                        else {
                            midterm = parseInt(grade.midterm_grade, 10) > 50 ? grade.midterm_grade : grade.midterm_grade.trim().charAt(0) + "." + grade.midterm_grade.trim().charAt(1);
                            final = parseInt(grade.final_grade, 10) > 50 ? grade.midterm_grade : grade.final_grade.trim().charAt(0) + "." + grade.final_grade.trim().charAt(1);
                            rowStyle = parseInt(grade.final_grade, 10) > 30 ? "has-background-danger-light" : "";
                            finalStyle = parseInt(grade.final_grade, 10) > 30  ? "has-text-danger has-text-weight-bold" : "";
                        }

                        // *** For Crim FORSCI subjects - Not shown to students yet TEMPORARY for term 20212 ONLY
                        if(grade.term === "20212") {
                            if(grade.subject_name === "FORSCI 222" || grade.subject_name === "FORSCI 221") {
                                midterm = "";
                                final = "";
                            }
                        }
                        // *** END FORSCI ********

                        loadGradeCols = (
                            <Fragment>
                            <td><span>{midterm}</span></td>
                            <td><span className={finalStyle}>{final}</span></td>
                            </Fragment>
                        );
                    
                    }
                    return (
                        <tr key={i} className={rowStyle}>
                            <td>{grade.subject_name}</td>
                            <td>{grade.descriptive}</td>
                            <td>{grade.subject_type === "L" ? "LAB" : "LEC"}</td>
                            <td>{grade.units}</td>
                            {loadGradeCols}
                        </tr>
                    )
                });
                return (
                    <article className="message is-light m-0 pt-0" key={index} style={{ border: "solid 1px white" }}>
                        <div className="message-header pt-2 pb-2 is-clickable" onClick={() => this.handleHeaderClick(index)}>
                            <p>{convertTermToReadable(term.toString(), false)}</p>     
                            <i className={"far " + (collapseGrade && collapseGrade[index] ? "fa-minus-square" : "fa-plus-square")}></i>              
                        </div>
                        <div className="message-body p-0">
                            {
                                collapseGrade && collapseGrade[index] ? (
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-size-7">
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Description</th>
                                                    <th>Type</th>
                                                    <th>Units</th>
                                                    <th>{labelG1}</th>
                                                    <th>{labelG2}</th>
                                                    {isSHS ? <th>Final</th> : null}
                                                    {isJHS ? <Fragment><th>3rd Grd</th><th>4th Grd</th><th>Final Ave</th></Fragment> : null}
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>                                 
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    {isSHS ? <th></th> : null}
                                                    {isJHS ? <Fragment><th></th><th></th></Fragment> : null}
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                {loadGrades}                                                                                         
                                            </tbody>
                                        </table>    
                                    </div>  
                                ) : ""
                            }                                  
                        </div>
                    </article> 
                );
            });
        }
        return(  
            <Fragment>    
                {loadGradeTable}              
            </Fragment> 
        )
    }
}