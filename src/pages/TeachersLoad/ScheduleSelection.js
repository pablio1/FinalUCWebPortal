import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import SearchSubjectPanel from '../../components/elements/SearchSubjectPanel';
import PaginateRecords from '../../components/elements/PaginateRecords';
import ClassListTable from '../../components/elements/ClassListTable';
import { getLoggedUserDetails, sortArrayObjectsByProp, conflictChecker } from '../../helpers/helper';
import { getSchedules, getSections, getCourses, getClassList } from '../../helpers/apiCalls';

class ScheduleSelection extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            filterStatus: 9, searchEdpCodes: '', searchEdpCodesArr: [], searchSubject: '', filterCourse: '', filterSection: '', checkAll: false,
            filteredSchedules: null, selectedSchedulesEdpCodes: [], selectedEdpCodes: [], currentCollege: '', totalRowsCount: 0, pageNum: 1, rowsPerPage: 20,
            courses: null, sections: null, genEd: '', userType: '', no_nstp: 0, no_pe: 0,
            showModal: false, selectedEdpCodeClassList: '', edpCode: '', subjectName: '', schedule: '', units: '', officiallyEnrolled: null, pendingEnrolled: null, notAccepted: null,
            showConflictError: false, errorMsg: '',
        }
    }
    componentDidMount = () => {  
        const { cookies } = this.props;
        this.setState({
            currentCollege: getLoggedUserDetails("courseabbr"),
            userType: getLoggedUserDetails("usertype")          
        }, () => {    
            //let data = { department_abbr: "" }
            //if(["ACAD"].includes(this.state.userType) && this.state.currentCollege !== "SHS") data = { department: "CL" }
            const data = (this.state.currentCollege === "SHS") ? { department: "SH", active_term: cookies.get("selterm") } : { department: "CL", active_term: cookies.get("selterm") };
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
                    courses: this.state.currentCollege === "XX" ? [...response.data.colleges, collegeForXX] : response.data.colleges,
                    no_nstp: this.state.currentCollege === "XX" ? 1 : 0,
                    no_pe: this.state.currentCollege === "XX" ? 1 : 0
                }, () => {
                    this.getFilteredSchedules()
                });
            });         
        });    
    }
    handleOnchangeInput = (key, value) => { 
        const { cookies } = this.props; 
        this.setState({
            [key] : value
        }, () => {
            if(key === "filterCourse") {
                getSections({ course_code: value, active_term: cookies.get("selterm") })
                .then(response => { 
                    if(value) {
                        if(response.data && response.data.section){
                            const sortedSection = sortArrayObjectsByProp(response.data.section, "section")           
                            this.setState({
                                sections: sortedSection,
                                pageNum: 1,
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
            const data = {
                course_code: filterCourse,
                year_level: filterSection && currentCollege !== "SHS" ? filterSection.substring(0, 1) : 0,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                status: filterStatus,
                gen_ed: genEd,    
                sort: 0,
                page: this.state.pageNum,
                limit: this.state.rowsPerPage,  
                active_term: cookies.get("selterm")   
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
                        const retData = parseInt(filterStatus, 10) > 0 ? response.data.schedules.filter(schedule => schedule.status > 0 ) : response.data.schedules;
                        console.log(response.data.schedules)
                        console.log(response.data.schedules.filter(schedule => schedule.status > 0 ))
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
    handleCheckBoxChange = e => {
        const { selectedSchedulesEdpCodes, checkAll, filteredSchedules } = this.state;
        if(selectedSchedulesEdpCodes) {
            if(e === "all") {
                if(!checkAll) {
                    const allSelectedEdpCodes = filteredSchedules.map((schedule, index) => {
                        return schedule.edpcode
                    });
                    this.setState({
                        selectedSchedulesEdpCodes: allSelectedEdpCodes,
                        checkAll: true, 
                    })
                }
                else {
                    this.setState({
                        selectedSchedulesEdpCodes: [],
                        checkAll: false, 
                    }) 
                }
            }
            else {
                if(e.every(code => selectedSchedulesEdpCodes.includes(code))) {
                //if(selectedSchedulesEdpCodes.includes(e.join())) {  
                    this.setState({
                        selectedSchedulesEdpCodes: selectedSchedulesEdpCodes.filter(edpCode => !e.includes(edpCode)),
                        checkAll: false, 
                    });
                }
                else {
                    this.setState({
                        selectedSchedulesEdpCodes: [...selectedSchedulesEdpCodes, ...e],                        
                    });
                }
            }
        }
    }
    handleLoadScheduleBtn = (e) => {
        /*const { selectedSchedulesEdpCodes, filteredSchedules } = this.state;
        const setStatus = type === "deploy" ? 1 : 0; 
        //const statusLabel = { undeployed: 0, deployed: 1, dissolve: 2, requested: 3, deferred: 4, all: 9 } 
        let data = null;
        if(e === "selected") data = { edp_code: selectedSchedulesEdpCodes, status: setStatus } //from selected checkboxes
        else data = { edp_code: e, status: setStatus } //From row deploy button   
        //console.log(data);
        updateScheduleStatus(data)           
        .then(response => {
            if(response.data.success) {
                const newFilteredSchedules = e === "selected" ? 
                filteredSchedules.filter(schedule => !selectedSchedulesEdpCodes.includes(schedule.edpcode)) : 
                filteredSchedules.filter(schedule =>  !e.includes(schedule.edpcode));
                this.setState({    
                    filteredSchedules: newFilteredSchedules,
                    selectedSchedulesEdpCodes: [],
                    checkAll: false, 
                });
                let confirmMsg = "Schedule deployment is successfull.";
                if(type === "undeploy") confirmMsg = "Schedule has been undeployed."
                alert(confirmMsg);   
            }
            else {
                this.setState({    
                    selectedSchedulesEdpCodes: [],
                    checkAll: false, 
                });
                let errorMsg = " deployment ";
                if(type === "undeploy") errorMsg = " Un-deployed ";
                alert("Schedule " + errorMsg + " failed! Please try again and if the issue persist, kindly contact the EDP Office.");               
            }
        });*/
    }
    handleOnAddSchedule = e => {
        const teachersLoad = this.props.teachersLoad ? this.props.teachersLoad : [];
        const { filteredSchedules, selectedSchedulesEdpCodes } = this.state;
 
        const addedSchedules = (e === "selected") ? 
            filteredSchedules.filter(schedule => selectedSchedulesEdpCodes.includes(schedule.edpcode)) : 
            filteredSchedules.filter(schedule => e.includes(schedule.edpcode));

        let conflictCheck = [false, ""];
        addedSchedules.forEach(schedule => {
            const retCheck = conflictChecker(teachersLoad, schedule);            
            if(retCheck[0]) conflictCheck = [true, retCheck[1]];
        });

        if(conflictCheck[0]) {
            const confirmMsg = conflictCheck[1] + ". Is this a Parallel Schedule? If Yes click OK to add to the load otherwise Cancel to discontinue adding.";
            if(window.confirm(confirmMsg)) {
                const updatedTeachersLoad = [...teachersLoad, ...addedSchedules];
                this.props.updateLoadView(updatedTeachersLoad)
            }
            else {
                this.setState({
                    showConflictError: true,
                    errorMsg: conflictCheck[1]
                }); 
            }
        }
        else {
            const updatedTeachersLoad = [...teachersLoad, ...addedSchedules];
            this.props.updateLoadView(updatedTeachersLoad)
        }  
    }
    getFilteredSchedules = () => {
        const { cookies } = this.props;
        const { searchSubject, searchEdpCodesArr , filterCourse, filterSection, filterStatus, genEd, currentCollege, pageNum, rowsPerPage } = this.state;          
            const data = {
                course_code: filterCourse,
                year_level: filterSection && currentCollege !== "SHS" ? filterSection.substring(0, 1) : 0,
                department_abbr: currentCollege === "SHS" ? "SHS" : "",
                edp_codes: searchEdpCodesArr,
                subject_name: searchSubject.toUpperCase(),
                section: filterSection,
                status: filterStatus,
                gen_ed: genEd,
                sort: 0,
                page: pageNum,
                limit: rowsPerPage, 
                active_term: cookies.get("selterm")     
            };
            getSchedules(data)
            .then(response => {        
                this.setState({
                    filteredSchedules: response.data.schedules,
                    totalRowsCount: response.data.count
                });
            });       
    }
    handleOnChangePage = e => {
        this.setState({
            pageNum: e,
            selectedSchedulesEdpCodes: [],
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
    toggleShowErrors = e => {
        this.setState({
            showConflictError: e
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
        const { 
            searchEdpCodes, searchSubject, filterCourse, filterSection, showConflictError, errorMsg, showModal,
            selectedSchedulesEdpCodes, checkAll, courses, sections, filteredSchedules, filterStatus, totalRowsCount, rowsPerPage, pageNum,
            edpCode, subjectName, schedule, units, officiallyEnrolled, pendingEnrolled, notAccepted
        } = this.state;
        const { teachersLoad } = this.props;
        const schedStatusLabel = { 0: "Undeployed", 1: "Deployed", 2: "Dissolved", 3: "Requested", 4: "Deferred", 5: "Closed" };
        const loadSchedules = filteredSchedules ? filteredSchedules.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const splitSchedules = schedule.split_type === "S" ? filteredSchedules.filter(sched => sched.split_code === schedule.edpcode && sched.split_type!=="S") : "";
            const splitEdpCodes = splitSchedules ? splitSchedules.map(schedule => {
                return schedule.edpcode
            }) : "";
            let classSizeColorIndicator = "";
            if(((parseInt(schedule.size, 10) / parseInt(schedule.max_size, 10)) * 100) >= 90  ) classSizeColorIndicator = "has-background-danger-light";
            if(parseInt(schedule.size, 10) >= parseInt(schedule.max_size, 10)) classSizeColorIndicator = "has-background-danger-dark has-text-weight-bold";
            const selectedEdpCodes = splitEdpCodes ? [...splitEdpCodes, schedule.edpcode] : [schedule.edpcode];
            const scheduleInTeachersLoad = teachersLoad ? teachersLoad.filter(sched => (sched.hasOwnProperty("edpcode") ? sched.edpcode : sched.edp_code) === schedule.edpcode) : [];
            let selected = false;
            if(checkAll) selected = true;
            else {
                if(selectedSchedulesEdpCodes.includes(schedule.edpcode)) selected = true;
            }
            let loadActionBtn = <div className="tag is-small is-info is-clickable" onClick={() => this.handleOnAddSchedule(selectedEdpCodes)}>Load</div>;
            let loadCheckBox = <input type="checkbox" checked={selected} onChange={() => this.handleCheckBoxChange(selectedEdpCodes)} /> ;
            if(schedule.instructor.trim().length > 1) {
                loadActionBtn = "";
                loadCheckBox = "";
            }
            if(scheduleInTeachersLoad.length > 0) {
                loadActionBtn = <div className="tag is-small is-light" disabled={true}>Loaded</div>;
                loadCheckBox = <input type="checkbox" checked={false} disabled={true}/>
            }
            return (
                <Fragment key={index}>
                <tr className={classSizeColorIndicator}>
                    <th className="is-narrow" >
                        {/*loadCheckBox*/}                        
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
                    <td className="valign has-text-centered">{schedStatusLabel[schedule.status]}</td>
                    <td className="valign">{schedule.instructor}</td>
                    <td>
                        <div className="tags">
                            <div className="tag is-small is-info is-clickable" onClick={() => this.handleOpenClassList(schedule.edpcode)}><i className="fas fa-clipboard-list"></i></div>                           
                            {loadActionBtn}  
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
                                <td className="valign has-text-centered pt-0 pb-0">{schedStatusLabel[schedule.status]}</td>
                                <td></td>
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
                    <div className={"modal " + (showConflictError ?  "is-active " : "")}>
                        <div className="modal-background" onClick={() => this.toggleShowErrors(false)}></div>
                        <div className="modal-content">
                            <div className="notification is-danger">
                                <button className="delete" onClick={() => this.toggleShowErrors(false)}></button>
                                <span className="icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </span>
                                <strong>Schedule Conflicts Detected!</strong> <br />
                                {
                                    errorMsg ? errorMsg : ""
                                }                                
                            </div>
                        </div>                        
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
                                module="TeachersLoading"
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
                                                        {/*<input type="checkbox" checked={checkAll} onChange={() => this.handleCheckBoxChange("all")} 
                                                        disabled={filteredSchedules && filteredSchedules.length > 0 ? false : true}/> */}
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
                                                    <th className="has-text-centered">Status</th>
                                                    <th className="has-text-centered">Instructor</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="4">
                                                        {/*                                    
                                                        <div className="button is-small is-success" 
                                                             disabled={selectedSchedulesEdpCodes.length > 0 ? false : true}
                                                             onClick={() => this.handleOnAddSchedule("selected")}>
                                                            Load Selected Subjects
                                                        </div>
                                                        */}                                                                                                             
                                                    </th>
                                                    <th></th><th></th><th></th><th></th><th></th><th></th>
                                                    <th></th><th></th><th></th><th></th><th></th><th></th><th></th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                { loadSchedules ? loadSchedules : (    
                                                        <tr>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td>
                                                            <td></td><td></td><td></td><td></td><th></th>
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

export default withCookies(ScheduleSelection)


