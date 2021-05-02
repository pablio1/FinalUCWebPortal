import React, { Component, Fragment } from 'react';
import GradesTable from '../../components/elements/GradesTable';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif';

export default class StudentInfoViewGrades extends Component {
    render() {
        const { studentInfo, studentGrades } = this.props;
        const classificationLabels = { O : "OLD STUDENT", H : "NEW STUDENT", T: "TRANSFEREE", R: "RETURNEE", S: "SHIFTEE" };
        let idPicture = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments.filter(document => document.type === "2x2 ID Picture") : "";
        idPicture = idPicture  ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + idPicture[0].filename : "";
        return studentInfo ? (
            <Fragment>
            <div className="">
                <article className="message is-link m-0 pt-0">
                    <div className="message-header pt-2 pb-2">
                        <p>Student Profile</p>                        
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable mb-0">                                        
                                <tbody>
                                    <tr>
                                        <td rowSpan="4" className="is-narrow pt-3">
                                            <figure className="image is-128x128">
                                                <img src={idPicture ? idPicture : DefaultAvatar} alt=""  style={{ width:"128px", height: "128px"}} />
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
                                        <td className="">{studentInfo.year_level + (studentInfo.assigned_section ? " (" + studentInfo.assigned_section + ") " : "")} - {studentInfo.mdn}</td>                                              
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Last Name:</th>
                                        <td>{studentInfo.last_name}</td>    
                                        <th className="is-narrow has-text-link">Classification:</th> 
                                        <td>{classificationLabels[studentInfo.classification]}</td>                                          
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Name Suffix:</th>
                                        <td>{studentInfo.suffix}</td>    
                                        <th className="is-narrow">College:</th>
                                        <td>{studentInfo.college}</td>                                            
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered has-text-weight-bold">{studentInfo.stud_id}</td>
                                        <th className="is-narrow has-text-className=">Email:</th>
                                        <td>{studentInfo.email}</td>
                                        <th className="is-narrow">Course:</th>   
                                        <td>{studentInfo.course}</td>                                       
                                    </tr>                                                                                                    
                                </tbody>
                            </table>
                            <table className="table is-fullwidth is-narrow is-bordered is-hoverable mt-0">                                        
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
                {
                    studentGrades ? (
                        <GradesTable 
                            studentGrades={studentGrades} 
                            college={studentInfo.college}
                        />
                    ) : (
                        <div className="columns is-vcentered">
                            <div className="column is-center mt-2">
                                <h4 className="is-size-5 has-text-weight-bold">No Records Found. Please check using CIS.</h4>
                            </div>
                        </div> 
                    )
                }
            </div>       
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