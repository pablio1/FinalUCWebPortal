import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { getLoggedUserDetails, sortArrayObjectsByProp } from '../../helpers/helper';
import { getColleges, getCourses, getSections, getClassListSection } from '../../helpers/apiCalls';


class ClassListBySection extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        userType: '', colleges: null, selectedCollege: '', courses: null, selectedCourse: '', sections: null, selectedSection: '',
        retCourse: '', retSection: '', section_size: '', assigned_section: null
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            userType: getLoggedUserDetails("usertype"),
            selectedCollege: ["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(getLoggedUserDetails("usertype")) ? getLoggedUserDetails("courseabbr") : ""
        }, () => {
            if(["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(this.state.userType)) {
                let data = { department_abbr: this.state.selectedCollege, active_term: cookies.get("selterm") }
                if(this.state.userType === "ACAD" && this.state.selectedCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
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
        })        
    }
    handleOnChangeInput = e => {    
        const { cookies } = this.props;
        if(e.target.name === "selectedCollege") {                   
            this.setState({
                selectedCollege: e.target.value,
                selectedCourse: e.target.value ? this.state.selectedCourse : "",                
                courses: e.target.value ? this.state.courses : null, 
                selectedSection: "",
                sections: null,
            }, () => {                
                let data = { department_abbr: this.state.selectedCollege, active_term: cookies.get("selterm") }
                if(this.state.userType === "ACAD" && this.state.selectedCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
                getCourses(data)
                .then(response => {
                    this.setState({ 
                        courses: response.data.colleges.length > 0 ? response.data.colleges : null
                    });
                });                 
            });
        }
        else if(e.target.name === "selectedCourse") {
            this.setState({
                selectedCourse: e.target.value,
                selectedSection: e.target.value ? this.state.selectedSection : "",
                sections: e.target.value ? this.state.sections : null,
            }, () => {   
                const data = {
                    college_abbr: this.state.selectedCourse ? this.state.selectedCollege : "", 
                    course_code: this.state.selectedCourse,
                    active_term: cookies.get("selterm")
                }  
                getSections(data)
                .then(response => { 
                    if(response.data && response.data.section){
                        const sortedSection = sortArrayObjectsByProp(response.data.section, "section")           
                        this.setState({
                            sections: sortedSection,
                        });
                    }
                });
            });
        }
        else if(e.target.name === "selectedSection") {
            getClassListSection(this.state.selectedCourse , e.target.value, cookies.get("selterm")) 
            .then(response => { 
                if(response.data){
                    this.setState({
                        retCourse: response.data.course, 
                        retSection: response.data.section, 
                        section_size: response.data.section_size, 
                        assigned_section: response.data.assigned_section.length > 0 ? response.data.assigned_section : null
                    });                    
                }
            });
        }
        else {
            this.setState({
                [e.target.name] : e.target.value
            })
        }
    }
    render() {
        const { 
            userType, colleges, selectedCollege, courses, selectedCourse, sections, selectedSection,
            retCourse, retSection, section_size, assigned_section
        } = this.state;
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="25px" height="25px" />;
        const showIconColleges = colleges ? <i className="fas fa-book"></i> : SpinnerIcon;
        const showIconCourses = courses ? <i className="fas fa-book"></i> : SpinnerIcon;
        const showIconSections = sections ? <i className="fas fa-book"></i> : SpinnerIcon;
        const collegesOptions = colleges ? colleges.map((college, i) => {
            return <option key={i} value={college.dept_abbr}>{college.dept_name}</option>
        }) : "";
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{(course.college_name).split(" ")[0]}</option>
        }) : "";
        const sectionsOptions = sections ? sections.map((section, i) => {
            return <option key={i} value={section.section}>{(section.section).split(" ")[0]}</option>
        }) : ""; 
        const statuLabel = { 3: "SECTION NOT ACCEPTED", 6: "PENDING ENROLLMENT", 8: "PENDING ENROLLMENT", 10: "OFFICIALLY ENROLLED"};
        const loadAssignedSection = assigned_section && assigned_section.length > 0 ? sortArrayObjectsByProp(assigned_section, "gender").map((student, index) => {
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-right">{student.last_name}</td>
                    <td className="has-text-right">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td>
                    <td className="has-text-centered">{statuLabel[student.status] ? statuLabel[student.status] : "--"}</td>
                    <td className="has-text-right">{student.mobile_number}</td>
                    <td className="has-text-centered">{student.email}</td>
                </tr>
            );
        }) : "";
        return (
            <Fragment>                
                <div className="columns">
                    <div className="column is-hidden-mobile is-2"></div>
                    {
                        //searcher && searcher !== "DEAN" ? (
                            userType && !["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType) ? (  
                            <div className="column mb-0">
                                <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by College</h5>                        
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <span className="select is-fullwidth is-small">
                                            <select name="selectedCollege" value={selectedCollege} onChange={this.handleOnChangeInput}>
                                                <option value="">Select College</option>
                                                {collegesOptions}
                                                <option value="SHS">Senior High</option>
                                                <option value="JHS">Junior High</option>
                                                <option value="BED">Elementary</option>
                                            </select>
                                        </span>
                                        <span className="icon is-small is-left">
                                            {showIconColleges}
                                        </span>
                                    </div>
                                </div>   
                            </div> 
                        ) : ""
                    }
                    <div className="column mb-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Course</h5>                        
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="selectedCourse" value={selectedCourse} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Course</option>
                                        {coursesOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {selectedCollege ? showIconCourses : <i className="fas fa-book"></i>}
                                </span>
                            </div>
                        </div>   
                    </div>
                    <div className="column mb-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Section</h5>                         
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="selectedSection" value={selectedSection} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Section</option>
                                        {sectionsOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {selectedCourse ? showIconSections : <i className="fas fa-book"></i>}
                                </span>
                            </div>
                        </div>    
                    </div>
                    <div className="column is-hidden-mobile is-2"></div>
                </div>
                
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div> 
                <div className="columns">
                    <div className="column is-2 is-hidden-mobile"></div>
                    <div className="column">
                        <article className="message is-link m-0 pt-0">
                            <div className="message-header pt-2 pb-2">
                                <p>Class List Section</p>    
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="button is-info is-small"
                                    table="classList"
                                    filename={"classlist-" + selectedCourse + "-" + retSection}
                                    sheet={selectedCourse + "-" + retSection}
                                    buttonText="Excel"
                                />                                         
                            </div>
                            <div className="message-body p-0">
                                <div className="table-container p-0">
                                    <table id="classList" className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                                        <tbody>
                                            <tr>
                                                <th colSpan="2">Course / Strand</th>
                                                <td colSpan="7" className="has-text-left">{retCourse}</td>                                 
                                            </tr>  
                                            <tr>
                                                <th colSpan="2">Section</th>
                                                <td colSpan="7" className="has-text-left">{retSection}</td>                                 
                                            </tr>
                                            <tr>
                                                <th colSpan="2">Size</th>
                                                <td colSpan="7" className="has-text-left">{section_size}</td>                                 
                                            </tr>                                                          
                                            <tr>
                                                <th className="has-text-centered is-narrow">No.</th>
                                                <th className="is-narrow">ID number</th>
                                                <th className="has-text-right">Last Name</th>
                                                <th className="has-text-right">First Name</th>
                                                <th className="has-text-centered is-narrow">Course / Year</th>
                                                <th className="has-text-centered is-narrow">Gender</th>
                                                <th className="has-text-centered">Status</th>
                                                <th className="has-text-right">Mobile</th>
                                                <th className="has-text-centered">Email</th>
                                            </tr>
                                            { loadAssignedSection ? loadAssignedSection : (    
                                                    <tr>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td><td></td>
                                                        <td></td><td></td>
                                                    </tr>
                                                )
                                            }                                                                                       
                                        </tbody>
                                    </table>             
                                </div>                                  
                            </div>
                        </article> 
                    </div>
                    <div className="column is-2 is-hidden-mobile"></div>
                </div>                
            </Fragment>
        )
    }
               
}

export default withCookies(ClassListBySection);
