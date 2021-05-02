import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import isLoggedIn from '../../helpers/isLoggedIn';
import { getLoggedUserDetails } from '../../helpers/helper'

import { ERR404 } from '../ERR404';
import EnrollmentSteps from '../../components/enrollment/EnrollmentSteps'
import UpdateContactDetails from '../../components/enrollment/UpdateContactDetails';
import SubjectSelection from '../../components/enrollment/SubjectSelection';
import UploadProofOfPayments from '../../components/enrollment/UploadProofOfPayment';
import UpdateVerifyEmail from '../../components/enrollment/UpdateVerifyEmail';
import MainForm from '../Registration/MainForm';

class Student extends Component {
    state = {
        studentType: '',
        idNumber: '',    
        currentStep: 1
    }
    componentDidMount = () => {
        if (isLoggedIn()) {            
            this.setState({
                studentType: getLoggedUserDetails("studentType"),
                idNumber: getLoggedUserDetails("idnumber")  
            });
            const { history } = this.props;
            history.push("/enrollment/student/steps");
        }
    }
    handleOnChangeInput = e => {

    }
    handleRoute = () => {
       //history.push('/login');
    }
    render() {
        if (getLoggedUserDetails("usertype") !== "STUDENT") {
            return <Redirect to="/login" />;
        }
        return (
            <div className="box" style={{ overflowX: "auto" }}>               
                <Switch>
                    <Route path="/enrollment/student/uploadpayment" component={UploadProofOfPayments} />
                    <Route path="/enrollment/student/selectsubjects/:type" component={SubjectSelection} />
                    <Route path="/enrollment/student/updatecontacts/:email" component={UpdateContactDetails} /> 
                    <Route path="/enrollment/student/updateverifyemail" component={UpdateVerifyEmail} />
                    <Route path="/enrollment/student/register" component={MainForm} />
                    <Route path="/enrollment/student/steps" component={EnrollmentSteps} />
                    <Route path="/enrollment/student" component={EnrollmentSteps} />
                    <Route path="/enrollment" component={EnrollmentSteps} />
                    <Route component={ERR404} />
                </Switch>    
                <div className="">
                    <div className="divider is-size-6 mb-0 pb-0"></div>
                </div>                
            </div>
        );
    };
}
export default withRouter(Student)


/*export const EnrollmentHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-edit"></i> Enrollment
    </div> 
);*/
