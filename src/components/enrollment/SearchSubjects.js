import React, { Component, Fragment } from 'react';

import SpinnerGif from '../../assets/sysimg/spinner.gif'

export default class SearchSubjects extends Component {

    handleOnChangeInput = e => {
        if(e.target.name === "searchByEDPCodes") {
            if(/^[0-9 _ ,]*$/.test(e.target.value)) {
                this.props.handleOnChangeInput(e);
            } 
        }
        else this.props.handleOnChangeInput(e);
    }
    handleKeyDown = e => {     
        if (e.key === 'Enter') {            
            this.props.handleOnSearchEvent(e);
        }
    }
    handleOnAddSchedule = e => {
        this.props.handleOnAddSchedule(e);
    }
    render() {   
        const { searchedSubjects, maxUnitsAllowed, searchByEDPCodes, searchBySubject, filterBySection, filterByCourse, courses, sections } = this.props;  
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{(course.college_name)}</option>
        }) : "";
        const sectionsOptions = sections ? sections.map((section, i) => {
            return <option key={i} value={section.section}>{section.section}</option>
        }) : "";   
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="25px" height="25px" />; 
        const showIcon = courses ? <i className="fas fa-book"></i> : SpinnerIcon;

        const loadSchedules = searchedSubjects ? searchedSubjects.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const splitSchedules = schedule.split_type === "S" ? searchedSubjects.filter(sched => sched.split_code === schedule.edpcode && sched.split_type!=="S") : "";
            const splitEdpCodes = splitSchedules ? splitSchedules.map(schedule => {
                return schedule.edpcode
            }) : "";
            const selectedEdpCodes = splitEdpCodes ? [...splitEdpCodes, schedule.edpcode] : [schedule.edpcode];
            const selectedSubjects = searchedSubjects.filter(sched => selectedEdpCodes.includes(sched.edpcode));
            return (
                <Fragment key={index}>
                <tr className="">
                    <td className="valign is-narrow">{schedule.edpcode}</td>
                    <td className="valign">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-right" data-tooltip={schedule.descriptive_title.trim()}>
                        {schedule.subject_name}
                        </span>
                    </td>
                    <td className="valign has-text-centered">{schedule.subject_type}</td>
                    <td className="valign has-text-centered">{schedule.units}</td>
                    <td className="valign has-text-right">{schedule.days}</td>
                    <td className="valign has-text-right">{schedule.begin_time} - {schedule.end_time} {schedule.mdn}</td>
                    <td className="valign has-text-centered">{schedule.room}</td>
                    <td className="valign has-text-centered">{schedule.section}</td>
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>                    
                    <td>
                        <div className="tag is-small is-info is-clickable" onClick={() => this.handleOnAddSchedule(selectedSubjects)}>
                            Add
                        </div>                                            
                    </td>
                </tr>
                {
                    splitSchedules ? splitSchedules.map((split, index) => {
                        return(
                            <tr key={index} className="has-background-link-light">
                                <td className="valign is-narrow pt-0 pb-0"><i className="fas fa-caret-right"></i> {split.edpcode}</td>
                                <td className="valign pt-0 pb-0">{split.subject_name}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.subject_type}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.units}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.days}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.begin_time} - {split.end_time} {split.mdn}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.room}</td>
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
        return(  
            <Fragment>    
                <div className="columns">                            
                    <div className="column pt-0 is-narrow">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Units Left</h5>
                        <div className="field">
                            <button className="button is-danger is-fullwidth is-small ">
                                <span className="has-text-weight-bold is-size-6 p-0">{maxUnitsAllowed}</span>
                            </button>                                   
                        </div>
                    </div>
                    <div className="column pt-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Course</h5>                        
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="filterByCourse" value={filterByCourse} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Course</option>
                                        {coursesOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {showIcon}
                                </span>
                            </div>
                        </div>   
                    </div>
                    <div className="column pt-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Section</h5>                         
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="filterBySection" value={filterBySection} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Section</option>
                                        {sectionsOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {showIcon}
                                </span>
                            </div>
                        </div>    
                    </div>
                    <div className="column pt-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Search by EDP Codes</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="searchByEDPCodes" className="input is-small" type="text" placeholder="Comma separated for multiple codes" 
                                    onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown}  value={searchByEDPCodes} data-fieldname="EDP Codes"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>   
                    </div>
                    <div className="column pt-0">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Search by Subject</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="searchBySubject" className="input is-small" type="text" placeholder="Search Subject" 
                                    onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} value={searchBySubject} data-fieldname="Subject"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>
                    </div>                                       
                </div>
                

                <article className="message mb-0 is-small">
                    <div className="message-header">
                        <p>Search Result</p>                                
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
                                        <th className="is-narrow">EDP Code</th>
                                        <th>Subject</th>
                                        <th className="has-text-centered">Type</th>
                                        <th className="has-text-centered">Units</th>
                                        <th className="has-text-right">Days</th>
                                        <th className="has-text-right">Time</th>
                                        <th className="has-text-centered">Room</th>
                                        <th className="has-text-centered">Section</th>
                                        <th className="has-text-centered">Course</th>                                        
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>  
                                        <td></td><td></td><td></td>
                                        <td></td><td></td><td></td>
                                        <td></td><td></td><td></td><td></td>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    { loadSchedules ? loadSchedules : (    
                                            <tr>
                                                <td></td><td></td><td></td>
                                                <td></td><td></td><td></td>
                                                <td></td><td></td><td></td><td></td>
                                            </tr>
                                        )
                                    }                                                                                                                                      
                                </tbody>
                            </table>
                        </div>
                    </div>
                </article>
            </Fragment>
        )
    }
}
