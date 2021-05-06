import React, { Component,Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import StudentsList from '../enrollment/StudentsList';
import EnrollmentTabs from '../elements/EnrollmentTabs';
import SearchStudentPanel from '../elements/SearchStudentPanel';
import ApprovalPanel from '../elements/ApprovalPanel';
import StudentInformation from '../enrollment/StudentInformation';
import StudentInfoWithGrades from '../enrollment/StudentInfoWithGrades';
import GradesTable from '../../components/elements/GradesTable';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getLoggedUserDetails,hasSubjectLab } from '../../helpers/helper';
import { updateStudentStatus,getCurriculum, getAllCurriculum, getStudentList, getOpenSections, getOldStudentInfo, getStudentInfo, getStatusCount, getGradesEvaluation, getCourses } from '../../helpers/apiCalls';

class DeanEvaluation extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 14, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, sections: null,
            name: '', course: '', course_department: '', date: '', id_number: '', session: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            disapproveMsg: '', courses: null,  filterYearLevel: 0,requesites: null,grades:null,
            selectedStudentID: '', selectedStudentCourseCode: '', selectedStudentClassification: '', selectedTab: 'evaluate',
            showPreloader: false, isLoadingStudentList: false, curr_year: null, selectedCurrYear: null, isEvaluate:false, year:null, semester: null,subjects: null, editableGrade: [{internal_code: null, editable: false}]
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

                this.getCurriculumYear();
            });
        });
    }
    getCurriculumYear = () => {
        getAllCurriculum()
        .then(response => {
            if(response.data){
                this.setState({
                    curr_year : response.data.year
                });
                console.log(this.state.curr_year);
            }
        });
    }
    getCurriculumInfo = () => {
        var data
    }
    handleOnClickEdit = (internal_code) =>{
        this.setState({
            editableGrade: {
                internal_code: internal_code,
                editable: true
            }
        });

        console.log("edit", this.state.editableGrade);
    }
    handleOnClickTab = (tab, value) => {
        this.setState({
            enrollStatus: value,
            selectedStudentID: '',
            selectedTab: tab
        }, () =>  this.getFilteredStudentList() );              
    }
    handleOnClickEvaluate = () =>{
        const {isEvaluate,selectedStudentID,selectedCurrYear} = this.state;

        if(this.state.selectedCurrYear === "" || this.state.selectedCurrYear === null) {
            alert("Please assign the curriculum of the student.");
            this.togglePreloader(false);
        }else{
            this.setState({
                isEvaluate: !isEvaluate
            });
            var data = {
                id_number: selectedStudentID,
                year: selectedCurrYear
            }
            console.log("test",data);
            getCurriculum(data)
                .then(response => {  
                    if(response.data) {          
                        this.setState({
                            subjects: response.data.subjects,
                            requisites: response.data.requisites,
                            grades: response.data.grades
                        });
                        console.log("response",response.data);
                        const {subjects} = this.state;
                        const year = [...new Set(subjects.map(item => item.year_level))]
                        this.setState({
                            year: year
                        });
                        const semester = [...new Set(subjects.map(item => item.semester))]
                        this.setState({
                            semester: semester
                        });
                        //console.log("subjects",this.state.subjects);
                    }
                }); 
        } 
    }
    handleOnchangeInput = (key, value) => {
        
        this.setState({
            [key] : value    
        }, () => {
            if(key === "year_level" || key === "session") this.getFilteredSections();
            if(key === "course" || key === "filterYearLevel") this.getFilteredStudentList();  
        });
        console.log(this.state.selectedCurrYear);
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification, 
            selectedStudentCourseCode: courseCode,
            section: ''
        }, () => this.getStudentInfoData() );
    }
    handleApprovalButton = e => {   
        const { cookies } = this.props;
        this.togglePreloader(true); 
        if(e === "approved") {
            if(this.state.allowed_units === 0) {
                alert("Please enter the max allowed number of units.");
                this.togglePreloader(false);
            }
            else { 
                let yearLevel = this.state.year_level;  
                let msg = ""; 
                if(this.state.course_department === "SHS") {
                    if(yearLevel.length > 2) yearLevel = yearLevel.substring(0, 2);
                    msg = this.state.disapproveMsg;
                }
                if(this.state.course_department === "JHS" || this.state.course_department === "BED") {
                    if(["N1","K1"].includes(this.state.year_level)) yearLevel = 1;
                    msg = this.state.disapproveMsg;
                }
                const data = {
                    status: 3,
                    name_of_approver: getLoggedUserDetails("fullname"), 
                    section: this.state.section ? this.state.section : "",
                    allowed_units: this.state.allowed_units,
                    course_code: this.state.selectedStudentCourseCode,
                    message: msg,
                    mdn: this.state.session,
                    classification: this.state.classification,
                    year_level: yearLevel,
                    curr_year: this.state.selectedCurrYear,
                    active_term: cookies.get("selterm") 
                };
                console.log("allowd units", data);
                if(this.state.section === "") {
                    alert("Please assign a section to the student.");
                    this.togglePreloader(false);
                }
                if(this.state.selectedCurrYear === ""){
                    alert("Please assign a curriculum to the student.");
                    this.togglePreloader(false);
                }
                if(this.state.selectedCurrYear !== "" && this.state.section !== "") {
                    updateStudentStatus(this.state.selectedStudentID, data)
                    .then(response => {            
                        if(response.data.success) {
                            alert("Student Successfully Approved!");
                            this.setState({
                                selectedStudentID: "",
                                disapproveMsg: "",
                                showPreloader: false
                            }, () => this.getFilteredStudentList() ); 
                        }
                        else { 
                            if(response.data.edp_code) {                            
                                alert("These EDP Codes under section " + this.state.section + " has just been filled up. Please select another open section. Full EDP Codes: " + response.data.edp_code.join())
                                this.getStudentInfoData();
                            }
                            else  alert("Approval Failed. Please try again, if issues persist please contact EDP Office."); 
                            this.togglePreloader(false);
                        }
                    })
                }
            }
        }
        else if(e === "disapproved") {
            const data = {
                status: 4,
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
                        showPreloader: false
                    }, () => this.getFilteredStudentList() ); 
                }
                else {
                    alert("We encountered a loss of connectivity during Student Approval. Please try again."); 
                    this.togglePreloader(false);
                }
            })
        }
    }
    getFilteredStudentList = () => { 
        const { cookies } = this.props;
        let yearLevel = this.state.filterYearLevel;   
        if(["N1","K1"].includes(this.state.filterYearLevel)) yearLevel = 1;
        const data = {
            status: this.state.enrollStatus,  
            page: this.state.page,
            limit: this.state.limit,
            name: this.state.name,
            course: this.state.course,
            course_department: this.state.course_department,
            date: this.state.date,
            id_number: this.state.id_number,
            year_level: yearLevel,
            //classification: this.state.searchFilterClassification,
            active_term: cookies.get("selterm")
        };
        console.log("data", data);
        this.setState({
            isLoadingStudentList: true
        }, () => {
            getStudentList(data)
            .then(response => {
                this.setState({
                    studentList: response.data.count > 0 ? response.data.students: null,
                    totalRecords: response.data.count,
                    selectedStudentID: '',
                    isLoadingStudentList: false
                }, () => {
                    const {studentList} = this.state;
                    getStatusCount(this.state.course_department, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            totalPending: studentList.length,
                            totalApproved: response.data.approved_registration_dean,
                            totalDisapproved: response.data.disapproved_registration_dean
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
                    session: response.data.mdn ? response.data.mdn : ""
                }, () => {
                    this.getFilteredSections();
                    getGradesEvaluation(this.state.selectedStudentID, this.state.studentInfo.dept)
                    .then(response => {
                        this.setState({
                            studentGrades: response.data && response.data.studentGrades.length > 0 ? response.data.studentGrades : null
                        });                             
                    });
                    console.log("studentGrades:",this.state.studentGrades);
                });
            });   
        }
        else {            
            getStudentInfo(this.state.selectedStudentID, 0, cookies.get("selterm")) 
            .then(response => {       
                let yearLevel = response.data.year_level;
                if(["N1","K1"].includes(response.data.course_code)) yearLevel = response.data.course_code;   
                
                this.setState({
                    studentGrades: null,
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: yearLevel, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id,
                    session: response.data.mdn ? response.data.mdn : ""
                }, () => this.getFilteredSections());
            }); 
        }
    }
    getFilteredSections = () => {
        const { cookies } = this.props;
        const { studentInfo, year_level, selectedStudentCourseCode, session } = this.state;
        const campusSHS = process.env.REACT_APP_CAMPUS === "Banilad" ? "2" : "1";
        const mdnSHS = session && session === "AM" ? 8 : 9;
        let yearLevel = year_level;
        if(studentInfo.college.toUpperCase() === "SENIOR HIGH") yearLevel = year_level + campusSHS + mdnSHS;
        if(["N1","K1"].includes(studentInfo.course_code)) yearLevel = 1;
        const data = {
            year_level: yearLevel,
            course_code: selectedStudentCourseCode, 
            active_term: cookies.get("selterm")   
        };     
        getOpenSections(data)
        .then(response => { 
            if(response.data && response.data.sections) {
                let retSections = response.data.sections;
                this.setState({
                    sections: retSections,
                });
            }            
        });
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
    togglePreloader = e => {
        this.setState({
            showPreloader: e
        })
    }
    handleOnClickBack = () =>{
        const{isEvaluate} = this.state;
        if(isEvaluate){
            this.setState({
                isEvaluate: !isEvaluate
            });
        }
    }

    render() {
        const { 
            studentList, page, limit, name, course, date, id_number, studentGrades, stud_id, disapproveMsg, sections, section,year,semester,
            totalPending, totalApproved, totalDisapproved, course_department, session, courses, filterYearLevel, showPreloader, isLoadingStudentList,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedStudentClassification, selectedTab,curr_year,selectedCurrYear,
            subjects,requisites, editableGrade,isEvaluate
        } = this.state;
        const yearLevel = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
        const sem  = ['', 'First', 'Second', 'Summer'];
        const editables = { allowed_units, year_level, classification, stud_id, section, session };
        const searcheables = { name, course, date, id_number, filterYearLevel };
        const approver = getLoggedUserDetails("usertype");
        const loadDocuments = studentInfo && studentInfo.attachments.length > 0 ? studentInfo.attachments
        .filter(document => document.type == "Transcript of Records")
        .map((document, index) => {
            return (
                <tr key={index}>                                                        
                    <th className="is-narrow">Document: </th>   
                    <td><a href={process.env.REACT_APP_PATH_STORAGE_ATTACHMENTS + document.filename} target="_blank">{document.type}</a></td>                                                     
                </tr>
            );
        }) : "";
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
        const loadApprovalPanel = (
            <ApprovalPanel
                studentID={selectedStudentID}
                approver={approver}
                sections={sections}
                selectedCurrYear = {selectedCurrYear}
                sectionValue={section}
                currentTab={selectedTab}
                courseDepartment = {course_department}
                title=""
                isEvaluate = {isEvaluate}
                handleOnClickBack={this.handleOnClickBack}
                studentInfo = {studentInfo}
                curr_year = {curr_year}
                step="DeanEvaluation"
                handleApprovalButton={this.handleApprovalButton}
                handleOnchangeInput={this.handleOnchangeInput}
                disapproveMsg={disapproveMsg}
                disableApproveBtn={false} 
                handleOnClickEvaluate={this.handleOnClickEvaluate}
            />
        );

        
        var loadHeader = year? year.map((year, index)=>{
            var loadSemester = semester ? semester.map((semester, index)=>{
                var totalUnits = 0;
                var countSummer = 0;
                var countRegular = 0;
                var loadSubjects = subjects? subjects.filter(fil => fil.year_level == year && fil.semester == semester && fil.subject_type != 'L').map((sub, i)=>{
                    let labUnit = hasSubjectLab(subjects, sub.internal_code);
                    totalUnits = labUnit + parseInt(sub.units)+ totalUnits;
                    var countPrerequisite = 0;
                    var countCorequisite = 0;
                    var countCore = 0;
                    var temp = null;
                    var loadSummerSubjects = subjects.filter(f => f.semester != 3 && f.year_level == year).map((summer, i)=>{
                        countRegular++;
                    });
                    var loadSummerSubjects = subjects.filter(f => f.semester == 3 && f.year_level == year).map((summer, i)=>{
                        countSummer++;
                    });
                    
                    var getCorequisites = requisites ? requisites.filter(remark => remark.internal_code === sub.internal_code && remark.requisite_type == "C").map((rem, i) => {
                        countCore++;
                        return rem.subject_code;
                   }) :"";
                    var getPrerequisites = requisites ? requisites.filter(remark => remark.internal_code === sub.internal_code && remark.requisite_type == "P").map((rem, i) => {
                        return ( 
                            <span key={i} className="ml-1 tag">{rem.subject_code}</span>
                        )
                   }) :"";
                    return (
                        <Fragment>
                            <tr key={i}>
                                <td>{sub.subject_name}</td>
                                <td>{sub.descr_1}</td>
                                <td className="has-text-centered">{labUnit + parseInt(sub.units)}</td>
                                <td className="has-text-centered">{(countCore>0)?"Taken together with "+getCorequisites:getPrerequisites}</td>
                                <td className="has-text-centered"> 
                                    {/* {
                                        (this.state.editableGrade.editable == true && this.state.editableGrade.internal_code == sub.internal_code)&&
                                        <input className="input is-small"/>
                                    } */}
                                </td>
                                <th classNmae="has-text-centered">
                                    <p className="buttons">
                                        <button class="button is-small" onClick={()=>this.handleOnClickEdit(sub.internal_code)}>
                                            <span class="icon is-small">
                                            <i class="fas fa-edit"></i>
                                            </span>
                                        </button>
                                        <button class="button is-small">
                                            <span class="icon is-small">
                                            <i class="fas fa-search"></i>
                                            </span>
                                        </button>
                                    </p>
                                </th>
                            </tr>
                        </Fragment>
                    )
                }):"";
    
                
                /* var loadSummerSubjects = subjects.filter(f => f.semester == 3 && f.year == year ).map((summer, in)=>{}):""; */
                return (
                    
                    <Fragment>
                        {   (semester == 3 && countSummer != 0) &&
                            <div>
                                <div className="message-header">
                                    <p className="has-text-weight-bold">{sem[semester]} {semester != 3?"Semester":""}</p>    
                                </div>
                                <div className="message-body p-0">
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th className="is-narrow">Subject Code</th>
                                                    <th>Descriptive Title</th>
                                                    <th className="has-text-centered">Total Units</th>
                                                    <th className="has-text-centered">Pre-requisites</th>
                                                    <th className="is-narrow">Grade</th>
                                                    <th className="has-text-centered">Action</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                                    <td className="has-text-centered has-text-weight-bold ">{totalUnits}</td>                                  
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                            <tbody>   
                                                {loadSubjects}                                                                                            
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        }
                        {   (semester != 3) &&
                            <div>
                                <div className="message-header">
                                    <p className="has-text-weight-bold">{sem[semester]} {semester != 3?"Semester":""}</p>    
                                </div>
                                <div className="message-body p-0">
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th className="is-narrow">Subject Code</th>
                                                    <th>Descriptive Title</th>
                                                    <th className="has-text-centered">Total Units</th>
                                                    <th className="has-text-centered">Pre-requisites</th>
                                                    <th className="is-narrow">Grade</th>
                                                    <th className="has-text-centered">Action</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                                    <td className="has-text-centered has-text-weight-bold ">{totalUnits}</td>                                  
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                            <tbody>   
                                                {loadSubjects}                                                                                            
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        }
                    </Fragment>
                )
            }):"";
            return(
                <Fragment>
                    <h1 className="is-size-4">{yearLevel[year]} Year</h1>
                    <article className="message mb-0 pb-0 is-small">
                        {loadSemester}
                    </article>
                </Fragment>
            )
        }):""; 


        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={1}
                        approved={3}
                        disapproved={4}
                        evaluate={14}
                        requests={"none"}
                        step = {"DeanEvaluation"}
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
                        { isEvaluate == false &&
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
                        }
                        
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
                        { this.state.isEvaluate !== true &&
                            <Fragment>
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
                            </Fragment>
                        }
                    </div> 
                    {this.state.isEvaluate === true &&
                        <Fragment>
                            <div className="columns">
                                <div className="is-three-fifths column">
                                    {(this.state.selectedCurrYear == null || this.state.selectedCurrYear == "") &&
                                        <article className="message is-danger mb-2">
                                            <div className="message-body">
                                                <h4 className="is-size-7">
                                                    <strong>Warning:</strong> Please assign the student curriculum before to evaluate.   
                                                </h4>                            
                                            </div>
                                        </article>
                                    }

                                    {(this.state.selectedCurrYear !== null && this.state.selectedCurrYear !== "") &&
                                       
                                        <div className="table-container is-size-7">
                                            <div className="message">
                                                <div className="message-header">
                                                    <p className="has-text-weight-bold">Curriculum for {studentInfo.course}</p> 
                                                    <p className="has-text-weight-bold has-text-right">{selectedCurrYear} - {parseInt(selectedCurrYear) + 1}</p>   
                                                </div>
                                                <div className="message-body p-0 mt-3">
                                                    <div className="table-container">
                                                        {loadHeader}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                               
                                <div className="column">
                                    {(this.state.selectedCurrYear !== null && this.state.selectedCurrYear !== "" && this.state.studentGrades != null) &&
                                        <GradesTable 
                                            studentGrades={studentGrades} 
                                            college={studentInfo.college}
                                        />
                                    }
                                    {(this.state.selectedCurrYear !== null && this.state.selectedCurrYear !== "" && this.state.studentGrades == null) &&
                                        <article className="message m-0 pt-0 is-link">
                                            <div className="message-header">
                                                <p>Documents Attached</p>                   
                                            </div>
                                            <div className="message-body p-0">
                                                <div className="table-container">
                                                    <table className="table is-striped is-fullwidth is-narrow is-bordered is-hoverable">                                        
                                                        <tbody>
                                                            {loadDocuments}                                                   
                                                        </tbody>
                                                    </table>    
                                                </div>                                
                                            </div>
                                        </article>
                                    }
                                </div>
                            </div>
                        </Fragment>
                    }
                </div>       
        );
    }
}

export default withCookies(DeanEvaluation)