import React, { Component,Fragment } from "react";
import { withRouter } from 'react-router-dom';
import SubjectForm from '../../components/enrollment/RequestSubjectForm';
import SearchRequestSubject from '../../components/elements/SearchRequestSubject';
import { getCurriculum,getStudentGrades, getStudentRequest,saveSubjectRequest,getStudentRequestSubject,addStudentRequest,cancelStudentRequest } from '../../helpers/apiCalls';
import { getLoggedUserDetails,checkRequestedSubject,toStandardTime,autoTimeEndSetter } from "../../helpers/helper";
import RequestedSubjects from '../../components/elements/RequestedSubjects';

export class RequestSubjects extends Component {
    state = {
        showRequestForm:false, subject_name: null, days: null, time_start: null, time_end:null,requestedSubjects: null,filteredSubjects: null,
         requestSubjects: null,rtype: 0, subjects: null, internal_code: null, success: null, closeButton:null, sanitizedSubject: {test: null}
    }
    componentDidMount = () => {
        var data = {
            department: getLoggedUserDetails("deptabbr"),
            course_code: getLoggedUserDetails("coursecode"),
            term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }
         getStudentRequest(data)
         .then(response => {  
            if(response.data) {          
                this.setState({
                    requestSubjects: response.data.request
                });
            }
        }); 
        //console.log(getLoggedUserDetails("idnumber"));
        if(getLoggedUserDetails("curryear") != 0 ){
            var data = {
                id_number: getLoggedUserDetails("idnumber"),
                year: getLoggedUserDetails("curryear"),
                term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
            }
            getCurriculum(data,getLoggedUserDetails("dept"))
            .then(response => {  
                if(response.data) {          
                    this.setState({
                        subjects:  response.data.subjects,
                        grades: response.data.grades
                    });
                    
                }
            }); 
        }
        var requestData = {
            id_number : getLoggedUserDetails("idnumber"),
            term : process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }
        getStudentRequestSubject(requestData)
        .then(response => {
            if(response.data) {          
                this.setState({
                    requestedSubjects:  response.data.request,
                    filteredSubjects: response.data.filtered,
                });
                //this.sanitizedSubjectList();
            }
        });
        
    }
   
    inputChange = input => e => {
        const{days} = this.state;
        this.setState({
            [input]: e.target.value
        });
        if(input == "time_start"){
            this.setState({
                time_end: autoTimeEndSetter(e.target.value , days)
            });
        }
        console.log("INPUT ",input);
    }
    
    handleCloseButton = () =>{
        this.setState({
            success: null
        });
        //console.log("test");
    }
    handleAddSubjectButton = (e) =>{
        
        const data = {
            id_number: getLoggedUserDetails("idnumber"),
            internal_code: e,
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        };
        console.log("handleAddSubject",data);
        addStudentRequest(data)
        .then(response => {
            if(response.data) {     
                this.handleLoadSubjectRequest();
            }
        });
    }
    handleCancelSubjectButton = (e) =>{
        const data = {
            id_number: getLoggedUserDetails("idnumber"),
            internal_code: e,
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        };
        cancelStudentRequest(data)
        .then(response => {
            if(response.data) {     
                this.handleLoadSubjectRequest();
            }
        });
    }
    handleRequestButton=()=>{
        const{showRequestForm}=this.state;
        this.setState({
            showRequestForm: !showRequestForm
        });
    }
    splitMilitaryTime = (military) =>{
        military = military.split(":");
        var cTime= military[0]+military[1];
        return (parseInt(cTime)).toString();
    }

    handleButtonSubmitRequest = () =>{
        const{internal_code, days, time_start, time_end, mdn, rtype,success,subjects,requestSubjects} = this.state;
        
       
        //var hasExist = (loadRequest > 0) ? true:false;
        if(internal_code == null || days == null || time_start == null ){
            this.setState({
                success: 0
            });
        }else{
            let mDn = "AM";
            var hasExist = false;
            var loadRequest = requestSubjects.filter( fRequest=>  fRequest.internal_code == internal_code).map((fRequest, index)=>{
                hasExist = true;
            });

            if(this.splitMilitaryTime(time_end) >= 1200){
                mDn = "PM";
            }
            
            if(!hasExist){
                const data = {
                    internal_code: internal_code,
                    time_start: toStandardTime(time_start),
                    time_end: toStandardTime(autoTimeEndSetter(time_start,days)),
                    m_time_start: this.splitMilitaryTime(time_start),
                    m_time_end: this.splitMilitaryTime(autoTimeEndSetter(time_start,days)),
                    mdn: mDn,
                    days: days,
                    rtype: rtype,
                    id_number: getLoggedUserDetails("idnumber"),
                    term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
                }
                //console.log("intenral_code",data);
                saveSubjectRequest(data)
                .then(response => {  
                    if(response.data) {          
                        this.setState({
                            success:  response.data.success
                        });
                        this.handleLoadSubjectRequest();
                    }   
                });
            }else{
                this.setState({
                    success: 2
                });
            }
        }
    }
    handleLoadSubjectRequest =()=>{
        var studentData = {
            department: getLoggedUserDetails("deptabbr"),
            course_code: getLoggedUserDetails("coursecode"),
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }
        getStudentRequest(studentData)
        .then(response => {  
            if(response.data) {          
                this.setState({
                    requestSubjects: response.data.request
                });
                var data = {
                    id_number: getLoggedUserDetails("idnumber"),
                    term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
                }
                getStudentRequestSubject(data)
                .then(response => {
                    if(response.data) {          
                        this.setState({
                            requestedSubjects: response.data.request,
                            filteredSubjects: response.data.filtered
                        });
                        //const{requestedSubjects} = this.state;
                    }
                });
            }
        }); 
    }
    handleOnChangeSelect = e => {
        const{internal_code} = this.state;
        this.setState({
            internal_code: e.value
        });
        //console.log("test e",e);
    }
    handleCheckBox = (event) => {
        const target = event.target;
        const{rtype,} = this.state;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        value = value? 1 : 0;
        this.setState({
          rtype: value
        });

        //console.log("rtype", rtype)
      }
    render() {
        const{showRequestForm, requestSubjects, subject_name,days,
        time_end,time_start,rtype,subjects,success, internal_code,requestedSubjects,filteredSubjects} = this.state;
        const values = {subject_name, days, time_end, time_start,rtype,internal_code};
        var count = 0;
        var sanitizedSubjectList = filteredSubjects ? filteredSubjects.map((subject, index) => {
            return {  value: subject.internal_code, label: subject.subject_name}
        }):[];

        var loadContent = getLoggedUserDetails("curryear")!=0?(
            <Fragment>
                <div className="column is-two-thirds">
                    <RequestedSubjects 
                        showRequestForm = {showRequestForm}
                        handleRequestButton = {this.handleRequestButton}
                        requestedSubjects = {requestedSubjects}
                        handleCancelSubjectButton = {this.handleCancelSubjectButton}
                    />
                    
                    <SearchRequestSubject
                        requestedSubjects = {requestedSubjects}
                        requestSubjects = {requestSubjects}
                        handleAddSubjectButton = {this.handleAddSubjectButton}
                    />
                </div>
                
                {showRequestForm ? 
                    <SubjectForm
                        inputChange = {this.inputChange}
                        values = {values}
                        handleButtonSubmitRequest = {this.handleButtonSubmitRequest}
                        sanitizedSubjectList = {sanitizedSubjectList}
                        handleCheckBox = {this.handleCheckBox}
                        success = {success}
                        handleOnChangeSelect = {this.handleOnChangeSelect}
                        handleCloseButton = {this.handleCloseButton}
                        internal_code = {internal_code}
                    /> : ""
                }
            </Fragment>
        ):"";
        return (
        <Fragment>
            <div className="box ml-1 mb-1">
                {  getLoggedUserDetails("curryear")==0 &&
                    <article className="message is-info mb-2">
                        <div className="message-body">
                            <h4 className="is-size-6">
                                You can only request subject once the Dean approves your registration. You can only request subject during enrollment period.   
                            </h4>                            
                        </div>
                    </article>
                }
                <article className="message is-danger mb-2">
                    <div className="message-body">
                        <h4 className="is-size-7">
                            <strong>Note:</strong> The number of student requested specific subject 
                            should reached the  minimum number needed (Major subject - 25 
                            students, Minor Subject - 15 students). If not reached,
                            the student will make a letter addressed to the dean.   
                        </h4>                            
                    </div>
                </article>
                <div className="columns">
                    {loadContent}
                </div> 
            </div>
        </Fragment>
        )
    };
}
export const RequestSubjectHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-edit"></i> Enrollment / Subject Request
    </div> 
);
