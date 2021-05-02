import React, { Component, Fragment } from 'react';
import RegistrationFormSteps from '../../elements/RegistrationFormSteps';
import CourseMenuTertiary from './formComponents/CourseMenuTertiary';
import CourseMenuSecondary from './formComponents/CourseMenuSecondary';
import CourseMenuPrimary from './formComponents/CourseMenuPrimary';
import { v_CourseMenu } from '../../../helpers/formValidation';
import { convertTermToReadable } from '../../../helpers/helper';


export default class CourseMenu extends Component {
    handleButtonClick = (e) => {
        if(e === "continue") {
            const {values} = this.props;  

            //Simple Validation - Check only if required field filled
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_CourseMenu(values) === 0) this.props.nextStep(); 
            }
            else this.props.nextStep(); 
        }
        if(e === "back") this.props.prevStep();
    }

    handleOnChangeInput = (e)=> { 
        /*if(e.target.name === "selectedEntryStatusCollege" && e.target.value === "freshman") {
            this.props.handleChange("selectedYearLevelCollege", "1");
        }  */
        if(e.target.name === "selectedCourseCode") {
            let name = e.target.name;
            const optionText =  e.target.options[e.target.selectedIndex].text;   
            this.props.handleChange(name.substring(0, name.length-4), optionText);
            this.props.handleChange(name, e.target.value);
        }
        this.props.handleChange(e.target.name, e.target.value);
    }
  
    render() { 
        const {values} = this.props;
        let readableTerm = convertTermToReadable(values.term, false);
        if(values.educLevel === "jhs" || values.educLevel === "bed") readableTerm = readableTerm.includes("Summer") ? readableTerm : readableTerm.substr(readableTerm.length - 16);
        let {formTitle, message, formBody, formSteps} = "";    
        if(values.educLevel === "col") {
            formTitle = "Course";
            message = "You can still change your course within the enrollment period under the dean's approval. All fields are required.";
            formBody = (
                <CourseMenuTertiary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}                    
                />
            );
            formSteps = ["Course Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        }
        else if(values.educLevel === "shs") {
            formTitle = "Strand";
            message = "You can still change your strand within the enrollment period under the principal's approval. All fields are required.";
            formBody = (
                <CourseMenuSecondary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}
                />
            );
            formSteps = ["Strand Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        }
        else if(values.educLevel === "jhs") {
            formTitle = "Grade Level";
            message = "All fields are required.";
            formBody = (
                <CourseMenuSecondary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}
                />
            );
            formSteps = ["Grade Level Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        }
        else {
            formTitle = "Grade";
            message = "All fields are required.";
            formBody = (
                <CourseMenuPrimary 
                    values={values}
                    handleOnChangeInput={this.handleOnChangeInput}
                />
            );
            formSteps = ["Grade Level Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        }
    
        return(      
            <Fragment>    
                <h3 className="has-text-weight-semibold has-text-centered is-size-4 mt-0 mb-4">{readableTerm} Enrollment</h3>             
                <div className="columns">
                    <div className="column">
                        <RegistrationFormSteps 
                            styles="is-small is-centered has-content-centered is-horizontal"
                            steps={formSteps}
                            formStep={0} //for Course Selection
                        />                                
                    </div>
                </div>
                <div className="section">                            
                    <div className="columns">
                        <div className="column pt-0">
                            <div className="has-text-centered">
                                <h3 className="has-text-weight-semibold is-size-4">Select {formTitle} and Status</h3>  
                                <h4 className="mt-1">{message}</h4>                                  
                            </div>
                            <div className="mt-0 pt-0 ">
                                <div className="divider is-size-6"></div>
                            </div> 
                            <div id="formBody">
                                {formBody}                
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

