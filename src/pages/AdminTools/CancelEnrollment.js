import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../../components/enrollment/StudentsList';
import SearchStudentPanel from '../../components/elements/SearchStudentPanel';
import StudentInformation from '../../components/enrollment/StudentInformation';
import StudentInfoWithGrades from '../../components/enrollment/StudentInfoViewGrades';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getStudentList, getStudentInfo, getOldStudentInfo, cancelEnrollment, getCourses, getGradesEvaluation } from '../../helpers/apiCalls';

class CancelEnrollment extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            page: 1, limit: 20, studentInfo: null, studentList: null, cancelBtnEnabled: false, isLoadingStudentList: false,
            name: '', course: '', course_department: '', date: '', id_number: '', session: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', courses: null
        };
    }
    componentDidMount = () => {
        const { cookies } = this.props;
         getCourses({ department_abbr: "", active_term: cookies.get("selterm") })
        .then(response => {
            this.setState({ 
                courses: response.data.colleges.length > 0 ? response.data.colleges : null
            });
        });
    }
    handleOnchangeInput = (key, value) => {
        this.setState({
            [key] : value    
        }, () => {
            if(key === "course") {
                if(value) this.getFilteredStudentList();  
                else {
                    this.setState({
                        studentList: null,
                        totalRecords: 0,
                        page: 1,
                        selectedStudentID: ''
                    });
                }
            }  
        });
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        const { cookies } = this.props;
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification, 
            selectedStudentCourseCode: courseCode,
            cancelBtnEnabled: true
        }, () => {
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
                        session: response.data.mdn
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
                if(response.data && response.data.count > 0) {
                    this.setState({
                        studentList: response.data.students,
                        totalRecords: response.data.count,
                        selectedStudentID: '',
                        cancelBtnEnabled: false,
                        isLoadingStudentList: false
                    });
                }
                else {
                    this.setState({
                        studentList: null,
                        totalRecords: 0,
                        selectedStudentID: '',
                        cancelBtnEnabled: false,
                        isLoadingStudentList: false
                    });
                }
            });
        })
    }
    handleOnChangePage = e => {
        this.setState({
            page: e,
            selectedStudentID: "",
            cancelBtnEnabled: false
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e,
            selectedStudentID: "",
            cancelBtnEnabled: false
        }, () => this.getFilteredStudentList());
    }
    handleCancelEnrollment = () => {
        const { cookies } = this.props;
        const confirmMsg = "Are you sure you want to cancel the student's Enrollment? He/she will loose all his/her accomplished steps. Click Ok to proceed otherwise Cancel.";
        if(window.confirm(confirmMsg)) {            
            cancelEnrollment(this.state.selectedStudentID, cookies.get("selterm"))
            .then(response => {
                if(response.data.success) {
                    this.setState({
                        selectedStudentID: ''
                    });
                    alert("Enrollment Cancelled.");
                }
                else alert("Enrollment Cancellation Failed! Please try again, if the issue persist please contact the EDP Office.")      
            });  
        }
    }
    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, stud_id, section, session, cancelBtnEnabled, selectedStudentClassification,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedTab, courses, studentGrades, isLoadingStudentList
        } = this.state;
        //console.log(totalRecords)
        const editables = { allowed_units, year_level, classification, stud_id, section, session };
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
            <Fragment>
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
                        <button className="button is-fullwidth is-danger" disabled={cancelBtnEnabled ? false : true}  
                                onClick={this.handleCancelEnrollment} >
                                Cancel Enrollment
                        </button>     
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-5 mt-0 mb-0 pt-0 pb-0">
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
            </Fragment>       
        );
    }
}

export default withCookies(CancelEnrollment)