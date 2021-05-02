import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store2';

import StudentsList from '../../components/enrollment/StudentsList';
import EnrollmentTabs from '../../components/elements/EnrollmentTabs';
import SearchStudentPanel from '../../components/elements/SearchStudentPanel';
import ApprovalPanel from '../../components/elements/ApprovalPanel';
import StudentInformation from '../../components/enrollment/StudentInformation';
import StudentInfoWithGrades from '../../components/enrollment/StudentInfoWithGrades';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getStudentList, updateStudentStatus } from '../../helpers/apiCalls';

class Registrar extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 0, totalPending: 0, page: 1, limit: 5, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, paginatedStudentList: [],
            name: '', course: '', date: '', id_number: '', course_department: '', 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, disapproveMsg: '',
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: "pending"
        };
    }
    componentDidMount = () => {
        this.setState({
            course_department: getLoggedUserDetails("courseabbr")    
        }, () => this.getFilteredStudentList() );
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
        });
    }
    handleOnSearchEvent = () => {
        this.getFilteredStudentList();  
    }
    handleClickUser = (idNum, classification, courseCode) => {
        this.setState({
            selectedStudentID: idNum,
            selectedStudentClassification: classification 
        }, () => this.getStudentInfo() );
    }
    handleApprovalButton = e => {
        const { cookies } = this.props;
        this.setState({
            approvalStatus: e 
        }, () => {
            const approveStatuses = { pending: 0, approved: 1, disapproved: 2 };    
            const data = {
                existing_id_number: this.state.stud_id,
                status: approveStatuses[this.state.approvalStatus],
                name_of_approver: getLoggedUserDetails("fullname"),
                message: this.state.disapproveMsg,
                //year_level: this.state.year_level,
                classification: this.state.classification,
                allowed_units: this.state.allowed_units,
                //course_code: "string",
                //section: "string",
                //needed_payment: 0,
                active_term: cookies.get("selterm")           
            };
            updateStudentStatus(this.state.selectedStudentID, data)
            .then(response => {            
                if(response.data.success) {
                    alert("Student Approved! Generated official student ID:" + response.data.id_number);
                    this.setState({
                        selectedStudentID: ""
                    }, () => this.getFilteredStudentList() ); 
                }
            });
        });  
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
        getStudentList(data)
        .then(response => {
            this.setState({
                studentList: response.data.count > 0 ? response.data.students : null,
                totalRecords: response.data.count,
            }, () => this.getStatusCount());
        });
    }
    getStudentInfo = () => { 
        const { cookies } = this.props; 
        if(this.state.selectedStudentClassification === "NEW STUDENT") {        
            const data = {
                id_number: this.state.selectedStudentID, 
                active_term: cookies.get("selterm")          
            };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            };
            axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, data, {headers})
            .then(response => {            
                this.setState({
                    studentInfo: response.data,
                    allowed_units: response.data.allowed_units, 
                    year_level: response.data.year_level, 
                    classification: response.data.classification,
                    stud_id: response.data.stud_id
                });
            }).catch(error => {
                console.log(error);
            });
        }
        else {
            const data = { status: this.state.enrollStatus, page: 0, limit: 0, name: "", course: "", date: "", id_number: this.state.selectedStudentID, active_term: cookies.get("selterm") };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            };           
            axios.post(process.env.REACT_APP_API_UC_GET_ENROLLMENT_STUDENT_LIST, data, {headers})
            .then(response => {
                this.setState({
                    studentInfo: response.data.students[0]
                });
            }).catch(error => {
                console.log(error);
            }); 
        }
    }
    getStudentGrades = () => {   
        const { cookies } = this.props;       
        const data = {
            id_number: this.state.selectedStudentID,    
            active_term: cookies.get("selterm")        
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, data, {headers})
        .then(response => {            
            this.setState({
                studentInfo: response.data,
                allowed_units: response.data.allowed_units, 
                year_level: response.data.year_level, 
                classification: response.data.classification
            });
        }).catch(error => {
            console.log(error);
        });
    }
    getStatusCount = () => {
        const { cookies } = this.props;      
        /*"registered": 19,
        "approved_registration_registrar": 2,
        "disapproved_registration_registrar": 1,
        "approved_registration_dean": 8,
        "disapproved_registration_dean": 0,
        "selecting_subjects": 5,
        "approved_by_dean": 0,
        "disapproved_by_dean": 0,
        "approved_by_accounting": 2,
        "approved_by_cashier": 0,
        "officially_enrolled": 0,
        "withdrawn_enrollment_before_start_of_class": 0,
        "withdrawn_enrollment_start_of_class": 0,
        "cancelled": 2*/
        const data = { course_department: this.state.course_department, active_term: cookies.get("selterm") };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_GET_STATUS_COUNT, data, {headers})
        .then(response => {            
            this.setState({
                totalPending: response.data.registered,
                totalApproved: response.data.approved_registration_registrar,
                totalDisapproved: response.data.disapproved_registration_registrar
            });
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
    render() {
        if (getLoggedUserDetails("usertype") !== "REGISTRAR") {
            return <Redirect to="/login" />;
        }
        const { 
            studentList, enrollStatus, page, limit, name, course, date, id_number, studentGrades, stud_id, selectedTab,
            totalPending, totalApproved, totalDisapproved,
            studentInfo, allowed_units, year_level, classification, totalRecords, selectedStudentID, selectedStudentClassification, paginatedStudentList
        } = this.state;
        //const pagination = { page, limit, totalRecords };
        const editables = { allowed_units, year_level, classification, stud_id };
        const searcheables = { name, course, date, id_number };
        const approver = getLoggedUserDetails("usertype");
        let loadStudentInfo = "";
        if(selectedStudentClassification !== "OLD STUDENT") {
            loadStudentInfo = (
                <StudentInformation 
                    studentInfo={studentInfo} 
                    editables={editables} 
                    viewer={approver}
                    selectedTab={selectedTab}
                    handleOnchangeInput={this.handleOnchangeInput}  
                />
            );
        } else {
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
                                        disapproveMsg={""}
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
                            {studentList ? (
                                <StudentsList
                                    studentList={studentList}
                                    selectedStudentID={selectedStudentID}
                                    totalRowsCount={totalRecords}
                                    rowsPerPage={limit}
                                    pageNum={page}
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
                            
                        </div>
                    </div> 


                    <div>
                        {/*<Switch>
                            <Route path="/enrollment/registrar/:statusCode" component={RegistrarTab} />
                            <Route component={ERR404} />
                        </Switch>*/}    
                    </div>
                </div>       
        );
    }
}

export default withCookies(Registrar)