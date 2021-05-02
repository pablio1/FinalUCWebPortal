import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif';

export default class StudentInfoView extends Component {
    render() {
        const { studentInfo } = this.props;
        const classificationLabels = { O : "OLD STUDENT", H : "NEW STUDENT", T: "TRANSFEREE", R: "RETURNEE", S: "SHIFTEE" };
        let idPicture = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments.filter(document => document.type === "2x2 ID Picture") : "";
        idPicture = idPicture  ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + idPicture[0].filename : "";
        const loadDocuments = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments
        .filter(document => document.type !== "2x2 ID Picture")
        .map((document, index) => {
            return (
                <tr key={index}>                                                        
                    <th className="is-narrow">Document: </th>   
                    <td><a href={process.env.REACT_APP_PATH_STORAGE_ATTACHMENTS + document.filename} target="_blank">{document.type}</a></td>                                                     
                </tr>
            )
        }) : "";
        return studentInfo ? (
            <Fragment>
            <div className="">
                <article className="message is-link m-0 pt-0">
                    <div className="message-header pt-2 pb-2">
                        <p>Student Profile</p>                        
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
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
                        </div>                                
                    </div>
                </article> 

                <article className="message m-0 pt-0 is-link">
                    <div className="message-header">
                        <p>Personal Details</p>                   
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                <tbody>
                                    <tr>                                                        
                                        <th className="is-narrow">Nationality:</th>
                                        <td>{studentInfo.nationality}</td>
                                        <th className="is-narrow">Civil Status:</th>
                                        <td>{studentInfo.status}</td>
                                        <th className="is-narrow">Birthdate:</th>
                                        <td>{studentInfo.birthdate}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Gender:</th>
                                        <td>{studentInfo.gender}</td>
                                        <th className="is-narrow">Religion:</th>
                                        <td>{studentInfo.religion}</td>
                                        <th className="is-narrow">Birthplace:</th>
                                        <td>{studentInfo.birthplace}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th colSpan="6" className="is-narrow has-text-centered">Parents / Guardian Details</th>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Mother's Name:</th>
                                        <td>{studentInfo.mother_name}</td>
                                        <th className="is-narrow">Father's Name:</th>
                                        <td>{studentInfo.father_name}</td>
                                        <th className="is-narrow">Guardian's Name:</th>
                                        <td>{studentInfo.guardian_name}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Occupation:</th>
                                        <td>{studentInfo.mother_occupation}</td>
                                        <th className="is-narrow">Occupation:</th>
                                        <td>{studentInfo.father_occupation}</td>
                                        <th className="is-narrow">Occupation:</th>
                                        <td>{studentInfo.guardian_occupation}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Contact #:</th>
                                        <td>{studentInfo.mother_contact}</td>
                                        <th className="is-narrow">Contact #:</th>
                                        <td>{studentInfo.father_contact}</td>
                                        <th className="is-narrow">Contact #:</th>
                                        <td>{studentInfo.guardian_contact}</td>
                                    </tr>                                                           
                                </tbody>
                            </table>    
                        </div>                                
                    </div>
                </article> 

                <article className="message m-0 pt-0 is-link">
                    <div className="message-header">
                        <p>Address & Contact Details</p>                   
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                <tbody>
                                    <tr>                                                        
                                        <th colSpan="2" className="is-narrow has-text-centered">Current Address</th>
                                        <th colSpan="2" className="is-narrow has-text-centered">Permanent / Provincial Address</th>
                                        <th colSpan="2" className="is-narrow has-text-centered">Overseas Address</th>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Zip Code:</th>
                                        <td>{studentInfo.czip}</td>
                                        <th className="is-narrow">Zip Code:</th>
                                        <td>{studentInfo.pzip}</td>
                                        <th className="is-narrow">Country:</th>
                                        <td>{studentInfo.pcountry}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Province:</th>
                                        <td>{studentInfo.cprovince}</td>
                                        <th className="is-narrow">Province:</th>
                                        <td>{studentInfo.pprovince}</td>
                                        <th className="is-narrow">State / Province:</th>
                                        <td>{studentInfo.pcountry !== "PHILIPPINES" ? studentInfo.pprovince : ""}</td>  
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">City:</th>
                                        <td>{studentInfo.ccity}</td>
                                        <th className="is-narrow">City:</th>
                                        <td>{studentInfo.pcity}</td>
                                        <th className="is-narrow">City:</th>
                                        <td>{studentInfo.pcountry !== "PHILIPPINES" ? studentInfo.pcity : ""}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Barangay:</th>
                                        <td>{studentInfo.cbarangay}</td>
                                        <th className="is-narrow">Barangay:</th>
                                        <td>{studentInfo.pbarangay}</td>
                                        <th className="is-narrow">Postal Code:</th>
                                        <td>{studentInfo.pcountry !== "PHILIPPINES" ? studentInfo.pzip : ""}</td>
                                    </tr>  
                                    <tr>                                                        
                                        <th colSpan="2" className="is-narrow">Street Address:</th>
                                        <th colSpan="2" className="is-narrow">Street Address:</th>
                                        <th colSpan="2" className="is-narrow">Street Address:</th>
                                    </tr> 
                                    <tr>                                                        
                                        <td colSpan="2" >{studentInfo.cstreet}</td>
                                        <td colSpan="2" >{studentInfo.pstreet}</td>
                                        <td colSpan="2" >{studentInfo.pcountry !== "PHILIPPINES" ? studentInfo.pzip : ""}y</td>
                                    </tr> 
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

                <article className="message m-0 pt-0 is-link">
                    <div className="message-header">
                        <p>Previous Schools Details</p>                   
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                <tbody>
                                    <tr>                                                        
                                        <th colSpan="4" className="is-narrow has-text-centered">College / University</th>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Last Course Attended:</th>
                                        <td>{studentInfo.col_course}</td>
                                        <th className="is-narrow">Last Year Level:</th>
                                        <td>{studentInfo.col_last_year}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">School Name:</th>
                                        <td>{studentInfo.col_name}</td>
                                        <th className="is-narrow">School Year:</th>
                                        <td>{studentInfo.col_year}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th colSpan="4" className="is-narrow has-text-centered">Secondary School</th>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">School Name:</th>
                                        <td>{studentInfo.sec_name}</td>
                                        <th className="is-narrow">School Type:</th>
                                        <td>{studentInfo.sec_type}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Last Year Level:</th>
                                        <td>{studentInfo.sec_last_year}</td>
                                        <th className="is-narrow">LRN:</th>
                                        <td>{studentInfo.sec_lrn_number}</td>
                                    </tr> 
                                    <tr>                                                        
                                        <th className="is-narrow">Last Strand:</th>
                                        <td>{studentInfo.sec_last_strand}</td>
                                        <th className="is-narrow">ESC Student #:</th>
                                        <td>{studentInfo.sec_esc_student_id}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">School Year:</th>
                                        <td>{studentInfo.sec_year}</td>
                                        <th className="is-narrow">ESC School #:</th>
                                        <td>{studentInfo.sec_esc_student_id}</td>
                                    </tr> 
                                    <tr>                                                        
                                        <th colSpan="4" className="is-narrow has-text-centered">Primary School</th>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">School Name:</th>
                                        <td>{studentInfo.elem_name}</td>
                                        <th className="is-narrow">School Type:</th>
                                        <td>{studentInfo.elem_type}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow">Last Year Level:</th>
                                        <td>{studentInfo.elem_last_year}</td>
                                        <th className="is-narrow">LRN:</th>
                                        <td>{studentInfo.elem_lrn_number}</td>
                                    </tr> 
                                    <tr>                                                        
                                        <th className="is-narrow">School Year:</th>
                                        <td>{studentInfo.elem_year}</td>
                                        <th className="is-narrow">ESC Student #:</th>
                                        <td>{studentInfo.elem_esc_student_id}</td>
                                    </tr>
                                    <tr>                                                        
                                        <th className="is-narrow"></th>
                                        <td></td>
                                        <th className="is-narrow">ESC School #:</th>
                                        <td>{studentInfo.elem_esc_school_id}</td>
                                    </tr>                                                         
                                </tbody>
                            </table>    
                        </div>                                
                    </div>
                </article>

                <article className="message m-0 pt-0 is-link">
                    <div className="message-header">
                        <p>Required Documents Attached</p>                   
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                <tbody>
                                    {
                                        loadDocuments ? loadDocuments : (
                                            <tr>                                                        
                                                <th>No Documents Submitted</th>
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