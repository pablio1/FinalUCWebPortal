import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import EnrollmentTabs from '../../components/elements/EnrollmentTabs';
import { getLoggedUserDetails } from '../../helpers/helper';
import { updateStudentStatus } from '../../helpers/apiCalls';
import store from 'store2';

class Accounting extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            enrollStatus: 0, page: 1, limit: 10, studentInfo: null, maxUnits: 0,
            name: '', course: '', date: '', id_number: '', studentList: null, 
            allowed_units: 0, year_level: '', classification: '', totalRecords: 0,
            disapproveMsg: ''
        };
    }
    componentDidMount = () => {
       this.getStudentList();
    }
    handleOnClickTab = e => {
        this.setState({
            enrollStatus: e
        }, () =>  this.getStudentList() );        
    }
    handleOnchangeInput = e => {
        this.setState({
            [e.target.name] : e.target.value    
        });
    }
    handleOnSearchEvent = () => {
        this.getStudentList();
        
    }
    handleClickUser = e => {
        this.getStudentInfo(e);
    }
    getStudentList = () => {
        const { cookies } = this.props;  
        const { enrollStatus, page, limit, name, course, date, id_number } = this.state;  
        const data = {
            status: enrollStatus,
            page: page,
            limit: limit,
            name: name,
            course: course,
            date: date,
            id_number: id_number,
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
                totalRecords: response.data.count
            });
        }).catch(error => {
            console.log(error);
        });
    }
    getStudentInfo = (id_number) => {  
        const { cookies } = this.props;        
        const data = {
            id_number: id_number, active_term: cookies.get("selterm")          
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
    updateStudentStatusHandle = (status, id_number) => {   
        const { cookies } = this.props;         
        const data = {
            //existing_id_number": "string",
            status: status === "approved" ? 1 : 2,
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
        updateStudentStatus(id_number, data)
        .then(response => {            
            if(response.data.success) {
                alert("Student Approved! Generated official student ID:" + response.data.id_number);
            }
        });
    }
    render() {
        if (getLoggedUserDetails("usertype") !== "ACCOUNTING") {
            return <Redirect to="/login" />;
        }
        const { 
            studentList, enrollStatus, page, limit, name, course, date, id_number, 
            studentInfo, allowed_units, year_level, classification, totalRecords
        } = this.state;
        const pagination = { page, limit, totalRecords };
        const editables = { allowed_units, year_level, classification };
        const searcheables = { name, course, date, id_number };
        return (
                <div className="box ml-1">
                    <EnrollmentTabs 
                        pending={0}
                        approved={1}
                        disapproved={2}
                        handleOnClickTab={this.handleOnClickTab}
                    />
                    <div className="">
                        <div className="divider is-size-6 mt-0 pt-0"></div>
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

export default withCookies(Accounting)