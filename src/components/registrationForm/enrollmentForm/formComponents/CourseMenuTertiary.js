import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import SelectCollege from '../../../elements/SelectCollege';
import SelectCourse from '../../../elements/SelectCourse';
import axios from 'axios';

class CourseMenuTertiary extends Component {   
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        courses: null, isCollegeSelected: false, yearLimit: 0, modalOpen: false
    }
    componentDidMount = () => {
        const college = (this.props.values.selectedCollege) ? this.props.values.selectedCollege : "";
        this.getCourses(college);
    }
    handleOnChangeInput = e => {   
        if(e.target.name === "selectedCollege") {
            //const optionText =  e.target.options[e.target.selectedIndex].text;   
            //this.props.handleOnChangeInput(e.target.name, optionText);
            //this.props.handleOnChangeInput(e.target.name + "Code", e.target.value);
            //this.props.handleOnChangeInput("selectedCourse", "");            
            this.getCourses(e.target.value);
        }  
        if(e.target.name === "selectedCourseCode") {
            this.getYearLimit(e.target.value);
        }
    
        this.props.handleOnChangeInput(e);
    }
    toggleIsCollegeSelected = () => {
        const {isCollegeSelected} = this.state;
        this.setState({ isCollegeSelected : !isCollegeSelected });
    }
    getCourses = college => {
        const { cookies, values } = this.props;
        if(college) {
            this.toggleIsCollegeSelected();
            const data = { department_abbr: college, course_department: "", department: "", active_term: cookies.get("selterm") ? cookies.get("selterm") : values.term };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
            };
            axios.post(process.env.REACT_APP_API_UC_GET_OPEN_ENROLL_COURSES, data, {headers})
            .then(response => {
                this.setState({  
                    courses: response.data.colleges,
                }, () => this.getYearLimit(null));
                this.toggleIsCollegeSelected();
            }).catch(error => {
                console.log(error);
            });
        }
        else {
            this.setState({  
                courses: '',
                yearLimit: 0
            });
        }
    }
    getYearLimit = (e) => {
        const {courses} = this.state;
        const {values} = this.props;
        const selectedCourse = e ? e : values.selectedCourseCode;
        if(selectedCourse && courses) {
            const filteredCourse = courses.filter(course => course.college_code === selectedCourse);
            this.setState({
                yearLimit: filteredCourse.length > 0 ? filteredCourse[0].year_limit : 0
            });
        }
    }
    closeModal = () => {
        this.setState({ modalOpen: false });
    }
    openModal = () => {
        this.setState({ modalOpen: true });
    }
    render() { 
        const { values, isOldStudent } = this.props; 
        const { courses,  isCollegeSelected, yearLimit, modalOpen } = this.state;
        const yearLevelOptions = yearLimit > 0 ? [...Array(yearLimit).keys()].map((year, i) => (
            <option key={i+1} value={year+1}>{year+1}</option>
        )) : ""; 
        const modalContentStatusHelp = (
            <article className="message">
                <div className="message-header">
                    <p>Entry Status Legend</p>
                    <button className="delete" aria-label="delete" onClick={this.closeModal}></button>
                </div>
                <div className="message-body">
                    <p><strong>New Student</strong> - New student whos starting his/her College or Basic Education schooling.</p>
                    <p><strong>Old Student</strong> - Continuing student who's enrolled in the previous semester (College/ Senior High) or previous school year (Junior High/ Elementary).</p>
                    <p><strong>Returnee</strong> - Students who stopped schooling for one or more semester/ school year and wish to return to school.</p>
                    <p><strong>Transferee</strong> - Student from other school and campus who wish to transfer to our campus.</p>
                    <p><strong>Cross Enrolee</strong> - Student from other UC campus who wish to take credits/subjects from our campus.</p>
                    <p><strong>Shiftee</strong> - Student who wish to shift into a different course/strand.</p>
                </div>
            </article>
        );
        return(
            <div className="" style={{ /*width: "94%"*/ }}>
                <div className={"modal " + (modalOpen ?  "is-active " : "")}>
                    <div className="modal-background" onClick={this.closeModal}></div>
                    <div className="modal-content">
                        {modalContentStatusHelp}    
                    </div>
                </div>
                <div className="columns is-vcentered">                                            
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-2">Open Colleges</h3>
                        <div className="field">
                            <SelectCollege 
                                name="selectedCollege"
                                value={values.selectedCollege}
                                educLevel={values.educLevel}
                                required={true}
                                fieldname="College"
                                term={values.term}
                                handleOnChangeInput={this.handleOnChangeInput}
                            />
                        </div>                                                                                                                                                                                                                        
                    </div>  
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-2">Courses Offered</h3>
                        <div className="field">
                            <SelectCourse
                                name="selectedCourseCode"
                                courses={courses}
                                value={values.selectedCourseCode}
                                required={true}
                                fieldname="Course"
                                handleOnChangeInput={this.handleOnChangeInput}   
                                isCollegeSelected={isCollegeSelected}                  
                            />       
                        </div>                                                                                                                                                                                                                        
                    </div> 
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-3 pt-0">Your Entry Status <span className="tag is-info is-clickable" onClick={this.openModal}>Help (?)</span></h3>
                        <div className="field">
                            <div className="control is-expanded has-icons-left">
                                <span className="select is-fullwidth">
                                    <select name="selectedEntryStatusCollege" value={values.selectedEntryStatusCollege} 
                                            onChange={this.handleOnChangeInput} required data-fieldname="Entry Status">
                                        <option value="">Select Status</option>
                                        {isOldStudent ? "" : <option value="H">New Student</option>}
                                        {isOldStudent ? <option value="O">Old Student</option> : ""}
                                        {isOldStudent ? <option value="R">Returnee</option> : ""}
                                        {isOldStudent ? "" : <option value="T">Transferee</option>}
                                        {isOldStudent ? "" : <option value="C">Cross Enrolee</option>}
                                        {isOldStudent ? <option value="S">Shiftee</option> : ""}  
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-chalkboard-teacher"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                           
                    </div>
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-3 pt-0">Year Level</h3>
                        <div className="field">
                            <p className="control is-expanded has-icons-left">
                                <span className="select is-fullwidth">                            
                                    <select name="selectedYearLevelCollege" value={values.selectedYearLevelCollege} 
                                            onChange={this.handleOnChangeInput} required data-fieldname="Year Level">
                                        <option key={0} value="">Select Year</option>
                                        {yearLevelOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-bars"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                           
                    </div>                                   
                </div>
            </div>
        );
    }

}

export default withCookies(CourseMenuTertiary)