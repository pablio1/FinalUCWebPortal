import React, { Component, Fragment } from 'react';
import SelectCountry from '../../../elements/SelectCountry'

export default class AddressAndContactsOverseas extends Component {   
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e.target.name, e.target.value);
    }
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e);
        // Empty all Overseas Address Values if not applicable checkbox is ticked
        if(e.target.checked) {
            this.props.handleOnChangeInput("countryOverseasAdd", "");            
            this.props.handleOnChangeInput("provinceOverseasAdd", "");   
            this.props.handleOnChangeInput("cityOverseasAdd", "");   
            this.props.handleOnChangeInput("zipcodeOverseasAdd", "");   
            this.props.handleOnChangeInput("streetOverseasAdd", "");   
        }
    }
    onChangeReactSelect = (id,e) => { 
        this.props.handleOnChangeInput(id, e.label); 
        this.props.handleOnChangeInput(id + "Code", e.value);   
    }
    render() { 
        const { values } = this.props; 
        const overseasAddressForm = !values.isNAOverseasAdd ? (
            <Fragment>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column">                                             
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Country</h5>
                        <div className="field">
                            <div className="control is-expanded has-icons-left">
                                <SelectCountry 
                                    name="countryOverseasAdd"
                                    value={values.countryOverseasAdd}
                                    required={true}
                                    fieldname="Overseas Address Country"
                                    handleOnChangeInput={this.handleOnChangeInput}
                                />
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>      
                    <div className="column">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> State / Province</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="provinceOverseasAdd" className="input" type="text" placeholder="State / Province"
                                       onChange={this.handleOnChangeInput} value={values.provinceOverseasAdd} required data-fieldname="Overseas State / Province"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-map-marked"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                 
                    </div>  
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> City</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="cityOverseasAdd" className="input" type="text" placeholder="City" 
                                       onChange={this.handleOnChangeInput} value={values.cityOverseasAdd} required data-fieldname="Overseas City"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-city"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                     
                    </div>
                    <div className="column is-2"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Postal Code</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="zipcodeOverseasAdd" className="input" type="text" placeholder="Postal Code" 
                                       onChange={this.handleOnChangeInput} value={values.zipcodeOverseasAdd} required data-fieldname="Overseas Postal Code"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>      
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>                                            
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Street Address</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="streetOverseasAdd" className="input" type="text" placeholder="House #, Blk #, Bldg #, Street" 
                                       onChange={this.handleOnChangeInput} value={values.streetOverseasAdd} required data-fieldname="Overseas Address Street"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-home"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>                                              
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        ) : "";
        return(
            <Fragment>
                <div className="columns is-vcentered mt-0 pt-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column is-narrow mb-0 pb-0">
                        <h3 className="has-text-weight-bold is-size-5 mb-0 pb-0">Overseas Address</h3>
                        <label className="checkbox">
                            <input type="checkbox" name="isNAOverseasAdd" checked={values.isNAOverseasAdd} onChange={this.handleCheckBoxChange} />
                            &nbsp;Not Applicable
                        </label>
                    </div>
                </div>
                {overseasAddressForm}
            </Fragment>    
        );
    }

}