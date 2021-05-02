import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../../components/enrollment/StudentsList';
import SearchStudentPanel from '../../components/elements/SearchStudentPanel';
import StudentInformation from '../../components/enrollment/StudentInformation';
import StudentInfoWithGrades from '../../components/enrollment/StudentInfoViewGrades';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getStudentList, getStudentInfo, getOldStudentInfo, getCourses, getGradesEvaluation, changePassword } from '../../helpers/apiCalls';

class ResetPassword extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            page: 1, limit: 20, studentInfo: null, studentList: null, resetBtnEnabled: false, isChecked: false, isLoadingStudentList: false,
            name: '', course: '', course_department: '', date: '', id_number: '', session: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', courses: null, selectedOldStudentID: ''
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
    handleOnchangeInputID = e => {
        this.setState({
            [e.target.name] : e.target.value    
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
            resetBtnEnabled: true,
            isChecked: false,
            selectedOldStudentID: ''
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
                        resetBtnEnabled: false,
                        isLoadingStudentList: false
                    });
                }
                else {
                    this.setState({
                        studentList: null,
                        totalRecords: 0,
                        selectedStudentID: '',
                        resetBtnEnabled: false,
                        isLoadingStudentList: false
                    });
                }
            });
        })
    }
    handleOnChangeCheckBox = () => {
        const { isChecked, selectedStudentID} = this.state;
        this.setState({
            isChecked: !isChecked,
            selectedStudentID: !isChecked ? "" : selectedStudentID,
            resetBtnEnabled: isChecked && !selectedStudentID ? false : true
        });
    }
    handleOnChangePage = e => {
        this.setState({
            page: e,
            selectedStudentID: "",
            resetBtnEnabled: false
        }, () => this.getFilteredStudentList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            limit: e,
            selectedStudentID: "",
            resetBtnEnabled: false
        }, () => this.getFilteredStudentList());
    }
    handleResetPassword = () => {
        const confirmMsg = "Are you sure you want to reset the student's password? Click Ok to proceed otherwise Cancel.";
        if(window.confirm(confirmMsg)) {
            let proceed = false;  
            let resetIDNumber = this.state.selectedStudentID; 
            if(this.state.isChecked) {
                if(this.state.selectedOldStudentID === "") {
                    alert("ID number is required. Please enter an ID number.")
                }
                else {
                    proceed = true;
                    resetIDNumber = this.state.selectedOldStudentID; 
                }
            }
            else proceed = true;   
            if(proceed) {   
                changePassword(resetIDNumber, "Password" + resetIDNumber)
                .then(response => {
                    if(response.data.success) {
                        this.setState({
                            selectedStudentID: '',
                            selectedOldStudentID: '',
                            resetBtnEnabled: false,
                            isChecked: false
                        });
                        alert("Password reset to default -> PasswordXXXXXXXX (XXXXXXXX = Student's ID number). Please advise the student to change their password once they login.");
                    }
                    else alert("Student with ID " + resetIDNumber + " not found. Please enter a valid and existing ID number.")      
                });  
            }
        }
    }
    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, stud_id, section, session, resetBtnEnabled, selectedStudentClassification, selectedOldStudentID,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedTab, courses, studentGrades, isChecked, isLoadingStudentList
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
                        <div className="columns">
                            <div className="column is-narrow">
                                <h5 className="has-text-weight-bold is-size-7 mb-0">Never Logged</h5>  
                                <div className="field mt-0 mb-2 pl-3">
                                    <div className="control pr-0 mr-0">
                                        <input id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" className="switch is-rounded is-info is-small" checked={isChecked} 
                                                onChange={this.handleOnChangeCheckBox} />
                                        <label htmlFor="switchRoundedInfo"></label>
                                    </div>
                                </div>   
                            </div>
                            {
                               isChecked ? ( 
                                    <div className="column is-narrow">
                                        <div className="field is-small pt-2">
                                            <div className="control">
                                                <input className="input is-small" name="selectedOldStudentID" type="text" placeholder="Enter ID Number" 
                                                    value={selectedOldStudentID} onChange={this.handleOnchangeInputID}/>
                                            </div>
                                        </div>
                                    </div>
                               ) : ""
                            }
                            <div className="column">
                                <button className="button is-fullwidth is-primary" disabled={resetBtnEnabled ? false : true}  
                                    onClick={this.handleResetPassword} >
                                    Reset Password
                                </button>
                            </div>
                        </div>                             
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

export default withCookies(ResetPassword)