import React, { Component, Fragment } from 'react';
import Pdf from "react-to-pdf";

import { convertMilitaryToStandardTime } from '../../helpers/helper';
import { getTotalUnitsTaken, convertTermToReadable } from '../../helpers/helper';

import UCLogo160x83 from '../../assets/sysimg/uc-logo-no-bg-160x83.png';

const ref = React.createRef();

export default class StudyLoad extends Component {
    render() {    
        const { subjects, studentInfo, enrollmentStatus, schoolTerm } = this.props;
        const totalUnitsSelected = subjects ? getTotalUnitsTaken(subjects) : 0;
        const enrolledStatus = enrollmentStatus.length > 0 ? enrollmentStatus.filter(status => status.step === 8) : "";
        const isEnrolled = enrolledStatus ? (enrolledStatus[0].done && enrolledStatus[0].approved ? true : false) : false;
        const fullName = studentInfo ? (studentInfo.last_name + ", " + studentInfo.first_name + " " + (studentInfo.middle_name ? studentInfo.middle_name.charAt(0) + ". " : "") + (studentInfo.suffix ? studentInfo.suffix : "")) : "";
        const loadEnrollStatus = !isEnrolled ? (
            <span className="has-text-danger-dark has-text-weight-semibold">PENDING ENROLLMENT</span> 
        ) : (
            <span className="has-text-primary-dark has-text-weight-semibold">OFFICIALLY ENROLLED</span> 
        );
        const loadSubjects = subjects ? subjects.map((subject, index) => {
            
            return (
                <tr key={index} className={subject.status === 2 ? "has-background-danger-light" : ""}>
                    <td className="is-narrow">{subject.edp_code}</td>
                    <td>{subject.subject_name}</td>
                    <td className="has-text-centered">{subject.subject_type}</td>
                    <td className="has-text-centered">{subject.units}</td>
                    <td className="has-text-right">{subject.days}</td>
                    <td className="has-text-right">{convertMilitaryToStandardTime(subject.m_begin_time)} - {convertMilitaryToStandardTime(subject.m_end_time)}</td>
                    <td className="has-text-centered">{subject.room}</td>
                    <td className="has-text-centered">{subject.course_abbr}</td>
                    <td className={"has-text-centered " + (subject.status === 2 ? "has-text-weight-semibold has-text-danger-dark" : "")}>{subject.status === 2 ? "Dissolved" : "" }</td>
                </tr>
            )
        }) : (
            <tr>
                <td></td><td></td><td></td><td></td><td></td>
                <td></td><td></td><td></td><td></td><td></td>
            </tr>
        );       
        return (
            <Fragment>
                <div ref={ref}>
                    <article className="message m-0 pt-0 is-light">
                        <div className="message-header pt-2">  
                            <img src={UCLogo160x83} className="m-0 p-0" style={{ width:"70px", height: "auto" }} />                           
                            <p>Study Load &nbsp;&nbsp;&nbsp;&nbsp;</p> 
                            {
                                isEnrolled ? (
                                    <Pdf targetRef={ref} filename={studentInfo.stud_id + "-studyload.pdf"} scale={0.9} x={10} y={5} >
                                        {({ toPdf }) => (
                                            <button 
                                                className="button is-dark" aria-label="delete" 
                                                onClick={toPdf} value="Download as PDF"                                                                                                      
                                            >
                                                <span className="icon is-small">
                                                    <i className="fas fa-file-pdf"></i>
                                                </span>
                                            </button>
                                        )}
                                    </Pdf>      
                                ) : "  -----  "
                            }                                      
                        </div>
                        <div className="message-body p-0">
                            <div className="is-hcenter">
                                    {loadEnrollStatus} 
                            </div>
                            <div className="is-hcenter is-size-7 has-text-weight-semibold">
                                    {convertTermToReadable(schoolTerm, false)}
                            </div>                                            
                            <table className="table is-striped is-fullwidth is-size-7 is-hoverable">
                                <tbody>
                                    <tr>
                                        <th className="is-narrow">Name</th>
                                        <td>{studentInfo ? fullName + " (" + studentInfo.stud_id + ") " : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">College</th>
                                        <td>{studentInfo ? studentInfo.college : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Course</th>
                                        <td>{studentInfo ? studentInfo.course : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Year Level</th>
                                        <td>{studentInfo ? studentInfo.year_level + (studentInfo.mdn ? " - " + studentInfo.mdn : "") : ""}</td>
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Section</th>
                                        <td>{studentInfo && studentInfo.assigned_section ? studentInfo.assigned_section : "Non-blocked"}</td>
                                    </tr>
                                </tbody>
                            </table>  
                            <div className="table-container p-0">
                                <table className="table is-striped is-fullwidth is-size-7 is-hoverable">
                                    <thead>
                                        <tr>
                                            <th className="is-narrow">EDP Code</th>
                                            <th>Subject</th>
                                            <th className="has-text-centered">Type</th>
                                            <th className="has-text-centered">Units</th>
                                            <th className="has-text-right">Days</th>
                                            <th className="has-text-right">Time</th>
                                            <th className="has-text-centered">Room</th>
                                            <th className="has-text-centered">Course</th>
                                            <th className="has-text-centered">Status</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th className="has-text-right">Total</th>
                                            <th className="has-text-centered">{totalUnitsSelected}</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                    <tbody>
                                    { loadSubjects ? loadSubjects : (    
                                                <tr>
                                                    <td></td><td></td><td></td>
                                                    <td></td><td></td><td></td>
                                                    <td></td><td></td><td></td>
                                                </tr>
                                            )
                                        }                                                                                             
                                    </tbody>
                                </table>    
                            </div>                                  
                        </div>
                    </article>
                </div>                
            </Fragment>  
        );
    };
}
