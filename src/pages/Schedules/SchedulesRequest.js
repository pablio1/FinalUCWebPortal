import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { getStudentRequestSubject,updateRequestStatus, getStudentRequest,getAllStudentsRequest } from '../../helpers/apiCalls';
import { getLoggedUserDetails } from '../../helpers/helper';
import ClassListModal from '../../components/elements/ClassListModal';


export class SchedulesRequest extends Component {
   
   state = {
       selectedTab: "pending", status: null, requestedSubjects: null,showModal:false, studentInfo: null,
       success: null
   }
    componentDidMount = () => {
        this.handleLoadRequestSubject();
        var setStatus = 0;
        if(getLoggedUserDetails("userType") == "EDP"){
            setStatus = 2;
        }else if(getLoggedUserDetails("userType") == "CHAIRPERSON"){
            setStatus = 1;
        }

        this.setState({
            status: setStatus
        });

        console.log("status",setStatus);
    }
    handleOnClickTab = (selectedTab, status) => {
        this.setState({
            selectedTab: selectedTab,
            status: status
        });
    }
    handleLoadRequestSubject = () =>{
        var data = {
            department: getLoggedUserDetails("courseabbr"),
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }
        console.log("abbr",data);
        getStudentRequest(data)
        .then(response => {
            if(response.data){
                this.setState({
                    requestedSubjects: response.data.request
                });
                console.log(response.data);
            }
        });
    }
    handleShowClassList = (internal_code) =>{
        const {showModal} = this.state;
        this.setState({
            showModal: !showModal
        });

        var data = {
            internal_code: internal_code,
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }
        getAllStudentsRequest(data)
        .then(response => {
            if(response.data){
                this.setState({
                    studentInfo: response.data.students
                })
                console.log("studentInfo", response.data);
            }
        });
        
    }
    handleCloseModal = () => {
        const {showModal} = this.state;
        this.setState({
            showModal: !showModal
        })
    }
    handleOnClickApprove = (internal_code) => {
        var data = {
            internal_code: internal_code,
            term: process.env.REACT_APP_CURRENT_SCHOOL_TERM
        }

        updateRequestStatus(data)
        .then(response => {
            if(response.data){
                this.setState({
                    success: response.data.success
                })
                this.handleLoadRequestSubject();
            }
        });

    }
    render() {
        const{selectedTab,requestedSubjects,status,showModal,studentInfo} = this.state;
        var loadRequestSubjects = requestedSubjects? requestedSubjects.filter(fil => fil.status == status).map((request, index)=>{
            return(
                <tr key={index}>
                    <td></td>
                    <td>{request.subject_name}</td>
                    <td className="has-text-centered">{request.rtype == 1? "Willing to pay":""}</td>
                    <td className="has-text-centered">{request.units}</td>
                    <td className="has-text-right">{request.days}</td>
                    <td className="has-text-right">{request.time_start} - {request.time_end} {request.mdn}</td>
                    <td className="has-text-centered">{request.room}</td>
                    <td className="has-text-centered">{request.size}</td>
                    <td></td>
                    <td className="has-text-centered">
                        {(getLoggedUserDetails("usertype") == "DEAN" && status == 0)&& <button className="button is-info is-small" onClick={()=> this.handleOnClickApprove(request.internal_code)}>Approve</button>}
                        {(getLoggedUserDetails("usertype") == "CHAIRPERSON" && status == 1)&& <button className="button is-info is-small" onClick={()=> this.handleOnClickApprove(request.internal_code)}>Approve</button>}
                        {(getLoggedUserDetails("usertype") == "EDP" && status == 2)&& <button className="button is-info is-small" onClick={()=> this.handleOnClickApprove(request.internal_code)}>Approve</button>}
                        <button className="button is-secondary is-small" onClick={() => this.handleShowClassList(request.internal_code)}>ClassList</button>
                    </td>
                </tr>
            )
        }):"";
        return (
            <div className="box ml-1">
                <div className={"modal " + (showModal == true?  "is-active " : "")}>
                    <div className="modal-background" onClick={this.handleCloseModal}></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                            <ClassListModal 
                                studentInfo = {studentInfo}
                            />
                        </section>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={this.handleCloseModal}></button>
                </div>
                <div className="buttons has-addons is-centered">
                    {
                        getLoggedUserDetails("usertype") == "DEAN" &&
                        <Fragment>
                            <button name="undeployed" className={"button "+(selectedTab=="pending"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("pending",0)}>
                                <span className="icon is-small">
                                    <i className="fas fa-envelope-open-text"></i>
                                </span>
                                <span>Requested Subjects</span>
                            </button>
                            <button name="undeployed" className={"button "+(selectedTab=="approved"?"is-info":"")+" is-selected"} 
                                onClick={() => this.handleOnClickTab("approved",1)}>
                                <span className="icon is-small">
                                    <i className="fas fa-envelope-open-text"></i>
                                </span>
                                <span>Approved Subjects</span>
                            </button>
                            <button name="deployed" className={"button "+(selectedTab=="deployed"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("deployed",3)}>
                                <span className="icon is-small">
                                    <i className="fas fa-check-circle"></i>
                                </span>
                                <span>Deployed Subjects</span>
                            </button> 
                        </Fragment>
                    }     
                    {
                        getLoggedUserDetails("usertype") == "CHAIRPERSON" &&
                        <Fragment>
                            <button name="undeployed" className={"button "+(selectedTab=="pending"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("pending",1)}>
                                <span className="icon is-small">
                                    <i className="fas fa-envelope-open-text"></i>
                                </span>
                                <span>Requested Subjects</span>
                            </button>
                            <button name="undeployed" className={"button "+(selectedTab=="approved"?"is-info":"")+" is-selected"} 
                                onClick={() => this.handleOnClickTab("approved",2)}>
                                <span className="icon is-small">
                                    <i className="fas fa-envelope-open-text"></i>
                                </span>
                                <span>Approved Subjects</span>
                            </button>
                            <button name="deployed" className={"button "+(selectedTab=="deployed"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("deployed",3)}>
                                <span className="icon is-small">
                                    <i className="fas fa-check-circle"></i>
                                </span>
                                <span>Deployed Subjects</span>
                            </button> 
                        </Fragment>
                    }    
                    {
                        getLoggedUserDetails("usertype") == "EDP" &&
                        <Fragment>
                            <button name="undeployed" className={"button "+(selectedTab=="pending"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("pending",2)}>
                                <span className="icon is-small">
                                    <i className="fas fa-envelope-open-text"></i>
                                </span>
                                <span>Requested Subjects</span>
                            </button>
                            <button name="deployed" className={"button "+(selectedTab=="deployed"?"is-info":"")+" is-selected"}
                                onClick={() => this.handleOnClickTab("deployed",3)}>
                                <span className="icon is-small">
                                    <i className="fas fa-check-circle"></i>
                                </span>
                                <span>Deployed Subjects</span>
                            </button> 
                        </Fragment>
                    }  
                                           
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>




                <div className="columns">
                        <div className="column">
                            <article className="message mb-0 is-small">
                                <div className="message-header">
                                    <p>Search Results</p>                                
                                    <button className="is-small p-0" aria-label="delete">
                                        <span className="icon is-small">
                                        <i className="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </div>
                                <div className="message-body p-0">
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th className="is-narrow">EDP Code</th>
                                                    <th>Subject</th>
                                                    <th className="has-text-centered">Request Type</th>
                                                    <th className="has-text-centered">Units</th>
                                                    <th className="has-text-right">Days</th>
                                                    <th className="has-text-right">Time</th>
                                                    <th className="has-text-centered">Room</th>
                                                    <th className="has-text-centered is-narrow">Size</th>
                                                    <th className="has-text-centered">Course</th>
                                                    <th className="has-text-centered">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loadRequestSubjects}                                                                                                                                     
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </article>                                  
                        </div>
                    </div>   
            </div>       
        );
    }
}

export const SchedulesRequestHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-calendar"></i> Schedules / Requests
    </div> 
);
