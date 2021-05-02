import React, { Component, Fragment } from 'react';
import PreviewSubmitCourse from '../enrollmentForm/formComponents/PreviewSubmitCourse';
import PreviewSubmitPersonalDetails from '../enrollmentForm/formComponents/PreviewSubmitPersonalDetails';
import PreviewSubmitAddressContacts from '../enrollmentForm/formComponents/PreviewSubmitAddressContacts';
import PreviewSubmitPreviousSchools from '../enrollmentForm/formComponents/PreviewSubmitPreviousSchools';
import PreviewSubmitRequiredDocuments from '../enrollmentForm/formComponents/PreviewSubmitRequiredDocuments';
import ProfilePictureCrop from '../../elements/ProfilePictureCrop';


export default class PreviewSubmit extends Component {   
    state = {
        idPicture: "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000",
        showModal: false,
        croppedImage: null 
    }
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "submit") this.props.submitForm();
        //this.props.handleButtonClick(e);    
    }
    toggleModal = () => {
        const { showModal } = this.state;
        this.setState({ showModal: !showModal }); 
    }
    onChangeCroppedImage = e => {
        this.setState({ croppedImage: e });
    }
    
    render() { 
        const { values } = this.props;
        const { idPicture, showModal, croppedImage } = this.state;

        return(  
            <Fragment> 
                <ProfilePictureCrop 
                    showModal={showModal} 
                    idPicture={idPicture}
                    toggleModal={this.toggleModal} 
                    onChangeCroppedImage={this.onChangeCroppedImage}
                />
                <div className="section pt-0 mt-0">
                    <div className="columns">
                        <div className="column"> 
                            <div className="has-text-centered ">
                                <h3 className="has-text-weight-semibold is-size-4">Review Form Entries</h3>  
                                <h4 className="mt-1">
                                    Please check and review if all information you entered are correct.<br />
                                    You can change your entry in the previous forms clicking the Back button.
                                </h4>  

                                    <button className="button is-small is-success" onClick={this.toggleModal}>Small</button>
                            </div>
                            <div className="">                                
                                <PreviewSubmitCourse 
                                    firstName={values.firstName}
                                    middleName={values.middleName}
                                    lastName={values.lastName}
                                    suffixName={values.suffixName}
                                    email={values.email}
                                    selectedCollege={values.selectedCollege}
                                    selectedCourse={values.selectedCourse}
                                    selectedEntryStatusCollege={values.selectedEntryStatusCollege}
                                    lastYearLevelCollege={values.lastYearLevelCollege}
                                    idPicture={idPicture}
                                    educLevel={values.educLevel}    
                                    SelectedFiles={values.SelectedFiles}
                                    selectedYearLevelCollege={values.selectedYearLevelCollege}
                                    croppedImage={croppedImage}
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
                                        className="button is-success is-fullwidth"
                                        onClick={() => this.handleButtonClick("submit")}                                                
                                    >                                                
                                        <span>Submit Application</span>
                                        <span className="icon">
                                            <i className="fas fa-paper-plane"></i>
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
