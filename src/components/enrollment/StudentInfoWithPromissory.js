import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { formatMoney } from '../../helpers/helper';

export default class StudentInfoWithPromissory extends Component {
    render() {
        const { studentInfo, promissoryData, promissoryType } = this.props;
        const examsCL = { P:"Prelim", M:"Midterm", S:"Semi-Final", F:"Final"};
        const examsSH = { P:"First Mastery Test", M:"First Quarter Test", S:"Second Mastery Test", F:"Second Quarter Test", P1:"Third Mastery Test", M1:"Third Quarter Test", S1:"Semi-Final Exam", F1:"Final Exam"};
        const examMonths = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];
        let outstandingHeader = "Outstanding Balance";
        if(studentInfo.dept === "CL" && promissoryType !== "enrollment") outstandingHeader = examsCL[promissoryType] + " Due";
        if(studentInfo.dept === "SH" && promissoryType !== "enrollment") outstandingHeader = examsSH[promissoryType] + " Due";
        if((studentInfo.dept === "JH" || studentInfo.dept === "BE") && promissoryType !== "enrollment") outstandingHeader = examMonths[promissoryType] + " Due";
        let loadClassification = "";
        if(studentInfo) {
            if(studentInfo.classification === "H") loadClassification = "NEW STUDENT";
            if(studentInfo.classification === "O") loadClassification = "OLD STUDENT";
            if(studentInfo.classification === "T") loadClassification = "TRANSFEREE";
            if(studentInfo.classification === "C") loadClassification = "CROSS ENROLLEE";
            if(studentInfo.classification === "R") loadClassification = "RETURNEE";
            if(studentInfo.classification === "S") loadClassification = "SHIFTEE";
        }
        let idPicture = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments.filter(document => document.type === "2x2 ID Picture") : "";
        idPicture = idPicture  ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + idPicture[0].filename : "";
        return studentInfo && promissoryData ? (
            <Fragment>
                <article className="message is-link m-0 pt-0">
                    <div className="message-header pt-2 pb-2">
                        <p>Student Profile</p>                                                  
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container mb-0">
                            <table className="table is-striped is-bordered is-hoverable">                                        
                                <tbody>
                                    <tr>
                                        <td rowSpan="4" className="is-narrow pt-3">
                                            <figure className="image is-128x128">
                                                <img src={idPicture ? idPicture : DefaultAvatar} alt="" style={{ width:"128px", height: "128px"}} />
                                            </figure>
                                        </td>
                                        <th className="is-narrow">First Name:</th>
                                        <td>{studentInfo.first_name}</td>
                                        <th className="is-narrow has-text-link">Set Max Units:</th>
                                        <td>{studentInfo.allowed_units}</td>
                                    </tr>
                                    <tr>   
                                        <th className="is-narrow">Middle Name:</th>
                                        <td>{studentInfo.middle_name}</td>  
                                        <th className="is-narrow has-text-link">Year Level:</th>
                                        <td className="">{studentInfo.year_level + (studentInfo.assigned_section ? " (" + studentInfo.assigned_section + ") " : "")} - {studentInfo.mdn}
                                        </td>                                              
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Last Name:</th>
                                        <td>{studentInfo.last_name}</td>    
                                        <th className="is-narrow has-text-link">Classification:</th> 
                                        <td>{loadClassification}</td>                                          
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Name Suffix:</th>
                                        <td>{studentInfo.suffix}</td>    
                                        <th className="is-narrow">College</th>
                                        <td>{studentInfo.college}</td>                                            
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered has-text-weight-bold">{studentInfo.stud_id}</td>
                                        <th className="is-narrow has-text-className=">Verified Email:</th>
                                        <td >{studentInfo.email}</td>
                                        <th className="is-narrow">Course:</th>   
                                        <td>{studentInfo.course}</td>                                       
                                    </tr>                                                           
                                </tbody>
                            </table>    
                        </div>
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                <tbody>                                   
                                    <tr>                                                        
                                        <th className="is-narrow">Mobile #:</th>
                                        <td>{studentInfo.mobile}</td>
                                        <th className="is-narrow">Landline #:</th>
                                        <td>{studentInfo.landline}</td>
                                        <th className="is-narrow">Facebook:</th>
                                        <td>{studentInfo.facebook}</td>
                                    </tr>                                                          
                                </tbody>
                            </table>    
                        </div>                                                      
                    </div>
                </article> 
                <article className="message mb-0">
                    <div className="message-header">
                        <p>{outstandingHeader}</p>
                    </div>
                    <div className="message-body pt-1 pb-1 pl-5">
                        <h4 className="is-size-5 has-text-weight-bold">{promissoryData.needed_payment ? formatMoney(promissoryData.needed_payment) : "0.00"}</h4>
                    </div>
                </article>
                <article className="message mt-1 mb-0">
                    <div className="message-header">
                        <p>Can only pay</p>
                    </div>
                    <div className="message-body pt-1 pb-1 pl-5">
                        <h4 className="is-size-5 has-text-weight-bold">{promissoryData.promise_pay ? formatMoney(promissoryData.promise_pay) : "0.00"}</h4>
                    </div>
                </article>
                <article className="message mt-1">
                    <div className="message-header">
                        <p>Student's Message:</p>
                    </div>
                    <div className="message-body">
                        {promissoryData.message}
                    </div>
                </article>                    
            </Fragment>
        ):(
            <div className="columns is-vcentered">
                <div className="column is-center">
                    <figure className="image is-128x128">
                        <img src={SpinnerGif} alt="" />
                    </figure>
                </div>
            </div>   
        );
    };


}