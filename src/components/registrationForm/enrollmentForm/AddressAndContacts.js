import React, { Component, Fragment } from 'react';
import RegistrationFormSteps from '../../elements/RegistrationFormSteps';
import AddressAndContactsCurrent from '../enrollmentForm/formComponents/AddressAndContactsCurrent';
import AddressAndContactsPermanent from '../enrollmentForm/formComponents/AddressAndContactsPermanent';
import AddressAndContactsOverseas from '../enrollmentForm/formComponents/AddressAndContactsOverseas';
import { v_AddressAndContacts } from '../../../helpers/formValidation';
import { convertTermToReadable } from '../../../helpers/helper';

export default class AddressAndContacts extends Component { 
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {
            const {values} = this.props;  
             
            //Simple Validation - Check only if required field filled, mobile and zip code formats
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_AddressAndContacts(values) === 0) this.props.nextStep(); 
            }
            else this.props.nextStep(); 
        }
           
    }
    handleOnChange = (e) => {
        this.props.handleChange(e.target.name, e.target.value);
    }
    handleOnChangeInput = (key, value) => {
        this.props.handleChange(key, value);
    }
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e.target.name, e.target.checked);
    }
    render() {  
        const { values } = this.props;
        let readableTerm = convertTermToReadable(values.term, false);
        if(values.educLevel === "jhs" || values.educLevel === "bed") readableTerm = readableTerm.includes("Summer") ? readableTerm : readableTerm.substr(readableTerm.length - 16);
        let formSteps = "";    
        if(values.educLevel === "col") formSteps = ["Course Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        else if(values.educLevel === "shs") formSteps = ["Strand Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        else formSteps = ["Grade Level Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
            
        return(  
            <Fragment>    
                <h3 className="has-text-weight-semibold has-text-centered is-size-4 mt-0 mb-4">{readableTerm} Enrollment</h3>             
                <div className="columns">
                    <div className="column">
                        <RegistrationFormSteps 
                            styles="is-small is-centered has-content-centered is-horizontal"
                            steps={formSteps}
                            formStep={2} //for Address & Contact Details
                        />
                    </div>
                </div>  
                <div className="section" id="formBody">                    
                    <div className="columns">
                        <div className="column pt-0">
                            <div className="has-text-centered"> 
                                <h3 className="has-text-weight-semibold is-size-4">Address & Contact Details</h3>  
                                <h4 className="mt-1">
                                    Please fill-in the required fields deligently. 
                                    All required fields are marked with <i className="fas fa-exclamation-circle has-text-info"></i> <br />
                                </h4>   
                            </div> 
                            <div className="mb-0 pb-0">
                                <div className="divider is-size-6 mb-0 pb-0"></div>
                            </div>
                            <div className="mt-0 pt-0" style={{ /*width: "94%"*/ }}> 
                                <AddressAndContactsCurrent 
                                    values={values}
                                    handleOnChangeInput={this.handleOnChangeInput}  
                                />                                   
                                <div className="mb-0 pb-0">
                                    <div className="divider is-size-6 mb-0 pb-0"></div>
                                </div>
                                <AddressAndContactsPermanent
                                    values={values}
                                    handleOnChangeInput={this.handleOnChangeInput}  
                                    handleCheckBoxChange={this.handleCheckBoxChange} 
                                /> 
                                <div className="mb-0 pb-0">
                                    <div className="divider is-size-6 mb-0 pb-0"></div>
                                </div>
                                <AddressAndContactsOverseas
                                    values={values}
                                    handleOnChangeInput={this.handleOnChangeInput} 
                                    handleCheckBoxChange={this.handleCheckBoxChange}  
                                />
                                <div className="">
                                    <div className="divider is-size-6">CONTACT & SOCIAL MEDIA </div>
                                </div>
                                <div className="columns is-vcentered">
                                    <div className="column is-1 is-hidden-mobile"></div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Mobile Number</h5>
                                        <div className="field">                                                    
                                            <div className="control has-icons-left has-icons-right">                                                    
                                                <input name="mobileNumber" className="input" type="text" placeholder="Mobile Number" 
                                                       onChange={this.handleOnChange} value={values.mobileNumber} required data-fieldname="Mobile Number"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-mobile-alt"></i>
                                                </span>
                                            </div>
                                        </div>                                                                                                                                                                                                                                                                                                              
                                    </div>  
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Landline Number</h5>
                                        <div className="field">                                                    
                                            <div className="control has-icons-left has-icons-right">                                                    
                                                <input name="landlineNumber" className="input" type="text" placeholder="Landline Number" 
                                                       onChange={this.handleOnChange} value={values.landlineNumber} data-fieldname="Landline Number"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-phone"></i>
                                                </span>
                                            </div>
                                        </div>                                                                                                                                                                                                                                                              
                                    </div>  
                                    <div className="column is-3"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Verified Email</h5>
                                        <div className="field">                                                    
                                            <div className="control has-icons-left has-icons-right">                                                    
                                                <input name="email" className="input" type="text" placeholder="Verified Email" 
                                                       value={values.email} disabled />  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                            </div>
                                        </div>                                                                                                                                                                                                                                                        
                                    </div>          
                                    <div className="column is-3"> 
                                        <h5 className="has-text-weight-bold mb-2">Facebook</h5>
                                        <div className="field">                                                    
                                            <div className="control has-icons-left has-icons-right">                                                    
                                                <input name="facebookAccount" className="input" type="text" placeholder="Facebook Account"
                                                       onChange={this.handleOnChange} value={values.facebookAccount} data-fieldname="Facebook Account"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fab fa-facebook-square"></i>
                                                </span>
                                            </div>
                                        </div>                                                                                                                                                                                                                                                                                                              
                                    </div> 
                                    <div className="column is-1 is-hidden-mobile"></div>                                           
                                </div>                               
                            </div>
                            <div>
                                <div className="divider is-size-6"></div>
                            </div>
                            <nav className="level">
                                <div className="level-left mb-0 pb-0">
                                    <button 
                                        className="button is-info is-fullwidth"
                                        onClick={() => this.handleButtonClick("back")}                                                
                                    >
                                        <span className="icon">
                                            <i className="fas fa-chevron-left"></i>
                                        </span>
                                        <span>Back</span>
                                    </button>
                                </div>
                                <div className="level-right mt-1 pt-0">
                                    <button 
                                        className="button is-info is-fullwidth"
                                        onClick={() => this.handleButtonClick("continue")}                                                
                                    >                                                
                                        <span>Continue</span>
                                        <span className="icon">
                                            <i className="fas fa-chevron-right"></i>
                                        </span>
                                    </button>
                                </div>  
                            </nav>                                                               
                        </div>
                    </div> 
                </div>                                  
            </Fragment>

        )   
    }
}
