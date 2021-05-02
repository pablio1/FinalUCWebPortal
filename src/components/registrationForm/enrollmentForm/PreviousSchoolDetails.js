import React, { Component, Fragment } from 'react';
import RegistrationFormSteps from '../../elements/RegistrationFormSteps';
import PreviousSchoolTertiary from './formComponents/PreviousSchoolTertiary';
import PreviousSchoolSecondary from './formComponents/PreviousSchoolSecondary';
import PreviousSchoolPrimary from './formComponents/PreviousSchoolPrimary';
import { v_PreviousSchoolDetails } from '../../../helpers/formValidation';
import { convertTermToReadable } from '../../../helpers/helper';

export default class PreviousSchoolDetails extends Component { 
      
    handleButtonClick = e => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {
            const {values} = this.props;  
            //Simple Validation - Check only if required field filled 
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_PreviousSchoolDetails(values) === 0) this.props.nextStep();  
            }
            else this.props.nextStep();  
        }    
    }
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e.target.name, e.target.checked);
    }
    handleOnChangeInput = (key, index) => {  
        this.props.handleChange(key, index)
    }
    render() {  
        const { values } = this.props; 
        let formSteps = "";         
        const showPrimaryForm = (
            <PreviousSchoolPrimary
                values={values}
                handleOnChangeInput={this.handleOnChangeInput}
                handleCheckBoxChange={this.handleCheckBoxChange}
            />
        );
        const showSecondaryForm = (
            <Fragment>                
                <PreviousSchoolSecondary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}
                    handleCheckBoxChange={this.handleCheckBoxChange}
                />                                                                             
                <div className="mb-0 pb-0">
                    <div className="divider is-size-6 mb-0 pb-0"></div>
                </div>
            </Fragment>
        );
        const showTertiaryForm = (
            <Fragment>
                <PreviousSchoolTertiary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}
                />                                                                                
                <div className="mb-0 pb-0">
                    <div className="divider is-size-6 mb-0 pb-0"></div>
                </div>
            </Fragment>
        );
        let showForms = "";
        if(values.educLevel === "col") {
            showForms = (
                <Fragment>
                    {values.selectedEntryStatusCollege !== "H" ? showTertiaryForm : ""}
                    {showSecondaryForm}
                    {showPrimaryForm}
                </Fragment>
            );
            formSteps = ["Course Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        };
        if(values.educLevel === "shs") {
            showForms = (
                <Fragment>
                    {showSecondaryForm}
                    {showPrimaryForm}
                </Fragment>
            );
            formSteps = ["Strand Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        }; 
        if(values.educLevel === "jhs" || values.educLevel === "bed") {
            showForms = (
                <Fragment>
                    {values.educLevel === "jhs" && values.selectedYearLevelSecondary !== "E7" ? showSecondaryForm : ""} 
                    {showPrimaryForm}
                </Fragment>
            );
            formSteps = ["Grade Level Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"]; 
        };   
        return(      
            <Fragment>
                <h3 className="has-text-weight-semibold has-text-centered is-size-4 mt-0 mb-4">{convertTermToReadable(values.term, false, values.educLevel.toUpperCase())} Enrollment</h3>  
                <div className="columns">
                    <div className="column">
                        <RegistrationFormSteps 
                            styles="is-small is-centered has-content-centered is-horizontal"
                            steps={formSteps}
                            formStep={3} //for Previous School Details
                        />
                    </div>
                </div>  
                <div className="section"  id="formBody">
                    <div className="columns">
                        <div className="column pt-0">
                            <div className="has-text-centered"> 
                                <h3 className="has-text-weight-semibold is-size-4">Previous School Details</h3>  
                                <p className="mt-1">
                                    Please fill-in the required fields deligently. 
                                    All required fields are marked with <i className="fas fa-exclamation-circle has-text-info"></i> <br />
                                    For overseas schools please append the country to the school name (e.g. University of **** - Germany) 
                                </p>   
                            </div> 
                            <div className="mb-0 pb-0">
                                <div className="divider is-size-6 mb-0 pb-0"></div>
                            </div>
                            <div className="mt-0 pt-0" style={{ /*width: "94%"*/ }}>
                                {showForms}                                                        
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
