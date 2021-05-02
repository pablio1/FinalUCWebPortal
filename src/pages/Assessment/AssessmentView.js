import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../../components/enrollment/StudentsList';
import SearchStudentPanelFull from '../../components/elements/SearchStudentPanelFull';
import AssessmentTable from './AssessmentTable';

import { getLoggedUserDetails, sortArraySpecificOrder } from '../../helpers/helper';
import { getStudentList, getStudentInfo, getCourses, getColleges, getOldStudentInfo, getStudentAssessment } from '../../helpers/apiCalls';

class AssessmentView extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        page: 1, limit: 20, totalRecords: 0, studentList: null, courses: null, colleges: null, userType: '',
        studentInfo: null, searchName: '', searchFilterCourse: '', searchFilterCollege: '', searchDate: '', 
        searchFilterYear: 0, searchFilterClassification: '', searchsection: '', searchIDNumber: '',
        selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', isLoadingStudentList: false,
        studentAssessmentAll: null, currentTerm: '', selectAssessExam: '', selectAssessExamText: '', studentAssessment: null, educLevel: '',

    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            searchFilterCollege: ["ACCOUNTING", "CASHIER", "LINKAGE", "EDP", "ADMIN"].includes(getLoggedUserDetails("courseabbr")) ? "" : getLoggedUserDetails("courseabbr"),    
            userType: getLoggedUserDetails("usertype"),
            currentTerm: process.env.REACT_APP_CURRENT_SCHOOL_TERM
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
                if(value) {
                    let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }
                    if(["ACAD"].includes(this.state.userType) && this.state.searchFilterCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
                    getCourses(data)
                    .then(response => {
                        this.setState({ 
                            courses: response.data.colleges.length > 0 ? response.data.colleges : null
                        });
                    });
                    this.getFilteredStudentList(); 
                }
                else {
                    this.setState({ 
                        courses: null,
                        studentList: null,
                        selectedStudentID: ''
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
    handleOnSelectExam = e => {
        this.setState({
            selectAssessExam : e.target.value,
            selectAssessExamText: e.target.options[e.target.selectedIndex].text,
        }, () => {
            if(this.state.selectAssessExam) {
                const { studentAssessmentAll, selectAssessExam } = this.state;
                const filteredAssessment = studentAssessmentAll.filter(assess => assess.examName === selectAssessExam)[0];
                this.setState({
                    studentAssessment: filteredAssessment
                })
            }
            else {
                this.setState({
                    studentAssessment: null,
                    selectAssessExamText: ''
                })
            }
        })
    }
    handleClickUser = (idNum, classification, courseCode) => {
        const { cookies } = this.props;
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification, 
            selectedStudentCourseCode: courseCode,
            studentAssessment: null,
            studentAssessmentAll: null,
            selectAssessExam: '', 
            selectAssessExamText: ''
        }, () => {           
            if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(this.state.selectedStudentClassification)) {        
                getOldStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
                .then(response => {
                    this.setState({
                        studentInfo: response.data,
                        selectedStudentClassification: response.data.classification,
                        educLevel: response.data.dept
                    }, () => this.getAssessment());
                });   
            }
            else {            
                getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
                .then(response => {            
                    this.setState({
                        studentInfo: response.data,
                        selectedStudentClassification: response.data.classification,
                        educLevel: response.data.dept
                    }, () => this.getAssessment());
                }); 
            }
        });
    }
    getAssessment = () => { 
        const { cookies } = this.props;       
        getStudentAssessment(this.state.educLevel,this.state.selectedStudentID,"", cookies.get("selterm"))
        .then(response => {
            if(response.data.exams && response.data.exams.length > 0) {
                this.setState({
                    studentAssessmentAll: response.data.exams
                })
            }
            else {
                this.setState({
                    studentAssessmentAll: null
                })
            }                 
        });
    }
    getFilteredStudentList = () => { 
        const { cookies } = this.props;
        const data = {
            status: 10,  
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
        const { 
            studentList, page, limit, searchName, searchFilterCourse, searchDate, searchIDNumber, searchFilterCollege,
            courses, colleges, studentAssessmentAll, currentTerm, selectAssessExam, studentAssessment, isLoadingStudentList,
            studentInfo, searchFilterYear, searchFilterClassification, totalRecords, selectedStudentID
        } = this.state;
        const searcheables = { searchFilterCollege, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate };
        const searcher = getLoggedUserDetails("usertype");   
        let educLevelSearch = "col";
        if(searchFilterCollege && ["SHS","JHS","BED"].includes(searchFilterCollege)) educLevelSearch = searchFilterCollege.toLowerCase();
        const examOrder = ["P","M","S","F"];
        const examsCL = { P:"Prelim", M:"Midterm", S:"Semi-Final", F:"Final"};
        const examsSH = { P:"First Mastery Test", M:"First Quarter Test", S:"Second Mastery Test", F:"Second Quarter Test", P1:"Third Mastery Test", M1:"Third Quarter Test", S1:"Semi-Final Exam", F1:"Final Exam"};
        const examMonths = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];
        const availableExams = studentAssessmentAll ? [...new Set(studentAssessmentAll.map(exam => exam.examName))] : null;        
        let loadExamOptions = "";
        let selectAssessExamText = "";
        if(studentInfo) {
            if(studentInfo.dept.toLowerCase() === "cl") { 
                selectAssessExamText = examsCL[selectAssessExam]; 
                loadExamOptions = availableExams ? sortArraySpecificOrder(availableExams, examOrder).map((exam, index) => {
                    return <option key={index} value={exam}>{examsCL[exam]}</option>
                }) : "";
            }
            if(studentInfo.dept.toLowerCase() === "sh") { 
                selectAssessExamText = currentTerm.substring(4) === "1" ? examsSH[selectAssessExam] : examsSH[selectAssessExam+"1"]; 
                loadExamOptions = availableExams ? sortArraySpecificOrder(availableExams, examOrder).map((exam, index) => {
                    return <option key={index} value={exam}>{currentTerm.substring(4) === "1" ? examsSH[exam] : examsSH[exam+"1"]}</option>
                }) : "";  
            }
            if(studentInfo.dept.toLowerCase() === "jh" || studentInfo.dept.toLowerCase() === "be") {
                selectAssessExamText = examsCL[selectAssessExam];
                const sortedArr = availableExams ? availableExams.sort(function(a, b) { return parseInt(a) > parseInt(b) }) : ""; //sort by numeric string values
                loadExamOptions = sortedArr ? sortedArr.map((exam, index) => {
                    return <option key={index} value={exam}>{examMonths[exam]}</option>
                }) : "";
            }
        }
        const loadStudentInfo = studentInfo ? (
            <Fragment>
                <div className="control mb-3">
                    <div className="select is-small">
                        <select name="selectAssessExam" value={selectAssessExam} onChange={this.handleOnSelectExam}>
                            <option value="">Select Assessment</option>
                            {loadExamOptions}
                        </select>
                    </div>
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0 mb-3"></div>
                </div> 
                <AssessmentTable
                    educLabel={studentInfo.dept}
                    studentAssessment={studentAssessment} 
                    selectAssessExamText={selectAssessExamText}
                />
            </Fragment>  
        ) : "";
        return(
            <Fragment>                
                <div className="columns">
                    <div className="column mt-1 mb-1">
                        <SearchStudentPanelFull
                            searcheables={searcheables}
                            searcher={searcher}
                            colleges={colleges}
                            courses={courses}
                            educLevel={educLevelSearch}
                            module="assessmentView"
                            handleOnSearchEvent={this.handleOnSearchEvent}
                            handleOnchangeInput={this.handleOnchangeInput}
                        />  
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
        )
    }

}

export default withCookies(AssessmentView);