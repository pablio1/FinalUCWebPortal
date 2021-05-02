import React, { Component, Fragment } from 'react';

import { getTimeDifferenceInMS, sortArrayObjectsByProp } from '../../helpers/helper';
import SchedulesTable from '../elements/SchedulesTable';

export default class TeachersLoadView extends Component {
    state = {
        accPlotterExpand: false, accSelectedSubjectsExpand: true
    }
    onClickAccordion = e => {
        const { accPlotterExpand, accSelectedSubjectsExpand } = this.state;
        if(e === "plotter") {
            this.setState({
                accSelectedSubjectsExpand: accPlotterExpand,
                accPlotterExpand: !accPlotterExpand
            });
        }
        if(e === "list") {
            this.setState({
                accSelectedSubjectsExpand: !accSelectedSubjectsExpand,
                accPlotterExpand: accSelectedSubjectsExpand
            });
        }
    }
    removeSchedule = e => {
        this.props.removeSchedule(e);
    }
    render() { 
        const { teachersLoad, module } = this.props;
        const { accPlotterExpand, accSelectedSubjectsExpand } = this.state;
        const startMtime = "600";
        const endMtime = "2230";
        const interval = "30";
        let timeIntervals = [];
        for(let i = parseInt(startMtime.slice(0, -2)); i <= parseInt(endMtime.slice(0, -2)); i++) {
            let mdn = i >= 12 ? "PM" : "AM"; 
            let hour = i > 12 ? i - 12 : i;           
            hour = hour.toString().length < 2 ? "0" + hour.toString() : hour.toString(); //Add 0 padding
            timeIntervals.push({ hour: hour + ":00 " + mdn, mhour: i + "00"});
            timeIntervals.push({ hour: hour + ":" + interval + " " + mdn, mhour: i + interval});
        }
        const sortedTeachersLoad = teachersLoad ? sortArrayObjectsByProp(teachersLoad, "edpcode") : null;
        const loadTimeSchedules = timeIntervals.map((time, index) => {
            let mon = <td></td>;
            let tue = <td></td>;
            let wed = <td></td>;
            let thu = <td></td>;
            let fri = <td></td>;
            let sat = <td></td>;
            let sun = <td></td>;
            let mon1 = <td></td>;
            let tue1 = <td></td>;
            let wed1 = <td></td>;
            let thu1 = <td></td>;
            let fri1 = <td></td>;
            let sat1 = <td></td>;
            let sun1 = <td></td>;
            if(sortedTeachersLoad) {
                sortedTeachersLoad.forEach(schedule => {
                    const edpCodeProp = schedule.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
                    const beginTimeSched = parseInt(schedule.m_begin_time, 10);
                    const endTimeSched = parseInt(schedule.m_end_time, 10);
                    const timeTable = parseInt(time.mhour, 10);
                    const interValInMS = parseInt(interval, 10) * 60000;
                    const classTimeInMS = getTimeDifferenceInMS(schedule.m_begin_time, schedule.m_end_time);
                    const rowSpan = ((classTimeInMS/interValInMS) * 2);                    
                    if(schedule.m_days.charAt(0).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(0).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            mon = findSameEndTime.length > 0 ? "" : <td></td>;

                            mon1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})  
                                    </div>
                                </td>
                            );                            
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {  
                            mon = "";
                            mon1 = "";
                        }
                        else if (timeTable === endTimeSched) {
                            mon = "";
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(0).toUpperCase() === "X" );
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(0).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            mon1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //mon1 = <td></td>;   
                        }                        
                    } 
                    if(schedule.m_days.charAt(1).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(1).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            tue = findSameEndTime.length > 0 ? "" : <td></td>;

                            tue1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})      
                                    </div>
                                </td>
                            );  
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {
                            tue = "";
                            tue1 = "";                            
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(1).toUpperCase() === "X" && sched.edpcode !== schedule[edpCodeProp]);
                            tue = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(1).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            tue1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //tue1 = <td></td>;                          
                        }
                        
                    } 
                    if(schedule.m_days.charAt(2).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(2).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            wed = findSameEndTime.length > 0 ? "" : <td></td>;

                            wed1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})     
                                    </div>
                                </td>
                            );                            
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {
                            wed = "";
                            wed1 = "";                            
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(2).toUpperCase() === "X" );
                            wed = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(2).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            wed1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //wed1 = <td></td>;                            
                        }
                        
                    } 
                    if(schedule.m_days.charAt(3).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(3).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            thu = findSameEndTime.length > 0 ? "" : <td></td>;

                            thu1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})     
                                    </div>
                                </td>
                            );   
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {                            
                            thu = "";
                            thu1 = "";
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(3).toUpperCase() === "X" );
                            thu = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(3).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            thu1 = findSameStartTime.length > 0 ? "" : <td></td>;                                 
                            //thu1 = <td></td>;
                        }
                        
                    } 
                    if(schedule.m_days.charAt(4).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(4).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            fri = findSameEndTime.length > 0 ? "" : <td></td>;

                            fri1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})      
                                    </div>
                                </td>
                            );
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {
                            fri = "";
                            fri1 = "";                            
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(4).toUpperCase() === "X" );
                            fri = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(4).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            fri1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //fri1 = <td></td>;                            
                        }
                        
                    } 
                    if(schedule.m_days.charAt(5).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(5).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            sat = findSameEndTime.length > 0 ? "" : <td></td>;

                            sat1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})      
                                    </div>
                                </td>
                            );
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {
                            sat = "";
                            sat1 = "";
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(5).toUpperCase() === "X" );
                            sat = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(5).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            sat1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //sat1 = <td></td>;  
                        }
                        
                    } 
                    if(schedule.m_days.charAt(6).toUpperCase() === "X") {
                        if(timeTable === beginTimeSched) {
                            //const findSameEndTime = teachersLoad.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched && sched.m_days.charAt(6).toUpperCase() === "X" );
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(6).toUpperCase() === "X");
                            const findSameEndTime = removeCurrSchedule.filter(sched => parseInt(sched.m_end_time, 10) === beginTimeSched );
                            sun = findSameEndTime.length > 0 ? "" : <td></td>;

                            sun1 = (
                                <td rowSpan={rowSpan} className="p-0 has-background-success">
                                    <div className="notification is-success">
                                        {module === "TeachersLoading" ? <button className="delete" onClick={() => this.removeSchedule(schedule[edpCodeProp])}></button> : ""}
                                        <strong>{schedule[edpCodeProp]}<br />{schedule.subject_name}</strong><br />(size: {schedule.size})     
                                    </div>
                                </td>
                            );                            
                        }
                        else if (timeTable > beginTimeSched && timeTable < endTimeSched) {
                            sun = "";
                            sun1 = "";
                            
                        }
                        else if (timeTable === endTimeSched) {
                            //const findSameStartTime = teachersLoad.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched && sched.m_days.charAt(6).toUpperCase() === "X" );
                            sun = "";
                            const removeCurrSchedule = teachersLoad.filter(sched => sched.edpcode !== schedule[edpCodeProp] && sched.m_days.charAt(6).toUpperCase() === "X");
                            const findSameStartTime = removeCurrSchedule.filter(sched => parseInt(sched.m_begin_time, 10) === endTimeSched );
                            sun1 = findSameStartTime.length > 0 ? "" : <td></td>;
                            //sun1 = <td></td>;  
                        }
                        
                    }          
                });
            }
            return (
                <Fragment key={index}>
                <tr>
                    <th rowSpan="2" className="has-text-centered is-narrow">{time.hour}</th>
                    {mon}
                    {tue}
                    {wed}
                    {thu}
                    {fri}
                    {sat}
                    {sun}
                </tr>                
                <tr>
                    {mon1}
                    {tue1}
                    {wed1}
                    {thu1}
                    {fri1}
                    {sat1}
                    {sun1}
                </tr> 
                </Fragment>
            )
        });   
        const loadSelectedSubjectList = (
            <SchedulesTable 
                subjects={sortedTeachersLoad}
                module={module}
                accSelectedSubjectsExpand={accSelectedSubjectsExpand}
                gradeEntryData=""
                onClickAccordion={this.onClickAccordion}
                removeSchedule={this.removeSchedule}
            />
        ); 
        return(  
            <Fragment>  
                {loadSelectedSubjectList}  
                <article className="message mb-0 pb-0 mt-2 is-small">
                    <div className="message-header is-clickable" onClick={() => this.onClickAccordion("plotter")}>
                        <p>PLOTTER VIEW</p>   
                        <button className="is-small p-0" aria-label="delete" onClick={() => this.onClickAccordion("plotter")}>
                            <span className="icon is-small">
                                <i className={accPlotterExpand ? "fas fa-minus" : "fas fa-plus"}></i>
                            </span>
                        </button>            
                    </div>
                    { 
                        accPlotterExpand ? (
                            <div className="message-body p-0 table-container">
                                <table className="table is-striped is-fullwidth is-hoverable is-bordered">
                                    <thead>
                                        <tr>
                                            <th className="has-text-centered is-narrow">Time</th>
                                            <th className="has-text-centered is-narrow">MON</th>
                                            <th className="has-text-centered is-narrow">TUE</th>
                                            <th className="has-text-centered is-narrow">WED</th>
                                            <th className="has-text-centered is-narrow">THU</th>
                                            <th className="has-text-centered is-narrow">FRI</th>
                                            <th className="has-text-centered is-narrow">SAT</th>
                                            <th className="has-text-centered is-narrow">SUN</th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        { 
                                            loadTimeSchedules ? loadTimeSchedules : (
                                                <tr>
                                                    <th></th>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr> 
                                            )
                                        }                                                                                                                                                                
                                    </tbody>
                                </table>
                            </div>
                        ) : ""
                    }
                </article>       
            </Fragment>                              
        )
    }
}
