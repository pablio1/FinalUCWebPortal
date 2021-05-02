import React, { Component, Fragment } from 'react';
import Pdf from "react-to-pdf";
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif';

const ref = React.createRef();

export default class StudentInformation extends Component {
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e.target.name, e.target.value);
    }
    handleOnOpenImageModal = e => {
        this.setState({
            showImageModal: true, 
            documentPath: e    
        });
    }
    handleOnCloseImageModal = () => {
        this.setState({
            showImageModal: false, 
            documentPath: ''    
        });
    }
    render() {
        const { studentInfo, editables, viewer, selectedTab } = this.props;
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
            );
        }) : "";
        const loadIDNumber = viewer === "REGISTRAR" && selectedTab === "pending" ? (
            <input 
                name="stud_id" className="input is-small has-text-weight-bold p-1" type="text" placeholder="ID Number" 
                maxLength="12" value={editables.stud_id} onChange={this.handleOnchangeInput}
                required data-fieldname="Id Number" 
            />
        ) : editables.stud_id;
        let loadYearLevelOptions = (
            <Fragment>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
            </Fragment>
        );
        if (studentInfo.college === "Senior High") {
            loadYearLevelOptions = (
                <Fragment>
                <option value="12">12</option>
                <option value="11">11</option>
                </Fragment>
            );
        }
        if (studentInfo.college === "Junior High") {
            loadYearLevelOptions = (
                <Fragment>
                <option value="10">10</option>
                <option value="9">9</option>
                <option value="8">8</option>
                <option value="7">7</option>
                </Fragment>
            );
        } 
        if (studentInfo.college === "Elementary") {
            loadYearLevelOptions = (
                <Fragment>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
                <option value="K1">K1</option>
                <option value="N1">N1</option>
                </Fragment>
            );
        }  
        const loadSessionMdn = selectedTab === "pending" ? (
            <span className="select is-small is-fullwidth ml-1">                            
                <select name="session" className="is-narrow" value={editables.session} //disabled={true}
                        onChange={this.handleOnchangeInput} required data-fieldname="Session">
                    <option value="">Session</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </span>
        ) : editables.session;
        return studentInfo ? (
            <div ref={ref}>
                <article className="message is-link m-0 pt-0">
                    <div className="message-header pt-2 pb-2">
                        <p>Student Profile</p>  
                        <Pdf targetRef={ref} filename={studentInfo.stud_id + "-studentProfile.pdf"} scale={0.7} x={5} y={.5} >
                            {({ toPdf }) => (
                                <button 
                                    className="button is-link"
                                    onClick={toPdf} 
                                    aria-label="delete"                                               
                                >
                                    <span className="icon">
                                        <i className="fas fa-file-pdf"></i>
                                    </span>
                                </button>
                            )}
                        </Pdf>                    
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
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
                                        <td>
                                            {
                                                selectedTab === "pending" ? (
                                                    <input 
                                                        name="allowed_units" className="input is-small" type="text" placeholder="Max Units Allowed" 
                                                        maxLength="12" value={editables.allowed_units} onChange={this.handleOnchangeInput}
                                                        required data-fieldname="Max Number of Units" 
                                                    />
                                                ) : editables.allowed_units
                                            }                                            
                                        </td>
                                    </tr>
                                    <tr>   
                                        <th className="is-narrow">Middle Name:</th>
                                        <td>{studentInfo.middle_name}</td>  
                                        <th className="is-narrow has-text-link">Year Level:</th>
                                        <td className="">
                                            <div className="field is-grouped">
                                            {
                                                selectedTab === "pending" ? (
                                                    <span className="select is-small is-fullwidth">                            
                                                        <select name="year_level" value={editables.year_level}
                                                                onChange={this.handleOnchangeInput} required data-fieldname="Year Level">
                                                            <option value="">Select Year</option>
                                                            {loadYearLevelOptions}
                                                        </select>
                                                    </span>
                                                ) : editables.year_level + (studentInfo.assigned_section ? " (" + studentInfo.assigned_section + ") " : "")
                                            } - {studentInfo.college === "Senior High" || studentInfo.college === "Junior High" ? loadSessionMdn : ""}   
                                            </div>                                         
                                        </td>                                              
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Last Name:</th>
                                        <td>{studentInfo.last_name}</td>    
                                        <th className="is-narrow has-text-link">Classification:</th> 
                                        <td>
                                            {
                                                selectedTab === "pending" ? (
                                                    <span className="select is-small is-fullwidth">                            
                                                        <select name="classification" value={editables.classification}
                                                                onChange={this.handleOnchangeInput} required data-fieldname="classification">
                                                            <option value="">Select Classification</option>
                                                            <option value="O">OLD STUDENT</option>
                                                            <option value="H">NEW STUDENT</option>
                                                            <option value="T">TRANSFEREE</option>
                                                            <option value="R">RETURNEE</option>
                                                            <option value="S">SHIFTEE</option>
                                                        </select>
                                                    </span>
                                                ) : classificationLabels[editables.classification]
                                            }                                            
                                        </td>                                          
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Name Suffix:</th>
                                        <td>{studentInfo.suffix}</td>    
                                        <th className="is-narrow">College:</th>
                                        <td>{studentInfo.college}</td>                                            
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered has-text-weight-bold">{loadIDNumber}</td>
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
                                    {loadDocuments}                                                      
                                </tbody>
                            </table>    
                        </div>                                
                    </div>
                </article>    
            </div>
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