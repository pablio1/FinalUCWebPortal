import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif';

export default class StudentProfilePanel extends Component {

    render() {
        const { studentInfo, avatarPath } = this.props;
        const classificationLabels = { O : "OLD STUDENT", H : "NEW STUDENT", T: "TRANSFEREE", R: "RETURNEE", S: "SHIFTEE" };
        return studentInfo ? (
            <Fragment>
                <article className="message is-link m-0 pt-0">
                    <div className="message-header pt-2 pb-2">
                        <p>Profile Details</p>                                                  
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container mb-0">
                            <table className="table is-striped is-bordered is-hoverable">                                        
                                <tbody>
                                    <tr>
                                        <td rowSpan="4" className="is-narrow pt-3">
                                            <figure className="image is-128x128">
                                                <img src={avatarPath ? avatarPath : DefaultAvatar} alt="" style={{ width:"128px", height: "128px"}} />
                                            </figure>
                                        </td>
                                        <th className="is-narrow">First Name:</th>
                                        <td>{studentInfo.first_name}</td>
                                        <th className="is-narrow">Year Level:</th>
                                        <td>{studentInfo.year_level} - {studentInfo.mdn}</td>
                                    </tr>
                                    <tr>   
                                        <th className="is-narrow">Middle Name:</th>
                                        <td>{studentInfo.middle_name}</td>  
                                        <th className="is-narrow">Classification:</th>
                                        <td className="">{studentInfo.classification ? classificationLabels[studentInfo.classification] : "TBA"}</td>                                              
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Last Name:</th>
                                        <td>{studentInfo.last_name}</td>    
                                        <th className="is-narrow">College</th> 
                                        <td>{studentInfo.college}</td>                                          
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Name Suffix:</th>
                                        <td>{studentInfo.suffix}</td>    
                                        <th className="is-narrow">Course:</th>
                                        <td>{studentInfo.course}</td>                                            
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered has-text-weight-bold">{studentInfo.stud_id}</td>
                                        <th className="is-narrow has-text-className=">Verified Email:</th>
                                        <td colSpan="2">{studentInfo.email}</td>
                                        <td></td>                                       
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