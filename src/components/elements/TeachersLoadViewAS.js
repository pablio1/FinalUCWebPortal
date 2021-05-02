import React, { Component, Fragment } from 'react';

import { getTimeDifferenceInMS } from '../../helpers/helper';

export default class TeachersLoadView extends Component {
    removeSchedule = e => {
        this.props.removeSchedule(e);
    }
    render() { 
        const { teachersLoad } = this.props;
        const startMtime = "600";
        const endMtime = "2230";
        const interval1 = "15";
        const interval2 = "30";
        const interval3 = "45";
        let timeIntervals = [];
        for(let i = parseInt(startMtime.slice(0, -2)); i <= parseInt(endMtime.slice(0, -2)); i++) {
            let mdn = i >= 12 ? "PM" : "AM"; 
            let hour = i > 12 ? i - 12 : i;           
            hour = hour.toString().length < 2 ? "0" + hour.toString() : hour.toString(); //Add 0 padding
            timeIntervals.push({ hour: hour + ":00 " + mdn, mhour: i + "00"});
            timeIntervals.push({ hour: hour + ":" + interval1 + " " + mdn, mhour: i + interval1});
            timeIntervals.push({ hour: hour + ":" + interval2 + " " + mdn, mhour: i + interval2});
            timeIntervals.push({ hour: hour + ":" + interval3 + " " + mdn, mhour: i + interval3});
        }

        const loadTimeSchedules = timeIntervals.map((time, index) => {
            const timeTable = parseInt(time.mhour, 10);
            let days = [];
            if(teachersLoad) {
                let dailySched = [];
                dailySched[0] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(0).toUpperCase() === "X")[0];
                dailySched[1] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(1).toUpperCase() === "X")[0];
                dailySched[2] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(2).toUpperCase() === "X")[0];
                dailySched[3] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(3).toUpperCase() === "X")[0];
                dailySched[4] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(4).toUpperCase() === "X")[0];
                dailySched[5] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(5).toUpperCase() === "X")[0];
                dailySched[6] = teachersLoad.filter(schedule => (parseInt(schedule.m_begin_time, 10) >= timeTable || parseInt(schedule.m_end_time, 10) <= timeTable) && schedule.m_days.charAt(6).toUpperCase() === "X")[0];
                
                for(let i = 0; i < 7; i++) {
                    if(dailySched[i]) {
                        const edpCodeProp = dailySched[i].hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
                        if(parseInt(dailySched[i].m_begin_time, 10) === timeTable) days[i] = dailySched[i][edpCodeProp]; 
                        if(timeTable > parseInt(dailySched[i].m_begin_time, 10) && timeTable < parseInt(dailySched[i].m_end_time, 10)) days[i] = dailySched[i][edpCodeProp]; 
                        if(parseInt(dailySched[i].m_end_time, 10) === timeTable) days[i] = dailySched[i][edpCodeProp];
                    }
                }
            }
            return (
                <Fragment key={index}>
                <tr>
                    <th rowSpan="2" className="valign has-text-centered is-narrow" >{time.hour}</th>
                    <td className="has-text-centered is-narrow p-0">{days[0]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[1]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[2]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[3]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[4]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[5]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[6]}</td>
                </tr>
                <tr>
                    <td className="has-text-centered is-narrow p-0">{days[0]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[1]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[2]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[3]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[4]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[5]}</td>
                    <td className="has-text-centered is-narrow p-0">{days[6]}</td>
                </tr>                 
                </Fragment>
            )
        });    
        return(      
            <article className="message mb-0 pb-0 is-small">
                <div className="message-header">
                    <p>Teacher's Schedules</p>   
                    <button className="is-small p-0" aria-label="delete">
                        <span className="icon is-small">
                            <i className="fas fa-minus"></i>
                        </span>
                    </button>            
                </div>
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
            </article>                                     
        )
    }
}
