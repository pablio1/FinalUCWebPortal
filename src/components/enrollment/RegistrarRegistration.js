import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import SpinnerGif from '../../assets/sysimg/spinner.gif';
import StudentsList from '../../components/enrollment/StudentsList';
import EnrollmentTabs from '../../components/elements/EnrollmentTabs';
import SearchStudentPanel from '../../components/elements/SearchStudentPanel';
import ApprovalPanel from '../../components/elements/ApprovalPanel';
import StudentInformation from '../../components/enrollment/StudentInformation';
import StudentInfoWithGrades from '../../components/enrollment/StudentInfoWithGrades';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getStudentList, updateStudentStatus, getCourses, getStudentInfo, getOldStudentInfo, getStatusCount, getGradesEvaluation } from '../../helpers/apiCalls';

class RegistrarRegistration extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 0, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, paginatedStudentList: [],
            name: '', course: '', date: '', id_number: '', course_department: '', session: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, disapproveMsg: '', courses: null, selectedStudentCourseCode: '',
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: "pending", isLoadingStudentList: false
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        getCourses({ department_abbr: "", active_term: cookies.get("selterm") })
        .then(response => {
            this.setState({ 
                courses: response.data.colleges.length > 0 ? response.data.colleges : null
            }, () => this.getFilteredStudentList());
        });
    }
    handleOnClickTab = (tab, value) => {
        this.setState({
            enrollStatus: value,
            selectedStudentID: '',
            selectedTab: tab
        }, () =>  this.getFilteredStudentList() );        
    }
    handleOnchangeInput = (key, value) => {
        this.setState({
            [key] : value    
        }, () => {
            if(key === "course" || key === "session") this.getFilteredStudentList();  
        });
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification 
        }, () => this.getStudentInfoData() );
    }
    handleApprovalButton = e => {
        const { cookies } = this.props;
        if(e === "approved") {
            if(this.state.allowed_units === 0) alert("Please enter the max allowed number of units.");
            else {     
                let yearLevel = this.state.year_level;  
                if(this.state.course_department === "SHS") {
                    if(yearLevel.length > 2) yearLevel = yearLevel.substring(0, 2);
                }
                if(["N1","K1"].includes(this.state.year_level)) yearLevel = 1;      
                const data = {
                    status: 1,
                    name_of_approver: getLoggedUserDetails("fullname"), 
                    section: this.state.section ? this.state.section : "",
                    allowed_units: this.state.allowed_units,
                    course_code: this.state.selectedStudentCourseCode,
                    mdn: this.state.session,
                    classification: this.state.classification,
                    year_level: yearLevel,
                    existing_id_number: this.state.selectedStudentID !== this.state.stud_id ? this.state.stud_id : "",
                    active_term: cookies.get("selterm")   
                };
                updateStudentStatus(this.state.selectedStudentID, data)
                .then(response => {            
                    if(response.data.success) {
                        alert("Student Successfully Approved!");
                        this.setState({
                            selectedStudentID: "",
                            disapproveMsg: "",
                            year_level: '',
                        }, () => this.getFilteredStudentList() ); 
                    }
                })
            }
        }
        else if(e === "disapproved") {
            const data = {
                status: 2,
                name_of_approver: getLoggedUserDetails("fullname"),
                message: this.state.disapproveMsg,
                active_term: cookies.get("selterm")      
            };
            updateStudentStatus(this.state.selectedStudentID, data)
            .then(response => {            
                if(response.data.success) {
                    alert("Student's Application has been Disapproved!");
                    this.setState({
                        selectedStudentID: "",
                        disapproveMsg: "",
                        year_level: ''
                    }, () => this.getFilteredStudentList() ); 
                }
            })
        }
    }
    onChangePagination = pageOfStudents => {
        this.setState({ paginatedStudentList: pageOfStudents });
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
            //year_level: this.state.year_level,
            //classification: this.state.searchFilterClassification,
            active_term: cookies.get("selterm")
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getStudentList(data)
            .then(response => {
                this.setState({
                    studentList: response.data.count > 0 ? response.data.students : null,
                    totalRecords: response.data.count,
                    selectedStudentID: '',
                    isLoadingStudentList: false
                }, () => {
                    getStatusCount(this.state.course_department, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            totalPending: response.data.registered,
                            totalApproved: response.data.approved_registration_registrar,
                            totalDisapproved: response.data.disapproved_registration_registrar
                        });
                    });
                });
            });
        })
    }
    getStudentInfoData = () => { 
        const { cookies } = this.props;
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification)) {        
            getOldStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {
                let yearLevel = response.data.year_level;
                if(["N1","K1"].includes(response.data.course_code)) yearLevel = response.data.course_code;
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: yearLevel, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn,
                    selectedStudentCourseCode: response.data.course_code
                }, () => {
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
                let yearLevel = response.data.year_level;
                if(["N1","K1"].includes(response.data.course_code)) yearLevel = response.data.course_code;            
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn,
                    selectedStudentCourseCode: response.data.course_code
                });
            }); 
        }
    }
    handleOnChangePage = e => {
        this.setState({
            page: e,
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e,
        }, () => this.getFilteredStudentList());
    }
    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, stud_id, selectedTab, selectedStudentClassification,
            totalPending, totalApproved, totalDisapproved, courses, disapproveMsg, session, studentGrades,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, isLoadingStudentList
        } = this.state;
        const editables = { allowed_units, year_level, classification, stud_id, session };
        const searcheables = { name, course, date, id_number };
        const approver = getLoggedUserDetails("usertype");
        let loadStudentInfo = "";
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(selectedStudentClassification)) {
            loadStudentInfo = ( 
                <StudentInfoWithGrades 
                    studentInfo={studentInfo} 
                    studentGrades={studentGrades}
                    editables={editables} 
                    viewer={approver}
                    selectedTab={selectedTab}
                    handleOnchangeInput={this.handleOnchangeInput}  
                />
            );
        } else {
            loadStudentInfo = (
                <StudentInformation 
                    studentInfo={studentInfo} 
                    editables={editables} 
                    viewer={approver}
                    selectedTab={selectedTab}
                    handleOnchangeInput={this.handleOnchangeInput} 
                />
            );
        }

        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={0}
                        approved={1}
                        disapproved={2}
                        totalPending={totalPending}
                        totalApproved={totalApproved} 
                        totalDisapproved={totalDisapproved}
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
                            />   
                        </div>
                        <div className="column mt-0 mb-0 pt-0 pb-0">
                            {
                                selectedStudentID ? (
                                    <ApprovalPanel
                                        studentID={selectedStudentID}
                                        approver={approver}
                                        sections={"disable"}
                                        currentTab={selectedTab}
                                        title=""
                                        sectionValue={""}
                                        courseDepartment = {""}
                                        step="Registrar"
                                        disapproveMsg={disapproveMsg}
                                        handleApprovalButton={this.handleApprovalButton}
                                        handleOnchangeInput={this.handleOnchangeInput} 
                                        disableApproveBtn={false}
                                    />
                                ) : ""
                            }
                        </div>
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
                            
                        </div>
                    </div> 
                </div>       
        );
    }
}

export default withCookies(RegistrarRegistration)