import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';

import { getTotalUnitsTaken, convertMilitaryToStandardTime } from '../../helpers/helper';

export default class SubjectsTable extends Component {
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e);
    }
    handleOnButtonClick = (e) => {
        this.props.handleOnButtonClick(e);
    }
    render() {    
        const { subjects, section, group} = this.props;
        let totalUnitsTaken = 0;
        const loadSubjects = subjects ? subjects.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const splitSchedules = schedule.split_type === "S" ? subjects.filter(sched => sched.split_code === schedule.edp_code && sched.split_type!=="S") : "";
            totalUnitsTaken = getTotalUnitsTaken(subjects);
            let isfull = schedule.size >= schedule.max_size ? <i className="fas fa-exclamation has-text-danger"></i> : "";
            return (
                <Fragment key={index}>
                <tr className={ schedule.size >= schedule.max_size ? "has-background-danger-light" : ""}> 
                    <td className="valign has-text-centered is-narrow">{isfull}</td>                 
                    <td className="valign is-narrow">{schedule.edp_code}</td>
                    <td className="valign">
                        <span className="has-tooltip-arrow has-tooltip-multiline has-tooltip-right" data-tooltip={schedule.descriptive_title.trim()}>
                        {schedule.subject_name}
                        </span>
                    </td>
                    <td className="valign has-text-centered">{schedule.subject_type}</td>
                    <td className="valign has-text-centered">{schedule.units}</td>
                    <td className="valign has-text-right">{schedule.days}</td>
                    <td className="valign has-text-right">{convertMilitaryToStandardTime(schedule.m_begin_time)} - {convertMilitaryToStandardTime(schedule.m_end_time)}</td>
                    <td className="valign has-text-centered">{schedule.room}</td>
                    <td className="valign has-text-centered">{schedule.section}</td>
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>
                </tr>
                {
                    splitSchedules ? splitSchedules.map((split, index) => {
                        return(
                            <tr key={index} className="has-background-link-light">  
                                <td className="valign is-narrow"></td>                               
                                <td className="valign is-narrow pt-0 pb-0"><i className="fas fa-caret-right"></i> {split.edp_code}</td>
                                <td className="valign pt-0 pb-0">{split.subject_name}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.subject_type}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.units}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.days}</td>
                                <td className="valign has-text-right pt-0 pb-0">{convertMilitaryToStandardTime(split.m_begin_time)} - {convertMilitaryToStandardTime(split.m_end_time)}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.room}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.section}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.course_abbr}</td>
                            </tr>
                        )
                    }) : <tr></tr>
                }
                </Fragment>   
            )
        }) : ""; 
        let tableHeadColor = "is-link";
        if(group === "added") tableHeadColor = "is-success";
        if(group === "removed") tableHeadColor = "is-danger";
        return(  
            <Fragment>    
                <article className={"message m-0 pt-0 " + tableHeadColor} >
                    <div className="message-header pt-2 pb-2">
                        <p>
                            {group === "selected" ? "Selected Subjects" : ""} 
                            {group === "added" ? "Subjects To Be Added" : ""} 
                            {group === "removed" ? "Subjects To Be Removed" : ""} 
                            {section ? " (Blocked Section: " + section + ")" : ""}
                        </p>                                             
                    </div>
                    <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table className="table is-striped is-fullwidth is-size-7 is-hoverable">
                            <thead>
                                <tr>
                                    <th className="is-narrow">Full</th>                                    
                                    <th className="is-narrow">EDP Code</th>
                                    <th>Subject</th>
                                    <th className="has-text-centered">Type</th>
                                    <th className="has-text-centered">Units</th>
                                    <th className="has-text-right">Days</th>
                                    <th className="has-text-right">Time</th>
                                    <th className="has-text-centered">Room</th>
                                    <th className="has-text-centered is-narrow">Section</th>
                                    <th className="has-text-centered">Course</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>                                    
                                    <th className="has-text-right">Total</th>
                                    <th className="has-text-centered">{totalUnitsTaken}</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </tfoot>
                            <tbody>
                               { loadSubjects ? loadSubjects : (    
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