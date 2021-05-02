import React, { Component } from 'react';
import { Fragment } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { sortArrayObjectsByProp } from '../../helpers/helper';

export default class ClassListTable extends Component {
 
    render() {
        const { edpCode, subjectName, schedule, units, officiallyEnrolled, pendingEnrolled, notAccepted } = this.props;
        const isPermitList = officiallyEnrolled && officiallyEnrolled[0].hasOwnProperty("has_permit") ? true : false;
        const sortBy = isPermitList ? "last_name" : "gender";
        const loadOfficiallyEnrolled = officiallyEnrolled && officiallyEnrolled.length > 0 ? sortArrayObjectsByProp(officiallyEnrolled, sortBy).map((student, index) => {
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-right">{student.last_name}</td>
                    <td className="has-text-right">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    { isPermitList ? "" : <td className="has-text-centered is-narrow">{student.gender}</td> }
                    <td className="has-text-right">{student.mobile_number}</td>
                    <td className="has-text-centered">{student.email}</td>
                    { 
                        isPermitList ? (
                            <td className={"has-text-centered is-narrow has-text-weight-semibold " + (student.has_permit === 0 ? "has-text-danger" : "has-text-success")}>
                                {student.has_permit === 0 ? "NO" : "YES"}
                            </td> 
                        ) : "" 
                    }
                </tr>
            );
        }) : "";
        const loadPendingEnrolled = pendingEnrolled && pendingEnrolled.length > 0 ? sortArrayObjectsByProp(pendingEnrolled, "gender").map((student, index) => {
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-right">{student.last_name}</td>
                    <td className="has-text-right">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td>
                    <td className="has-text-right">{student.mobile_number}</td>
                    <td className="has-text-centered">{student.email}</td>
                </tr>
            );
        }) : "";
        const loadNotAccepted = notAccepted && notAccepted.length > 0 ? sortArrayObjectsByProp(notAccepted, "gender").map((student, index) => {
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-right">{student.last_name}</td>
                    <td className="has-text-right">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td>
                    <td className="has-text-right">{student.mobile_number}</td>
                    <td className="has-text-centered">{student.email}</td>
                </tr>
            );
        }) : "";
        return (
            <article className="message is-link m-0 pt-0">
                <div className="message-header pt-2 pb-2">
                    <p>Class List</p>    
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="button is-info is-small"
                        table="classList"
                        filename={"classlist-" + edpCode}
                        sheet={edpCode}
                        buttonText="Excel"
                    />                                         
                </div>
                <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table id="classList" className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                            <tbody>
                                <tr>
                                    <th colSpan="2">EDP Code</th>
                                    <td colSpan="6" className="has-text-left">{edpCode}</td>                                 
                                </tr>  
                                <tr>
                                    <th colSpan="2">Subject</th>
                                    <td colSpan="6" className="has-text-left">{subjectName}</td>                                 
                                </tr>
                                <tr>
                                    <th colSpan="2">Schedule</th>
                                    <td colSpan="6" className="has-text-left">{schedule}</td>                                 
                                </tr>                           
                                <tr>
                                    <th className="is-narrow" colSpan="8">Officially Enrolled</th>
                                </tr> 
                                <tr>
                                    <th className="has-text-centered is-narrow">No.</th>
                                    <th className="is-narrow">ID number</th>
                                    <th className="has-text-right">Last Name</th>
                                    <th className="has-text-right">First Name</th>
                                    <th className="has-text-centered is-narrow">Course / Year</th>
                                    { isPermitList ? null : <th className="has-text-centered is-narrow">Gender</th> }                                    
                                    <th className="has-text-right">Mobile</th>
                                    <th className="has-text-centered">Email</th>
                                    { isPermitList ? <th className="has-text-centered">Has Permit</th> : null }
                                </tr>
                                { loadOfficiallyEnrolled ? loadOfficiallyEnrolled : (    
                                        <tr>
                                            <td></td><td></td><td></td><td></td><td></td>
                                            <td></td><td></td><td></td>  
                                        </tr>
                                    )
                                } 
                                {
                                    isPermitList ? "" : (
                                        <Fragment>
                                            <tr>
                                                <th className="is-narrow" colSpan="8">Pending Enrollment</th>
                                            </tr>                                
                                            <tr>
                                                <th className="has-text-centered is-narrow">No.</th>
                                                <th className="is-narrow">ID number</th>
                                                <th className="has-text-right">Last Name</th>
                                                <th className="has-text-right">First Name</th>
                                                <th className="has-text-centered is-narrow">Course / Year</th>
                                                <th className="has-text-centered is-narrow">Gender</th>
                                                <th className="has-text-right">Mobile</th>
                                                <th className="has-text-centered">Email</th>
                                            </tr>
                                            { loadPendingEnrolled ? loadPendingEnrolled : (    
                                                    <tr>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td>
                                                    </tr>
                                                )
                                            }
                                            <tr>
                                                <th className="is-narrow" colSpan="8">Pending Section Acceptance</th>
                                            </tr>  
                                            <tr>
                                                <th className="has-text-centered is-narrow">No.</th>
                                                <th className="is-narrow">ID number</th>
                                                <th className="has-text-right">Last Name</th>
                                                <th className="has-text-right">First Name</th>
                                                <th className="has-text-centered is-narrow">Course / Year</th>
                                                <th className="has-text-centered is-narrow">Gender</th>
                                                <th className="has-text-right">Mobile</th>
                                                <th className="has-text-centered">Email</th>
                                            </tr>   
                                            { loadNotAccepted ? loadNotAccepted : (
                                                    <tr>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td>
                                                    </tr>
                                                )
                                            } 
                                        </Fragment>
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