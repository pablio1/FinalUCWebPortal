import React, { Component, Fragment } from 'react';
import PreviewSubmitCourse from '../enrollmentForm/formComponents/PreviewSubmitCourse';
import PreviewSubmitPersonalDetails from '../enrollmentForm/formComponents/PreviewSubmitPersonalDetails';
import PreviewSubmitAddressContacts from '../enrollmentForm/formComponents/PreviewSubmitAddressContacts';
import PreviewSubmitPreviousSchools from '../enrollmentForm/formComponents/PreviewSubmitPreviousSchools';
import PreviewSubmitRequiredDocuments from '../enrollmentForm/formComponents/PreviewSubmitRequiredDocuments';
import Eula from '../../elements/Eula';
import { convertTermToReadable } from '../../../helpers/helper';

export default class PreviewSubmit extends Component {   
    state = {
        submitBtnIsLoading: false,
        showEula: false
    }
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "submit") {
            this.setState({
                submitBtnIsLoading: true,
                showEula: true
            });    
        }       
    }
    handleOnclickPrint = () => {
        window.print();
    }
    handleAcceptBtn = () => {
        this.setState({
            showEula: false
        }, () => this.props.submitForm());        
    }
    closeModal = () => {
        this.setState({
            showEula: false,
            submitBtnIsLoading: false,
        })
    }
    render() { 
        const { values } = this.props;
        const { submitBtnIsLoading, showEula } = this.state;
        let readableTerm = convertTermToReadable(values.term, false);
        if(values.educLevel === "jhs" || values.educLevel === "bed") readableTerm = readableTerm.includes("Summer") ? readableTerm : readableTerm.substr(readableTerm.length - 16); 
        const submitBtn = submitBtnIsLoading ? (
            <button 
                className="button is-success is-fullwidth is-loading"                                             
            >                                                
                <span>Submit Application</span>
                <span className="icon">
                    <i className="fas fa-paper-plane"></i>
                </span>
            </button> 
        ) : (
            <button 
                className="button is-success is-fullwidth"
                onClick={() => this.handleButtonClick("submit")}                                                
            >                                                
                <span>Submit Application</span>
                <span className="icon">
                    <i className="fas fa-paper-plane"></i>
                </span>
            </button>  
        );
        const backBtnDisabled = submitBtnIsLoading ? true : false;
        return(  
            <Fragment> 
                <div className={"modal " + (showEula ?  "is-active " : "")}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <Eula handleAcceptBtn={this.handleAcceptBtn} term={readableTerm} />           
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                </div>
                <div className="section pt-0 mt-0">
                    <div className="columns">
                        <div className="column"> 
                            <div className="has-text-centered ">
                                <h3 className="has-text-weight-semibold is-size-4">{readableTerm} Enrollment</h3>  
                                <h3 className="has-text-weight-semibold is-size-4">Review Form Entries</h3>  
                                <h4 className="mt-1">
                                    Please check and review if all information you entered are correct.<br />
                                    You can change your entry in the previous forms clicking the Back button.
                                </h4>  
                            </div>
                            <div>                                
                                <PreviewSubmitCourse 
                                    values={values}
                                    firstName={values.firstName}
                                    middleName={values.middleName}
                                    lastName={values.lastName}
                                    suffixName={values.suffixName}
                                    email={values.email}
                                    selectedCollege={values.selectedCollege}
                                    selectedCourse={values.selectedCourse}
                                    selectedEntryStatusCollege={values.selectedEntryStatusCollege}
                                    lastYearLevelCollege={values.lastYearLevelCollege}
                                    educLevel={values.educLevel}    
                                    SelectedFiles={values.SelectedFiles}
                                    selectedYearLevelCollege={values.selectedYearLevelCollege}
                                />
                                <PreviewSubmitPersonalDetails
                                    nationality={values.nationality}
                                    gender={values.gender}
                                    civilstatus={values.civilstatus}
                                    religion={values.religion}
                                    birthdate={values.birthdate}
                                    birthplace={values.birthplace}
                                    motherName={values.motherName}
                                    motherContact={values.motherContact}
                                    motherOccupation={values.motherOccupation}                                    
                                    fatherName={values.fatherName}
                                    fatherContact={values.fatherContact}
                                    fatherOccupation={values.fatherOccupation}
                                    guardianName={values.guardianName}
                                    guardianContact={values.guardianContact}
                                    guardianOccupation={values.guardianOccupation} 
                                />
                                <PreviewSubmitAddressContacts
                                    zipcodeCurrentAdd={values.zipcodeCurrentAdd}
                                    provinceCurrentAdd={values.provinceCurrentAdd}
                                    cityCurrentAdd={values.cityCurrentAdd}
                                    barangayCurrentAdd={values.barangayCurrentAdd}
                                    streetCurrentAdd={values.streetCurrentAdd}
                                    zipcodePermanentAdd={values.zipcodePermanentAdd}
                                    provincePermanentAdd={values.provincePermanentAdd}
                                    cityPermanentAdd={values.cityPermanentAdd}
                                    barangayPermanentAdd={values.barangayPermanentAdd}
                                    streetPermanentAdd={values.streetPermanentAdd}
                                    zipcodeOverseasAdd={values.zipcodeOverseasAdd}
                                    provinceOverseasAdd={values.provinceOverseasAdd}
                                    cityOverseasAdd={values.cityOverseasAdd}
                                    countryOverseasAdd={values.countryOverseasAdd}
                                    streetOverseasAdd={values.streetOverseasAdd}
                                    mobileNumber={values.mobileNumber}
                                    landlineNumber={values.landlineNumber}
                                    facebookAccount={values.facebookAccount}
                                />
                                <PreviewSubmitPreviousSchools
                                    educLevel={values.educLevel}
                                    lastCourseCollege={values.lastCourseCollege}
                                    schoolNameCollege={values.schoolNameCollege}
                                    lastYearLevelCollege={values.lastYearLevelCollege}
                                    schoolYearStartCollege={values.schoolYearStartCollege}
                                    schoolYearEndCollege={values.schoolYearEndCollege}
                                    lastStrandSecondary={values.lastStrandSecondary}                                    
                                    isSameCollege={values.isSameCollege}
                                    isK12Secondary={values.isK12Secondary}
                                    schoolNameSecondary={values.schoolNameSecondary}
                                    lastYearLevelSecondary={values.lastYearLevelSecondary}
                                    schoolYearStartSecondary={values.schoolYearStartSecondary}
                                    schoolYearEndSecondary={values.schoolYearEndSecondary}
                                    schoolTypeSecondary={values.schoolTypeSecondary}
                                    lrnNumberSecondary={values.lrnNumberSecondary}
                                    escStudentNumSecondary={values.escStudentNumSecondary}
                                    escSchoolNumSecondary={values.escSchoolNumSecondary}
                                    isSameSecondary={values.isSameSecondary}
                                    schoolNamePrimary={values.schoolNamePrimary}
                                    lastYearLevelPrimary={values.lastYearLevelPrimary}
                                    schoolYearStartPrimary={values.schoolYearStartPrimary}
                                    schoolYearEndPrimary={values.schoolYearEndPrimary}
                                    schoolTypePrimary={values.schoolTypePrimary}
                                    lrnNumberPrimary={values.lrnNumberPrimary}
                                    escStudentNumPrimary={values.escStudentNumPrimary}
                                    escSchoolNumPrimary={values.escSchoolNumPrimary}
                                    selectedEntryStatusCollege={values.selectedEntryStatusCollege}
                                />                                
                                <PreviewSubmitRequiredDocuments
                                    SelectedFilesDetails={values.SelectedFilesDetails}
                                />
                            </div>
                            
                            <div>
                                <div className="divider is-size-6"></div>
                            </div>
                            <nav className="level">
                                <div className="level-left mb-0 pb-0">
                                    <button 
                                        disabled={backBtnDisabled}
                                        className="button is-info is-fullwidth"
                                        onClick={() => this.handleButtonClick("back")}                                                
                                    >
                                        <span className="icon">
                                            <i className="fas fa-chevron-left"></i>
                                        </span>
                                        <span>Back</span>
                                    </button> 
                                </div>
                                <div className="level-center mt-1 pt-0">
                                    <button 
                                        className="button is-link is-fullwidth"
                                        onClick={this.handleOnclickPrint}                                                
                                    >
                                        <span className="icon">
                                            <i className="fas fa-print"></i>
                                        </span>
                                        <span>Print Page</span>
                                    </button>                                    
                                </div>  
                                <div className="level-right mt-1 pt-0">
                                    {submitBtn}
                                </div>  
                            </nav>                                                               
                        </div>
                    </div> 
                </div>                                      
            </Fragment>
        )   
    }
}
