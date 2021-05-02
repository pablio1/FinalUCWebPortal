import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import isLoggedIn from '../../helpers/isLoggedIn';
import PortalAccountCreation from '../../components/registrationForm/PortalAccountCreation';
import EmailVerification from '../../components/registrationForm/EmailVerification';
import EmailVerified from '../../components/registrationForm/EmailVerified';
import EmailVerifiedPortalUser from '../../components/registrationForm/EmailVerifiedPortalUser';
import CourseMenu from '../../components/registrationForm/enrollmentForm/CourseMenu';
import PreviewSubmit from '../../components/registrationForm/enrollmentForm/PreviewSubmit';
import PersonalDetails from '../../components/registrationForm/enrollmentForm/PersonalDetails';
import AddressAndContacts from '../../components/registrationForm/enrollmentForm/AddressAndContacts';
import PreviousSchoolDetails from '../../components/registrationForm/enrollmentForm/PreviousSchoolDetails';
import RequiredDocumentsUpload from '../../components/registrationForm/enrollmentForm/RequiredDocumentsUpload';
import RegistrationSubmitted from '../../components/registrationForm/RegistrationSubmitted';
import { getActiveTerms } from '../../helpers/apiCalls';

export default class MainForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1, formSubmitted: false, regtype: 'admission', educLevel: '', term: '', activeTerms: null,
            
            firstName: '', middleName: '', lastName: '', suffixName: '',  email: '', password: '', passwordCon: '', verificationCode: '',

            selectedCollege: '', selectedCourse: '', selectedCourseCode: '', selectedYearLevelCollege: '', selectedEntryStatusCollege: '', selectedStrand: '', selectedSessionSecondary: '',
            selectedYearLevelSecondary: '', selectedEntryStatusSecondary: '', selectedGradeLevel: '', selectedEntryStatusPrimary: '',

            nationality: 'Filipino', gender: '', civilstatus: '', religion: '', birthdate: '', birthplace: '', motherName: '', motherContact: '', motherOccupation: '',
            fatherName: '', fatherContact: '', fatherOccupation: '', guardianName: '', guardianContact: '', guardianOccupation: '',  

            zipcodeCurrentAdd: '',provinceCurrentAdd: '', cityCurrentAdd: '', barangayCurrentAdd: '',streetCurrentAdd: '', provinceCurrentAddCode: '',
            zipcodePermanentAdd: '',provincePermanentAdd: '',cityPermanentAdd: '',barangayPermanentAdd: '',streetPermanentAdd: '',provincePermanentAddCode: '',
            zipcodeOverseasAdd: '',provinceOverseasAdd: '',cityOverseasAdd: '',countryOverseasAdd: '',streetOverseasAdd: '',isSameAsCurrentAdd: false,isNAOverseasAdd: false,
            mobileNumber: '',landlineNumber: '',facebookAccount: '',

            lastCourseCollege: '', schoolNameCollege: '', lastYearLevelCollege: '', schoolYearStartCollege: '', schoolYearEndCollege: '', isSameCollege: false, isK12Secondary: true,
            lastStrandSecondary: '',schoolNameSecondary: '', lastYearLevelSecondary: '', schoolYearStartSecondary: '', schoolYearEndSecondary: '', schoolTypeSecondary: 'public', lrnNumberSecondary: '', escStudentNumSecondary: '', escSchoolNumSecondary: '',
            isSameSecondary: false, schoolNamePrimary: '', lastYearLevelPrimary: '', schoolYearStartPrimary: '', schoolYearEndPrimary: '', schoolTypePrimary: 'public', lrnNumberPrimary: '', escStudentNumPrimary: '', escSchoolNumPrimary: '',

            SelectedFiles: [], SelectedFilesDetails: [],
        };
    }
    componentDidMount = () => {    
        const currentDate = new Date();
        if(!isLoggedIn()) {  
            this.setState({ 
                regtype: this.props.regtype,
                birthdate: currentDate,
            });
            getActiveTerms()
            .then(response => {
                this.setState({ 
                    term: response.data && response.data.active_term ? response.data.active_term : "",
                    activeTerms: response.data.active_terms
                });
            });      
        }
        else {
            this.setState({ 
                regtype: "admission",
                birthdate: currentDate,
                step: 4
            });
        }
    }
    nextStep = () => {
        const { step } = this.state;    
        this.setState({
            step : step + 1,
        });
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step : step - 1
        })
    }

    handleRegType = input => {      
        this.setState({ regtype: input});   
    } 

    handleEducLevel = (educLevel) => {       
        this.setState({ educLevel: educLevel });
    }

    handleSelectTerm = e => {
        this.setState({ term: e });
    }

    handleChange = (key, value) => {   
        //console.log("main", key, value);   
        this.setState({ [key] : value });
    }

    handleCheckBoxChange = (key, value) => {        
        this.setState({ [key]: value });
    }

    handleSelectFile = (id, filetype, e) => {
        const { SelectedFilesDetails, SelectedFiles, email } = this.state;
        const filesDetailsForDbData =  { "email": email, "type": filetype, "filename": e.name };
        const fileDetailsForDb = [{ 
            slug_id: id,
            data: filesDetailsForDbData
        }];
        const fileDetailsForUpload = [{
            slug_id: id,
            file: e
        }];
        
        let updatedSelectedFile = SelectedFiles.find(file => file.slug_id === id && (file.file = e, true )); //Find and update if existing object then return object (not array)
        if(updatedSelectedFile) {
            updatedSelectedFile = [updatedSelectedFile]; //place object inside array to make use of Array.prototype below for merging
            Array.prototype.push.apply(updatedSelectedFile, SelectedFiles.filter(file => file.slug_id !== id)); //Iterate SelectedFiles excluding updated object then merge with updatedSelectedFile
            this.setState({ SelectedFiles: updatedSelectedFile });
        }
        else {
            this.setState({ 
                SelectedFiles: SelectedFiles ? [...SelectedFiles, ...fileDetailsForUpload] : [...fileDetailsForUpload]
            });      
        }
        let updatedSelectedFilesDetails = SelectedFilesDetails.find(file => file.slug_id === id && (file.data = filesDetailsForDbData, true )); //Find and update if existing object then return object (not array)
        if(updatedSelectedFilesDetails) {
            updatedSelectedFilesDetails = [updatedSelectedFilesDetails]; //place object inside array to make use of Array.prototype below for merging
            Array.prototype.push.apply(updatedSelectedFilesDetails, SelectedFilesDetails.filter(file => file.slug_id !== id)); //Iterate SelectedFiles excluding updated object then merge with updatedSelectedFile
            this.setState({ SelectedFilesDetails: updatedSelectedFilesDetails });
        }
        else {
            this.setState({ 
                SelectedFilesDetails: SelectedFilesDetails ? [...SelectedFilesDetails, ...fileDetailsForDb] : [...fileDetailsForDb]
            });      
        }      
    }

    removeSelectedFile = e => {
        const { SelectedFiles, SelectedFilesDetails } = this.state;
        const updatedSelectedFilesDetails = SelectedFilesDetails.filter(file => file.slug_id !== e);  
        const updatedSelectedFiles = SelectedFiles.filter(file => file.slug_id !== e);
        this.setState({ 
            SelectedFilesDetails: updatedSelectedFilesDetails,
            SelectedFiles: updatedSelectedFiles
        });
    }

    submitForm = () => {
        const { 
            step, educLevel, firstName, middleName, lastName, suffixName, email, password, term,     

            selectedCollege, selectedCourse, selectedCourseCode, selectedYearLevelCollege, selectedEntryStatusCollege, selectedStrand, selectedSessionSecondary,
            selectedYearLevelSecondary, selectedEntryStatusSecondary, selectedGradeLevel, selectedEntryStatusPrimary,

            nationality, gender, civilstatus, religion, birthdate, birthplace, motherName, motherContact, motherOccupation,
            fatherName, fatherContact, fatherOccupation, guardianName, guardianContact, guardianOccupation, 

            zipcodeCurrentAdd,provinceCurrentAdd,cityCurrentAdd,barangayCurrentAdd,streetCurrentAdd,provinceCurrentAddCode,
            zipcodePermanentAdd,provincePermanentAdd,cityPermanentAdd,barangayPermanentAdd,streetPermanentAdd,provincePermanentAddCode,
            zipcodeOverseasAdd,provinceOverseasAdd,cityOverseasAdd,countryOverseasAdd,streetOverseasAdd,isNAOverseasAdd,
            mobileNumber,landlineNumber,facebookAccount,

            lastCourseCollege, schoolNameCollege, lastYearLevelCollege, schoolYearStartCollege, schoolYearEndCollege, 
            lastStrandSecondary, schoolNameSecondary, lastYearLevelSecondary, schoolYearStartSecondary, schoolYearEndSecondary, schoolTypeSecondary, lrnNumberSecondary, escStudentNumSecondary, escSchoolNumSecondary,
            schoolNamePrimary, lastYearLevelPrimary, schoolYearStartPrimary, schoolYearEndPrimary, schoolTypePrimary, lrnNumberPrimary, escStudentNumPrimary, escSchoolNumPrimary,
        
            SelectedFiles, SelectedFilesDetails

        } = this.state;
        const apiResourcePost = process.env.REACT_APP_API_UC_REGISTRATION_SUBMIT;
        const apiResourceUploadFile = process.env.REACT_APP_API_UC_UPLOAD_FILE;
        const currentSchoolTerm = term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM;
        const allowedTotalUnits = 0;
        //const enrolleeClassification = "H";
        
        let SanitizedFilesDetails = SelectedFilesDetails;
        SelectedFilesDetails.forEach(function(document, index) {
            const fileExtension = document.data.filename.substr(document.data.filename.lastIndexOf('.') + 1).toLowerCase();
            const fullname = (lastName.trim() + "_" +  firstName.trim() + (middleName.trim() ? "_" + middleName.trim() : "") + "_" + suffixName.trim()).split(" ").join("_"); 
            const filename = fullname + "_" + Math.floor(100000 + Math.random() * 900000) + "_[" + document.slug_id + "]" + "." + fileExtension;
            SanitizedFilesDetails[index].data.filename = filename;
        });
        const filesAttachments = SanitizedFilesDetails.map((file, i) => { 
           return file.data;
        });
        //const filesAttachments = SelectedFilesDetails.map((file, i) => { 
        //    return file.data;
        //});

        const educLevels = {"col":"CL","shs":"SH","jhs":"JH","bed":"BE"};
        let enrolleeClassification = selectedEntryStatusCollege;
        let yearLevel = selectedYearLevelCollege;
        let course = selectedCourseCode;
        let elemLastYear = ["K1","N1"].includes(lastYearLevelPrimary) ? 1 : lastYearLevelPrimary;
        if (educLevel === "jhs" || educLevel === "shs") {
            course = educLevel === "jhs" ? selectedYearLevelSecondary : selectedStrand;
            enrolleeClassification = selectedEntryStatusSecondary;
            yearLevel = educLevel === "jhs" ? selectedYearLevelSecondary.substring(1) : selectedYearLevelSecondary;
        }
        if (educLevel === "bed") {
            course = selectedGradeLevel;
            enrolleeClassification = selectedEntryStatusPrimary;
            yearLevel = ["K1","N1"].includes(selectedGradeLevel) ? 1 : selectedGradeLevel.substring(1);
        }
        
        const student = {
            "student_info": {
                "course": course,
                "year_level": yearLevel,
                "mdn": ["shs","jhs"].includes(educLevel) ? selectedSessionSecondary : "",
                "first_name": firstName.toUpperCase(),
                "middle_name": middleName.toUpperCase(),
                "last_name": lastName.toUpperCase(),
                "suffix": suffixName.toUpperCase(),
                "gender": gender.toUpperCase(),
                "status": civilstatus.toUpperCase(),
                "nationality": nationality.toUpperCase(),
                "birthdate": moment(birthdate).format('YYYY-MM-DD'),
                "birthplace": birthplace.toUpperCase(),
                "religion": religion.toUpperCase(),
                "start_term": parseInt(currentSchoolTerm),
                "allowed_units": allowedTotalUnits,
                "classification": enrolleeClassification,
                "dept": educLevels[educLevel],
                "password": password
            },
            "address_contact": {
                "pcountry": isNAOverseasAdd ? "PHILIPPINES" : countryOverseasAdd.toUpperCase(),
                "pprovince": isNAOverseasAdd ? provincePermanentAdd.toUpperCase() : provinceOverseasAdd.toUpperCase(),
                "pcity": isNAOverseasAdd ? cityPermanentAdd.toUpperCase() : cityOverseasAdd.toUpperCase(),
                "pbarangay": isNAOverseasAdd ? barangayPermanentAdd.toUpperCase() : "",
                "pstreet": isNAOverseasAdd ? streetPermanentAdd.toUpperCase() : streetOverseasAdd.toUpperCase(),
                "pzip": isNAOverseasAdd ? zipcodePermanentAdd : zipcodeOverseasAdd,
                "cprovince": provinceCurrentAdd.toUpperCase(),
                "ccity": cityCurrentAdd.toUpperCase(),
                "cbarangay": barangayCurrentAdd.toUpperCase(),
                "cstreet": streetCurrentAdd.toUpperCase(),
                "mobile": mobileNumber,
                "landline": landlineNumber,
                "email": email,
                "facebook": facebookAccount
            },
            "family_info": {
                "father_name": fatherName.toUpperCase(),
                "father_contact": fatherContact,
                "father_occupation": fatherOccupation.toUpperCase(),
                "mother_name": motherName.toUpperCase(),
                "mother_contact": motherContact,
                "mother_occupation": motherOccupation.toUpperCase(),
                "guardian_name": guardianName.toUpperCase(),
                "guardian_contact": guardianContact,
                "guardian_occupation": guardianOccupation.toUpperCase()
            },
            "school_info": {
                "elem_name": schoolNamePrimary.toUpperCase(),
                "elem_year": schoolYearStartPrimary + "-" + schoolYearEndPrimary,
                "elem_last_year": elemLastYear ? elemLastYear : 0,
                "elem_type": schoolTypePrimary.toUpperCase(),
                "elem_lrn_number": lrnNumberPrimary,
                "elem_esc_student_id": escStudentNumPrimary,
                "elem_esc_school_id": escSchoolNumPrimary,
                "sec_name": schoolNameSecondary.toUpperCase(),
                "sec_year": schoolYearStartSecondary + "-" + schoolYearEndSecondary,
                "sec_last_year": lastYearLevelSecondary ? lastYearLevelSecondary : 0,
                "sec_last_strand": lastStrandSecondary,
                "sec_type": schoolTypeSecondary.toUpperCase(),
                "sec_lrn_number": lrnNumberSecondary,
                "sec_esc_student_id": escStudentNumSecondary,
                "sec_esc_school_id": escSchoolNumSecondary,
                "col_name": schoolNameCollege.toUpperCase(),
                "col_year": schoolYearStartCollege + "-" + schoolYearEndCollege,
                "col_course": lastCourseCollege.toUpperCase(),
                "col_last_year": lastYearLevelCollege ? lastYearLevelCollege : 0
            },
            "attachment": filesAttachments,
            "active_term": term
          };
        
        //console.log(student);  
        
        //Files Upload
        let formData = new FormData();
        SelectedFiles.forEach(function(document, index) {
            const fileObj = SanitizedFilesDetails.filter(doc => doc.slug_id === document.slug_id);
            //const fileExtension = fileObj[0].data.filename.substr(fileObj[0].data.filename.lastIndexOf('.') + 1).toLowerCase();
            //const fullname = (lastName.trim() + "_" +  firstName.trim() + (middleName.trim() ? "_" + middleName.trim() : "") + "_" + suffixName.trim()).split(" ").join("_"); 
            //formData.append('formFiles', document.file, fullname + "_[" + document.slug_id + "]" + "." + fileExtension); 
            formData.append('formFiles', document.file, fileObj[0].data.filename); 
        });
        const headersFiles = { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data'
        };
        const headersData = { 
            'Access-Control-Allow-Origin': '*',
        };

        const apiRequest1 = axios.post(apiResourceUploadFile, formData, {headersFiles});
        const apiRequest2 = axios.post(apiResourcePost, student, {headersData});
        Promise.all([apiRequest1, apiRequest2]).then(values =>  {
            if(values[0].data.success > 0 && values[1].data.success > 0) {
                this.setState({
                    formSubmitted: true,
                    step : step + 1
                })
            }  
        }).catch(error => {
            console.log(error);
            this.setState({
                formSubmitted: false,
                step : step + 1
            });
        });

    }

    render(){
        const { 
            step, educLevel, regtype, formSubmitted, term, activeTerms,
            firstName, middleName, lastName, suffixName, email, password, passwordCon, verificationCode,  

            selectedCollege, selectedCourse, selectedCourseCode, selectedYearLevelCollege, selectedEntryStatusCollege, selectedStrand, selectedSessionSecondary,
            selectedYearLevelSecondary, selectedEntryStatusSecondary, selectedGradeLevel, selectedEntryStatusPrimary,

            nationality, gender, civilstatus, religion, birthdate, birthplace, motherName, motherContact, motherOccupation,
            fatherName, fatherContact, fatherOccupation, guardianName, guardianContact, guardianOccupation, 

            zipcodeCurrentAdd,provinceCurrentAdd,cityCurrentAdd,barangayCurrentAdd,streetCurrentAdd,provinceCurrentAddCode,
            zipcodePermanentAdd,provincePermanentAdd,cityPermanentAdd,barangayPermanentAdd,streetPermanentAdd,provincePermanentAddCode,
            zipcodeOverseasAdd,provinceOverseasAdd,cityOverseasAdd,countryOverseasAdd,streetOverseasAdd,isSameAsCurrentAdd,isNAOverseasAdd,
            mobileNumber,landlineNumber,facebookAccount,

            lastCourseCollege, schoolNameCollege, lastYearLevelCollege, schoolYearStartCollege, schoolYearEndCollege, isSameCollege, isK12Secondary, 
            lastStrandSecondary, schoolNameSecondary, lastYearLevelSecondary, schoolYearStartSecondary, schoolYearEndSecondary, schoolTypeSecondary, lrnNumberSecondary, escStudentNumSecondary, escSchoolNumSecondary,
            isSameSecondary, schoolNamePrimary, lastYearLevelPrimary, schoolYearStartPrimary, schoolYearEndPrimary, schoolTypePrimary, lrnNumberPrimary, escStudentNumPrimary, escSchoolNumPrimary,
        
            SelectedFiles, SelectedFilesDetails
        } = this.state;        
        const PortalAccountCreationValues = { 
            step, term,
            firstName, middleName, lastName, suffixName, email, password, passwordCon,                
        };
        const EmailVerificationValues = {
            verificationCode, email, term
        };
        const CourseMenuValues = {
            educLevel, term,
            selectedCollege, selectedCourse, selectedCourseCode, selectedYearLevelCollege, selectedEntryStatusCollege, selectedStrand, selectedYearLevelSecondary, selectedEntryStatusSecondary,
            selectedSessionSecondary, selectedGradeLevel, selectedEntryStatusPrimary
        }
        const PersonalInformationValues = {
            firstName, middleName, lastName, suffixName, term, educLevel,
            nationality, gender, civilstatus, religion, birthdate, birthplace, motherName, motherContact, motherOccupation,
            fatherName, fatherContact, fatherOccupation, guardianName, guardianContact, guardianOccupation  
        }
        const AddressAndContactsValues = {
            term, educLevel,
            zipcodeCurrentAdd,provinceCurrentAdd,cityCurrentAdd,barangayCurrentAdd,streetCurrentAdd,provinceCurrentAddCode,
            zipcodePermanentAdd,provincePermanentAdd,cityPermanentAdd,barangayPermanentAdd,streetPermanentAdd,provincePermanentAddCode,
            zipcodeOverseasAdd,provinceOverseasAdd,cityOverseasAdd,countryOverseasAdd,streetOverseasAdd,isSameAsCurrentAdd,isNAOverseasAdd,
            email,mobileNumber,landlineNumber,facebookAccount
        }
        const PreviousSchoolDetailsValues = {
            term, selectedEntryStatusCollege, selectedEntryStatusSecondary, selectedEntryStatusPrimary, selectedYearLevelSecondary,
            educLevel, lastCourseCollege, schoolNameCollege, lastYearLevelCollege, schoolYearStartCollege, schoolYearEndCollege, isSameCollege, isK12Secondary, selectedGradeLevel,
            lastStrandSecondary, schoolNameSecondary, lastYearLevelSecondary, schoolYearStartSecondary, schoolYearEndSecondary, schoolTypeSecondary, lrnNumberSecondary, escStudentNumSecondary, escSchoolNumSecondary,
            isSameSecondary, schoolNamePrimary, lastYearLevelPrimary, schoolYearStartPrimary, schoolYearEndPrimary, schoolTypePrimary, lrnNumberPrimary, escStudentNumPrimary, escSchoolNumPrimary
        }
        const RequiredDocumentsUploadValues = {
            term, educLevel, SelectedFiles, SelectedFilesDetails, selectedCourseCode
        }
        const PreviewSubmitValues = {
            educLevel, firstName, middleName, lastName, suffixName, email, term,

            selectedCollege, selectedCourse, selectedCourseCode, selectedYearLevelCollege, selectedEntryStatusCollege, selectedStrand, selectedSessionSecondary,
            selectedYearLevelSecondary, selectedEntryStatusSecondary, selectedGradeLevel, selectedEntryStatusPrimary,

            nationality, gender, civilstatus, religion, birthdate, birthplace, motherName, motherContact, motherOccupation,
            fatherName, fatherContact, fatherOccupation, guardianName, guardianContact, guardianOccupation, 

            zipcodeCurrentAdd,provinceCurrentAdd,cityCurrentAdd,barangayCurrentAdd,streetCurrentAdd,provinceCurrentAddCode,
            zipcodePermanentAdd,provincePermanentAdd,cityPermanentAdd,barangayPermanentAdd,streetPermanentAdd,provincePermanentAddCode,
            zipcodeOverseasAdd,provinceOverseasAdd,cityOverseasAdd,countryOverseasAdd,streetOverseasAdd,isSameAsCurrentAdd,isNAOverseasAdd,
            mobileNumber,landlineNumber,facebookAccount,

            lastCourseCollege, schoolNameCollege, lastYearLevelCollege, schoolYearStartCollege, schoolYearEndCollege, isSameCollege, isK12Secondary, 
            lastStrandSecondary, schoolNameSecondary, lastYearLevelSecondary, schoolYearStartSecondary, schoolYearEndSecondary, schoolTypeSecondary, lrnNumberSecondary, escStudentNumSecondary, escSchoolNumSecondary,
            isSameSecondary, schoolNamePrimary, lastYearLevelPrimary, schoolYearStartPrimary, schoolYearEndPrimary, schoolTypePrimary, lrnNumberPrimary, escStudentNumPrimary, escSchoolNumPrimary,
        
            SelectedFiles, SelectedFilesDetails
        }
        
        switch(step) {         
            case 1:
                if(regtype === "admission" || regtype === "portal") {
                    return <PortalAccountCreation
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        handleChange = {this.handleChange}
                        values={PortalAccountCreationValues}
                        />
                }                
            break;                
            case 2:
                if(regtype === "admission" || regtype === "portal") {
                    return <EmailVerification
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        handleChange = {this.handleChange}
                        values={EmailVerificationValues}
                        />
                }                             
            break;
            case 3:
                if(regtype === "admission") {
                    return <EmailVerified
                    handleEducLevel={this.handleEducLevel}
                    handleSelectTerm={this.handleSelectTerm}
                    term={term} 
                    educLevel={educLevel}
                    activeTerms={activeTerms}
                    nextStep={this.nextStep}
                    />               
                } 
                if(regtype === "portal") {
                    return <EmailVerifiedPortalUser />                               
                }                             
            break;
            case 4:
                if(regtype === "admission") {
                    return <CourseMenu
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleChange = {this.handleChange}
                        values={CourseMenuValues}
                        />                               
                }                
            break;
            case 5:
                if(regtype === "admission") {
                    return <PersonalDetails
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleChange = {this.handleChange}
                        educLevel = {educLevel}
                        values={PersonalInformationValues}
                        />                                             
                }
            break;
            case 6:
                if(regtype === "admission") {
                    return <AddressAndContacts
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleChange = {this.handleChange}
                        handleCheckBoxChange = {this.handleCheckBoxChange}
                        educLevel = {educLevel}
                        values={AddressAndContactsValues}
                        />                                            
                }
            break;
            case 7:
                if(regtype === "admission") {
                        return <PreviousSchoolDetails
                            prevStep={this.prevStep}
                            nextStep={this.nextStep}
                            handleChange = {this.handleChange}
                            handleCheckBoxChange = {this.handleCheckBoxChange}
                            educLevel = {educLevel}
                            values={PreviousSchoolDetailsValues}
                            />                                              
                }
            break;
            case 8:
                if(regtype === "admission") {
                    return <RequiredDocumentsUpload
                        prevStep={this.prevStep}
                        nextStep={this.nextStep}
                        handleChange = {this.handleChange}
                        handleSelectFile = {this.handleSelectFile}
                        removeSelectedFile = {this.removeSelectedFile}
                        educLevel = {educLevel}
                        values={RequiredDocumentsUploadValues}
                        />                                            
                }
            break;
            case 9:
                if(regtype === "admission") {
                    return <PreviewSubmit
                        prevStep={this.prevStep}
                        submitForm={this.submitForm}
                        handleChange = {this.handleChange}                           
                        educLevel = {educLevel}
                        values={PreviewSubmitValues}
                        />                                                   
                }
            break;
            case 10:
                if(regtype === "admission") {
                    return <RegistrationSubmitted 
                        prevStep={this.prevStep}  
                        formSubmitted={formSubmitted}  
                    />                               
                }
            break;
            default:
                return <div>----</div>
            
        }
    }
}
