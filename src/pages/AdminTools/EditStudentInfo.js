import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { updateStudentDetails, getCourses, viewStudentInfo } from '../../helpers/apiCalls';


class EditStudentInfo extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        studentFound: false, courses: '', classification: '', educLevel: '',
        middleName: '', firstName: '', lastName: '', idNumber: '', course_code: '', year_level: '', allowedUnits: 0
    }
    componentDidMount = () => {
        
    }
    handleOnChangeInput = e => {
        const { cookies } = this.props;
        if(e.target.name === "educLevel") {
            this.setState({
                educLevel : e.target.value
            }, () => {
                getCourses({ department: this.state.educLevel, active_term: cookies.get("selterm") })
                .then(response => {
                    this.setState({ courses: response.data.colleges });      
                });
            })
        }
        else if(e.target.name === "allowedUnits") {
            if(/^[0-9]*$/.test(e.target.value)) {
                this.setState({
                    [e.target.name] : e.target.value
                })
            } 
        }
        else {
            this.setState({
                [e.target.name] : e.target.value
            })
        }
    }
    handleCancelBtn = () => {
        this.setState({
            classification: "", 
            educLevel: "", 
            middleName: "", 
            firstName: "", 
            lastName: "",  
            course_code: "", 
            year_level: "",
            idNumber: "",
            studentFound: false
        });
    }
    handleSaveBtn = () => {
        const { cookies } = this.props;
        const { classification, educLevel, middleName, firstName, lastName, idNumber, course_code, year_level, allowedUnits } = this.state;
        let promptMsg = "Required fields "
        let missingFields = []
        if(!idNumber) missingFields.push("Id Number");
        if(!lastName) missingFields.push("Last Name");
        if(!firstName) missingFields.push("First Name");
        if(!course_code) missingFields.push("Course");
        if(!educLevel) missingFields.push("Education Level");
        if(!classification) missingFields.push("Classification");
        if(!year_level) missingFields.push("Year Level");
        if(!allowedUnits) missingFields.push("Max Allowed Units");
        if(missingFields.length > 0) {
            promptMsg += missingFields.join(", ");
            alert(promptMsg);
        }
        else {
            const data = {
                stud_id: idNumber.trim(),
                last_name: lastName.trim().toUpperCase(),
                first_name: firstName.trim().toUpperCase(),
                middle_initial: middleName ? middleName.trim().toUpperCase() : "",
                course_code: course_code,
                dept: educLevel,
                classification: classification,
                year_level: year_level,
                allowed_units: allowedUnits,
                active_term: cookies.get("selterm")
            };
            updateStudentDetails(data)
            .then(response => {
                if(response.data.success) {
                    alert("Successfully Edited!");
                    this.setState({
                        classification: "", 
                        educLevel: "", 
                        middleName: "", 
                        firstName: "", 
                        lastName: "",  
                        course_code: "", 
                        year_level: "",
                        idNumber: "",
                        allowedUnits: 0,
                        studentFound: false
                    })
                }      
                else alert("Student Edit Failed!");
            });
        }
    }
    handleKeyDown = e => { 
        const { cookies } = this.props;    
        if (e.key === 'Enter') { 
            viewStudentInfo(this.state.idNumber, cookies.get("selterm"))    
            .then(response => {
                if(response.data) {
                    this.setState({
                        classification: response.data.classification, 
                        educLevel: response.data.dept, 
                        middleName: response.data.middle_initial, 
                        firstName: response.data.first_name, 
                        lastName: response.data.last_name,  
                        course_code: response.data.course_code, 
                        year_level: response.data.year_level,
                        allowedUnits: response.data.allowed_units,
                        studentFound: true
                    }, () => {
                        getCourses({ department: this.state.educLevel, active_term: cookies.get("selterm") })
                        .then(response => {
                            this.setState({ courses: response.data.colleges });      
                        });
                    });

                    console.log("studentINFO", response.data)
                }
                else {
                    alert("ID Number not found!")
                    this.setState({
                        classification: "", 
                        educLevel: "", 
                        middleName: "", 
                        firstName: "", 
                        lastName: "",  
                        course_code: "", 
                        year_level: "",
                        allowedUnits: 0,
                        studentFound: false
                    });
                }
            });
        }
    }
    render() {
        const { courses, classification, educLevel, middleName, firstName, lastName, idNumber, course_code, year_level, studentFound, allowedUnits } = this.state;
        const coursesOptions = courses ? courses.filter(course => course.department === educLevel).map((course, i) => {
            let courseName = "[" + course.department + "] " + course.college_name.split(" ")[0];
            return <option key={i} value={course.college_code}>{courseName}</option>
        }) : "";
        const courseDetailsCollege = courses ? courses.filter(course => course.college_code === course_code) : "";
        const yearLevelOptionsCL = courseDetailsCollege && courseDetailsCollege.length > 0 ? [...Array(courseDetailsCollege[0].year_limit).keys()].map((year, i) => (
            <option key={i+1} value={year+1}>{year+1}</option>
        )) : "";
        const yearLevelOptionsSH = (
            <Fragment>
                <option value="11">11</option>
                <option value="12">12</option>
            </Fragment>
        );
        const loadYearLevelOption = educLevel && educLevel === "CL" ? yearLevelOptionsCL : yearLevelOptionsSH;
        return (
            <Fragment>
                <div className="field is-small">
                    <label className="label is-small">ID Number</label>
                    <div className="control">
                        <input className="input is-small" name="idNumber" type="text" onKeyDown={this.handleKeyDown}
                               value={idNumber} onChange={this.handleOnChangeInput}/>
                    </div>
                </div>
                { 
                    studentFound ? (
                        <Fragment>
                            <div className="field">
                                <label className="label is-small">Last Name</label>
                                <input className="input is-small" name="lastName" type="text" 
                                        value={lastName} onChange={this.handleOnChangeInput}/>       
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">First Name</label>
                                        <input className="input is-small" name="firstName" type="text" 
                                            value={firstName} onChange={this.handleOnChangeInput}/>
                                    </div>
                                </div>
                                <div className="column is-3">
                                    <div className="field">
                                        <label className="label is-small">Middle Initial</label>
                                        <input className="input is-small" name="middleName" type="text" maxLength="1"  
                                            value={middleName} onChange={this.handleOnChangeInput}/>
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">Education Level</label>
                                        <div className="control">
                                            <div className="select is-small is-fullwidth">
                                            <select name="educLevel" value={educLevel} onChange={this.handleOnChangeInput}>
                                                <option value="CL">College</option>
                                                <option value="SH">Senior High</option>                                    
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">Course</label>
                                        <div className="select is-small is-fullwidth">
                                            <select name="course_code" value={course_code} onChange={this.handleOnChangeInput}>
                                                {coursesOptions}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">Classification</label>
                                        <div className="select is-small is-fullwidth">
                                            <select name="classification" value={classification} onChange={this.handleOnChangeInput} >
                                                <option value="O">OLD STUDENT</option>
                                                <option value="H">NEW STUDENT</option>
                                                <option value="T">TRANSFEREE</option>
                                                <option value="R">RETURNEE</option>
                                                <option value="S">SHIFTEE</option>
                                            </select>
                                        </div>
                                    </div>                            
                                </div>                                
                            </div> 
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">Year</label>
                                        <div className="select is-small is-fullwidth">
                                            <select name="year_level" value={year_level} onChange={this.handleOnChangeInput} >
                                                {loadYearLevelOption}
                                            </select>
                                        </div>
                                    </div>                                                   
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label is-small">Max Allowed Units</label>
                                        <input className="input is-small" name="allowedUnits" type="text" 
                                            value={allowedUnits} onChange={this.handleOnChangeInput}/>
                                    </div>
                                </div> 
                                <div className="column is-hidden-mobile"></div>
                                <div className="column is-hidden-mobile"></div>           
                            </div>  
                            <div className="control">
                                <button className="button is-danger is-fullwidth mb-3" onClick={this.handleCancelBtn}>Cancel</button>
                            </div> 
                            <div className="control">
                                <button className="button is-link is-fullwidth" onClick={this.handleSaveBtn}>Save</button>
                            </div>
                        </Fragment>
                    ) : ""
                }
                <br />
            </Fragment>
        )
    }

}

export default withCookies(EditStudentInfo)