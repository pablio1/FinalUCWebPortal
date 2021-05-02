import React, { Component, Fragment } from 'react';

export default class PreviewSubmitAddressContacts extends Component {  
    handleButtonClick = e => {

    }
    render() {
        const { 
            zipcodeCurrentAdd,provinceCurrentAdd,cityCurrentAdd,barangayCurrentAdd,streetCurrentAdd,
            zipcodePermanentAdd,provincePermanentAdd,cityPermanentAdd,barangayPermanentAdd,streetPermanentAdd,
            zipcodeOverseasAdd,provinceOverseasAdd,cityOverseasAdd,countryOverseasAdd,streetOverseasAdd,
            mobileNumber,landlineNumber,facebookAccount 
        } = this.props;
        return(
            <Fragment> 
                <div className="">
                    <div className="divider is-size-6">Address & Contact Details</div>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">Current Address</th></tr>
                            </thead>                                        
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Zip Code</th><td>{zipcodeCurrentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Province</th><td>{provinceCurrentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">City/Municipality</th><td>{cityCurrentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Barangay</th><td>{barangayCurrentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Street Address</th><td>{streetCurrentAdd}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                            
                    </div>  
                    <div className="column">  
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">Permanent / Provincial Address</th></tr>
                            </thead>                                        
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Zip Code</th><td>{zipcodePermanentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Province</th><td>{provincePermanentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">City/Municipality</th><td>{cityPermanentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Barangay</th><td>{barangayPermanentAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Street Address</th><td>{streetPermanentAdd}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                   
                    </div>    
                    <div className="column"> 
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">Overseas Address</th></tr>
                            </thead>                                        
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Country</th><td>{countryOverseasAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">State / Province</th><td>{provinceOverseasAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">City</th><td>{cityOverseasAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Postal Code</th><td>{zipcodeOverseasAdd}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Street Address</th><td>{streetOverseasAdd}</td>                                                    
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
                                    <th className="is-narrow">Mobile Number</th><td>{mobileNumber}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow"></th><td></td>                                                    
                                </tr>                                                               
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                             
                    </div>      
                    <div className="column">
                        <table className="table is-fullwidth">                                           
                            <tbody>                                
                                <tr>
                                    <th className="is-narrow">Landline Number</th><td>{landlineNumber}</td>                                                    
                                </tr> 
                                <tr>
                                    <th className="is-narrow"></th><td></td>                                                    
                                </tr>                                                              
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                             
                    </div>      
                    <div className="column">
                        <table className="table is-fullwidth">                                           
                            <tbody>                                
                                <tr>
                                    <th className="is-narrow">Facebook</th><td>{facebookAccount}</td>                                                    
                                </tr> 
                                <tr>
                                    <th className="is-narrow"></th><td></td>                                                    
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