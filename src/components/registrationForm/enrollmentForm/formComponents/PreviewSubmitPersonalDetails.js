import React, { Component, Fragment } from 'react';

export default class PreviewSubmitPersonalDetails extends Component {  
    handleButtonClick = e => {

    }
    render() {
        const { 
            nationality, gender, civilstatus, religion, birthdate, birthplace, motherName, motherContact, motherOccupation,
            fatherName, fatherContact, fatherOccupation, guardianName, guardianContact, guardianOccupation 
        } = this.props;
        return(
            <Fragment> 
                <div className="">
                    <div className="divider is-size-6">Personal Details</div>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Nationality</th><td>{nationality.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Gender</th><td>{gender.toUpperCase()}</td>                                                    
                                </tr>                                
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                               
                    </div>  
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Civil Status</th><td>{civilstatus.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Religion</th><td>{religion.toUpperCase()}</td>                                                    
                                </tr>                                
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                         
                    </div> 
                    <div className="column">
                    <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Birthdate</th><td>{birthdate}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Birth Place</th><td>{birthplace.toUpperCase()}</td>                                                    
                                </tr>
                            </tbody>
                        </table>    
                    </div>                                                 
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Mother's Name</th><td>{motherName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Occupation</th><td>{motherOccupation.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Contact #</th><td>{motherContact.toUpperCase()}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                            
                    </div>  
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Father's Name</th><td>{fatherName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Occupation</th><td>{fatherOccupation.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Contact #</th><td>{fatherContact.toUpperCase()}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                         
                    </div>    
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Guardian's Name</th><td>{guardianName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Occupation</th><td>{guardianOccupation.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Contact #</th><td>{guardianContact.toUpperCase()}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                         
                    </div>                                             
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
    }

}