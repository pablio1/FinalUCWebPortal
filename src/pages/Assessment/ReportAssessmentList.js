import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';

import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { sortArrayObjectsByProp, formatMoney, getLoggedUserDetails } from '../../helpers/helper';
import { getAssessmentStudentListReport, getColleges } from '../../helpers/apiCalls';

class ReportAssessmentList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        selectedCourseDepartment: '', listCategory1: null, listCategory2: null, listCategory3: null, colleges: null,
        isLoading: false
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        if(["DEAN", "CHAIRPERSON"].includes(getLoggedUserDetails("usertype"))) {
            this.setState({ 
                selectedCourseDepartment: getLoggedUserDetails("courseabbr")
            }, () => this.getStudentList());
        }
        else {
            getColleges(cookies.get("selterm"))
            .then(response => {
                this.setState({ 
                    colleges: response.data.departments 
                });      
            });
        }
    } 
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name]: e.target.value,
            isLoading: true
        }, () => this.getStudentList());
    }
    getStudentList = () => {
        const { cookies } = this.props;
        getAssessmentStudentListReport(this.state.selectedCourseDepartment, cookies.get("selterm"))
        .then(response => {
            if(response.data) {
                const data = response.data;
                this.setState({
                    listCategory1: data.category_1 && data.category_1.length > 0 ? data.category_1 : null,
                    listCategory2: data.category_2 && data.category_2.length > 0 ? data.category_2 : null,
                    listCategory3: data.category_3 && data.category_3.length > 0 ? data.category_3 : null,
                    isLoading: false
                })
            }

        });
    }
    render() {
        const today = moment().format("DD-MM-YYYY")
        const { colleges, selectedCourseDepartment, listCategory1, listCategory2, listCategory3, isLoading } = this.state;
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="25px" height="25px" />; 
        const showIconColleges = colleges ? <i className="fas fa-book"></i> : SpinnerIcon;
        const collegesOptions = colleges ? colleges.map((college, i) => {
            return <option key={i} value={college.dept_abbr}>{college.dept_name}</option>
        }) : "";
        let showLoadedStudentsCat1 = (
            <tr>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
            </tr>  
        );
        let showLoadedStudentsCat2 = (
            <tr>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
            </tr>  
        );
        let showLoadedStudentsCat3 = (
            <tr>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
            </tr>  
        );
        if(listCategory1) {
            showLoadedStudentsCat1 = sortArrayObjectsByProp(listCategory1, "lastname").map((student,index) => {
                return (
                    <tr key={index}>
                        <td>{student.id_number}</td>
                        <td>{student.lastname}</td>
                        <td>{student.first_name}</td>
                        <td>{student.course_year}</td>
                        <td>{formatMoney(student.total_assessment)}</td>
                        <td>{formatMoney(student.total_balance)}</td>
                        <td>{formatMoney(student.due)}</td>
                        <td className="has-text-centered has-text-weight-bold">1</td>
                        <td>{student.email}</td>
                        <td>{student.mobile_number}</td>
                    </tr>
                )
            });
        }
        if(listCategory2) {
            showLoadedStudentsCat2 = sortArrayObjectsByProp(listCategory2, "lastname").map((student,index) => {
                return (
                    <tr key={index}>
                        <td>{student.id_number}</td>
                        <td>{student.lastname}</td>
                        <td>{student.first_name}</td>
                        <td>{student.course_year}</td>
                        <td>{formatMoney(student.total_assessment)}</td>
                        <td>{formatMoney(student.total_balance)}</td>
                        <td>{formatMoney(student.due)}</td>
                        <td className="has-text-centered has-text-weight-bold">2</td>
                        <td>{student.email}</td>
                        <td>{student.mobile_number}</td>
                    </tr>
                )
            });
        }
        if(listCategory3) {
            showLoadedStudentsCat3 = sortArrayObjectsByProp(listCategory3, "lastname").map((student,index) => {
                return (
                    <tr key={index}>
                        <td>{student.id_number}</td>
                        <td>{student.lastname}</td>
                        <td>{student.first_name}</td>
                        <td>{student.course_year}</td>
                        <td>{formatMoney(student.total_assessment)}</td>
                        <td>{formatMoney(student.total_balance)}</td>
                        <td>{formatMoney(student.due)}</td>
                        <td className="has-text-centered has-text-weight-bold">3</td>
                        <td>{student.email}</td>
                        <td>{student.mobile_number}</td>
                    </tr>
                )
            });
        }
        const loadPreloader = isLoading ? (
            <div className="column is-center">
                <figure className="image is-128x128">
                    <img src={SpinnerGif} alt="" />
                </figure>
            </div>  
        ) : "";
        return (
            <div className="box ml-1" style={{ borderTop: "1px solid", borderColor: "#E5E8E8" }}>
                {
                    ["ACCOUNTING", "CASHIER", "ACAD"].includes(getLoggedUserDetails("usertype")) ? (
                        <Fragment>
                        <div className="columns is-vcentered">
                            <div className="column is-narrow">
                                <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by College</h5>                             
                            </div> 
                            <div className="column">
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <span className="select is-fullwidth is-small">
                                            <select name="selectedCourseDepartment" value={selectedCourseDepartment} onChange={this.handleOnChangeInput}>
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
                            <div className="column is-hidden-mobile"></div>
                            <div className="column is-hidden-mobile"></div>
                        </div>
                        <div className="">
                            <div className="divider is-size-6 mt-0 mb-2 pt-0"></div>
                        </div> 
                        </Fragment> 
                    ) : ""
                }                 
                {loadPreloader}              
                {
                    selectedCourseDepartment && (listCategory1 || listCategory2 || listCategory3) ? (
                        <Fragment>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="button is-info is-small mb-3"
                            table="assessmentList"
                            filename={"assessment_cat_list" + today} 
                            sheet="Assessment"
                            buttonText="Export to Excel"
                        />
                        <div className="table-container">
                            <table id="assessmentList" className="table is-striped is-fullwidth is-size-7">
                                <thead>
                                    <tr>
                                        <th colSpan="10" className="is-size-6 has-text-centered">{"Assessment Category List"}</th>
                                    </tr>
                                    <tr>
                                        <th>ID Number</th>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>Course Year</th>
                                        <th>Total Assessment</th>
                                        <th>Total Balance</th>
                                        <th>Exam Due</th>
                                        <th className="has-text-centered">Category</th>
                                        <th>Email</th>
                                        <th>Mobile #</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCategory1 ? showLoadedStudentsCat1 : ""} 
                                    {listCategory2 ? showLoadedStudentsCat2 : ""} 
                                    {listCategory3 ? showLoadedStudentsCat3 : ""} 
                                    { 
                                        !listCategory1 && !listCategory2 && !listCategory3 ? (
                                            <tr>
                                                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
                                                <td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td><td>TBA</td>
                                            </tr>  
                                        ) : ""
                                    }                                                                                                                         
                                </tbody>
                            </table>    
                        </div>
                        </Fragment> 
                    ) : (                        
                        <div className="column is-center">
                            <h5 className="has-text-weight-bold mb-2 is-size-5">
                                {selectedCourseDepartment && (!listCategory1 && !listCategory2 && !listCategory3) ? "No Data / Assessment not Ready" : "Select College First" }
                            </h5>                
                        </div>
                    )
                } 
                 
            </div>       
        );
    }
}

export default withCookies(ReportAssessmentList);
