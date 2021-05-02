import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import store from 'store2';

import SearchSubjectPanel from '../../components/elements/SearchSubjectPanel';
import PaginateRecords from '../../components/elements/PaginateRecords';
import ClassListTable from '../../components/elements/ClassListTable';
import { getLoggedUserDetails, sortArrayObjectsByProp, getSplitCodePair } from '../../helpers/helper';
import { updateScheduleStatus, getSchedules, getSections, getCourses, getClassList } from '../../helpers/apiCalls';

class Schedules extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'undeployed', filterStatus: 0, searchEdpCodes: '', searchEdpCodesArr: [], searchSubject: '', filterCourse: '', filterSection: '', checkAll: false,
            filteredSchedules: null, selectedSchedules: [], currentCollege: '', totalRowsCount: 0, pageNum: 1, rowsPerPage: 20,
            courses: null, sections: null, genEd: '', userType: '', no_nstp: 0, no_pe: 0,
            showModal: false, selectedEdpCodeClassList: '', edpCode: '', subjectName: '', schedule: '', units: '', officiallyEnrolled: null, pendingEnrolled: null, notAccepted: null
        }
    }
    componentDidMount = () => { 
        const { cookies } = this.props; 
        this.setState({
            currentCollege: getLoggedUserDetails("courseabbr"),
            userType: getLoggedUserDetails("usertype")           
        }, () => {
            let data = { department_abbr: this.state.currentCollege, active_term: cookies.get("selterm") }
            if(["ACAD"].includes(this.state.userType) && this.state.currentCollege !== "SHS") data = { department: "CL", active_term: cookies.get("selterm") }
            const collegeForXX = {
                college_id: 0,
                college_name: "NSTP/PE - For Shared NSTP & PE",
                college_code: "XX",
                year_limit: 5,
                department: "CL"
              }
            getCourses(data)
            .then(response => {
                this.setState({  
                    courses: this.state.currentCollege === "XX" ? [collegeForXX] : response.data.colleges,
                    no_nstp: this.state.currentCollege === "XX" ? 1 : 0,
                    no_pe: this.state.currentCollege === "XX" ? 1 : 0
                }, () => this.getFilteredSchedules());
            });          
        });    
    }
    handleOnClickTab = e => {
        const statusLabel = { undeployed: 0, deployed: 1, dissolve: 2, requested: 3, deferred: 4, all: 9 } 
        this.setState({
            selectedTab: e,
            filterStatus: statusLabel[e] > 0 ? 9 : 0,
            pageNum: 1
        }, () => this.getFilteredSchedules());
    }
    handleOnchangeInput = (key, value) => { 
        const { cookies } = this.props; 
        this.setState({
            [key] : value
        }, () => {
            if(key === "filterCourse") {
                getSections({ college_abbr: this.state.currentCollege, course_code: value, active_term: cookies.get("selterm") })
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
                            pageNum: 1,
                            rowsPerPage: 20
                        }, () => this.getFilteredSchedules()); 
                    }
                });
            }
            if(key === "filterStatus") {
                
            }
            if(key === "filterSection" || key === 'filterStatus') {
                this.setState({
                    pageNum: 1,
                }, () => this.getFilteredSchedules()); 
            }
        });
    }
    handleOnSwitchGened = e => {
        if(e) {
            const genEdStatusArr = getLoggedUserDetails("gened"); 
            this.setState({
                genEd: genEdStatusArr.length > 0 ? genEdStatusArr.join() : "1"
            }, () => this.getFilteredSchedules());
        }
        else {
            this.setState({
                genEd: ""
            }, () => this.getFilteredSchedules());
        }        
    }
    handleOnSearchEvent = e => {
        const { cookies } = this.props;
        if(e.target.name === "searchEdpCodes") {
            const { searchSubject, filterCourse, filterSection, filterStatus, searchEdpCodes, genEd, currentCollege } = this.state;
            /*const data = {
                course_code: filterCourse,
                year_level: filterSection && currentCollege !== "SHS" ? filterSection.substring(0, 1) : 0,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                status: filterStatus,
                gen_ed: genEd,    
                sort: 0,
                page: this.state.pageNum,
                limit: this.state.rowsPerPage,     
            };
            getSchedules(data)
            .then(response => { 
                let edpCodesArr = []; 
                if(response.data.schedules) {                    
                    let sanitizedEdpCodes = searchEdpCodes.trim();
                    sanitizedEdpCodes = sanitizedEdpCodes.replace(/\s+/g, '');
                    if(sanitizedEdpCodes !== "") {
                        sanitizedEdpCodes = sanitizedEdpCodes.split(",");
                        sanitizedEdpCodes = Array.isArray(sanitizedEdpCodes) ? sanitizedEdpCodes : [sanitizedEdpCodes];
                        const retData = parseInt(filterStatus, 10) > 0 ? response.data.schedules.filter(schedule => schedule.status !== 0 ) : response.data.schedules;
                        const withSplitCodes = retData.filter(schedule => sanitizedEdpCodes.includes(schedule.split_code)).map(sched => { return sched.edpcode });
                        edpCodesArr = [...withSplitCodes, ...sanitizedEdpCodes];
                    }                   
                }
                this.setState({
                    searchEdpCodesArr: edpCodesArr,
                }, () => this.getFilteredSchedules());
            }); */
            let sanitizedEdpCodes = searchEdpCodes.trim();
            sanitizedEdpCodes = sanitizedEdpCodes.replace(/\s+/g, '');
            if(sanitizedEdpCodes !== "") {
                const dataSchedAll = {
                    course_code: filterCourse,
                    department_abbr: "",
                    year_level: filterSection && currentCollege !== "SHS" ? filterSection.substring(0, 1) : 0,
                    subject_name: searchSubject.toUpperCase(),
                    section: filterSection,
                    status: 9, 
                    sort: 0, gen_ed: "", page: 1, limit: 0, no_nstp: 0, no_pe: 0, edp_codes: [],
                    active_term: cookies.get("selterm")
                }
                const nstpAndPECommon = {
                    course_code: filterCourse,
                    department_abbr: "",
                    year_level: 0,
                    subject_name: searchSubject.toUpperCase(),
                    section: "", status: 9, sort: 0, gen_ed: "", page: 1, limit: 0, 
                    no_nstp:  1, 
                    no_pe: 1,
                    edp_codes: [],
                    active_term: cookies.get("selterm")   
                }     
                const headers = { 
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Bearer ' + store.get("token")
                }; 
                const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, dataSchedAll, {headers});
                const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_GET_SCHEDULES, nstpAndPECommon, {headers});
                Promise.all([apiRequest1, apiRequest2]).then(values =>  { 
                    let allWithSelectedScheds = null;          
                    if (currentCollege === "SHS") allWithSelectedScheds = values[0].data.schedules;   
                    else { 
                        const edpCodes = new Set(values[0].data.schedules.map(schedule => schedule.edpcode));
                        allWithSelectedScheds = [...values[0].data.schedules, ...values[1].data.schedules.filter(schedule => !edpCodes.has(schedule.edpcode))];
                    }                               

                    sanitizedEdpCodes = sanitizedEdpCodes.split(",");
                    sanitizedEdpCodes = Array.isArray(sanitizedEdpCodes) ? sanitizedEdpCodes : [sanitizedEdpCodes];
                    console.log(sanitizedEdpCodes)
                    let withSplitCodes = [];
                    sanitizedEdpCodes.forEach((schedule, index) => {
                        withSplitCodes = [...withSplitCodes, ...getSplitCodePair(allWithSelectedScheds, schedule)];
                    })
                    this.setState({
                        searchEdpCodesArr: [...withSplitCodes, ...sanitizedEdpCodes],
                        pageNum: 1,
                    }, () => this.getFilteredSchedules());
                }).catch(error => {
                    console.log(error);
                });
            }
            this.setState({
                searchEdpCodesArr: [],
                pageNum: 1,
            }, () => this.getFilteredSchedules());
        }
        else this.getFilteredSchedules();
    }
    handleCheckBoxChange = e => {
        const { selectedSchedules, checkAll, filteredSchedules } = this.state;
        if(selectedSchedules) {
            if(e === "all") {
                if(!checkAll) {
                    const allSelectedEdpCodes = filteredSchedules.map((schedule, index) => {
                        return schedule.edpcode
                    });
                    this.setState({
                        selectedSchedules: allSelectedEdpCodes,
                        checkAll: true, 
                    })
                }
                else {
                    this.setState({
                        selectedSchedules: [],
                        checkAll: false, 
                    }) 
                }
            }
            else {
                if(e.every(code => selectedSchedules.includes(code))) {
                //if(selectedSchedules.includes(e.join())) {  
                    this.setState({
                        selectedSchedules: selectedSchedules.filter(edpCode => !e.includes(edpCode)),
                        checkAll: false, 
                    });
                }
                else {
                    this.setState({
                        selectedSchedules: [...selectedSchedules, ...e],                        
                    });
                }
            }
        }
    }
    handleActionButtonClick = (type, e) => {
        const { cookies } = this.props;
        const { selectedSchedules, filteredSchedules } = this.state;
        const setStatus = type === "deploy" ? 1 : 0; 
        //const statusLabel = { undeployed: 0, deployed: 1, dissolve: 2, requested: 3, deferred: 4, all: 9 } 
        let data = null;
        if(e === "selected") data = { edp_code: selectedSchedules, status: setStatus, active_term: cookies.get("selterm") } //from selected checkboxes
        else data = { edp_code: e, status: setStatus, active_term: cookies.get("selterm") } //From row deploy button   
        //console.log(data);
        updateScheduleStatus(data)           
        .then(response => {
            if(response.data.success) {
                const newFilteredSchedules = e === "selected" ? 
                filteredSchedules.filter(schedule => !selectedSchedules.includes(schedule.edpcode)) : 
                filteredSchedules.filter(schedule =>  !e.includes(schedule.edpcode));
                this.setState({    
                    filteredSchedules: newFilteredSchedules,
                    selectedSchedules: [],
                    checkAll: false, 
                });
                let confirmMsg = "Schedule deployment is successfull.";
                if(type === "undeploy") confirmMsg = "Schedule has been undeployed."
                alert(confirmMsg);   
            }
            else {
                this.setState({    
                    selectedSchedules: [],
                    checkAll: false, 
                });
                let errorMsg = " deployment ";
                if(type === "undeploy") errorMsg = " Un-deployed ";
                alert("Schedule " + errorMsg + " failed! Please try again and if the issue persist, kindly contact the EDP Office.");               
            }
        });
    }
    getFilteredSchedules = () => {
        const { cookies } = this.props;
        const { searchSubject, searchEdpCodesArr , filterCourse, filterSection, filterStatus, genEd, currentCollege, no_nstp, no_pe, userType } = this.state;
        if(filterCourse) {            
            const data = {
                course_code: filterCourse,
                year_level: filterSection && currentCollege !== "SHS" ? filterSection.substring(0, 1) : 0,
                edp_codes: searchEdpCodesArr,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                status: filterStatus,
                gen_ed: genEd,
                sort: 0,
                page: this.state.pageNum,
                limit: this.state.rowsPerPage,  
                no_nstp: no_nstp,
                no_pe: no_pe,
                active_term: cookies.get("selterm")     
            };
            getSchedules(data)
            .then(response => {  
                const filteredSchedules = parseInt(filterStatus, 10) > 0 ? response.data.schedules.filter(schedule => schedule.status !== 0 ) : response.data.schedules;        
                this.setState({
                    filteredSchedules: filteredSchedules,
                    totalRowsCount: response.data.count
                });
            });       
        }
        else {
            this.setState({
                filteredSchedules: null,
            });
        }
    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e,
            selectedSchedules: [],
            checkAll: false, 
        }, () => this.getFilteredSchedules());
    }
    handleChangeRowsPerPage = e => {
        this.setState({
            rowsPerPage: e
        }, () => this.getFilteredSchedules());
    }
    closeModal = () => {
        this.setState({
            showModal: false
        })
    }
    handleOpenClassList = e => {
        const { cookies } = this.props;
        if(e) {
            this.setState({
                selectedEdpCodeClassList: e,
                showModal: true
            }, () => {
                getClassList(this.state.selectedEdpCodeClassList, cookies.get("selterm"))
                .then(response => {
                    if(response.data) {
                        const data = response.data;                    
                        this.setState({
                            edpCode: data.edp_code, 
                            subjectName: data.subject_name, 
                            schedule: data.time_info, 
                            units: data.units, 
                            officiallyEnrolled: data.official_enrolled.length > 0 ? data.official_enrolled : null, 
                            pendingEnrolled: data.pending_enrolled.length > 0 ? data.pending_enrolled : null, 
                            notAccepted: data.not_accepted.length > 0 ? data.not_accepted : null
                        });
                    }
                    else {
                        alert("No records found. Please try again.");
                    }
                });
            })
        }
    }
    render() {
        if (!["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { 
            selectedTab, searchEdpCodes, searchSubject, filterCourse, filterSection, userType, currentCollege, showModal,
            selectedSchedules, checkAll, courses, sections, filteredSchedules, filterStatus, totalRowsCount, rowsPerPage, pageNum,
            edpCode, subjectName, schedule, units, officiallyEnrolled, pendingEnrolled, notAccepted
        } = this.state;
        
        const loadSchedules = filteredSchedules ? filteredSchedules.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const splitSchedules = schedule.split_type === "S" ? filteredSchedules.filter(sched => sched.split_code === schedule.edpcode && sched.split_type!=="S") : "";
            const splitEdpCodes = splitSchedules ? splitSchedules.map(schedule => {
                return schedule.edpcode
            }) : "";
            let classSizeColorIndicator = "";
            if(((parseInt(schedule.size, 10) / parseInt(schedule.max_size, 10)) * 100) >= 90  ) classSizeColorIndicator = "has-background-danger-light";
            if(parseInt(schedule.size, 10) >= parseInt(schedule.max_size, 10)) classSizeColorIndicator = "has-background-danger-dark has-text-weight-bold";
            const selectedEdpCodes = splitEdpCodes ? [...splitEdpCodes, schedule.edpcode] : [schedule.edpcode];
            let loadActionBtn = "";
            if(filterStatus > 0) {
                if(schedule.size <= 0) {
                    loadActionBtn = <div className="tag is-small is-primary is-clickable" onClick={() => this.handleActionButtonClick("undeploy", selectedEdpCodes)}>Undeploy</div>;
                }
                else if(["MV", "MM"].includes(schedule.course_code)) {
                    loadActionBtn = <div className="tag is-small is-primary is-clickable" onClick={() => this.handleActionButtonClick("undeploy", selectedEdpCodes)}>Undeploy</div>;
                }            
            }
            else {
                loadActionBtn =  <div className="tag is-small is-info is-clickable" onClick={() => this.handleActionButtonClick("deploy", selectedEdpCodes)}>Deploy</div>;
            }
            let selected = false;
            if(checkAll) selected = true;
            else {
                if(selectedSchedules.includes(schedule.edpcode)) selected = true;
            }
            return (
                <Fragment key={index}>
                <tr className={classSizeColorIndicator}>
                    <th className="is-narrow" >
                        {
                            filterStatus > 0 ? "" : <input type="checkbox" checked={selected} onChange={() => this.handleCheckBoxChange(selectedEdpCodes)} />
                        }
                    </th>
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
                    <td className="valign has-text-centered is-narrow">
                        <h4 className="has-text-weight-semibold is-size-7 is-clickable" onClick={() => this.handleOpenClassList(schedule.edpcode)}>{schedule.size}</h4>
                    </td>
                    <td className="valign has-text-centered is-narrow">{schedule.official_enrolled}</td>
                    <td className="valign has-text-centered is-narrow">{schedule.pending_enrolled}</td>
                    <td className="valign has-text-centered">{schedule.section}</td> 
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>
                    <td className="valign is-narrow">{schedule.instructor}</td>
                    <td>
                        <div className="tags">
                            <div className="tag is-small is-info is-clickable" onClick={() => this.handleOpenClassList(schedule.edpcode)}><i className="fas fa-clipboard-list"></i></div>                           
                            {userType === "DEAN" || userType === "CHAIRPERSON" || (userType === "ACAD" && currentCollege === "XX") ? loadActionBtn : ""}  
                        </div>                                                 
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
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">                                    
                                    <h4 className="has-text-weight-semibold is-size-7 is-clickable" onClick={() => this.handleOpenClassList(split.edpcode)}>{split.size}</h4>
                                </td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.official_enrolled}</td>
                                <td className="valign has-text-centered pt-0 pb-0 is-narrow">{split.pending_enrolled}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.section}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.course_abbr}</td>
                                <td className="valign is-narrow pt-0 pb-0">{split.instructor}</td>
                                <td></td>
                            </tr>
                        )
                    }) : <tr></tr>
                }
                </Fragment>   
            )
        }) : "";
        return (
                <div className="box ml-1">
                    <div className={"modal " + (showModal ?  "is-active " : "")}>
                        <div className="modal-background" onClick={this.closeModal}></div>
                        <div className="modal-content">
                            <ClassListTable 
                                edpCode={edpCode}
                                subjectName={subjectName}
                                schedule={schedule}
                                units={units}
                                officiallyEnrolled={officiallyEnrolled}
                                pendingEnrolled={pendingEnrolled}
                                notAccepted={notAccepted}
                            /> 
                        </div>
                        <button className="modal-close is-large" aria-label="close" onClick={this.closeModal}></button>
                    </div>
                    <div className="buttons has-addons is-centered">                
                        <button name="undeployed" className={"button " + (selectedTab === "undeployed" ? "is-info is-selected" : "")} 
                                onClick={() => this.handleOnClickTab("undeployed")}>
                            <span className="icon is-small">
                                <i className="fas fa-envelope-open-text"></i>
                            </span>
                            <span>Undeployed Subjects</span>
                        </button>
                        <button name="deployed" className={"button " + (selectedTab === "deployed" ? "is-info is-selected" : "")}
                                onClick={() => this.handleOnClickTab("deployed")}>
                            <span className="icon is-small">
                                <i className="fas fa-check-circle"></i>
                            </span>
                            <span>Deployed Subjects</span>
                        </button>                        
                    </div>  
                    <div className="">
                        <div className="divider is-size-6 mt-0 pt-0"></div>
                    </div>   
                    <div className="columns">
                        <div className="column">
                            <SearchSubjectPanel 
                                edpcodes={searchEdpCodes}
                                subject={searchSubject}
                                course={filterCourse}
                                section={filterSection}
                                status={filterStatus}
                                courses={courses}
                                sections={sections}
                                module="Schedules"
                                handleOnchangeInput={this.handleOnchangeInput} 
                                handleOnSearchEvent={this.handleOnSearchEvent}
                                handleOnChangeCheckBox={this.handleOnSwitchGened}
                            />
                        </div>
                    </div>                                             
                    <div className="columns">
                        <div className="column">
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
                                                    <th className="is-narrow">
                                                        {
                                                            filterStatus > 0 ? "" : 
                                                            <input type="checkbox" checked={checkAll} onChange={() => this.handleCheckBoxChange("all")} 
                                                            disabled={filteredSchedules && filteredSchedules.length > 0 ? false : true}/>
                                                        }
                                                    </th>
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
                                                    <th className="has-text-centered">Instructor</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="4">
                                                        {
                                                            filterStatus > 0 ? "" : 
                                                                ["DEAN", "CHAIRPERSON"].includes(userType) || (userType === "ACAD" && currentCollege === "XX") ? (
                                                                <div className="button is-small is-success" onClick={() => this.handleActionButtonClick("deploy", "selected")}>
                                                                    Deploy Selected Subjects
                                                                </div>
                                                                ) : ""                                                            
                                                        }                                                        
                                                    </th>
                                                    <th></th><th></th><th></th><th></th><th></th><th></th>
                                                    <th></th><th></th><th></th><th></th><th></th><th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                { loadSchedules ? loadSchedules : (    
                                                        <tr>
                                                            <td></td><td></td><td></td><th></th>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
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
                </div>       
        );
    }
}

export default withCookies(Schedules)


export class SchedulesHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="far fa-calendar-alt"></i> Schedules / Department
            </div> 
        );
    }   
}

