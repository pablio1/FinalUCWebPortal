import axios from 'axios';
import store from 'store2';

export function updateStudentStatus(idNumber, data) {      
    const dataRequest = {
        id_number:          idNumber,
        existing_id_number: data.hasOwnProperty("existing_id_number") ? data.existing_id_number : "",
        status:             data.hasOwnProperty("status") ? data.status : 0,
        name_of_approver:   data.hasOwnProperty("name_of_approver") ? data.name_of_approver : "SYSTEM",
        message:            data.hasOwnProperty("message") ? data.message : "",
        year_level:         data.hasOwnProperty("year_level") ? data.year_level : 0,
        classification:     data.hasOwnProperty("classification") ? data.classification : "",
        allowed_units:      data.hasOwnProperty("allowed_units") ? data.allowed_units : 0,
        course_code:        data.hasOwnProperty("course_code") ? data.course_code : "",
        section:            data.hasOwnProperty("section") ? data.section : "", 
        needed_payment:     data.hasOwnProperty("needed_payment") ? data.needed_payment : 0,
        mdn:                data.hasOwnProperty("mdn") ? data.mdn : "",
        curr_year:          data.hasOwnProperty("curr_year") ? data.curr_year : "",
        active_term:        data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM,        
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(dataRequest)
    return axios.post(process.env.REACT_APP_API_UC_STUDENT_STATUS_UPDATE, dataRequest, {headers})
            .catch(error => {
                console.log(error);
            });
}

export function handleStudentRequest(idNumber, type) {
    let deblockReg = 0;
    let overloadReq = 0;
    if(type === "deblock") deblockReg = 1;
    if(type === "resDeblock") deblockReg = 0;
    if(type === "overload") overloadReq = 1;
    if(type === "resOverload") overloadReq = 0;

    const data = {
        stud_id: idNumber,
        request_deblock: deblockReg,
        request_overload: overloadReq
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(data)
    return axios.post(process.env.REACT_APP_API_UC_STUDENT_SEND_REQUEST, data, {headers})
            .catch(error => {
                console.log(error);
            });  

}

export function saveSubjectsSchedules(data) {
    const dataRequests = {
        id_number:      data.hasOwnProperty("id_number") ? data.id_number : "", 
        schedules:      data.hasOwnProperty("schedules") ? data.schedules : "", 
        total_units:    data.hasOwnProperty("total_units") ? parseInt(data.total_units, 10) : 0, 
        year_level:     data.hasOwnProperty("year_level") ? data.year_level : 0, 
        classification: data.hasOwnProperty("classification") ? data.classification : "",
        accept_section: data.hasOwnProperty("accept_section") ? data.accept_section : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    //console.log(dataRequests)
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_ENROLL, dataRequests, {headers})
            .catch(error => {
                console.log(error);
            });     
}

export function getStudentSavedSchedules(idNumber, term) {
    const dataRequest = {
        id_number: idNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_STUDENT_SUBJECTS, dataRequest, {headers})
            .catch(error => {
                console.log(error);
            });
}

export function updateScheduleStatus(data) {
    const dataRequest = {
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        section: data.hasOwnProperty("section") ? data.section : "",
        edp_code: data.hasOwnProperty("edp_code") ? data.edp_code : [],
        status: data.hasOwnProperty("status") ? data.status : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
      }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_SET_SCHEDULE_STATUS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getStudentInfo(idNumber, payment, term) {
    const dataRequest = {
        id_number: idNumber, 
        payment: payment,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getOldStudentInfo(idNumber, payment, term) { 
    const dataRequest = {
        id_number: idNumber, 
        payment: payment,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }   
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_OLD_STUDENT_INFO, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function savePayment(data) {
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_SAVE_PAYMENT, data, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function getSchedules(data) {
    // undeployed: 0, deployed: 1, dissolve: 2, requested: 3, deferred: 4, all: 9  
    const dataRequest = {
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        year_level: data.hasOwnProperty("year_level") ? data.year_level : 0,
        edp_codes: data.hasOwnProperty("edp_codes") ? data.edp_codes : [],
        subject_name: data.hasOwnProperty("subject_name") ? data.subject_name : "",
        section: data.hasOwnProperty("section") ? data.section : "",
        status: data.hasOwnProperty("status") ? data.status : 9,
        sort: data.hasOwnProperty("sort") ? data.sort : 0,
        gen_ed: data.hasOwnProperty("gen_ed") ? data.gen_ed : "0", 
        page: data.hasOwnProperty("page") ? data.page : 0, 
        limit: data.hasOwnProperty("limit") ? data.limit : 0,  
        no_nstp: data.hasOwnProperty("no_nstp") ? data.no_nstp : 0, 
        no_pe: data.hasOwnProperty("no_pe") ? data.no_pe : 0, 
        department_abbr: data.hasOwnProperty("department_abbr") ? data.department_abbr : "",
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM   
    };
    //console.log(dataRequest)
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });       
}

export function loginUser(idnumber, password) {
    const data = { 
        id_number: idnumber,
        password: password
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
    };
    return axios.post(process.env.REACT_APP_API_UC_LOGIN, data, {headers})
    .catch(error => {
        console.log(error);
    });   
}

export function changePassword(idnumber, password) {
    const data = { 
        user_id: idnumber,
        new_password: password
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(data)
    return axios.post(process.env.REACT_APP_API_UC_CHANGE_PASSWORD, data, {headers})
    .catch(error => {
        console.log(error);
    });
    
}

export function getStudentList(data) {
    const dataRequest = {
        status: data.hasOwnProperty("status") ? data.status : 99,
        page: data.hasOwnProperty("page") ? data.page : 1,
        limit: data.hasOwnProperty("limit") ? data.limit : 0,
        name: data.hasOwnProperty("name") ? data.name : "",
        course: data.hasOwnProperty("course") ? data.course : "",
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        date: data.hasOwnProperty("date") ? data.date : "",
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        year_level: data.hasOwnProperty("year_level") ? data.year_level : 0,
        classification: data.hasOwnProperty("classification") ? data.classification : "",
        is_cashier: data.hasOwnProperty("is_cashier") ? data.is_cashier : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    //console.log(dataRequest);
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(dataRequest)
    return axios.post(process.env.REACT_APP_API_UC_GET_ENROLLMENT_STUDENT_LIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getCourses(data) {
    //course_department: "College of Business and Accountancy",
    //department_abbr: "CBA"
    const dataRequest = { 
        department_abbr: data.hasOwnProperty("department_abbr") ? data.department_abbr : "",
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        department: data.hasOwnProperty("department") ? data.department : "", 
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(dataRequest)
    return axios.post(process.env.REACT_APP_API_UC_COURSES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getCoursesOpen(data) {
    const dataRequest = { 
        department_abbr: data.hasOwnProperty("department_abbr") ? data.department_abbr : "",
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        department: data.hasOwnProperty("department") ? data.department : "", 
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    //console.log(dataRequest)
    return axios.post(process.env.REACT_APP_API_UC_GET_OPEN_ENROLL_COURSES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getColleges(term) {
    const dataRequest = {
        department: "cl",
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_COLLEGES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getSections(data) {
    const dataRequest = {
        year_level: data.hasOwnProperty("year_level") ? data.year_level : 0,
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        college_abbr: data.hasOwnProperty("college_abbr") ? data.college_abbr : "",    
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_GET_SECTIONS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getOpenSections(data) {
    const dataRequest = {
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        year_level: data.hasOwnProperty("year_level") ? data.year_level : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM   
    };
    //console.log(dataRequest)
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_GET_OPEN_SECTIONS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getStudentStatus(idNumber, term) {
    const dataRequest = {
        id_number: idNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token"),
    };
    return axios.post(process.env.REACT_APP_API_UC_CHECK_ENROLLMENT_STATUS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function createUser(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        lastname: data.hasOwnProperty("lastname") ? data.lastname : "",
        firstname: data.hasOwnProperty("firstname") ? data.firstname : "",
        middle_initial: data.hasOwnProperty("middle_initial") ? data.middle_initial : ".",
        suffix: data.hasOwnProperty("suffix") ? data.suffix : "",
        dept: data.hasOwnProperty("dept") ? data.dept : "",
        course: data.hasOwnProperty("course") ? data.course : "",
        sex: data.hasOwnProperty("sex") ? data.sex : "",
        user_type: data.hasOwnProperty("user_type") ? data.user_type : "",
        email: data.hasOwnProperty("email") ? data.email : "",
        mobile_number: data.hasOwnProperty("mobile_number") ? data.mobile_number : "",
    };
    //console.log(dataRequest)
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token"),
    };
    return axios.post(process.env.REACT_APP_API_UC_CREATE_USER, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
    
}

export function cancelEnrollment(idNumber, term) {
    const dataRequest = {
        id_number: idNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_CANCEL_ENROLLMENT,  dataRequest, {headers}) 
    .catch(error => {
        console.log(error);
    });  
}

export function getStatusCount(courseAbbr, term) {
     /*"registered": 19,
        "approved_registration_registrar": 2,
        "disapproved_registration_registrar": 1,
        "approved_registration_dean": 8,
        "disapproved_registration_dean": 0,
        "selecting_subjects": 5,
        "approved_by_dean": 0,
        "disapproved_by_dean": 0,
        "approved_by_accounting": 2,
        "approved_by_cashier": 0,
        "officially_enrolled": 0,
        "withdrawn_enrollment_before_start_of_class": 0,
        "withdrawn_enrollment_start_of_class": 0,
        "cancelled": 2*/
    const data = { 
        course_department: courseAbbr,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM 
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_GET_STATUS_COUNT, data, {headers})
    .catch(error => {
        console.log(error);
    });        
}

export function getEnrollmentReport(date, college, term) {
    const data = date ? {
        dte: date, //2020-12-23
        department: college,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM 
    } : { 
        department: college,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM 
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UC_ENROLLMENT_REPORTS, data, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function updateStudentInfo(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        dept: data.hasOwnProperty("dept") ? data.dept : "",
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        year: data.hasOwnProperty("year") ? data.year : 1,
        mobile: data.hasOwnProperty("mobile") ? data.mobile : "",
        email: data.hasOwnProperty("email") ? data.email : "",
        facebook: data.hasOwnProperty("facebook") ? data.facebook : "",
        classification: data.hasOwnProperty("classification") ? data.classification : "",
        mdn: data.hasOwnProperty("mdn") ? data.mdn : "",
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    //console.log(dataRequest)
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_OLD_STUDENT_UPDATE, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function updateEmail(idNumber, email) {
    const dataRequest = {
        id_number: idNumber,
        email: email
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_UPDATE_EMAIL, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function checkEmailVerificationCode(email, code) {
    const dataRequest = { 
        email: email,
        token: code,                        
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
    };    
    return axios.post(process.env.REACT_APP_API_UC_EMAIL_CHECK_VERIFICATION, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function getGradesEvaluation(idNumber, dept) {
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };  
    let apiCall = process.env.REACT_APP_API_UC_GRADE_EVALUATION;
    if(dept === "JH" || dept === "BE") apiCall = process.env.REACT_APP_API_UC_GRADE_EVALUATION_BE;
    return axios.post(apiCall, { id_number : idNumber }, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function getScheduleSubject(edpCode, term) {
    const dataRequest = {
        edp_code : edpCode,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SHOW_SCHEDULE, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function updateSchedule(data) {
    const dataRequest = {        
        edpCode: data.hasOwnProperty("edpCode") ? data.edpCode : "",
        description: data.hasOwnProperty("description") ? data.description : "",
        subType: data.hasOwnProperty("subType") ? data.subType : "",
        units: data.hasOwnProperty("units") ? data.units : 0,
        timeStart: data.hasOwnProperty("timeStart") ? data.timeStart : "",
        timeEnd: data.hasOwnProperty("timeEnd") ? data.timeEnd : "",
        mdn: data.hasOwnProperty("mdn") ? data.mdn : "",
        days: data.hasOwnProperty("days") ? data.days : "",
        mTimeStart: data.hasOwnProperty("mTimeStart") ? data.mTimeStart : "",
        mTimeEnd: data.hasOwnProperty("mTimeEnd") ? data.mTimeEnd : "",
        mDays: data.hasOwnProperty("mDays") ? data.mDays : "",
        maxSize: data.hasOwnProperty("maxSize") ? data.maxSize : 0,
        section: data.hasOwnProperty("section") ? data.section : "",
        room: data.hasOwnProperty("room") ? data.room : "",
        splitType: data.hasOwnProperty("splitType") ? data.splitType : "",
        splitCode: data.hasOwnProperty("splitCode") ? data.splitCode : "",
        isGened: data.hasOwnProperty("isGened") ? data.isGened : 0,
        status: data.hasOwnProperty("status") ? data.status : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SCHEDULE_UPDATE, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function fixOstspTool(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_REMOVE_DUPLICATE_OSTSP, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function getClassList(edpCode, term) {  
    const dataRequest = {
        edp_code: edpCode,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM        
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_GET_CLASS_LIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function getClassListSection(courseCode, section, term) {
    const dataRequest = {
        course_code: courseCode, 
        section: section,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_GET_SECTION_CLASSLIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    }); 
}

export function forceUpdateStatus(idNumber, status, term) {
    const dataRequest = {
        id_number: idNumber, 
        new_status: status,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }    
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_FORCE_UPDATE_STATUS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function manualEnroll(idNumber, edpCodes, term) {
    const dataRequest = {
        id_number: idNumber, 
        edp_codes: edpCodes,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    } 
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_MANUAL_ENROLLMENT, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function studentApplyPromissory(data, type, term) {  
    let dataRequest = {
        stud_id: data.hasOwnProperty("stud_id") ? data.stud_id : "",
        message: data.hasOwnProperty("message") ? data.message : "", 
        promise_pay: data.hasOwnProperty("promise_pay") ? data.promise_pay : 0,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM  
    };
    let apiCall = process.env.REACT_APP_API_UC_APPLY_PROMISSORY;
    if(type === "exam") {  
        dataRequest["exam"] = data.hasOwnProperty("exam") ? data.exam : "";
        dataRequest["department"] = data.hasOwnProperty("department") ? data.department : "";
        apiCall = process.env.REACT_APP_API_APPLY_PROMISSORY_EXAM;
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(apiCall, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function studentListPromissory(data) {
    const dataRequest = {
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        status: data.hasOwnProperty("status") ? data.status : 1, 
        limit: data.hasOwnProperty("limit") ? data.limit : 0,
        page: data.hasOwnProperty("page") ? data.page : 1,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM   
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_VIEW_PROMISSORY, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function approvePromissory(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        approved_deblock: data.hasOwnProperty("approved_deblock") ? data.approved_deblock : 0, 
        approved_overload: data.hasOwnProperty("approved_overload") ? data.approved_overload : 0,
        approved_promissory: data.hasOwnProperty("approved_promissory") ? data.approved_promissory : 3, 
        approved_prelim_promissory: data.hasOwnProperty("approved_prelim_promissory") ? data.approved_prelim_promissory : 0,
        approved_midterm_promissory: data.hasOwnProperty("approved_midterm_promissory") ? data.approved_midterm_promissory : 0,
        approved_semi_promissory: data.hasOwnProperty("approved_semi_promissory") ? data.approved_semi_promissory : 0,
        approved_final_promissory: data.hasOwnProperty("approved_final_promissory") ? data.approved_final_promissory : 0,
        max_units: data.hasOwnProperty("max_units") ? data.max_units : 0,
        promise_pay: data.hasOwnProperty("promise_pay") ? data.promise_pay : 0,
        message: data.hasOwnProperty("message") ? data.message : "",
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_STUDENT_APPROVE_REQUEST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function correctTotalUnits(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_CORRECT_TOTAL_UNITS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function setClosedSubjects(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SET_CLOSED_SUBJECTS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function sendNotification(data) {
    const dataRequest = {
        stud_id: data.hasOwnProperty("stud_id") ? data.stud_id : "",
        from_sender: data.hasOwnProperty("from_sender") ? data.from_sender : "", 
        message: data.hasOwnProperty("message") ? data.message : "",  
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SEND_NOTIFICATION, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function viewStudentInfo(IdNumber, term) {
    const dataRequest = {
        stud_id : IdNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_UPDATE_INFO_VIEW, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function updateStudentDetails(data) {
    const dataRequest = {
        stud_id: data.hasOwnProperty("stud_id") ? data.stud_id : "",
        first_name: data.hasOwnProperty("first_name") ? data.first_name : "",
        last_name: data.hasOwnProperty("last_name") ? data.last_name : "",
        middle_initial: data.hasOwnProperty("middle_initial") ? data.middle_initial : "",
        year_level: data.hasOwnProperty("year_level") ? data.year_level : 0,
        dept: data.hasOwnProperty("dept") ? data.dept : "",
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        classification: data.hasOwnProperty("classification") ? data.classification : "",
        allowed_units: data.hasOwnProperty("allowed_units") ? data.allowed_units : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_UPDATE_INFO, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getTeachersList(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        name: data.hasOwnProperty("name") ? data.name : "",
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_GET_TEACHERS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function saveTeachersLoad(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        edp_codes: data.hasOwnProperty("edp_codes") ? data.edp_codes : [""],
        active_term: data.hasOwnProperty("term") ? data.term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SAVE_TEACHERS_LOAD, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getTeachersLoad(idNumber, term) {
    const dataRequest = {
        id_number : idNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_GET_TEACHERS_LOAD, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function saveSubjectAdjustments(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        addEdpCodes: data.hasOwnProperty("addEdpCodes") ? data.addEdpCodes : [""],
        deleteEdpCodes: data.hasOwnProperty("deleteEdpCodes") ? data.deleteEdpCodes : [""]
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_SAVE_SUBJECT_ADJUSTMENTS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function listStudentsWithAdjustments(data) {
    const dataRequest = {
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        year: data.hasOwnProperty("year") ? data.year : 0,
        name: data.hasOwnProperty("name") ? data.name : "",
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        status: data.hasOwnProperty("status") ? data.status : 0,
        limit: data.hasOwnProperty("limit") ? data.limit : 0,
        page: data.hasOwnProperty("page") ? data.page : 0,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    };
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_VIEW_SUBJECT_ADJUSTMENTS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function viewAdjustmentDetails(IDNumber, term) {
    const dataRequest = {
        stud_id : IDNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_VIEW_ADJUSTMENT_DETAILS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function adjustmentApprove(IDNumber, approve, term) {
    const dataRequest = {
        id_number : IDNumber,
        approve: approve,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_VIEW_ADJUSTMENT_APPROVE, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function reactivateAdjustment(IDNumber, term) {
    const dataRequest = {
        id_number : IDNumber,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_REACTIVATE_ADJUSTMENT, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function transferSection(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        course_code: data.hasOwnProperty("course_code") ? data.course_code : "",
        section: data.hasOwnProperty("section") ? data.section : "",
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }      
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_TRANSFER_SECTION, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function correctLabAndLec() {
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_UC_CORRECT_LAB_AND_LEC, { }, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function sendNotifDissolveSchedules(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_SEND_NOTIF_DISSOLVED_SCHEDULES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function exportUsersForLMS(type, term) {
    const dataRequest = {
        old_student: type,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_EXPORT_USERS_LMS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function exportCoursesForLMS(type, term) {
    const dataRequest = {
        dissolved: type,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_EXPORT_COURSES_LMS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function exportEnrolledForLMS(type, term) {
    const dataRequest = {
        delete: type,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_EXPORT_ENROLLED_LMS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function exportTeachersForLMS(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };    
    return axios.post(process.env.REACT_APP_API_EXPORT_TEACHERS_LMS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getStudentAssessment(level,idNumber,exam, term) {
    const dataRequest = {
        id_number: idNumber, 
        exam: exam,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    let apiCall =  process.env.REACT_APP_API_GET_ASSESSMENT_CL; 
    if(level === "SH") apiCall = process.env.REACT_APP_API_GET_ASSESSMENT_SH; 
    if(level === "JH" || level === "BE") apiCall = process.env.REACT_APP_API_GET_ASSESSMENT_JH; 
    return axios.post(apiCall, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getAssessmentStudentListReport(department, term) {
    const dataRequest = {
        course_department: department,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_GET_ASSESSMENT_REPORT, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getAssessmentStudentList(data) {
    const dataRequest = {
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        status: data.hasOwnProperty("status") ? data.status : 0,
        exam: data.hasOwnProperty("exam") ? data.exam : "",
        department: data.hasOwnProperty("department") ? data.department : "",
        limit: data.hasOwnProperty("limit") ? data.limit : 0,
        page: data.hasOwnProperty("page") ? data.page : 1,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_PROMISSORY_STUDENT_LIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getPaymentStudentList(data) {
    const dataRequest = {
        course_department: data.hasOwnProperty("course_department") ? data.course_department : "",
        status: data.hasOwnProperty("status") ? data.status : 0,
        exam: data.hasOwnProperty("exam") ? data.exam : "",
        limit: data.hasOwnProperty("limit") ? data.limit : 0,
        page: data.hasOwnProperty("page") ? data.page : 1,
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_PAYMENT_STUDENT_LIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getStudentPayments(data) {
    const dataRequest = {
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        status: data.hasOwnProperty("status") ? data.status : 0,
        exam_type: data.hasOwnProperty("exam_type") ? data.exam_type : "",
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_PAYMENTS, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function acknowledgePaymentReceipt(filename, duplicate, term) {
    const dataRequest = {
        filename: filename, 
        duplicate: duplicate,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_PAYMENT_ACKNOWLEDGE, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getPermitList(edpcode, term) {
    const dataRequest = {
        edp_code: edpcode,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_PERMIT_LIST, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function uploadGrades(data) {
    const dataRequest = {
        edp_code: data.hasOwnProperty("edp_code") ? data.edp_code : "",
        exam: data.hasOwnProperty("exam") ? data.exam : 0,
        stud_grades: data.hasOwnProperty("stud_grades") ? data.stud_grades : [],
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_UPLOAD_GRADES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function viewGrades(edpCode, term) {
    const dataRequest = {
        edp_code: edpCode,
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_VIEW_GRADES, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function uploadCores(data) { 
    const dataRequest = {
        department: data.hasOwnProperty("department") ? data.department : "",
        exam: data.hasOwnProperty("exam") ? data.exam : 0,
        stud_core: data.hasOwnProperty("stud_core") ? data.stud_core : [],
        active_term: data.hasOwnProperty("active_term") ? data.active_term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_CORE_UPLOAD, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getActiveTerms() { 
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        //'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_CONFIG_ACTIVE_TERMS, {}, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function checkEmailVerified(id_number,email) { 
    const dataRequest = {
        id_number: id_number,
        email: email
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_USER_VERIFIED, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function copyGradesToEvaluation(term) {
    const dataRequest = {
        active_term: term ? term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_COPY_GRADES_TO_EVAL, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function teacherGradeReport(data) {  
    const dataRequest = {
        department: data.hasOwnProperty("department") ? data.department : "",
        id_number: data.hasOwnProperty("id_number") ? data.id_number : "",
        exam: data.hasOwnProperty("exam") ? data.exam : 0,
        active_term: data.hasOwnProperty("term") ? data.term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
    }
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_GRADE_REPORT, dataRequest, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getTeacherListByDept(dept, activeTerm) {  
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    }; 
    return axios.post(process.env.REACT_APP_API_UC_GET_TEACHERS_DEPT, {dept: dept, active_term: activeTerm}, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getCurriculum(data) {
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_CURRICULUM, data, {headers})
            .catch(error => {
                console.log(error);
            });
}

export function getStudentRequest(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_REQUEST_SUBJECT,data , {headers})
    .catch(error => {
        console.log(error);
    });
}
export function saveSubjectRequest(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_SAVE_SUBJECT_REQUEST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function getStudentRequestSubject(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_STUDENT_REQUEST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function addStudentRequest(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_ADD_STUDENT_REQUEST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function cancelStudentRequest(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_CANCEL_STUDENT_REQUEST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getAllCurriculum(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_ALL_CURRICULUM, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function getCourseList(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_COURSE_LIST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function saveCurriculum(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_SAVE_CURRICULUM, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function closeCurriculum(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_CLOSE_CURRICULUM, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function getSubjectInfo(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_SUBJECT_INFO, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function removePrerequisite(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_REMOVE_PREREQUISITE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function savePrerequisite(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_SAVE_PREREQUISITE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function getEquivalence(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_EQUIVALENCE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function addEquivalence(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_ADD_EQUIVALENCE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}
export function removeEquivalence(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_REMOVE_EQUIVALENCE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function searchSubjects(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_SEARCH_SUBJECT, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getSubjectEquivalence(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_SUBJECT_EQUIVALENCE, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function getAllStudentsRequest(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_GET_ALL_STUDENT_REQUEST, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

export function updateRequestStatus(data){
    const headers = { 
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer ' + store.get("token")
    };
    return axios.post(process.env.REACT_APP_API_UPDATE_REQUEST_STATUS, data, {headers})
    .catch(error => {
        console.log(error);
    });
}

