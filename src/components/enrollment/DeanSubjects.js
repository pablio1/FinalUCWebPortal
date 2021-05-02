import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import store from 'store2';

import StudentsList from '../enrollment/StudentsList';
import EnrollmentTabs from '../elements/EnrollmentTabs';
import SearchStudentPanel from '../elements/SearchStudentPanel';
import ApprovalPanel from '../elements/ApprovalPanel';
import StudentInfoWithSubjects from '../enrollment/StudentInfoWithSubjects';
import GradesTable from '../../components/elements/GradesTable';
import SpinnerGif from '../../assets/sysimg/spinner.gif';
import { getLoggedUserDetails } from '../../helpers/helper';
import { updateStudentStatus, getStudentSavedSchedules, getStudentInfo, getOldStudentInfo, getStatusCount, getStudentList, getGradesEvaluation, getCourses } from '../../helpers/apiCalls';

class DeanSubjects extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 5, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0, totalRequests:0,
            studentInfo: null, studentList: null, studentRequestList: null, studentGrades: null, studentSubjects: null, paginatedStudentList: [],
            name: '', course: '', course_department: '', date: '', id_number: '', year_level: 0, classification: '', 
            allowed_units: 0, totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, disapproveMsg: '', courses: null, filterYearLevel: 0,
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: 'pending',
            showPreloader: false, isLoadingStudentList: false
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            course_department: getLoggedUserDetails("courseabbr")    
        }, () => {
            getCourses({ department_abbr: this.state.course_department, active_term: cookies.get("selterm") })
            .then(response => {
                this.setState({ 
                    courses: response.data.colleges.length > 0 ? response.data.colleges : null
                }, () => this.getFilteredStudentList());
            });
        }); 
    }
    handleOnClickTab = (tab, value) => {
        if(tab === "requests") {
            this.setState({
                selectedStudentID: '',
                selectedTab: tab
            }, () =>  this.getRequestsStudents() );    
        }
        else {
            this.setState({
                enrollStatus: value,
                selectedStudentID: '',
                selectedTab: tab
            }, () =>  this.getFilteredStudentList());        
        }
    }
    handleOnchangeInput = (key, value) => {
        this.setState({
            [key] : value    
        }, () => {
            if(key === "course" || key === "filterYearLevel") this.getFilteredStudentList(); 
        });
    }
    handleOnSearchEvent = () => {
        if(this.state.selectedTab === "requests") this.getRequestsStudents();
        else this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        //console.log("userclick",this.state.enrollStatus);
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification 
        }, () => this.getStudentInfo());
    }
    handleApprovalButton = e => {
        const { cookies } = this.props;
        if(this.state.selectedTab === "requests") {
            if(e === "approved") {
                this.approveStudentRequest("approve");
            }
            else if (e === "disapprove") {
                this.approveStudentRequest("disapprove");
            }        
        }
        else {
            this.setState({
                approvalStatus: e,
                showPreloader: true 
            }, () => {
                const approveStatuses = { pending: 5, approved: 6, disapproved: 7 };  
                const data = {
                    classification: this.state.classification,
                    status: approveStatuses[this.state.approvalStatus],
                    name_of_approver: getLoggedUserDetails("fullname"),
                    message: this.state.disapproveMsg,
                    active_term: cookies.get("selterm") 
                }  
                updateStudentStatus(this.state.studentInfo.stud_id, data)
                .then(response => {            
                    if(response.data.success) {
                        if(e === "approved")  alert("Approval Successful!");
                        else alert("Student has been disapproved!");
                        this.setState({
                            selectedStudentID: "",
                            showPreloader: false
                        }, () => this.getFilteredStudentList() ); 
                    }
                    else {
                        if(response.data.edp_code) {                            
                            alert("These EDP Codes has just been filled up. Please advise student to select another open schedule. Full EDP Codes: " + response.data.edp_code.join())
                            this.getStudentInfo();
                        }
                        else  alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                        this.togglePreloader(false);
                    }
                }); 
            }); 
        }     
    }
    getFilteredStudentList = () => { 
        const { cookies } = this.props;
        const data = {
            status: this.state.enrollStatus,  
            page: this.state.page,
            limit: this.state.limit,
            name: this.state.name,
            course: this.state.course,
            course_department: this.state.course_department,
            date: this.state.date,
            id_number: this.state.id_number,
            year_level: this.state.filterYearLevel,
            classification: "",
            active_term: cookies.get("selterm")
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getStudentList(data)
            .then(response => {
                this.setState({
                    studentList: response.data.students,
                    totalRecords: response.data.students.length,
                    isLoadingStudentList: false
                }, () => {
                    getStatusCount(this.state.course_department, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            totalPending: response.data.selecting_subjects,
                            totalApproved: response.data.approved_by_dean,
                            totalDisapproved: response.data.disapproved_by_dean,
                            totalRequests: response.data.request
                        });
                    });
                });
            });
        }) 
    }
    getRequestsStudents = () => {
        const { cookies } = this.props;
        const { name, course, date, id_number } = this.state;    
        const data = { course_department: this.state.course_department, active_term: cookies.get("selterm") }
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_GET_ENROLLMENT_STUDENT_REQUESTS, data, {headers})
        .then(response => {
            const studentList = response.data.students;
            const filteredStudentList = studentList.filter(student => {  
                const fullname =  student.firstname + " " + student.mi + " " + student.lastname;           
                return (
                    fullname.indexOf(name.toUpperCase()) >= 0 ||
                    student.course_code.indexOf(course.toUpperCase()) >= 0 || 
                    student.date.indexOf(date) >= 0 ||
                    student.id_number.indexOf(id_number) >= 0
                )
            });
            this.setState({
                studentList: filteredStudentList,
                //totalRequests: response.data.count,
            });
        }).catch(error => {
            console.log(error);
        });
    }
    getStudentInfo = () => { 
        const { cookies } = this.props;
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification)) {  
            getOldStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn
                }, () => {
                    getStudentSavedSchedules(this.state.studentInfo.stud_id, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            studentSubjects: response.data.schedules,
                        });
                    });
                    getGradesEvaluation(this.state.selectedStudentID, this.state.studentInfo.dept)
                    .then(response => {
                        this.setState({
                            studentGrades: response.data && response.data.studentGrades.length > 0 ? response.data.studentGrades : null
                        });                             
                    });
                });
            }); 
        }
        else {
            getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    section: response.data.assigned_section,
                }, () => {
                    getStudentSavedSchedules(this.state.studentInfo.stud_id, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            studentSubjects: response.data.schedules,
                        });
                    });
                });
            });
        }
    }
    approveStudentRequest = (type) => {
        const { cookies } = this.props;
        const {studentInfo} = this.state;
        const approveValue = type === "approve" ? 2 : 3;  // 2 - approved, 3 - disapproved
        const data = {
            id_number: this.state.selectedStudentID,
            approved_deblock: studentInfo.request_deblock > 0 ? approveValue : 0,
            approved_overload: studentInfo.request_overload > 0 ? approveValue : 0,
            max_units: this.state.allowed_units,
            active_term: cookies.get("selterm")
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_STUDENT_APPROVE_REQUEST, data, {headers})
        .then(response => {            
            if(response.data.success) {                
                this.setState({
                    selectedStudentID: "",
                    approvalStatus: "pending",
                    section: studentInfo.request_deblock > 0 ? "" : this.state.section
                }, () => {
                    updateStudentStatus(studentInfo.stud_id, { status: 3, allowed_units: studentInfo.allowed_units, active_term: cookies.get("selterm") })
                    .then(response => {            
                        if(response.data.success) {
                            alert("Student Request Successfully Approved!");
                            this.setState({
                                selectedStudentID: ""
                            }, () => this.getFilteredStudentList() ); 
                        }
                    });                
                }); 
            }
            else alert("Request Approval Failed. Please try again, if issues persist please contact EDP Office.");
        }).catch(error => {
            console.log(error);
        });
    }
    handleOnChangePage = e => {
        this.setState({
            page: e
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e
        }, () => this.getFilteredStudentList());
    }
    togglePreloader = e => {
        this.setState({
            showPreloader: e
        })
    }
    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, stud_id, disapproveMsg, studentSubjects, filterYearLevel,
            totalPending, totalApproved, totalDisapproved, totalRequests, course_department, studentGrades, courses, showPreloader, isLoadingStudentList,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedTab, selectedStudentClassification
        } = this.state;
        //const pagination = { page, limit, totalRecords };
        const editables = { allowed_units, year_level, classification, stud_id };
        const searcheables = { name, course, date, id_number, filterYearLevel };
        const approver = getLoggedUserDetails("usertype");
        let approvalPanelTitle = "";
        if(selectedTab === "requests" && studentInfo) {
            if(studentInfo.request_deblock > 0) approvalPanelTitle = "De-block Request"; 
            else if(studentInfo.request_overload > 0) approvalPanelTitle = "Overload Request";
        }
        const fullScheds = studentSubjects ? studentSubjects.filter(schedule => schedule.size >= schedule.max_size) : "";
        const disableApproveBtn = fullScheds && fullScheds.length > 0 ? true : false;
        let loadStudentInfo = (
            <StudentInfoWithSubjects
                studentInfo={studentInfo} 
                editables={editables} 
                viewer={approver}
                selectedTab={selectedTab}
                subjects={studentSubjects}
                adjustments={null}
                handleOnchangeInput={this.handleOnchangeInput}  
            />                
        );
        let loadStudentGrades = "";
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(selectedStudentClassification)) {
            loadStudentGrades = studentGrades ? (
                <div>
                    <h4 className="is-size-5 has-text-weight-bold mt-3 mb-3">Previous Grade Records</h4>
                    <GradesTable 
                        studentGrades={studentGrades} 
                        college={studentInfo ? studentInfo.college : ""}
                    />
                </div>
            ) : (
                <div className="columns is-vcentered">
                    <div className="column is-center mt-2">
                        <h4 className="is-size-5 has-text-weight-bold">No Records Found. Please check using CIS.</h4>
                    </div>
                </div>
            );
        }
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={approver}
                sections={"disable"}
                sectionValue={""}
                currentTab={selectedTab}
                title={approvalPanelTitle}
                courseDepartment = {course_department}
                step="DeanSubjects"
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={disapproveMsg}     
                disableApproveBtn={disableApproveBtn}                                   
            />
        );
        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={5}
                        approved={6}
                        disapproved={7}
                        requests={"requests"}
                        totalPending={totalPending}
                        totalApproved={totalApproved} 
                        totalDisapproved={totalDisapproved}
                        totalRequests={totalRequests}
                        handleOnClickTab={this.handleOnClickTab}
                        viewer={approver}
                    />
                    <div className="">
                        <div className="divider is-size-6 mt-0 pt-0"></div>
                    </div>
                    <div className="columns">
                        <div className="column is-5 mt-0 mb-0 pt-0 pb-0">
                            <SearchStudentPanel
                                searcheables={searcheables}
                                handleOnchangeInput={this.handleOnchangeInput}
                                handleOnSearchEvent={this.handleOnSearchEvent}
                                searcher={approver}
                                courses={courses ? courses : null}
                                deptabbr={course_department ? course_department : ""}
                            />   
                        </div>
                        {
                            showPreloader ? (
                                <div className="column is-center">
                                    <figure className="image is-64x64">
                                        <img src={SpinnerGif} alt="" />
                                    </figure>
                                </div>
                            ) : (
                                <div className="column mt-0 mb-0 pt-0 pb-0">
                                    {studentInfo && selectedStudentID ? loadApprovalPanel : ""}                            
                                </div>
                            )
                        }
                    </div>
                    <div className="columns">
                        <div className="column is-5 mt-0 mb-0 pt-0 pb-0">
                            { 
                                isLoadingStudentList ? (
                                    <div className="columns is-vcentered">
                                        <div className="column is-center">
                                            <figure className="image is-128x128">
                                                <img src={SpinnerGif} alt="" />
                                            </figure>
                                        </div>
                                    </div> 
                                ) : ""
                            }
                            {studentList ? (
                                <StudentsList
                                    studentList={studentList}
                                    selectedStudentID={selectedStudentID}
                                    totalRowsCount={totalRecords}
                                    rowsPerPage={limit}
                                    pageNum={page}
                                    step=""
                                    isLoading={isLoadingStudentList}
                                    handleOnchangeInput={this.handleOnchangeInput}
                                    handleClickUser={this.handleClickUser}
                                    handleOnChangePage={this.handleOnChangePage}
                                    handleChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />  
                                ) : ""
                            }
                        </div>
                        <div className="column mt-0 mb-0 pt-0 pb-0">

                            {studentInfo && selectedStudentID ? loadStudentInfo : ""}                            
                            {studentInfo && selectedStudentID ? loadStudentGrades : ""}
                            
                        </div>
                    </div> 
                </div>       
        );
    }
}

export default withCookies(DeanSubjects)