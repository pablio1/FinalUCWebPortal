import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import GradesTable from '../../components/elements/GradesTable';
import Pdf from "react-to-pdf";

const ref = React.createRef();

export default class StudentInfoWithGrades extends Component {
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e.target.name, e.target.value);
    }
    handleOnButtonClick = (e, idnum) => {
        this.props.handleOnButtonClick(e, idnum);
    }
    render() {
        const { studentInfo, editables, selectedTab, studentGrades, viewer } = this.props;
        const classificationLabels = { O : "OLD STUDENT", H : "NEW STUDENT", T: "TRANSFEREE", R: "RETURNEE", S: "SHIFTEE" };
        let idPicture = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments.filter(document => document.type === "2x2 ID Picture") : "";
        idPicture = idPicture  ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + idPicture[0].filename : "";
        const loadYearLevelOptions = studentInfo.college === "Senior High" ? (
            <Fragment>
            <option value="12">12</option>
            <option value="11">11</option>
            </Fragment>
        ) : (
            <Fragment>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
            </Fragment>
        );
        const loadIDNumber = viewer === "REGISTRAR" && selectedTab === "pending" ? (
            <input 
                name="stud_id" className="input is-small has-text-weight-bold p-1" type="text" placeholder="ID Number" 
                maxLength="12" value={editables.stud_id} onChange={this.handleOnchangeInput}
                required data-fieldname="Id Number" 
            />
        ) : editables.stud_id ;
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
                            <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable mb-0">                                        
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
                                            } - {studentInfo.college === "Senior High" ? loadSessionMdn : ""}   
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