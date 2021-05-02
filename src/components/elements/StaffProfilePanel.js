import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../assets/sysimg/user.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif';

export default class StaffProfilePanel extends Component {

    render() {
        const { staffInfo, avatarPath } = this.props;
        return staffInfo ? (
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
                                        <th className="is-narrow">Full Name:</th>
                                        <td>{staffInfo.fullname}</td>
                                    </tr>
                                    <tr>   
                                        <th className="is-narrow">Designation</th>
                                        <td>{staffInfo.courseyear}</td>                                              
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Email:</th>
                                        <td>{staffInfo.email}</td>                                            
                                    </tr>
                                    <tr>
                                        <th className="is-narrow">Course / Department</th>
                                        <td>{staffInfo.courseabbr}</td>                                            
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered has-text-weight-bold">{staffInfo.idnumber}</td>
                                        <th className="is-narrow has-text-className="></th>
                                        <td></td>                                       
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