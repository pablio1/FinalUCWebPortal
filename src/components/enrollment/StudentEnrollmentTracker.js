import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import DefaultAvatar from "../../assets/sysimg/user.png";
import { getLoggedUserDetails, getEnrollmentStepsFromStatus } from '../../helpers/helper';
import { getStudentList, getCourses, getStudentInfo, getColleges, getOldStudentInfo } from '../../helpers/apiCalls';

import SearchStudentPanelFull from '../../components/elements/SearchStudentPanelFull';
import StudentInfoView from '../enrollment/StudentInfoView';
import StudentProfilePanel from '../elements/StudentProfilePanel';
import StudentInfoWithPayment from '../enrollment/StudentInfoWithPayment';
import PaginateRecords from '../../components/elements/PaginateRecords';

class StudentEnrollmentTracker extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        studentList: null, colleges: null, courses: null, totalRowsCount: 0, pageNum: 1, rowsPerPage: 20, showModal: false, studentInfo: null,
        searchFilterCollege: '', searchFilterCourse: '', searchFilterClassification: '', searchFilterYear: 0, searchIDNumber: '', searchName: '', searchDate: '',
        userType: '', paymentAttachment: '', filterEnrollStep: 99
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            userType: getLoggedUserDetails("usertype"),
            searchFilterCollege: ["DEAN", "CHAIRPERSON", "COOR"].includes(getLoggedUserDetails("usertype")) ? getLoggedUserDetails("courseabbr") : ""
        }, () => {
            const data = {
                status: this.state.filterEnrollStep, //return all 
                page: this.state.pageNum,
                limit: this.state.rowsPerPage,
                course_department: this.state.searchFilterCollege,      
                active_term: cookies.get("selterm")      
            };
            getStudentList(data)
            .then(response => {
                this.setState({
                    studentList: response.data.count > 0 ? response.data.students : null,
                    totalRowsCount: response.data.count    
                }, () => {
                    if(["DEAN", "CHAIRPERSON", "COOR"].includes(this.state.userType)) {
                        let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }
                        if(this.state.userType === "ACAD" && this.state.searchFilterCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
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
                            this.setState({ colleges: response.data.departments });      
                        });
                    }
                });
            });
        });    
    }
    handleOnchangeInput = (key, value) => {
        const { cookies } = this.props;
        if(key === "searchFilterCollege") {
            const { searchFilterCourse } = this.state;           
            this.setState({
                searchFilterCollege: value,
                searchFilterCourse: value ? searchFilterCourse : ""
            }, () => {
                const data = {
                    status: this.state.filterEnrollStep, //return all 
                    page: this.state.pageNum,
                    limit: this.state.rowsPerPage,
                    name: this.state.searchName,
                    course: this.state.searchFilterCourse,
                    course_department: this.state.searchFilterCollege,
                    date: this.state.searchDate,
                    id_number: this.state.searchIDNumber,
                    year_level: this.state.searchFilterYear,
                    classification: this.state.searchFilterClassification,
                    active_term: cookies.get("selterm")
                };
                getStudentList(data)
                .then(response => {
                    this.setState({
                        studentList: response.data.count > 0 ? response.data.students : null,
                        totalRowsCount: response.data.count
                    }, () => {
                        let data = { department_abbr: this.state.searchFilterCollege, active_term: cookies.get("selterm") }
                        if(this.state.userType === "ACAD" && this.state.searchFilterCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
                        getCourses(data)
                        .then(response => {
                            this.setState({ 
                                courses: response.data.colleges.length > 0 ? response.data.colleges : null
                            });
                        });            
                    });
                });
            });
        }
        else if(key === "filterEnrollStep") {
            this.setState({
                filterEnrollStep: value,
                pageNum: 1,
            }, () => this.filterStudentsList());
        }
        else if(key === "searchFilterCourse") {
            this.setState({
                searchFilterCourse: value,
                pageNum: 1,
            }, () => this.filterStudentsList());
        }
        else if(key === "searchFilterClassification") {
            this.setState({
                searchFilterClassification: value,
                pageNum: 1,
            }, () => this.filterStudentsList());
        }
        else if(key === "searchFilterYear") {
            this.setState({
                searchFilterYear: value,
                pageNum: 1,
            }, () => this.filterStudentsList());
        }
        else {
            this.setState({
                [key]: value
            });
        }
    } 
    handleOnSearchEvent = e => {
        this.filterStudentsList();
    }
    handleOnClickAvatar = (idNumber, classification) => {
        const { cookies } = this.props;
        if(["OLD STUDENT", "RETURNEE", "SHIFTEE"].includes(classification)) {
            getOldStudentInfo(idNumber, 0, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    studentInfo: response.data ? response.data : null,
                    showModal: true
                }, () => {
                    if(this.state.userType === "CASHIER") {
                        getOldStudentInfo(idNumber, 1, cookies.get("selterm"))
                        .then(response => {            
                            this.setState({
                                paymentAttachment: response.data ? response.data.attachments : '',
                            });
                        });
                    }
                });
            });
        }
        else {
            getStudentInfo(idNumber, 0, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    studentInfo: response.data ? response.data : null,
                    showModal: true
                }, () => {
                    if(this.state.userType === "CASHIER") {
                        getStudentInfo(idNumber, 1, cookies.get("selterm"))
                        .then(response => {            
                            this.setState({
                                paymentAttachment: response.data ? response.data.attachments : '',
                            });
                        });
                    }
                });
            });
        }
    }
    closeModal = () => {
        this.setState({
            showModal: false
        }, () => this.filterStudentsList());
    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e
        }, () => this.filterStudentsList());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            rowsPerPage: e
        }, () => this.filterStudentsList());
    }
    filterStudentsList = () => {
        const { cookies } = this.props;
        const data = {
            status: this.state.filterEnrollStep, //return all 
            page: this.state.pageNum,
            limit: this.state.rowsPerPage,
            name: this.state.searchName,
            course: this.state.searchFilterCourse,
            course_department: this.state.searchFilterCollege,
            date: this.state.searchDate,
            id_number: this.state.searchIDNumber,
            year_level: this.state.searchFilterYear,
            classification: this.state.searchFilterClassification,
            active_term: cookies.get("selterm")
        };
        getStudentList(data)
        .then(response => {
            this.setState({
                studentList: response.data.count > 0 ? response.data.students : null,
                totalRowsCount: response.data.count,                
            });
        });
    }
    render() {
        const { 
            studentList, colleges, courses, searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate, showModal,
            studentInfo, userType, totalRowsCount, pageNum, rowsPerPage, paymentAttachment, searchFilterCollege, filterEnrollStep 
        } = this.state;
        const searcheables = { searchFilterCourse, searchFilterClassification, searchFilterYear, searchIDNumber, searchName, searchDate, filterEnrollStep };
        const avatarPath = studentInfo && studentInfo.attachments.length > 0 ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + studentInfo.attachments.filter(file => file.type === "2x2 ID Picture")[0].filename : "";
        const loadStudentList = studentList ? studentList.map((student, index) => {
            const stepsArr = getEnrollmentStepsFromStatus(student.status);
            const stepIcons = [
                <i className="fas fa-minus"></i>,
                <i className="fas fa-check has-text-link"></i>,
                <i className="fas fa-times has-text-danger"></i>,
                <i className="fas fa-hourglass-start fa-pulse has-text-info"></i>
            ]; 
            let step1 = stepIcons[stepsArr[0]];
            let step2 = stepIcons[stepsArr[1]];
            let step3 = stepIcons[stepsArr[2]];
            let step4 = stepIcons[stepsArr[3]];
            let step5 = stepIcons[stepsArr[4]];
            let step6 = stepIcons[stepsArr[5]];
            let step7 = stepIcons[stepsArr[6]];
            let step8 = student.status === 10 ? <i className="fas fa-trophy has-text-primary"></i> : stepIcons[stepsArr[7]];
            return (
                <tr className="" key={index}>
                    <td className="is-narrow">
                        <div className="is-clickable" onClick={() => this.handleOnClickAvatar(student.id_number, student.classification)}>
                            <div className="image is-32x32">
                                <img className="is-rounded" src={student.profile ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + student.profile : DefaultAvatar} 
                                alt="" style={{ width:"32px", height: "32px"}} />
                            </div>
                        </div>
                    </td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="">{student.lastname}, {student.firstname} {student.mi ? student.mi + "." : ""} {student.suffix}</td>
                    <td className="">{student.classification}</td>
                    <td className="">{student.course_year}</td>
                    <td className="">{student.date.substring(0, 10)}</td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Filing of Registration Forms">{step1}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Registrar Evaluation and Approval">{step2}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Dean/Principal Evaluation Approval">{step3}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Subject Selection">{step4}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Dean/Principal Subjects Approval">{step5}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Accounting Approval">{step6}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Cashier Approval">{step7}</span>                        
                    </td>
                    <td className="has-text-centered">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-left" data-tooltip="Officially Enrolled">{step8}</span>                        
                    </td>
                </tr>  
            )
        }) : "";
        return (
            <Fragment>
            <div className={"modal " + (showModal ?  "is-active " : "")}>
                <div className="modal-background" onClick={this.closeModal}></div>
                <div className="modal-content">
                    {
                        studentInfo && userType === "REGISTRAR" ? 
                        (
                            <StudentInfoView
                                studentInfo={studentInfo}
                            />
                        ) : ""
                    }
                    {
                        studentInfo && ["DEAN", "CHAIRPERSON", "COOR", "ACAD", "EDP", "LINKAGE", "ACCOUNTING"].includes(userType) ? 
                        (
                            <StudentProfilePanel
                                studentInfo={studentInfo}
                                avatarPath={avatarPath}
                            />
                        ) : ""
                    }
                    {
                        studentInfo && paymentAttachment && userType === "CASHIER" ? 
                        (
                            <StudentInfoWithPayment 
                                studentInfo={studentInfo}
                                attachments={paymentAttachment}
                                module="StudentEnrollmentTracker"
                            />
                        ) : ""
                    }
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
            </div>
            <div className="box" >                
                <div className="columns">
                    <div className="column">
                        <SearchStudentPanelFull
                            searcheables={searcheables}
                            searcher={userType}
                            colleges={colleges}
                            courses={courses}
                            educLevel={searchFilterCollege === "SHS" ? "shs" : "col"}
                            module="studentEnrollmentTracker"
                            handleOnSearchEvent={this.handleOnSearchEvent}
                            handleOnchangeInput={this.handleOnchangeInput}
                        />
                    </div>
                </div>
            
                <div className="columns">
                    <div className="column">
                        <article className="message is-link m-0 pt-0">
                            <div className="message-header pt-2 pb-2">
                                <p>Student Tracks</p>                                             
                            </div>
                            <div className="message-body p-0">
                                <div className="table-container p-0">
                                    <table className="table is-striped is-fullwidth is-size-7 is-hoverable">
                                        <thead>
                                            <tr>
                                                <th className="is-narrow"></th>
                                                <th className="is-narrow">ID Number</th>
                                                <th className="">Name</th>
                                                <th className="">Classification</th>
                                                <th className="">Course</th>
                                                <th className="">Date Registered</th>
                                                <th className="has-text-centered">Step 1</th>
                                                <th className="has-text-centered">Step 2</th>
                                                <th className="has-text-centered">Step 3</th>
                                                <th className="has-text-centered">Step 4</th>
                                                <th className="has-text-centered">Step 5</th>
                                                <th className="has-text-centered">Step 6</th>
                                                <th className="has-text-centered">Step 7</th>
                                                <th className="has-text-centered">Step 8</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </tfoot>
                                        <tbody>
                                        { loadStudentList ? loadStudentList : (    
                                                    <tr>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                )
                                            }                                                                                             
                                        </tbody>
                                    </table>    
                                </div>                                  
                            </div>
                        </article> 
                    </div>
                </div>  

                <div className="columns">
                    <div className="column">
                        <PaginateRecords
                            totalRowsCount={totalRowsCount}
                            rowsPerPage={rowsPerPage}
                            pageNum={pageNum}
                            handleOnClickPage={this.handleOnChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </div> 
            </Fragment>     
        );
    }
}

export default withCookies(StudentEnrollmentTracker);