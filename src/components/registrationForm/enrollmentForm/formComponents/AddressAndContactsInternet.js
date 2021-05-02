
import React, { Component, Fragment } from 'react';

export default class AddressAndContactsInternet extends Component {

    render() { 
 
        return(
            <Fragment>
                <div className="">
                    <div className="divider is-size-6">INTERNET CONNECTIVITY</div>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2">Internet Connection Type</h5>
                        <div className="field">
                            <div className="control is-expanded has-icons-left">
                                <span className="select is-fullwidth">
                                    <select name="netConnectionType">
                                        <option>Select Type</option>
                                        <option>No Connection</option>
                                        <option>Mobile Data</option>
                                        <option>Broadband Wifi</option>
                                        <option>Broadband Cable</option>
                                        <option>Broadband Fiber</option>
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-tachometer-alt"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                                 
                    </div>  
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2">Your Internet Service Provider</h5>
                        <div className="field">
                            <div className="control is-expanded has-icons-left">
                                <span className="select is-fullwidth">
                                    <select name="netServiceProvider ">
                                        <option>Select ISP</option>
                                        <option>Globe</option>
                                        <option>Smart</option>
                                        <option>PLDT</option>
                                        <option>Sky Cable</option>
                                        <option>Others</option>
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-satellite-dish"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                              
                    </div>  
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2">Devices owned (for online classes)</h5>
                        <div className="field">                                                    
                            <DevicesMultiSelect />
                        </div>                                                                                                                                                                                                                                                                                                             
                    </div>       
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>    
        );
    }
    
}