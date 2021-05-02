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
import StudentInfoWithPayment from '../../components/enrollment/StudentInfoWithPayment';
import StudentInfoWithGrades from '../../components/enrollment/StudentInfoWithGrades';
import { getLoggedUserDetails } from '../../helpers/helper';
import { updateStudentStatus, getCourses } from '../../helpers/apiCalls';

class Cashier extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 8, totalPending: 0, page: 1, limit: 20, totalApproved: 0, totalDisapproved: 0,
            studentInfo: null, studentList: null, studentGrades: null, paginatedStudentList: [], attachments: [],
            name: '', course: '', date: '', id_number: '', courses: null, 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0, section: '', stud_id: '',
            approvalStatus: null, disapproveMsg: '',
            selectedStudentID: '', selectedStudentClassification: '', selectedTab: "pending"
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
            if(key === "course") this.getFilteredStudentList(); 
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
            const approveStatuses = { pending: 8, approved: 9, disapproved: 2 };    
            const data = {
                id_number: this.state.selectedStudentID,
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
                    alert("Student payment approved!")
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
        const { enrollStatus, page, limit, name, course, date, id_number} = this.state;      
        const data = {
            status: enrollStatus,
            page: page,
            limit: limit,
            name: name,
            course: course,
            date: date,
            id_number: id_number,
            course_department: "",
            active_term: cookies.get("selterm")
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_GET_ENROLLMENT_STUDENT_LIST, data, {headers})
        .then(response => {
            this.setState({
                studentList: response.data.students,
                totalRecords: response.data.count,
            }, () => this.getStatusCount() );
        }).catch(error => {
            console.log(error);
        });
    }
    getStudentInfo = () => { 
        const { cookies } = this.props; 
        if(this.state.selectedStudentClassification === "NEW STUDENT") {        
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            };
            const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, { id_number: this.state.selectedStudentID, payment: 0, active_term: cookies.get("selterm") }, {headers});
            const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, { id_number: this.state.selectedStudentID, payment: 1, active_term: cookies.get("selterm") }, {headers});
            Promise.all([apiRequest1, apiRequest2]).then(values =>  {
                this.setState({
                    studentInfo: values[0].data,
                    allowed_units: values[0].data.allowed_units, 
                    year_level: values[0].data.year_level, 
                    classification: values[0].data.classification,
                    stud_id: values[0].data.stud_id,
                    attachments:  values[1].data.attachments
                }); 
            }).catch(error => {
                console.log(error);
            });

            /* DEPRECEATED
            axios.all([
                axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, { id_number: this.state.selectedStudentID, payment: 0 }, {headers}),
                axios.post(process.env.REACT_APP_API_UC_GET_STUDENT_INFO, { id_number: this.state.selectedStudentID, payment: 1 }, {headers})
            ])
            .then(axios.spread((studentInfo, paymentAttachments) => {
                this.setState({
                    studentInfo: studentInfo.data,
                    allowed_units: studentInfo.data.allowed_units, 
                    year_level: studentInfo.data.year_level, 
                    classification: studentInfo.data.classification,
                    stud_id: studentInfo.data.stud_id,
                    attachments:  paymentAttachments.data.attachments
                });            
            })).catch(error => {
                console.log(error);
            });   */ 
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
            id_number: this.state.selectedStudentID, active_term: cookies.get("selterm")          
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
        const data = { course_department: "", active_term: cookies.get("selterm") };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_GET_STATUS_COUNT, data, {headers})
        .then(response => {            
            this.setState({
                totalPending: response.data.approved_by_accounting,
                totalApproved: response.data.officially_enrolled,
            });
        }).catch(error => {
            console.log(error);
        });        
    }
    render() {
        if (getLoggedUserDetails("usertype") !== "CASHIER") {
            return <Redirect to="/login" />;
        }
        const { 
            studentList, enrollStatus, page, limit, name, course, date, id_number, studentGrades, selectedTab,
            totalPending, totalApproved, totalDisapproved, attachments, courses,
            studentInfo, selectedStudentID, selectedStudentClassification, paginatedStudentList
        } = this.state;
        //const pagination = { page, limit, totalRecords };
     
        const searcheables = { name, course, date, id_number };
        const approver = getLoggedUserDetails("usertype");
        let loadStudentInfo = "";
        if(selectedStudentClassification !== "OLD STUDENT") {
            loadStudentInfo = (
                <StudentInfoWithPayment 
                    studentInfo={studentInfo} 
                    attachments={attachments}
                    viewer={approver}
                    selectedTab={selectedTab}
                    module="Cashier"
                    handleOnchangeInput={this.handleOnchangeInput}  
                />
            );
        } else {
            loadStudentInfo = ( 
                <StudentInfoWithGrades 
                    studentInfo={studentInfo} 
                    studentGrades={studentGrades}
                    editables={[]} 
                    viewer={approver}
                    selectedTab={selectedTab}
                    handleOnchangeInput={this.handleOnchangeInput}  
                />
            );
        }

        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={8}
                        approved={10}
                        disapproved={9}
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
                                        step="Cashier"
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
                                    paginatedStudentList={paginatedStudentList}
                                    selectedStudentID={selectedStudentID}
                                    handleOnchangeInput={this.handleOnchangeInput}
                                    handleClickUser={this.handleClickUser}
                                    onChangePagination={this.onChangePagination}
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

export default withCookies(Cashier)