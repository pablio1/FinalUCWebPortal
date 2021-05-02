import React, { Component, Fragment } from 'react';
import { getTotalUnitsTaken } from '../../helpers/helper';

export default class SelectedSubjects extends Component {

    handleOnRemoveSchedule = e => {
        this.props.handleOnRemoveSchedule(e);
    }
    handleOnSubmitSchedules = () => {
        //const confirmMsg = "Are you sure to want to submit? If all subjects are correct and good to go, please press OK. If you want to double check and make more changes press Cancel";
        //if(window.confirm(confirmMsg)) this.props.handleOnSubmitSchedules();
        this.props.handleOnSubmitSchedules();
    }
    render() {
        const { selectedSubjects, hasSection, showSubmitBtn, has_nstp, has_pe, section } = this.props;   
        const totalUnitsSelected = getTotalUnitsTaken(selectedSubjects);
        const loadSchedules = selectedSubjects ? selectedSubjects.filter(sch => sch.split_type !== "C").map((schedule, index) => {
            const edpCodePropName = schedule.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
            const splitSchedules = schedule.split_type === "S" ? selectedSubjects.filter(sched => sched.split_code === schedule[edpCodePropName] && sched.split_type!=="S") : "";
            const splitEdpCodes = splitSchedules ? splitSchedules.map(schedule => {
                return schedule[edpCodePropName]
            }) : "";
            const selectedEdpCodes = splitEdpCodes ? [...splitEdpCodes, schedule[edpCodePropName]] : [schedule[edpCodePropName]];
            const selectedSchedules = selectedSubjects.filter(sched => selectedEdpCodes.includes(sched[edpCodePropName]));
            let activateRemoveBtn = true;
            if(hasSection) activateRemoveBtn = false;
            //if(hasSection && has_nstp === 0 && has_pe === 0 && (schedule.subject_name.startsWith("NSTP") || schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."))) activateRemoveBtn = true; 
            if(has_nstp === 0 && has_pe === 0 && hasSection) {
                if((schedule.subject_name.startsWith("NSTP") || schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."))) activateRemoveBtn = true;
                else activateRemoveBtn = false;
            }
            if(has_nstp === 1 && has_pe === 0 && hasSection) {
                if((schedule.subject_name.startsWith("NSTP") || schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."))) activateRemoveBtn = true;
                else activateRemoveBtn = false;
            }
            if(has_nstp === 0 && has_pe === 1 && hasSection) {
                if((schedule.subject_name.startsWith("NSTP") || schedule.subject_name.startsWith("PE") || schedule.subject_name.startsWith("P.E") || schedule.subject_name.startsWith("P.E."))) activateRemoveBtn = true;
                else activateRemoveBtn = false;
            }
            return (
                <Fragment key={index}>
                <tr className="">
                    <td className="valign is-narrow">{schedule[edpCodePropName]}</td>
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
                    <td className="valign has-text-centered">{schedule.course_abbr}</td>
                    <td>
                        {
                            activateRemoveBtn ? (
                                <div className="tag is-small is-danger is-clickable" onClick={() => this.handleOnRemoveSchedule(selectedSchedules)}>
                                    Remove
                                </div>
                            ) : <div className="tag is-small is-light">Remove</div>
                        }                                            
                    </td>
                </tr>
                {
                    splitSchedules ? splitSchedules.map((split, index) => {
                        return(
                            <tr key={index} className="has-background-link-light">
                                <td className="valign is-narrow pt-0 pb-0"><i className="fas fa-caret-right"></i> {split[edpCodePropName]}</td>
                                <td className="valign pt-0 pb-0">{split.subject_name}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.subject_type}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.units}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.days}</td>
                                <td className="valign has-text-right pt-0 pb-0">{split.begin_time} - {split.end_time} {split.mdn}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.room}</td>
                                <td className="valign has-text-centered pt-0 pb-0">{split.course_abbr}</td>
                                <td></td>
                            </tr>
                        )
                    }) : <tr></tr>
                }
                </Fragment>   
            )
        }) : "";    
        const loadSubmitBtn = showSubmitBtn ? (
            <button className="button is-small is-success m-0" onClick={this.handleOnSubmitSchedules}>
                <span className="icon is-small">
                    <i className="fas fa-check"></i>
                </span>
                <span>Submit for Approval</span>
            </button>
        ) : (
            <button className="button is-small is-success m-0" disabled={true}>
                <span className="icon is-small">
                    <i className="fas fa-check"></i>
                </span>
                <span>Submit for Approval</span>
            </button>
        );         
        return(      
            <article className="message mb-0 pb-0 is-small">
                <div className="message-header">
                    <p>Selected Subject</p>   
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
                                    <th className="has-text-centered">Course</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                    <td className="has-text-centered has-text-weight-bold">{totalUnitsSelected ? totalUnitsSelected : "--"}</td>
                                    <td></td><td></td><td></td>
                                    <td colSpan="2" className="is-narrow"> 
                                        {selectedSubjects.length > 0 && !hasSection? loadSubmitBtn : ""}                                        
                                    </td>
                                </tr>
                            </tfoot>
                            <tbody>
                                { loadSchedules ? loadSchedules : (    
                                        <tr>
                                            <td></td><td></td><td></td>
                                            <td></td><td></td><td></td>
                                            <td></td><td></td><td></td>
                                        </tr>
                                    )
                                }                                                                                                                                      
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>                                     
        )
    }
}
