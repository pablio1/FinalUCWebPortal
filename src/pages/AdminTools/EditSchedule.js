import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getLoggedUserDetails, convertMilitaryToStandardTime } from '../../helpers/helper';
import { getScheduleSubject,  updateSchedule } from '../../helpers/apiCalls';

class EditSchedule extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        searchEDPCode: '', edpCode: '', internalCode: '', subject: '', type: 'LEC', size: 0, section: '', units: 0, room: '', isGened: false, mdn: 'AM',
        timeStart: '', timeEnd: '', dayM: false, dayT: false, dayW: false, dayTh: false, dayF: false, dayS: false, daySu: false,      
        mDays: '', mTimeStart: '', mTimeEnd: '', days: '', splitType: '', splitCode: '', isGenedValue: 0, status: 0
    }
    handleOnChangeInput = e => {
        if(["searchEDPCode", "units", "size", "isGenedValue"].includes(e.target.name)) {
            if(/^[0-9]*$/.test(e.target.value)) {
                this.setState({
                    [e.target.name] : e.target.value
                });
            }
        }
        else if(["dayM", "dayT", "dayW", "dayTh", "dayF", "dayS", "daySu", "isGened"].includes(e.target.name)) {
            this.setState({
                [e.target.name] : e.target.checked
            });
        }
        else {
            this.setState({
                [e.target.name] : e.target.value
            });
        }
    }
    handleKeyDown = e => {   
        const { cookies } = this.props;  
        if (e.key === 'Enter') {            
            getScheduleSubject(this.state.searchEDPCode, cookies.get("selterm"))
            .then(response => {
                if(response.data)
                {   
                    const mDays = response.data.mDays;
                    const dayM = mDays.charAt(0).toUpperCase() === "X" ? true : false;
                    const dayT = mDays.charAt(1).toUpperCase() === "X" ? true : false;
                    const dayW = mDays.charAt(2).toUpperCase() === "X" ? true : false;
                    const dayTh = mDays.charAt(3).toUpperCase() === "X" ? true : false;
                    const dayF = mDays.charAt(4).toUpperCase() === "X" ? true : false;
                    const dayS = mDays.charAt(5).toUpperCase() === "X" ? true : false;
                    const daySu = mDays.charAt(6).toUpperCase() === "X" ? true : false; 
                    let mTimeStart = response.data.mTimeStart;
                    mTimeStart = mTimeStart.length === 3 ? "0" + mTimeStart.substring(0,1) + ":" + mTimeStart.substring(1) : mTimeStart.substring(0,2) + ":" + mTimeStart.substring(2);
                    let mTimeEnd = response.data.mTimeEnd;
                    mTimeEnd = mTimeEnd.length === 3 ? "0" + mTimeEnd.substring(0,1) + ":" + mTimeEnd.substring(1) : mTimeEnd.substring(0,2) + ":" + mTimeEnd.substring(2);
                    this.setState({
                        edpCode: response.data.edpCode, 
                        internalCode: response.data.internalCode,
                        subject: response.data.description,
                        type: response.data.subType,
                        size: response.data.maxSize,
                        section: response.data.section,
                        units: response.data.units, 
                        room: response.data.room,
                        isGened: response.data.isGened > 0 ? true : false,
                        isGenedValue: response.data.isGened,
                        mTimeStart: mTimeStart,
                        mTimeEnd: mTimeEnd,
                        timeStart: response.data.timeStart,
                        timeEnd: response.data.timeEnd,
                        mdn: response.data.mdn,
                        mDays: response.data.mDays,
                        days: response.data.days,
                        splitType: response.data.splitType,
                        splitCode: response.data.splitCode,
                        dayM: dayM, 
                        dayT: dayT, 
                        dayW: dayW, 
                        dayTh: dayTh, 
                        dayF: dayF, 
                        dayS: dayS, 
                        daySu: daySu,
                        status: response.data.status  
                    });
                }
                else {
                    alert("EDP Code not found!");
                    this.handleCancelSave();
                }
            });
        }
    }
    handleSaveSchedule = () => {
        const { cookies } = this.props;
        const { dayM, dayT, dayW, dayTh, dayF, dayS, daySu } = this.state;
        let mTimeStart = this.state.mTimeStart.replace(":", "");
        mTimeStart = mTimeStart.charAt(0) === "0" ? mTimeStart.substring(1) : mTimeStart
        let mTimeEnd = this.state.mTimeEnd.replace(":", "");
        mTimeEnd = mTimeEnd.charAt(0) === "0" ? mTimeEnd.substring(1) : mTimeEnd
        let timeStart = convertMilitaryToStandardTime(mTimeStart).split(" ")[0];
        let timeEnd = convertMilitaryToStandardTime(mTimeEnd).split(" ")[0];
        const daysOfWeek = { M: "MON", T: "TUE", W: "WED", TH: "THU", F: "FRI", S: "SAT", SU: "SUN" };
        let days = "";
        let mDays = "";
        let dayCount = 0;
        if(dayM) {
            days += "M"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(dayT) {
            days += "T"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(dayW) {
            days += "W"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(dayTh) {
            days += "TH"; mDays += "X"; dayCount++;
        }
        else mDays += " "; 
        if(dayF) {
            days += "F"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(dayS) {
            days += "S"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(daySu) {
            days += "SU"; mDays += "X"; dayCount++;
        }
        else mDays += " ";
        if(dayCount === 1) days = daysOfWeek[days];
        let isGened = this.state.isGenedValue;
        if(process.env.REACT_APP_CAMPUS === "Banilad") {
            isGened = this.state.isGened ? 1 : 0;
        }
        const data = {
            edpCode: this.state.edpCode,
            description: this.state.subject,
            subType:this.state.type,
            units: this.state.units,
            timeStart: timeStart,
            timeEnd: timeEnd,
            mdn: this.state.mdn,
            days: days,
            mTimeStart: mTimeStart,
            mTimeEnd: mTimeEnd,
            mDays: mDays,
            maxSize: this.state.size,
            section: this.state.section,
            room: this.state.room,
            splitType: this.state.splitType,
            splitCode: this.state.splitCode,
            isGened: isGened,
            status: this.state.status,
            active_term: cookies.get("selterm")
        }
        updateSchedule(data)
        .then(response => {
            if(response.data && response.data.success === 1) {
                alert("Schedule change(s) saved.");
                this.handleCancelSave();
            }
            else {
                alert("Saving Error, please try again.");
                this.handleCancelSave();
            }
        });
    }
    handleCancelSave = () => {
        this.setState({
            edpCode: '', 
            internalCode: '',
            subject: '',
            type: 'LEC',
            size: 0,
            section: '',
            units: 0, 
            room: '',
            isGened: false,
            mTimeStart: '',
            mTimeEnd: '',
            timeStart: '',
            timeEnd: '',
            mdn: 'AM',
            mDays: '',
            days: '',
            splitType: '',
            splitCode: '',
            dayM: false, 
            dayT: false, 
            dayW: false, 
            dayTh: false, 
            dayF: false, 
            dayS: false, 
            daySu: false,
            status: 0   
        });
    }
    render() {
        if (!["EDP"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { 
            searchEDPCode, edpCode, internalCode, subject, type, size, section, units, room, isGened, mTimeStart, mTimeEnd, mdn,
            dayM, dayT, dayW, dayTh, dayF, dayS, daySu, isGenedValue, status
        } = this.state;
        const loadSubjectForm = (
            <Fragment>
                <h4 className="has-text-weight-bold is-size-6 mt-0 mb-2">Editing EDP Code : {edpCode}</h4>
                <div className="columns">
                    <div className="column is-narrow">
                        <label className="label is-small">Internal Code</label>
                        <input className="input is-small" name="internalCode" type="text" disabled={true} 
                            value={internalCode} onChange={this.handleOnChangeInput}/> 
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">Subject Name</label>
                        <input className="input is-small" name="subject" type="text" disabled={true}  
                            value={subject} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">Type</label>  
                        <div className="select is-small">
                            <select name="type" value={type} onChange={this.handleOnChangeInput}>
                                <option value="LEC">LEC</option>
                                <option value="LAB">LAB</option>
                            </select>
                        </div>   
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-narrow">
                        <label className="label is-small">Units</label>
                        <input className="input is-small" name="units" type="text" autoComplete="off"
                            value={units} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">Max Size</label>
                        <input className="input is-small" name="size" type="text" autoComplete="off"
                            value={size} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">Section</label>
                        <input className="input is-small" name="section" type="text" autoComplete="off"
                            value={section} onChange={this.handleOnChangeInput}/>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-narrow">
                        <label className="label is-small">Room</label>
                        <input className="input is-small" name="room" type="text" autoComplete="off" 
                            value={room} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small mb-2">Is Gened</label>                               
                        <div className="control pr-0 mr-0">
                            <input id="switchRoundedInfo" type="checkbox" name="isGened" className="switch is-rounded is-info is-small" checked={isGened} 
                                    onChange={this.handleOnChangeInput} />
                            <label htmlFor="switchRoundedInfo"></label>
                        </div>
                    </div>
                    {
                        process.env.REACT_APP_CAMPUS === "Banilad" ? (
                            <div className="column is-hidden-mobile"></div>
                        ) : (
                            <div className="column is-narrow">
                                <label className="label is-small mb-2">Gened Value</label>                               
                                <div className="control pr-0 mr-0">
                                    <input type="text" name="isGenedValue" className="input is-small" value={isGenedValue} autoComplete="off"
                                            onChange={this.handleOnChangeInput} />
                                </div>
                            </div>
                        )
                    }
                    
                </div>
                <div className="columns">
                    <div className="column is-narrow">
                        <label className="label is-small">Start Time</label>
                        <input className="input is-small" name="mTimeStart" type="time" 
                            value={mTimeStart} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">End Time</label>
                        <input className="input is-small" name="mTimeEnd" type="time" 
                            value={mTimeEnd} onChange={this.handleOnChangeInput}/>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">MDN</label>  
                        <div className="select is-small">
                            <select name="mdn" value={mdn} onChange={this.handleOnChangeInput}>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                    <div className="column is-narrow">
                        <label className="label is-small">Status</label>  
                        <span className="select is-small">
                            <select name="status" value={status} onChange={this.handleOnChangeInput}>
                                <option value="0">Undeployed</option>                                                
                                <option value="1">Deployed</option>
                                <option value="2">Dissolved</option>
                                <option value="3">Requested</option>
                                <option value="4">Deferred</option>
                                <option value="5">Closed</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-narrow">
                        <label className="label is-small">Days</label>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="has-text-centered is-narrow is-size-7">Mon</td>
                                    <td className="has-text-centered is-narrow is-size-7">Tue</td>
                                    <td className="has-text-centered is-narrow is-size-7">Wed</td>
                                    <td className="has-text-centered is-narrow is-size-7">Thu</td>
                                    <td className="has-text-centered is-narrow is-size-7">Fri</td>
                                    <td className="has-text-centered is-narrow is-size-7">Sat</td>
                                    <td className="has-text-centered is-narrow is-size-7">Sun</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayM" checked={dayM} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayT" checked={dayT} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayW" checked={dayW} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayTh" checked={dayTh} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayF" checked={dayF} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="dayS" checked={dayS} /></td>
                                    <td className="has-text-centered is-narrow"><input type="checkbox" onChange={this.handleOnChangeInput} name="daySu" checked={daySu} /></td>
                                </tr>
                            </tbody>
                        </table> 
                    </div>
                </div>
                <div className="columns">                    
                    <div className="column">
                        <button className="button is-primary is-fullwidth" onClick={this.handleCancelSave}>Cancel</button>
                    </div>
                    <div className="column">
                        <button className="button is-link is-fullwidth" onClick={this.handleSaveSchedule}>Save</button>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
            </Fragment>
        );
        return (
            <Fragment>
                <div className="columns">
                    <div className="column is-one-third-tablet">
                        <div className="field is-small">
                            <label className="label is-small">Enter EDP Code</label>
                            <div className="control">
                                <input className="input is-small" name="searchEDPCode" type="text" 
                                    value={searchEDPCode} onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} />
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="">
                    <div className="divider is-size-6 mt-0 mb-2 pt-0"></div>
                </div> 
                {edpCode ? loadSubjectForm : ""}              
            </Fragment>       
        );
    }

}

export default withCookies(EditSchedule)