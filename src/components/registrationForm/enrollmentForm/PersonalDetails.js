import React, { Component, Fragment } from 'react';
import DatePicker from '../../elements/DatePicker';
import RegistrationFormSteps from '../../elements/RegistrationFormSteps';
import { v_PersonalDetails } from '../../../helpers/formValidation';
import { convertTermToReadable } from '../../../helpers/helper';

export default class PersonalDetails extends Component {   
    state = {
        isCheckedFilipino: true
    }
    componentDidMount = () => {   
        const nationalityValue = (this.props.values.nationality === "Filipino") ? true : false;     
        this.setState({ isCheckedFilipino: nationalityValue});
    }
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {
            const {values} = this.props;  
            //Simple Validation - Check only if required field filled, birthday, mobile number format 
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_PersonalDetails(values) === 0) this.props.nextStep(); 
            }
            else this.props.nextStep();   
        }    
    }
    handleCheckBoxChange = e => {
        const nationalityValue = (e.target.checked) ? "Filipino" : ""; 
        this.props.handleChange("nationality", nationalityValue);
        this.setState({ isCheckedFilipino: e.target.checked});
    }
    handleOnChangeInput = e => {     
        this.props.handleChange(e.target.name, e.target.value);
    }
    handleOnChangeDate = e => {  
        this.props.handleChange("birthdate", e);
    }
    render() {  
        const { values } = this.props; 
        const { isCheckedFilipino } = this.state; 
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
                            formStep={1} //for Personal Details
                        />
                    </div>
                </div>
                <div className="section" id="formBody">
                    <div className="columns">
                        <div className="column pt-0"> 
                            <div className="has-text-centered">
                                <h3 className="has-text-weight-semibold is-size-4">Personal Details</h3>  
                                <h4 className="mt-1">
                                    Please fill-in the required fields deligently. 
                                    All required fields are marked with <i className="fas fa-exclamation-circle has-text-info"></i> <br />
                                    Fill in at least one parent/guardian details.
                                </h4>  
                            </div>  
                            <div className="">
                                <div className="divider is-size-6"></div>
                            </div>
                            <div className="" style={{ /*width: "94%"*/ }}>
                                <div className="columns is-vcentered">
                                    <div className="column is-1 is-hidden-mobile"></div>                                    
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> First Name</h5>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="firstName" className="input" type="text" placeholder="First Name" 
                                                       value={values.firstName} onChange={this.handleOnChangeInput} required data-fieldname="First Name"/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Middle Name</h5>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="middleName" className="input" type="text" placeholder="Middle Name" 
                                                       value={values.middleName} onChange={this.handleOnChangeInput} data-fieldname="Middle Name"/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div> 
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Last Name</h5>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="lastName" className="input" type="text" placeholder="Last Name" 
                                                       value={values.lastName} onChange={this.handleOnChangeInput} required data-fieldname="Last Name"/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div>
                                    <div className="column is-2 "> 
                                        <h5 className="has-text-weight-bold mb-2">Suffix Name</h5>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="suffixName" className="input" type="text" placeholder="ex. JS, SR, III " 
                                                       value={values.suffixName} onChange={this.handleOnChangeInput} data-fieldname="Suffix Name"/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div>                                                  
                                    <div className="column is-1 is-hidden-mobile"></div>                                           
                                </div>                            
                                <div className="columns is-vcentered">
                                    <div className="column is-1 is-hidden-mobile"></div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Nationality (Uncheck if Foreign)</h5>
                                        <div className="field has-addons is-grouped">
                                            <p className="control">
                                                <label className="checkbox has-text-weight-semibold pt-2">
                                                    <input type="checkbox" checked={isCheckedFilipino} onChange={this.handleCheckBoxChange} />
                                                    &nbsp;Filipino
                                                </label>                                                   
                                            </p>
                                            <p className="control has-icons-left has-icons-right">
                                                <input name="nationality" className="input" type="text" placeholder="Other" disabled={isCheckedFilipino ? true : false} 
                                                       value={values.nationality} onChange={this.handleOnChangeInput} required data-fieldname="Nationality"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-flag"></i>
                                                </span>
                                            </p>                                            
                                        </div>                                                                                                                                                                                                                                                                                                      
                                    </div>  
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Gender</h5>
                                        <div className="field">
                                            <p className="control is-expanded has-icons-left">
                                                <span className="select is-fullwidth">
                                                    <select name="gender" value={values.gender} onChange={this.handleOnChangeInput} required data-fieldname="Gender">
                                                        <option value="">Select Gender</option>
                                                        <option value="M">Male</option>
                                                        <option value="F">Female</option> 
                                                    </select>
                                                </span>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-venus-mars"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Civil Status</h5>
                                        <div className="field">
                                            <p className="control is-expanded has-icons-left">
                                                <span className="select is-fullwidth">
                                                    <select name="civilstatus" value={values.civilstatus} onChange={this.handleOnChangeInput} required data-fieldname="Civil Status">
                                                        <option value="">Select Civil Status</option>
                                                        <option value="Single">Single</option>
                                                        <option value="Married">Married</option>
                                                        <option value="Widow">Widow</option>
                                                        <option value="Annulled">Annulled</option>
                                                        <option value="Divorced">Divorced</option> 
                                                    </select>
                                                </span>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-user-friends"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                  
                                    </div> 
                                    <div className="column is-1 is-hidden-mobile"></div>                                           
                                </div>
                                <div className="columns is-vcentered">
                                    <div className="column is-1 is-hidden-mobile"></div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Birth Date</h5>
                                        <div className="field">
                                            <p className="control">                                                 
                                                <DatePicker 
                                                    id="birthdate" 
                                                    handleOnChangeDate={this.handleOnChangeDate}     
                                                    options={{
                                                        type: "date",
                                                        color: "dark",
                                                        dateFormat: "MM/DD/YYYY",
                                                        startDate: new Date(values.birthdate)                                                         
                                                    }}
                                                /> 
                                            </p>  
                                        </div>                                                                                                                                                                                                                                                        
                                    </div>  
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Birth Place</h5>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="birthplace" className="input" type="text" placeholder="City, Province/State, Country" 
                                                       value={values.birthplace} onChange={this.handleOnChangeInput} data-fieldname="Birthplace"/>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-baby-carriage"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                    
                                    </div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Religion</h5>
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="religion" className="input" type="text" placeholder="Religion" 
                                                       value={values.religion} onChange={this.handleOnChangeInput} data-fieldname="Religion"/> 
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-pray"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                
                                    </div>                                                
                                    <div className="column is-1 is-hidden-mobile"></div>                                           
                                </div>
                                <div className="">
                                    <div className="divider is-size-6">PARENT / GUARDIAN DETAILS</div>
                                </div>
                                <div className="columns is-vcentered">
                                    <div className="column is-1 is-hidden-mobile"></div>
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Mother's Information</h5>
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="motherName" className="input" type="text" placeholder="Full Name" 
                                                       value={values.motherName} onChange={this.handleOnChangeInput} data-fieldname="Mother's Name"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                        
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="motherOccupation" className="input" type="text" placeholder="Occupation" 
                                                       value={values.motherOccupation} onChange={this.handleOnChangeInput} data-fieldname="Mother's Occupation"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-user-tie"></i>
                                                </span>
                                            </p>
                                        </div> 
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="motherContact" className="input" type="text" placeholder="Contact Number" 
                                                       value={values.motherContact} onChange={this.handleOnChangeInput} data-fieldname="Mother's Contact Number"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-phone-alt"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                                 
                                    </div>  
                                    <div className="column"> 
                                        <h5 className="has-text-weight-bold mb-2">Father's Information</h5>
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="fatherName" className="input" type="text" placeholder="Full Name" 
                                                       value={values.fatherName} onChange={this.handleOnChangeInput} data-fieldname="Father's Name"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                        
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="fatherOccupation" className="input" type="text" placeholder="Occupation" 
                                                       value={values.fatherOccupation} onChange={this.handleOnChangeInput} data-fieldname="Father's Occupation"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-user-tie"></i>
                                                </span>
                                            </p>
                                        </div> 
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="fatherContact" className="input" type="text" placeholder="Contact Number" 
                                                       value={values.fatherContact} onChange={this.handleOnChangeInput} data-fieldname="Father's Contact Number"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-phone-alt"></i>
                                                </span>
                                            </p>
                                        </div>                                                                                                                                                                                                                                                               
                                    </div>  
                                    <div className="column"> 
                                    <h5 className="has-text-weight-bold mb-2">Guardian's Information</h5>
                                    <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="guardianName" className="input" type="text" placeholder="Full Name" 
                                                       value={values.guardianName} onChange={this.handleOnChangeInput} data-fieldname="Guardian's Name"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-id-card"></i>
                                                </span>
                                            </p>
                                        </div>                                        
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="guardianOccupation" className="input" type="text" placeholder="Occupation" 
                                                       value={values.guardianOccupation} onChange={this.handleOnChangeInput} data-fieldname="Guardian's Occupation"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-user-tie"></i>
                                                </span>
                                            </p>
                                        </div> 
                                        <div className="field">                                                    
                                            <p className="control has-icons-left has-icons-right">                                                    
                                                <input name="guardianContact" className="input" type="text" placeholder="Contact Number" 
                                                       value={values.guardianContact} onChange={this.handleOnChangeInput} data-fieldname="Guardian's Contact Number"/>  
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-phone-alt"></i>
                                                </span>
                                            </p>
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
