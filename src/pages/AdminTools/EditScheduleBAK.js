import React, { Component, Fragment } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import store from 'store2';

import SearchSubjectPanel from '../../components/elements/SearchSubjectPanel';
import PaginateRecords from '../../components/elements/PaginateRecords';
import { getLoggedUserDetails, sortArrayObjectsByProp } from '../../helpers/helper';
import { getSchedules, getSections, getCourses } from '../../helpers/apiCalls';

class EditSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterStatus: '', searchEdpCodes: '', searchEdpCodesArr: [], searchSubject: '', filterCourse: '', filterSection: '',
            filteredSchedules: null, selectedSchedules: [], currentCollege: '', totalRowsCount: 0, pageNum: 1, rowsPerPage: 20,
            courses: null, sections: null, userType: '', no_nstp: 0, no_pe: 0
        }
    }
    componentDidMount = () => {  
        this.setState({
            currentCollege: getLoggedUserDetails("courseabbr"),
            userType: getLoggedUserDetails("usertype")           
        }, () => {
            let data = { department_abbr: "" }
            getCourses(data)
            .then(response => {
                const insertCourse = {
                    college_code: "XX",
                    college_id: 0,
                    college_name: "Common_NSTP_&_PE",
                    department: "XX",
                    year_limit: 1,
                }
                this.setState({  
                    courses: [...response.data.colleges, ...[insertCourse]],
                }, () => this.getFilteredSchedules());
            });          
        });    
    }
    handleOnchangeInput = (key, value) => {  
        this.setState({
            [key] : value
        }, () => {
            if(key === "filterCourse") {
                getSections({ college_abbr: this.state.currentCollege, course_code: value })
                .then(response => { 
                    if(value) {
                        if(response.data && response.data.section){
                            const sortedSection = sortArrayObjectsByProp(response.data.section, "section")           
                            this.setState({
                                sections: sortedSection,
                            }, () => this.getFilteredSchedules());
                        }
                    }
                    else {
                        this.setState({
                            filterSection: '',
                            sections: null,
                            totalRowsCount: 0,
                            filterStatus: '',
                            pageNum: 1,
                            rowsPerPage: 20
                        }, () => this.getFilteredSchedules()); 
                    }
                });
            }
            if(key === "filterSection" || key === 'filterStatus') {
                this.setState({
                    pageNum: 1,
                }, () => this.getFilteredSchedules()); 
            }
        });
    }
    handleOnSearchEvent = e => {
        if(e.target.name === "searchEdpCodes") {
            const { searchSubject, filterCourse, filterSection, filterStatus, searchEdpCodes } = this.state;
            let data = {
                course_code: filterCourse,
                year_level: 0,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,   
                sort: 0,
                page: this.state.pageNum,
                limit: this.state.rowsPerPage,     
            };
            if(filterStatus) data["status"] = filterStatus;
            getSchedules(data)
            .then(response => { 
                let edpCodesArr = []; 
                if(response.data.schedules) {
                    let sanitizedEdpCodes = searchEdpCodes.trim();
                    sanitizedEdpCodes = sanitizedEdpCodes.replace(/\s+/g, '');
                    if(sanitizedEdpCodes !== "") {
                        sanitizedEdpCodes = sanitizedEdpCodes.split(",");
                        sanitizedEdpCodes = Array.isArray(sanitizedEdpCodes) ? sanitizedEdpCodes : [sanitizedEdpCodes];
                        const retData = response.data.schedules;
                        const withSplitCodes = retData.filter(schedule => sanitizedEdpCodes.includes(schedule.split_code)).map(sched => { return sched.edpcode });
                        edpCodesArr = [...withSplitCodes, ...sanitizedEdpCodes];
                    }                   
                }
                this.setState({
                    searchEdpCodesArr: edpCodesArr,
                }, () => this.getFilteredSchedules());
            });
        }
        else this.getFilteredSchedules();
    }
    handleActionButtonClick = (type, e) => {
        
    }
    getFilteredSchedules = () => {
        const { searchSubject, searchEdpCodesArr , filterCourse, filterSection, filterStatus, rowsPerPage, pageNum } = this.state;
       if(filterCourse) {            
            let dataSchedAll = {
                course_code: filterCourse,
                department_abbr: "",
                year_level: 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                gen_ed: "",
                sort: 0,
                page: 1,
                limit: 0, 
                no_nstp: 0, no_pe: 0     
            }
            if(filterStatus) dataSchedAll["status"] = filterStatus;
            let nstpAndPECommon = {
                course_code: "",
                department_abbr: "",
                year_level: 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                gen_ed: "",
                sort: 0,
                page: 1,
                limit: 0,
                no_nstp: 1, no_pe: 1  
            }
            if(filterStatus) nstpAndPECommon["status"] = filterStatus;
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            }; 
            const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, dataSchedAll, {headers});
            const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, nstpAndPECommon, {headers});
            Promise.all([apiRequest1, apiRequest2]).then(values =>  {  
                const combinedScheds = [...values[0].data.schedules, ...values[1].data.schedules];
                //console.log(values[1].data.schedules)  
                this.setState({                    
                    filteredSchedules: combinedScheds.slice((pageNum - 1) * rowsPerPage, pageNum * rowsPerPage),
                    totalRowsCount: combinedScheds.length
                });
            }).catch(error => {
                console.log(error);
            });      
        }
        else {
            this.setState({
                filteredSchedules: null,
                totalRowsCount: 0
            });
        }

    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e,
            selectedSchedules: [],
        }, () => this.getFilteredSchedules());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            rowsPerPage: e
        }, () => this.getFilteredSchedules());
    }
    render() {
        if (!["EDP", "ADMIN"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { 
            searchEdpCodes, searchSubject, filterCourse, filterSection,
            courses, sections, filteredSchedules, filterStatus, totalRowsCount, rowsPerPage, pageNum
        } = this.state;
        
        const loadSchedules = filteredSchedules ? filteredSchedules.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const splitSchedules = schedule.split_type === "S" ? filteredSchedules.filter(sched => sched.split_code === schedule.edpcode && sched.split_type!=="S") : "";
            const splitEdpCodes = splitSchedules ? splitSchedules.map(schedule => {
                return schedule.edpcode
            }) : "";
            let classSizeColorIndicator = "";
            if(((schedule.size / schedule.max_size) * 100) >= 90  ) classSizeColorIndicator = "has-background-danger-light";
            if(schedule.size === schedule.max_size) classSizeColorIndicator = "has-background-danger-dark";
            const selectedEdpCodes = splitEdpCodes ? [...splitEdpCodes, schedule.edpcode] : [schedule.edpcode];
            return (
                <Fragment key={index}>
                <tr className={classSizeColorIndicator}>
                    <th className="is-narrow" ></th>
                    <td className="valign is-narrow">{schedule.edpcode}</td>
                    <td className="valign">
                        <span className="has-tooltip-arrow has-tooltip-multiline" data-tooltip={schedule.descriptive_title.trim()}>
                        {schedule.subject_name}
                        </span>
                    </td>
                    <td className="valign has-text-centered">{schedule.subject_type}</td>
                    <td className="valign has-text-centered">{schedule.units}</td>
                    <td className="valign has-text-right">{schedule.days}</td>
                    <td className="valign has-text-right">{schedule.begin_time} - {schedule.end_time} {schedule.mdn}</td>
                    <td className="valign has-text-centered">{schedule.room}</td>
                    <td className="valign has-text-centered is-narrow">{schedule.max_size}</td>
                    <td className="valign has-text-centered is-narrow">{schedule.size}</td>
                    <td className="valign has-text-centered is-narrow">{schedule.official_enrolled}</td>
                    <td className="valign has-text-centered is-narrow">{schedule.pending_enrolled}</td>
                    <td className="valign has-text-centered">{schedule.section}</td> 
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>
                    <td>
                        <div className="tag is-small is-info is-clickable" onClick={() => this.handleActionButtonClick("edit", selectedEdpCodes)}>Edit</div>                                              
                    </td>
                </tr>
                {
                    splitSchedules ? splitSchedules.map((split, index) => {
                        return(
                            <tr key={index} className="has-background-link-light">
                                <th className="is-narrow has-text-right pt-0 pb-0"><i className="fas fa-caret-right"></i></th>
                                <td className="valign is-narrow pt-0 pb-0">{split.edpcode}</td>
                                <td className="valign pt-0 pb-0">{split.subject_name}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.subject_type}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.units}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.days}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.begin_time} - {split.end_time} {split.mdn}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.room}</td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.max_size}</td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.size}</td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.official_enrolled}</td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.pending_enrolled}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.section}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.course_abbr}</td>
                                <td></td>
                            </tr>
                        )
                    }) : <tr></tr>
                }
                </Fragment>   
            )
        }) : "";
        return (
                <Fragment>
                    <div className="columns">
                        <div className="column is-three-quarters-widescreen">
                            <SearchSubjectPanel 
                                edpcodes={searchEdpCodes}
                                subject={searchSubject}
                                course={filterCourse}
                                section={filterSection}
                                status={filterStatus}
                                courses={courses}
                                sections={sections}
                                module="EditSchedule"
                                handleOnchangeInput={this.handleOnchangeInput} 
                                handleOnSearchEvent={this.handleOnSearchEvent}
                            />
                        </div>
                    </div>                                             
                    <div className="columns">
                        <div className="column is-three-quarters-widescreen">
                            <article className="message mb-0 is-small">
                                <div className="message-header">
                                    <p>Search Results</p>                                
                                    <button className="is-small p-0" aria-label="delete">
                                        <span className="icon is-small">
                                        <i className="fas fa-minus"></i>
                                        </span>
                                    </button>
                                </div>
                                <div className="message-body p-0">
                                    <div className="table-container">
                                        <table className="table is-striped is-fullwidth is-hoverable">
                                            <thead>
                                                <tr>
                                                    <th className="is-narrow"></th>
                                                    <th className="is-narrow">EDP Code</th>
                                                    <th>Subject</th>
                                                    <th className="has-text-centered">Type</th>
                                                    <th className="has-text-centered">Units</th>
                                                    <th className="has-text-right">Days</th>
                                                    <th className="has-text-right">Time</th>
                                                    <th className="has-text-centered">Room</th>
                                                    <th className="has-text-centered is-narrow">Max Size</th>
                                                    <th className="has-text-centered is-narrow">Size</th>
                                                    <th className="has-text-centered is-narrow">Official</th>
                                                    <th className="has-text-centered is-narrow">Pending</th>
                                                    <th className="has-text-centered">Section</th>
                                                    <th className="has-text-centered">Course</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="4"></th>
                                                    <th></th><th></th><th></th><th></th><th></th><th></th>
                                                    <th></th><th></th><th></th><th></th><th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                { loadSchedules ? loadSchedules : (    
                                                        <tr>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td>
                                                        </tr>
                                                    )
                                                }                                                                                                                                      
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </article>                                  
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <PaginateRecords
                                totalRowsCount={totalRowsCount} 
                                rowsPerPage={rowsPerPage}
                                pageNum={pageNum}
                                handleOnClickPage={this.handleOnChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                    </div> 
                </Fragment>       
        );
    }

}

export default withRouter(EditSchedule)