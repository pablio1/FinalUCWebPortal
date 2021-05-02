import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import SpinnerGif from '../../assets/sysimg/spinner.gif';
import StudentsList from '../../components/enrollment/StudentsList';
import SearchStudentPanelFull from '../../components/elements/SearchStudentPanelFull';
import StudyLoad from '../../components/elements/StudyLoad';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getStudentList, getStudentInfo, getCourses, getColleges, getStudentSavedSchedules, getOldStudentInfo, getStudentStatus } from '../../helpers/apiCalls';

class StudyLoadStaff extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            page: 1, limit: 20, studentInfo: null, studentList: null, courses: null, colleges: null, userType: '',
            studentSubjects: null, searchName: '', searchFilterCourse: '', searchFilterCollege: '', searchDate: '', 
            searchFilterYear: 0, searchFilterClassification: '', totalRecords: 0, section: '', searchIDNumber: '',
            selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', selectedTab: 'pending',
            studentEnrollmentStatus: [], isLoadingStudentList: false
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            searchFilterCollege: ["ACCOUNTING", "CASHIER", "LINKAGE", "EDP", "ADMIN"].includes(getLoggedUserDetails("courseabbr")) ? "" : getLoggedUserDetails("courseabbr"),    
            userType: getLoggedUserDetails("usertype")
        }, () => { 
            if(["DEAN", "CHAIRPERSON", "COOR"].includes(this.state.userType)) {
                let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }
                if(["ACAD"].includes(this.state.userType) && this.state.searchFilterCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
                getCourses(data)
                .then(response => {
                    this.setState({ 
                        courses: response.data.colleges.length > 0 ? response.data.colleges : null
                    });
                });
            }
            else {
                getColleges(cookies.get("selterm"))
                .then(response => {
                    this.setState({ 
                        colleges: response.data.departments 
                    });      
                });
            }
            
        });
    }
    handleOnchangeInput = (key, value) => {
        const { cookies } = this.props;
        if(key === "searchFilterCollege") {
            this.setState({
                searchFilterCollege: value,
                searchFilterCourse: "",
                courses: null,
            }, () => {
                this.getFilteredStudentList();        
                if(value) {
                    let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }
                    if(["ACAD"].includes(this.state.userType) && this.state.searchFilterCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
                    getCourses(data)
                    .then(response => {
                        this.setState({ 
                            courses: response.data.colleges.length > 0 ? response.data.colleges : null
                        });
                    });
                }
                else {
                    this.setState({ 
                        courses: null
                    });
                }
            });
        }
        if(key === "searchFilterCourse") {
            this.setState({
                searchFilterCourse: value,
                page: 1
            }, () => this.getFilteredStudentList());
        }
        else if(key === "searchFilterClassification") {
            this.setState({
                searchFilterClassification: value,
                page: 1
            }, () => this.getFilteredStudentList());
        }
        else if(key === "searchFilterYear") {
            this.setState({
                searchFilterYear: value,
                page: 1
            }, () => this.getFilteredStudentList());
        }
        else {
            this.setState({
                [key]: value
            });
        }
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        const { cookies } = this.props;
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification, 
            selectedStudentCourseCode: courseCode
        }, () => {
            getStudentStatus(this.state.selectedStudentID, cookies.get("selterm"))
            .then(response => {
                this.setState({
                    studentEnrollmentStatus: response.data.status, 
                });
            });
            if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification)) {        
                getOldStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
                .then(response => {
                    this.setState({
                        studentInfo: response.data,
                        selectedStudentClassification: response.data.classification,
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
            else {            
                getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
                .then(response => {            
                    this.setState({
                        studentInfo: response.data,
                        selectedStudentClassification: response.data.classification,
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
        });
    }
    
    getFilteredStudentList = () => {
        const { cookies } = this.props; 
        const data = {
            status: 99,  
            page: this.state.page,
            limit: this.state.limit,
            name: this.state.searchName,
            course: this.state.searchFilterCourse,
            course_department: this.state.searchFilterCollege,
            date: this.state.searchDate,
            id_number: this.state.searchIDNumber,
            year_level: this.state.searchFilterYear,
            classification: this.state.searchFilterClassification,
            active_term: cookies.get("selterm")
        };
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getStudentList(data)
            .then(response => {
                this.setState({
                    studentList: response.data.students,
                    totalRecords: response.data.count,
                    selectedStudentID: '',
                    isLoadingStudentList: false
                });
            });
        })
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
    render() {
        const { cookies } = this.props; 
        const { 
            studentList, page, limit, searchName, searchFilterCourse, searchDate, searchIDNumber, searchFilterCollege,
            courses, colleges, studentSubjects, studentEnrollmentStatus, isLoadingStudentList,
            studentInfo, searchFilterYear, searchFilterClassification, totalRecords, selectedStudentID, selectedTab
        } = this.state;
        const searcheables = { searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate };
        const approver = getLoggedUserDetails("usertype");        
        const loadStudentInfo = (
                <StudyLoad
                    subjects={studentSubjects}
                    studentInfo={studentInfo}
                    enrollmentStatus={studentEnrollmentStatus}
                    schoolTerm={cookies.get("selterm")}
                />
            );
        

        return (
                <div className="box ml-1">
                    <div className="columns">
                        <div className="column mt-1 mb-1">
                            <SearchStudentPanelFull
                                searcheables={searcheables}
                                searcher={approver}
                                colleges={colleges}
                                courses={courses}
                                educLevel={searchFilterCollege === "SHS" ? "shs" : "col"}
                                module="studyLoad"
                                handleOnSearchEvent={this.handleOnSearchEvent}
                                handleOnchangeInput={this.handleOnchangeInput}
                            />  
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

export default withCookies(StudyLoadStaff)