import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getLoggedUserDetails, convertTermToReadable } from '../../helpers/helper';
import store from 'store2';
import { toast } from 'bulma-toast';

import { errToasterOptions } from '../../helpers/configObjects';
import { updateStudentInfo } from '../../helpers/apiCalls';
import CourseMenuTertiary from '../../components/registrationForm/enrollmentForm/formComponents/CourseMenuTertiary';
import CourseMenuSecondary from '../../components/registrationForm/enrollmentForm/formComponents/CourseMenuSecondary';
import CourseMenuPrimary from '../../components/registrationForm/enrollmentForm/formComponents/CourseMenuPrimary';

class UpdateContactDetails extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        department_abbr: '', educLevel: '', id_number: '', submitBtnClicked: false,
        mobileNumber: '', email: '', facebookAccount:'',
        selectedCollege: '', selectedCourseCode: '', selectedEntryStatusCollege: '', selectedYearLevelCollege: '',
        selectedYearLevelSecondary: '', selectedStrand: '', selectedSessionSecondary: '', selectedEntryStatusSecondary: '', 
        selectedGradeLevel: '', selectedEntryStatusPrimary: ''
    }
    componentDidMount = () => {
        const { match: { params } } = this.props;
        this.setState({
            id_number: getLoggedUserDetails("idnumber"),
            email: params.email,
            department_abbr: getLoggedUserDetails("deptabbr")
        });        
    }
    handleOnChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        });     
    }
    handleButtonClick = e => {
        this.setState({
            educLevel: e,
        });
    }
    handleOnSubmit = () => {
        const { cookies } = this.props;
        this.setState({
            submitBtnClicked: true
        }, () => {
            const { 
                mobileNumber, email, facebookAccount,
                educLevel, selectedCollege, selectedCourseCode, selectedEntryStatusCollege, selectedYearLevelCollege,
                selectedYearLevelSecondary, selectedStrand, selectedSessionSecondary, selectedEntryStatusSecondary,
                selectedGradeLevel, selectedEntryStatusPrimary  
            } = this.state; 
            let errCounter = 0;
            if(educLevel === "col") {
                if(selectedCollege === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "College field is required.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
                if(selectedCourseCode === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Course field is required.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
                if(selectedEntryStatusCollege === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please select an Entry Status.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                }  
                if(selectedYearLevelCollege === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please select your year level";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
            }
            else if (educLevel === "shs") {
                if(selectedSessionSecondary === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Session field is required.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
                if(selectedStrand === '' && educLevel === "shs") {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Strand field is required.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
                if(selectedEntryStatusSecondary === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please select an Entry Status.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                }  
                if(selectedYearLevelSecondary === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = educLevel === "shs" ? "Please select your year level." : "Please select your Grade Level.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
            }
            else if (educLevel === "bed") { 
                if(selectedGradeLevel === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please select your Grade Level.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                } 
                if(selectedEntryStatusPrimary === '') {
                    errCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please select an Entry Status.";
                    toasterOptions["position"] = "top-right";
                    toast(toasterOptions);
                }                 
            }
            if(mobileNumber === '') {
                errCounter++;
                let toasterOptions = errToasterOptions;
                toasterOptions["message"] = "Mobile Number is required.";
                toasterOptions["position"] = "top-right";
                toast(toasterOptions);
            }
            if(email === '') {
                errCounter++;
                let toasterOptions = errToasterOptions;
                toasterOptions["message"] = "Email Address is required";
                toasterOptions["position"] = "top-right";
                toast(toasterOptions);
            }
    
            if(errCounter === 0) {
                let dept = "CL";
                let courseCode = selectedCourseCode;
                let year = selectedYearLevelCollege;
                let classification = selectedEntryStatusCollege;
                let mdn = "";
                if(educLevel === "shs" || educLevel === "jhs") {
                    dept = educLevel === "shs" ? "SH" : "JH";
                    courseCode = educLevel === "shs" ? selectedStrand : "E" + selectedYearLevelSecondary;
                    year = selectedYearLevelSecondary;
                    classification = selectedEntryStatusSecondary;
                    mdn = selectedSessionSecondary;
                }
                if(educLevel === "bed") {
                    dept = "BE";
                    courseCode = selectedGradeLevel.length > 1 ?  selectedGradeLevel: "E" + selectedGradeLevel;
                    year = selectedGradeLevel.length > 1 ?  selectedGradeLevel.substr(-1) : selectedGradeLevel;
                    classification = selectedEntryStatusPrimary;
                }
                const data = {
                    id_number: this.state.id_number,
                    dept: dept,
                    course_code: courseCode,
                    year: year,
                    mobile: mobileNumber,
                    email: email,
                    facebook: facebookAccount,
                    classification: classification,
                    mdn: mdn,
                    active_term: cookies.get("selterm")
                }
                updateStudentInfo(data)
                .then(response => {  
                    if(response.data.success) {  
                        let localData = store.get("loggeduser");
                        localData["classification"] = classification;
                        localData["coursecode"] = courseCode;
                        localData["deptabbr"] = educLevel === "col" ? selectedCollege : educLevel.toUpperCase();
                        localData["yearlevel"] = year;
                        localData["courseabbr"] = courseCode;
                        store.set('loggeduser', localData);       
                        alert("Your application has been submitted. Your dean will evaluate and approve your application. Please be patient as it will take at least 1 working day for the dean to evaluate.")
                        const { history } = this.props;
                        history.push("/enrollment/student/steps");
                    }
                    else {
                        alert("Submission Failed! Please insure that you are connected to the internet.")
                        this.setState({
                            submitBtnClicked: false
                        });
                    }
                });
            }
            else {
                this.setState({
                    submitBtnClicked: false
                });
            }
        });
        
    }
    render() {
        const { cookies } = this.props;
        const term = cookies.get("selterm");
        const { 
            mobileNumber, email, facebookAccount, submitBtnClicked, department_abbr,
            educLevel, selectedCollege, selectedCourseCode, selectedEntryStatusCollege, selectedYearLevelCollege,
            selectedYearLevelSecondary, selectedStrand, selectedSessionSecondary, selectedEntryStatusSecondary,
            selectedGradeLevel, selectedEntryStatusPrimary    
        } = this.state;
        const departmentAbbr =  ["SHS","JHS","BED"].includes(department_abbr) ? department_abbr : "COL";
        const collegeValues = { educLevel, selectedCollege, selectedCourseCode, selectedEntryStatusCollege, selectedYearLevelCollege, term };
        const secondaryValues = { educLevel, selectedYearLevelSecondary, selectedStrand, selectedSessionSecondary, selectedEntryStatusSecondary, term }
        const primaryValues = { educLevel, selectedGradeLevel, selectedEntryStatusPrimary, term }
        const loadEducLevelMenu = (
            <Fragment>
                <h1 className="mb-0 has-text-centered is-size-5 has-text-weight-bold">{convertTermToReadable(term, false)}</h1> 
                <div className="divider is-size-6 mt-2"></div>               
                <h1 className="mb-5 has-text-centered is-size-5 has-text-weight-bold">Please Choose Level to Enroll</h1>
                { 
                    departmentAbbr === "SHS" && process.env.REACT_APP_CAMPUS === "Banilad" ? (
                        <p className="mb-5 has-text-centered is-size-6 has-text-weight-semibold">
                            If you are enrolling as a college Freshman, you have to register as a new college student.<br />
                            Please logout and proceed to https://banportal.uc.edu.ph/registration 
                        </p>
                    ) : ""
                }
                <div className="columns">
                    <div className="column is-hidden-mobile"></div>
                    {
                        departmentAbbr === "SHS" && process.env.REACT_APP_CAMPUS === "Banilad" ? "" : (
                            <div className="column">
                                <button 
                                    className="button is-info is-fullwidth"
                                    onClick={() => this.handleButtonClick("col")} 
                                >College</button>
                            </div>
                        )
                    }  
                    {
                        departmentAbbr === "COL" ? "" : (
                            <div className="column">
                                <button 
                                    className="button is-info is-fullwidth"
                                    onClick={() => this.handleButtonClick("shs")}    
                                >Senior High School</button>
                            </div>
                        )
                    }                                                   
                    {
                        departmentAbbr === "COL" || departmentAbbr === "SHS" ? "" : (
                            <div className="column">
                                <button 
                                    className="button is-info is-fullwidth"
                                    onClick={() => this.handleButtonClick("jhs")}    
                                >Junior High School (Grade 7-10)</button>
                            </div>
                        )
                    }
                    {
                        departmentAbbr === "COL" || departmentAbbr === "SHS" || departmentAbbr === "JHS"  ? "" : (
                            <div className="column">
                                <button 
                                    className="button is-info is-fullwidth"
                                    onClick={() => this.handleButtonClick("bed")}
                                >Elementary (Grade 1-6)</button>
                            </div>
                        )
                    }                     
                    <div className="column is-hidden-mobile"></div> 
                </div>
            </Fragment>
        );
        let loadCourseMenu = "";
        if(educLevel === "shs" || educLevel === "jhs") {
            loadCourseMenu = (
                <Fragment>
                    <h1 className="mb-0 has-text-centered is-size-5 has-text-weight-bold">{convertTermToReadable(term, false)}</h1>
                    <div className="divider is-size-6 mt-2"></div> 
                    <h4 className="is-size-5 has-text-weight-bold mb-2">{ educLevel === "shs" ? "Select Strand and Year" : "Select Year Level and Session" }</h4>
                    <CourseMenuSecondary
                        values={secondaryValues}
                        isOldStudent={true}
                        handleOnChangeInput={this.handleOnChange}   
                    />
                </Fragment>
            );
        }
        if(educLevel === "col") {
            loadCourseMenu = (
                <Fragment>
                    <h1 className="mb-0 has-text-centered is-size-5 has-text-weight-bold">{convertTermToReadable(term, false)}</h1>
                    <div className="divider is-size-6 mt-2"></div> 
                    <h4 className="is-size-5 has-text-weight-bold mb-2">Select Course and Year</h4>                    
                    <CourseMenuTertiary 
                        values={collegeValues}
                        isOldStudent={true}
                        handleOnChangeInput={this.handleOnChange}      
                    />
                </Fragment>
            );
        }
        if(educLevel === "bed") {
            loadCourseMenu = (
                <Fragment>
                    <h1 className="mb-0 has-text-centered is-size-5 has-text-weight-bold">{convertTermToReadable(term, false)}</h1>
                    <div className="divider is-size-6 mt-2"></div> 
                    <h4 className="is-size-5 has-text-weight-bold mb-2">Select Grade Level and Entry Status</h4>           
                    <CourseMenuPrimary 
                        values={primaryValues}
                        isOldStudent={true}
                        handleOnChangeInput={this.handleOnChange}      
                    />
                </Fragment>
            );
        }
        const updateDetailsForm = (
            <Fragment>
                {loadCourseMenu}
                <h4 className="is-size-5 has-text-weight-bold mb-2 mt-4">Update Contact Details</h4>  
                <div className="columns is-vcentered">
                    <div className="column"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Mobile Number</h5>
                        <div className="field">                                                    
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="mobileNumber" className="input" type="text" placeholder="Mobile Number" 
                                        onChange={this.handleOnChange} value={mobileNumber} required data-fieldname="Mobile Number"/>  
                                <span className="icon is-small is-left">
                                    <i className="fas fa-mobile-alt"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                              
                    </div>  
                    {/*<div className="column"> 
                        <h5 className="has-text-weight-bold mb-2">Landline Number</h5>
                        <div className="field">                                                    
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="landlineNumber" className="input" type="text" placeholder="Landline Number" 
                                        onChange={this.handleOnChange} value={landlineNumber} required data-fieldname="Landline Number"/>  
                                <span className="icon is-small is-left">
                                    <i className="fas fa-phone"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                              
                    </div> */} 
                    <div className="column is-3"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Verified Email</h5>
                        <div className="field">                                                    
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="email" className="input" type="text" placeholder="Verified Email" disabled={true}
                                        onChange={this.handleOnChange} value={email} required data-fieldname="Landline Number" />  
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
                                        onChange={this.handleOnChange} value={facebookAccount} required data-fieldname="Facebook Account"/>  
                                <span className="icon is-small is-left">
                                    <i className="fab fa-facebook-square"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                              
                    </div>
                    <div className="column"> </div>                                          
                </div> 
                <nav className="level">
                    <div className="level-left mb-0 pb-0">
                        <button 
                            className="button is-info is-fullwidth"
                            onClick={() => this.handleButtonClick("")} disabled={submitBtnClicked}                                               
                        >       
                            <span className="icon">
                                <i className="fas fa-chevron-left"></i>
                            </span>                                    
                            <span>Back</span>
                        </button>
                    </div>
                    <div className="level-right mt-1 pt-0">
                        <button 
                            className={"button is-success is-fullwidth " + (submitBtnClicked ?  "is-loading" : "")}
                            onClick={this.handleOnSubmit} disabled={submitBtnClicked}                                               
                        >                                                
                            <span>Submit Application</span>
                            <span className="icon">
                                <i className="fas fa-paper-plane"></i>
                            </span>
                        </button>
                    </div>  
                </nav> 
            </Fragment>
        );
        return(
            <Fragment>
                {educLevel ? updateDetailsForm : loadEducLevelMenu}   
            </Fragment>
        )
    };
}

export default withCookies(UpdateContactDetails)