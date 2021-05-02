import React, { Component, Fragment } from 'react';

import TeachersLoadView from '../../components/elements/TeachersLoadView';
import ScheduleSelection from './ScheduleSelection';

export default class TeachersLoading extends Component {
    handleOnBeginLoadingBtn = () => {      
        this.props.handleOnClickBtn("beginLoadSchedules");
    }
    handleOnSaveLoads = () => {
        this.props.handleOnSaveLoads();
    }
    updateLoadView = e => {
        this.props.updateLoadView(e);   
    }
    removeSchedule = e => {  
        this.props.removeSchedule(e);
    }
    render() {
        const { beginLoadSchedules, selectedTeacher, teachersLoad, selectedTab } = this.props;
        let teachersLoadViewModule = "TeachersLoadView";
        if(selectedTab === "myLoads") teachersLoadViewModule = "MyLoads";
        if(selectedTab === "loadTeachers") teachersLoadViewModule = "TeachersLoading";
        const loadTeachersLoadView = beginLoadSchedules ? (
            <TeachersLoadView 
                teachersLoad={teachersLoad}
                module= {teachersLoadViewModule}
                removeSchedule={this.removeSchedule} 
            />
         ) : "";
        const loadScheduleSelection = beginLoadSchedules ? (
            <ScheduleSelection 
                teachersLoad={teachersLoad} 
                updateLoadView={this.updateLoadView} 
            />
        ) : "";
        let loadLoadBtnLabel = "";
        if(selectedTab === "loadTeachers") loadLoadBtnLabel = beginLoadSchedules ? "Cancel Loading" : "Load Schedules";
        else loadLoadBtnLabel = beginLoadSchedules ? "Cancel Viewing" : "View Loaded Schedules";
        const loadSelectedTeacherDetails = selectedTeacher ? (
            <table className="table is-striped is-hoverable m-0 p-0">
                <tbody> 
                    <tr>
                        <th colSpan="2">{selectedTab === "loadTeachers" ? "Loading for: " : "Viewing: "}</th>
                        <th>{selectedTeacher.id_number + " - " + selectedTeacher.last_name + ", " + selectedTeacher.first_name}</th>
                        <th>
                            <div className="butons">
                                {
                                    (teachersLoad && selectedTab === "viewLoads") || selectedTab === "loadTeachers" ? (                                
                                        <button className={"button is-small " + (beginLoadSchedules ? "is-danger" : "is-success")} 
                                                onClick={this.handleOnBeginLoadingBtn}>
                                            {loadLoadBtnLabel}
                                        </button>
                                    ) : ""
                                }
                                {
                                    teachersLoad && beginLoadSchedules && selectedTab === "loadTeachers" ? (
                                        <button className="button is-small is-info ml-2" onClick={this.handleOnSaveLoads}>
                                            Save Load
                                        </button>
                                    ) : ""
                                }
                            </div>
                        </th>
                    </tr>                                                                                                                                                             
                </tbody>
            </table>
        ) : "";
        return (           
            <Fragment>
                {loadSelectedTeacherDetails}
                { 
                    selectedTab === "viewLoads" && !teachersLoad ? (
                    <div className="columns">
                        <div className="column">
                            <div className="notification is-danger">
                                <strong>No Teaching Loads as of the moment.</strong>                           
                            </div>
                        </div>
                    </div> 
                    ) : ""
                }
                {loadTeachersLoadView}
                {loadTeachersLoadView && selectedTab === "loadTeachers" ? loadSelectedTeacherDetails : ""}
                {selectedTab === "loadTeachers" ? loadScheduleSelection : ""}
            </Fragment>    
        );
    }
}
