import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getColleges, createUser } from '../../helpers/apiCalls';

class CreateUserForm extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        colleges: null, userType: '', mobileNumber: '', email: '', sex: 'M', suffixName: '', 
        middleName: '', firstName: '', lastName: '', idNumber: '', department: ''
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        getColleges(cookies.get("selterm"))
        .then(response => {
            this.setState({ colleges: response.data.departments });      
        });

    }
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSaveNewUser = () => {
        const { userType, mobileNumber, email, sex, suffixName, middleName, firstName, lastName, idNumber, department } = this.state;
        let promptMsg = "Required fields "
        let missingFields = []
        if(!idNumber) missingFields.push("Id Number");
        if(!lastName) missingFields.push("Last Name");
        if(!firstName) missingFields.push("First Name");
        if(!department) missingFields.push("Department");
        if(!sex) missingFields.push("Sex");
        if(!userType) missingFields.push("User Type");
        if(missingFields.length > 0) {
            promptMsg += missingFields.join(", ");
            alert(promptMsg);
        }
        else {
            const data = {
                id_number: idNumber ? idNumber : "",
                lastname: lastName ? lastName.toUpperCase() : "",
                firstname: firstName ? firstName.toUpperCase() : "",
                middle_initial: middleName ? middleName.substring(0,1).toUpperCase() : ".",
                suffix: suffixName ? suffixName.toUpperCase() : "",
                dept: department ? department.toUpperCase() : "",
                sex: sex ? sex : "",
                user_type: userType ? userType : "",
                email: email ? email.toUpperCase() : "",
                mobile_number: mobileNumber ? mobileNumber : "",
            };
            createUser(data)
            .then(response => {
                if(response.data.success) {
                    alert("Successfully Created!");
                    this.setState({
                        userType: "", 
                        mobileNumber: "", 
                        email: "", 
                        sex: "M", 
                        suffixName: "", 
                        middleName: "", 
                        firstName: "", 
                        lastName: "", 
                        idNumber: "", 
                        department: ""
                    })
                }      
                else alert("User Creation Failed!");
            });
        }
    }
    render() {
        const { colleges, userType, mobileNumber, email, sex, suffixName, middleName, firstName, lastName, idNumber, department, selectedTerm, activeTerms } = this.state;
        const departmentOptions = colleges ? colleges.map((college, i) => {
            return <option key={i+1} value={college.dept_abbr}>{college.dept_name}</option>
        }) : "";
        const departmentSelect = (
            <div className="field">
                <label className="label is-small">Department (required)</label>
                <div className="select is-small">
                    <select name="department" value={department} onChange={this.handleOnChangeInput}>
                        <option key={0} value="">Select Department</option>
                        {departmentOptions}
                        <option value="SHS">Senior High</option>
                        <option value="JHS">Junior High</option>
                        <option value="BED">Elementary</option>
                    </select>
                </div>
            </div>
        );
        const departmentTxt = (  
            <div className="field">
                <label className="label is-small">Department (required)</label>
                <input className="input is-small" type="text" name="department"
                        value={department} onChange={this.handleOnChangeInput}/>
            </div>
        );
        return(
            <Fragment>
                <div className="field is-small">
                    <label className="label is-small">ID Number (required)</label>
                    <div className="control">
                        <input className="input is-small" name="idNumber" type="text" 
                               value={idNumber} onChange={this.handleOnChangeInput}/>
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">Last Name (required)</label>
                    <input className="input is-small" name="lastName" type="text" 
                            value={lastName} onChange={this.handleOnChangeInput}/>       
                </div>
                <div className="field">
                    <label className="label is-small">First Name (required)</label>
                    <input className="input is-small" name="firstName" type="text" 
                           value={firstName} onChange={this.handleOnChangeInput}/>
                </div>
                <div className="field is-grouped">
                    <div className="field mr-3">
                        <label className="label is-small">Middle Initial</label>
                        <input className="input is-small" name="middleName" type="text" 
                               value={middleName} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="field mr-3">
                        <label className="label is-small">Suffix</label>
                        <input className="input is-small" name="suffixName" type="text" 
                               value={suffixName} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="field">
                        <label className="label is-small">Sex (required)</label>
                        <div className="control">
                            <div className="select is-small">
                            <select name="sex" value={sex} onChange={this.handleOnChangeInput}>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="field">
                    <label className="label is-small">Email</label>
                    <div className="control has-icons-left has-icons-right">
                        <input className="input is-small" type="email" name="email"
                                value={email} onChange={this.handleOnChangeInput}/>
                        <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                        </span>
                    </div>
                </div>
                <div className="field is-grouped">
                    <div className="field mr-3">
                        <label className="label is-small">Mobile</label>
                        <input className="input is-small" type="text" name="mobileNumber"
                               value={mobileNumber} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="field mr-3">
                        <label className="label is-small">User Type (required)</label>
                        <div className="control">
                            <div className="select is-small">
                                <select name="userType" value={userType} onChange={this.handleOnChangeInput}>
                                    <option value="">Select User Type</option>
                                    <option value="EDP">EDP</option>
                                    <option value="REGISTRAR">REGISTRAR</option>
                                    <option value="ACCOUNTING">ACCOUNTING</option>
                                    <option value="CASHIER">CASHIER</option>
                                    <option value="ACAD">ACAD</option>
                                    <option value="DEAN">DEAN / PRINCIPAL</option>
                                    <option value="CHAIRPERSON">CHAIRPERSON</option>
                                    <option value="COOR">COORDINATOR</option>
                                    <option value="FACULTY">FACULTY</option>
                                    <option value="LINKAGE">LINKAGE</option>  
                                </select>
                            </div>
                        </div>
                    </div>
                    {
                        userType && ["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType) ? departmentSelect : departmentTxt
                    }
                                         
                </div>

                <div className="control">
                    <button className="button is-link is-fullwidth" onClick={this.handleSaveNewUser}>Save</button>
                </div>
                <br />
            </Fragment>
        )
    }

}

export default withCookies(CreateUserForm);