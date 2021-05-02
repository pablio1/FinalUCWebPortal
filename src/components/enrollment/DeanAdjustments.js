import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../enrollment/StudentsList';
import EnrollmentTabs from '../elements/EnrollmentTabs';
import SearchStudentPanel from '../elements/SearchStudentPanel';
import ApprovalPanel from '../elements/ApprovalPanel';
import StudentInfoWithSubjects from '../enrollment/StudentInfoWithSubjects';
import GradesTable from '../elements/GradesTable';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getLoggedUserDetails } from '../../helpers/helper';
import { 
    getStudentSavedSchedules, getStudentInfo, getOldStudentInfo, getStatusCount, getCourses, listStudentsWithAdjustments, 
    viewAdjustmentDetails, adjustmentApprove, sendNotification, getGradesEvaluation 
} from '../../helpers/apiCalls';

class DeanAdjustments extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 0, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0, totalRequests:0,
            studentInfo: null, studentList: null, studentRequestList: null, studentGrades: null, studentSubjects: null, 
            name: '', course: '', course_department: '', date: '', id_number: '', year_level: 0, classification: '', 
            allowed_units: 0, totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, disapproveMsg: '', courses: null, filterYearLevel: 0,
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: 'pending',
            showPreloader: false, adjustments: null, isLoadingStudentList: false
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
        this.setState({
            enrollStatus: value,
            selectedStudentID: '',
            selectedTab: tab
        }, () =>  this.getFilteredStudentList());        

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
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification 
        }, () => this.getStudentInfo());
    }
    handleApprovalButton = e => {
        const { cookies } = this.props;
        this.setState({
            approvalStatus: e,
            showPreloader: true 
        }, () => {            
            const approveStatuses = { approved: 1, disapproved: 0 };   
            adjustmentApprove(this.state.selectedStudentID, approveStatuses[this.state.approvalStatus], cookies.get("selterm"))
            .then(response => {            
                if(response.data.success) { 
                    if(e === "approved") {
                        alert("Approval Successful!");
                        this.setState({
                            selectedStudentID: "",
                            showPreloader: false
                        }, () => this.getFilteredStudentList());
                    }   
                    else {              
                        const data = {
                            stud_id: this.state.selectedStudentID,
                            from_sender: getLoggedUserDetails("fullname"),
                            message: this.state.disapproveMsg
                        }
                        sendNotification(data)
                        .then(resp => {
                            if(resp.data.success) {
                                alert("Student has been disapproved!");
                                this.setState({
                                    disapproveMsg: '',
                                    selectedStudentID: "",
                                    showPreloader: false
                                }, () => this.getFilteredStudentList());
                            }
                        }); 
                    }                   
                }
                else {
                    if(response.data.edp_code) {
                        if(response.data.edp_code.length > 0) {
                            alert("FULL SCHEDULES DETECTED! These EDP Codes are full " + response.data.edp_code.join(", ") + ". Approval failed."); 
                        }
                        else alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                    }
                    else alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                    this.togglePreloader(false);
                }
            }); 
        }); 
    
    }
    getFilteredStudentList = () => {
        const { cookies } = this.props; 
        const data = {           
            course_department: this.state.course_department, 
            course_code: this.state.course,
            year: this.state.filterYearLevel,
            name: this.state.name,
            id_number: this.state.id_number,
            status: this.state.enrollStatus,
            limit: this.state.limit,
            page: this.state.page,
            active_term: cookies.get("selterm")   
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            listStudentsWithAdjustments(data)
            .then(response => {
                this.setState({
                    studentList: response.data.students,
                    totalRecords: response.data.students.length,
                    isLoadingStudentList: false
                }, () => {
                    getStatusCount(this.state.course_department, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            totalPending: response.data.pending_adjustment,
                            totalApproved: response.data.approved_adjustment,
                            totalDisapproved: response.data.disapproved_adjustment                            
                        });
                    });
                });
            });
        })
        
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
                    viewAdjustmentDetails(this.state.selectedStudentID, cookies.get("selterm"))
                    .then(response => {
                        if(response.data) {             
                            this.setState({
                                adjustments: response.data
                            }); 
                        }                               
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
                    viewAdjustmentDetails(this.state.selectedStudentID, cookies.get("selterm"))
                    .then(response => {
                        if(response.data) {             
                            this.setState({
                                adjustments: response.data
                            }); 
                        }                                                     
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
            studentList, page, limit, name, course, date, id_number, stud_id, disapproveMsg, studentSubjects, filterYearLevel, adjustments,
            totalPending, totalApproved, totalDisapproved, totalRequests, course_department, courses, showPreloader, isLoadingStudentList,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedTab, studentGrades
        } = this.state;
        //const pagination = { page, limit, totalRecords };
        const editables = { allowed_units, year_level, classification, stud_id };
        const searcheables = { name, course, date, id_number, filterYearLevel };
        const approver = getLoggedUserDetails("usertype");
        //const fullScheds = studentSubjects ? studentSubjects.filter(schedule => schedule.size >= schedule.max_size) : "";
        //const disableApproveBtn = fullScheds && fullScheds.length > 0 ? true : false;
        const disableApproveBtn = false;
        let loadStudentInfo = (
            <Fragment>
            <StudentInfoWithSubjects
                studentInfo={studentInfo} 
                editables={editables} 
                viewer={approver}
                selectedTab={selectedTab}
                subjects={studentSubjects}
                adjustments={adjustments}
                handleOnchangeInput={this.handleOnchangeInput}  
            /> 
            <h4 className="has-text-weight-bold mt-2 mb-2 is-size-5">Grades Evaluation</h4>   
            </Fragment>              
        );
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={approver}
                sections={"disable"}
                sectionValue={""}
                currentTab={selectedTab}
                title={""}
                courseDepartment = {course_department}
                step="DeanAdjustments"
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={disapproveMsg}     
                disableApproveBtn={disableApproveBtn}                                   
            />
        );
        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={0}
                        approved={9}
                        disapproved={8}
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
                                    isLoading={isLoadingStudentList}
                                    step=""
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
                            {
                                studentGrades && studentInfo && selectedStudentID ? (    
                                    <GradesTable 
                                        studentGrades={studentGrades} 
                                        college={studentInfo.college}
                                    />
                                ) : ""
                            }
                           
                        </div>
                    </div> 
                </div>       
        );
    }
}

export default withCookies(DeanAdjustments)