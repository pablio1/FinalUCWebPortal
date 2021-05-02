import { toast } from 'bulma-toast';
import { YearsBetween, ValidateEmail, ValidatePassword, getDifferenceBetweenArrayObjects } from '../helpers/helper';
import { errToasterOptions, requiredEnrollmentCredentials } from './configObjects';

export function v_PortalAccountCreation(values)
{
    //Simple Validation - Check only if required field filled
    let container = document.getElementById("formBody");
    let inputs = container.querySelectorAll("select, input");     
    let invalidCounter = 0;     
    for (let i = 0; i < inputs.length; ++i) {
       if(inputs[i].required && values[inputs[i].name] === "") {
           invalidCounter++;
           let toasterOptions = errToasterOptions;
           toasterOptions["message"] = "Please fill in the <strong>" + inputs[i].dataset.fieldname + "</strong> field.";
           toast(toasterOptions);
        }         
    }    
    if(!ValidateEmail(values.email)) {
       invalidCounter++;
       let toasterOptions = errToasterOptions;
       toasterOptions["message"] = "Please fill in a valid <strong>Email Address</strong>.";
       toast(toasterOptions);
    }
    if(!ValidatePassword(values.password)) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Password must contain at least a number, lower case and upper case letters. \nPassword must be at least 6 characters long.";
        toast(toasterOptions);    
    }
    else if(values.password !== values.passwordCon) {        
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "<strong>Confirmation Password</strong> did not match.";
        toast(toasterOptions);
    }
    return invalidCounter;   

}

export function v_EmailVerification(values)
{
    //Simple Validation - Check only if required field filled   
    let invalidCounter = 0;     
    if(values.verificationCode.length !== 6) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Invalid Verification Code. The code is only <strong>6 digits long.</strong>";
        toast(toasterOptions);    
    } 
    return invalidCounter;   
}

export function v_AddressAndContacts(values)
{
     //Simple Validation - Check only if required field filled
     let container = document.getElementById("formBody");
     let inputs = container.querySelectorAll("select, input");     
     let invalidCounter = 0;     
     for (let i = 0; i < inputs.length; ++i) {
        if(inputs[i].required && values[inputs[i].name] === "") {
            invalidCounter++;
            let toasterOptions = errToasterOptions;
            toasterOptions["message"] = "Please fill in the <strong>" + inputs[i].dataset.fieldname + "</strong> field.";
            toast(toasterOptions);
         }
         if(inputs[i].name === "zipcodePermanentAdd" || inputs[i].name === "zipcodeCurrentAdd") {
            if(values[inputs[i].name]) {
                if(!/\d{1,4}/.test(values[inputs[i].name]) || values[inputs[i].name].length > 4) {  //Accepts only numeric max 4 digits                    
                    invalidCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please enter a valid <strong>" + inputs[i].dataset.fieldname + "</strong>";
                    toast(toasterOptions);                    
                }
            }            
         }
         if(inputs[i].name === "mobileNumber" || inputs[i].name === "landlineNumber") {
            if(values[inputs[i].name]) {
                if(!/[\d+()]/.test(values[inputs[i].name])) {  //Accepts only numeric, +, ( and )                 
                    invalidCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please enter a valid <strong>" + inputs[i].dataset.fieldname + "</strong>";
                    toast(toasterOptions);      
                }
            }            
         }            
     }

     return invalidCounter;   
}

export function v_CourseMenu(values)
{
    //Simple Validation - Check only if required field filled
    let container = document.getElementById("formBody");
    let inputs = container.getElementsByTagName('select');
    let invalidCounter = 0;
    for (let i = 0; i < inputs.length; ++i) {
        if(inputs[i].required && values[inputs[i].name] === "") {
            invalidCounter++;
            let toasterOptions = errToasterOptions;
            toasterOptions["message"] = "Please fill in the <strong>" + inputs[i].dataset.fieldname + "</strong> field.";
            toast(toasterOptions);     
        }                 
    }
    return invalidCounter;        
    
}


export function v_PersonalDetails(values)
{
    const currentDate = new Date(); 
             
    let container = document.getElementById("formBody");
    let inputs = container.querySelectorAll("select, input");
    let invalidCounter = 0;
    for (let i = 0; i < inputs.length; ++i) {
        if(inputs[i].required && values[inputs[i].name] === "") {
            invalidCounter++;
            let toasterOptions = errToasterOptions;
            toasterOptions["message"] = "Please fill in the <strong>" + inputs[i].dataset.fieldname + "</strong> field.";
            toast(toasterOptions);
        }  
        if(inputs[i].name === "fatherContact" || inputs[i].name === "motherContact" || inputs[i].name === "guardianContact") {
            if(values[inputs[i].name]) {
                if(!/[\d+()]/.test(values[inputs[i].name])) {  //Accepts only numeric, +, ( and )                 
                    invalidCounter++;
                    let toasterOptions = errToasterOptions;
                    toasterOptions["message"] = "Please enter a valid <strong>" + inputs[i].dataset.fieldname + "</strong>";
                    toast(toasterOptions);      
                }
            }            
         }               
    }
    const yearsArr = YearsBetween(new Date(values.birthdate), currentDate);
    if(yearsArr.length < 4 || new Date(values.birthdate) > currentDate) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Please fill in a valid <strong>Birthdate</strong>.";
        toast(toasterOptions);
    }
    if(values.motherName === "" && values.fatherName === "" && values.guardianName === "") {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Please fill in at least 1 <strong>Parent/Guardian's Full Name, Occupation and Contact Number</strong>.";
        toast(toasterOptions);
    }
    return invalidCounter; 
           
}

export function v_PreviousSchoolDetails(values) 
{            
    let container = document.getElementById("formBody");
    let inputs = container.querySelectorAll("select, input");
    let invalidCounter = 0;
    for (let i = 0; i < inputs.length; ++i) {
        if(inputs[i].required && values[inputs[i].name] === "") {
            invalidCounter++;
            let toasterOptions = errToasterOptions;
            toasterOptions["message"] = "Please fill in the <strong>" + inputs[i].dataset.fieldname + "</strong> field.";
            toast(toasterOptions);
        }         
    }
    if(values.schoolYearStartPrimary > values.schoolYearEndPrimary) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Please fill in a valid <strong>Primary School From and To Year</strong>.";
        toast(toasterOptions);   
    }
    if(values.schoolYearStartSecondary > values.schoolYearEndSecondary) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Please fill in a valid <strong>Secondary School From and To Year</strong>.";
        toast(toasterOptions);   
    }
    if(values.schoolYearStartCollege > values.schoolYearEndCollege) {
        invalidCounter++;
        let toasterOptions = errToasterOptions;
        toasterOptions["message"] = "Please fill in a valid <strong>College School From and To Year</strong>.";
        toast(toasterOptions);   
    } 
    return invalidCounter; 
}

export function v_RequiredDocumentsUpload(values)
{
    let invalidCounter = 0;
    let educationLevel = values.educLevel;
    if(["JD", "JT"].includes(values.selectedCourseCode)) educationLevel = "law"
    const requiredDocs = requiredEnrollmentCredentials(values.educLevel).filter(document => document.required === true); 
    //checkIfObjectExistInArray(array, key, value)
    const lackingDocs = getDifferenceBetweenArrayObjects(requiredDocs, values.SelectedFiles, "slug_id");
    if(lackingDocs.length > 0) {
        lackingDocs.forEach(function(document) {
            invalidCounter++;
            let toasterOptions = errToasterOptions;
            toasterOptions["message"] = "<strong>" + document.name + "</strong> is required. Please attached the file.";
            toast(toasterOptions); 
        });
    }
    
    //console.log("validate", getDifferenceBetweenArrayObjects(requiredDocs, values.SelectedFiles, "slug_id"));
    return invalidCounter;
}

export function v_ValidateFileSelect(file, requiredextensions) 
{
    let invalidCounter = 0;
    const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
    const fileSize = file.size;
    if(fileSize > 10485760) { //check if over 10MB
        invalidCounter++;
        //let toasterOptions = errToasterOptions;
        //toasterOptions["message"] = "The file you attached is more than 10BM. Please reduce the size to not more than 10MB.";
        //toast(toasterOptions); 
        alert("The file you attached is more than 10BM. Please reduce the size to not more than 10MB.");    
    }
    if(!requiredextensions.includes(fileExtension)) {
        invalidCounter++;
        let validExtensions = requiredextensions.join("/"); 
        //let toasterOptions = errToasterOptions;
        //toasterOptions["message"] = "File type attached is invalid! Please attached file with " + validExtensions + " extension.";
        //toast(toasterOptions); 
        alert("File type attached is invalid! Please attached file with " + validExtensions + " extension.");    
    }
    return invalidCounter; 
}