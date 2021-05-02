import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import * as XLSX from 'xlsx';

import { getLoggedUserDetails } from '../../helpers/helper';
import { teacherGradeReport, getTeachersList, getTeachersLoad, getClassList, getTeacherListByDept } from '../../helpers/apiCalls';

import SearchTeacherPanel from '../../components/elements/SearchTeacherPanel';
import EgradeTable from '../../components/elements/EgradeTable';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class Report extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        teacherList: null, selectedTeacher: null, department: '', userType: '', hasTeachersLoad: false,
        reportData: null, id_number: '', name:'', exam: 1, semester: '',
        edpCode: '', subjectName: '', units: 0, classListDept: '', studentList: null, 
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        let department = "CL";
        if(getLoggedUserDetails("courseabbr") === "SHS") department = "SH";
        if(getLoggedUserDetails("courseabbr") === "JHS") department = "JH";
        if(getLoggedUserDetails("courseabbr") === "BED") department = "BE";
        const selectedTerm = cookies.get("selterm") ? cookies.get("selterm") : process.env.REACT_APP_CURRENT_SCHOOL_TERM;
        const semester = selectedTerm.charAt(4);
        getTeachersList({})
        .then(response => {
            if(response.data && response.data.teacherList.length > 0) { 
                getTeacherListByDept(getLoggedUserDetails("courseabbr"), cookies.get("selterm")) 
                .then(resp => {
                    if(resp.data && resp.data.id_numbers.length > 0) { 
                        let teacherList = [];
                        response.data.teacherList.forEach(teacher => {
                            if(resp.data.id_numbers.includes(teacher.id_number)) {
                                teacherList.push(teacher);
                            }
                        });
                        this.setState({
                            teacherList: teacherList,
                            userType: getLoggedUserDetails("usertype"),
                            department: department,
                            semester: semester,
                            teachersIDDeptArr: response.data.id_numbers
                        })
                    }
                })
            }
        });   
    }
    handleOnSearchEvent = e => {
        if(e.target.value) {
            this.setState({
                [e.target.key] : e.target.value,
                teachersLoad: null,
            }, () => this.getSelectedTeacher());
        }
    }
    handleOnchangeInput = (key,value) => {
        if(value) {
            this.setState({
            [key] : value,
            teachersLoad: null,
            }, () => this.getSelectedTeacher());
        }
    }
    getSelectedTeacher = () => {
        const { cookies } = this.props;
        const data = {
            id_number: this.state.id_number,
            name: this.state.name
        }
        getTeachersList(data)
        .then(response => {
            if(response.data && response.data.teacherList.length > 0) { 
                this.setState({
                    selectedTeacher: response.data.teacherList[0],   
                    edpCode: data.edp_code, 
                    subjectName: '', 
                    units: 0, 
                    classListDept: '',
                    studentList: null                
                }, () => {
                    getTeachersLoad(this.state.id_number, cookies.get("selterm"))        
                    .then(response => {
                        if(response.data && response.data.schedules.length > 0) {
                            this.setState({ 
                                hasTeachersLoad: true 
                            }, () => {
                                const data = {
                                    department: this.state.department,
                                    id_number: this.state.id_number,
                                    exam: this.state.exam,
                                    active_term: cookies.get("selterm")
                                }
                                teacherGradeReport(data)        
                                .then(response => {
                                    if(response.data && response.data.gradeR.length > 0) {
                                        this.setState({ 
                                            reportData: response.data.gradeR[0]                        
                                        });
                                    }
                                }); 
                            });                    
                        }
                    });  
                });
            }
        });
    }
    handleOpenGrades = edpCode => {
        const { cookies } = this.props;
        const currentCampus = process.env.REACT_APP_CAMPUS;
        getClassList(edpCode, cookies.get("selterm"))
        .then(response => {
            if(response.data) {
                const data = response.data;                  
                if(parseInt(data.official_enrolled_size, 10) > 0) {
                    let classList = data.official_enrolled;
                    if(currentCampus !== "Banilad" && parseInt(data.pending_enrolled_size, 10) > 0) {
                        classList = [ ...classList, ...data.pending_enrolled ];
                    }
                    this.setState({
                        edpCode: data.edp_code, 
                        subjectName: data.subject_name, 
                        units: data.units, 
                        classListDept: data.department,
                        studentList: classList.length > 0 ? classList : null, 
                    });                          
                }     
            }              
            else {
                alert("No records found. Please try again.");
            }           
        });
    }
    render() {
        const { 
            teacherList, id_number, name, selectedTeacher, hasTeachersLoad, reportData, 
            edpCode, subjectName, units, classListDept, studentList, semester 
        } = this.state;
        const searcheables = { id_number, name };
        const loadSelectedTeacherDetails = selectedTeacher ? (
            <div className="columns">
                <div className="column">
                    <table className="table is-striped is-hoverable m-0 p-0">
                        <tbody> 
                            <tr>
                                <th colSpan="2">Submission Report For :</th>
                                <th>{selectedTeacher.id_number + " - " + selectedTeacher.last_name + ", " + selectedTeacher.first_name}</th>                        
                            </tr>                                                                                                                                                             
                        </tbody>
                    </table>
                </div>
            </div> 
            
        ) : "";
        let loadReportList = [];
        if( reportData && reportData.total_subjects.count > 0) {
            reportData.total_subjects.subjs.forEach((subj, index) => {
                let arrItem = subj.split(" - ");
                let status = "";
                if(reportData.late_submitted.count > 0) {
                    let lateSubmitted = reportData.late_submitted.subjs.filter(subject => subject.includes(subj));
                    if(lateSubmitted.length > 0) lateSubmitted = lateSubmitted[0].split(" - ");
                    status = <span className="has-text-danger-dark has-text-weight-semibold">Submitted {lateSubmitted[2]} Late</span>;
                }
                if(reportData.submitted.subjs.includes(subj)) status = <span className="has-text-success-dark has-text-weight-semibold">Submitted On Time</span>;              
                if(reportData.not_submitted.subjs.includes(subj)) status = <span className="has-text-danger has-text-weight-bold">Not Submitted</span>; 
                loadReportList.push(
                    <tr className="is-clickable" onClick={() => this.handleOpenGrades(arrItem[0])} key={index}>
                        <td className="has-text-centered is-narrow">{index + 1}</td>
                        <td className="has-text-centered">{arrItem[0]}</td>
                        <td className="has-text-left">{arrItem[1]}</td>    
                        <td className="">{status}</td>
                    </tr>
                );
            });
        }
        const loadTeacherList = teacherList ? teacherList.map((teacher,index) => {

        }) : "";
        const loadReport = reportData ? (
            <article className="message is-info mt-4 pt-0">                
                <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table id="egradeReport" className="table is-striped is-size-7 is-hoverable mb-2">
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Id No.</th>
                                    <td className="has-text-left">{selectedTeacher.id_number}</td> 
                                    <th className="has-text-right">Deadline</th>       
                                    <td className="has-text-left has-text-danger-dark has-text-weight-semibold">{reportData.deadline.split(" ")[0]}</td>                                                           
                                </tr>  
                                <tr>
                                    <th className="is-narrow">Name</th>
                                    <td colSpan="3" className="has-text-left">{selectedTeacher.last_name + ", " + selectedTeacher.first_name}</td>                                 
                                </tr>                                                           
                                <tr>
                                    <th className="has-text-centered is-narrow">No.</th>
                                    <th className="has-text-centered">EDP Code</th>
                                    <th className="has-text-left">Subject</th>    
                                    <th className="has-text-centered">Status</th>
                                </tr>
                                {
                                    loadReportList.length > 0 ? loadReportList : null 
                                }                                                                                                                  
                            </tbody>                                
                        </table>             
                    </div>                                  
                </div>
            </article>  
        ) : "";
        const loadGradesTable = studentList && selectedTeacher ? (
            <EgradeTable
                edpCode={edpCode}
                subjectName={subjectName}
                units={units}
                studentList={studentList}
                department={classListDept}
                teacherID={selectedTeacher.id_number}
                teacherName={selectedTeacher.last_name + ", " + selectedTeacher.first_name}
                semester={semester}
                isHidden={false}
            />
        ) : "";
        return(
            <Fragment>
            <div className="columns">
                <div className="column mt-0 mb-0 is-half-widescreen is-half-desktop"> 
                    <SearchTeacherPanel 
                        searcheables={searcheables}
                        teacherList={teacherList}
                        handleOnchangeInput={this.handleOnchangeInput}
                        handleOnSearchEvent={this.handleOnSearchEvent}
                    />
                </div>
            </div>
            {loadSelectedTeacherDetails}
            {
                !hasTeachersLoad && selectedTeacher ? (
                    <div className="columns is-vcentered">
                        <div className="column is-half-widescreen is-half-desktop">
                            <div className="notification is-danger">
                                <strong>No Teaching Loads.</strong>                           
                            </div>
                        </div>
                    </div> 
                ) : (
                    <div className="columns">
                        <div className="column mt-0 pt-0 is-one-third-widescreen is-one-third-desktop"> 
                            {
                                selectedTeacher ? (
                                    <ReactHTMLTableToExcel
                                        className="button is-info is-small"
                                        table="egradeReport"
                                        filename={selectedTeacher.id_number + "_" + selectedTeacher.last_name + "_" + selectedTeacher.first_name}
                                        sheet="report"
                                        buttonText="Export to Excel"
                                    />
                                ) : ""
                            }                                                              
                            {loadReport}
                        </div>
                        <div className="column mt-0 pt-0">{loadGradesTable}</div>
                    </div>    
                ) 
            }  
            </Fragment>
        );
    }
}

export default withCookies(Report);