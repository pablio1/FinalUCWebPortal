import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { getLoggedUserDetails } from '../../helpers/helper';
import { getTeachersList, getTeachersLoad, saveTeachersLoad } from '../../helpers/apiCalls';
import SearchTeacherPanel from '../../components/elements/SearchTeacherPanel';
import TeachersLoading from './TeachersLoading';
import TeachersLoadView from '../../components/elements/TeachersLoadView';


class TeachersLoad extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        userType: '', selectedTab: "viewLoads", teacherList: null, selectedTeacher: null, teachersLoad: null,
        id_number: '', name:'', beginLoadSchedules: false, myLoad: null
    }
    componentDidMount = () => {
        getTeachersList({})
        .then(response => {
            if(response.data && response.data.teacherList.length > 0) { 
                this.setState({
                    teacherList: response.data.teacherList,
                    userType: getLoggedUserDetails("usertype")
                })
            }
        });
    }
    handleOnClickTab = e => {
        const { cookies } = this.props;
        this.setState({
            selectedTab: e,
            selectedTeacher: null,
            id_number: '', 
            name:'', 
            beginLoadSchedules: false,
            teachersLoad: null,
        }, () => {
            if(getLoggedUserDetails("hasload")) {
                getTeachersLoad(getLoggedUserDetails("idnumber"), cookies.get("selterm"))       
                .then(response => {
                    if(response.data && response.data.schedules.length > 0) {
                        this.setState({
                            myLoad: response.data.schedules
                        });                    
                    }
                });
            }
        })
    }
    handleOnSearchEvent = e => {
        this.setState({
            [e.target.key] : e.target.value,
            teachersLoad: null,
        }, () => this.getSelectedTeacher());
    }
    handleOnchangeInput = (key,value) => {
        this.setState({
           [key] : value,
           teachersLoad: null,
        }, () => this.getSelectedTeacher());
    }
    getSelectedTeacher = () => {
        const { cookies } = this.props;
        const data = {
            id_number: this.state.id_number,
            name: this.state.name
        }
        getTeachersList(data)
        .then(response => {
            if(response.data && response.data.teacherList.length > 0) { 
                this.setState({
                    selectedTeacher: response.data.teacherList[0],
                    beginLoadSchedules: false
                }, () => {
                    getTeachersLoad(this.state.id_number, cookies.get("selterm"))        
                    .then(response => {
                        if(response.data && response.data.schedules.length > 0) {
                            this.setState({
                                teachersLoad: response.data.schedules
                            });                    
                        }
                    });
                });
            }
        });
    }
    handleOnClickBtn = e => {
        if(e === "beginLoadSchedules") {
            const { beginLoadSchedules } = this.state;
            this.setState({
                beginLoadSchedules: !beginLoadSchedules,
            })
        }
    }
    removeSchedule = e => {  
        const { teachersLoad } = this.state;
        let filteredTeachersLoad = teachersLoad;
        let selectedCodes = [e];
        let selectSchedule = filteredTeachersLoad.filter(schedule => (schedule.hasOwnProperty("edpcode") ? schedule.edpcode : schedule.edp_code) === e)[0];
        if(selectSchedule.split_type === "S") {
            selectSchedule = filteredTeachersLoad.filter(schedule => schedule.split_type === "C" && schedule.split_code === e )[0];
            selectedCodes = [...selectedCodes, selectSchedule.hasOwnProperty("edpcode") ? selectSchedule.edpcode : selectSchedule.edp_code];
        }
        else if(selectSchedule.split_type === "C") {
            selectedCodes = [...selectedCodes, selectSchedule.split_code];
        }
        filteredTeachersLoad = teachersLoad.filter(schedule => !selectedCodes.some(sched => (schedule.hasOwnProperty("edpcode") ? schedule.edpcode : schedule.edp_code) === sched));
        this.setState({
            teachersLoad: filteredTeachersLoad
        });
    }
    updateLoadView = e => {
        this.setState({
            teachersLoad: e
        });   
    }
    handleOnSaveLoads = () => {
        const { teachersLoad, id_number } = this.state;
        const { cookies } = this.props;
        //if(teachersLoad && teachersLoad.length > 0) {
            const edpCodes = teachersLoad.map((schedule, index) => {
                const edpCodeProp = schedule.hasOwnProperty("edpcode") ? "edpcode" : "edp_code";
                return schedule[edpCodeProp];
            });
            const data = {
                id_number: id_number,
                edp_codes: edpCodes,
                term: cookies.get("selterm")
            };
            saveTeachersLoad(data)
            .then(response => {
                if(response.data && response.data.success) {
                    alert("Loads Successfully Saved!");
                    this.setState({
                        teachersLoad: null,
                        beginLoadSchedules: false,
                        selectedTeacher: null,
                        id_number: '', 
                        name: ''
                    });
                }
                else {
                    alert("Error on saving, please try again. Contact Edp office if issue persist.");
                }
            });

        //}
    }
    render() {
        if (!["DEAN", "CHAIRPERSON", "ACAD", "FACULTY", "EDP", "COOR", "REGISTRAR", "ACCOUNTING", "CASHIER", "LINKAGE", "ADMIN"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { userType, selectedTab, teacherList, id_number, name, selectedTeacher, beginLoadSchedules, teachersLoad, myLoad } = this.state;
        const searcheables = { id_number, name };
        const loadLoadTeachers = id_number ? (
            <TeachersLoading 
                beginLoadSchedules={beginLoadSchedules} 
                selectedTeacher={selectedTeacher}
                teachersLoad={teachersLoad}
                selectedTab={selectedTab}
                handleOnClickBtn={this.handleOnClickBtn}
                handleOnSaveLoads={this.handleOnSaveLoads}
                removeSchedule={this.removeSchedule}
                updateLoadView={this.updateLoadView}
            />
        ) : "";
        const loadMyLoad = myLoad ? (
            <TeachersLoadView 
                teachersLoad={myLoad}
                module="MyLoads"
                removeSchedule={this.removeSchedule} 
            />
         ) : (
            <div className="columns is-vcentered">
                <div className="column is-center">
                    <div className="notification is-danger">
                        <strong>You currently do not have any Teaching Loads as of the moment.</strong>                           
                    </div>
                </div>
            </div> 
        );
        return (            
            <div className="box ml-1 is-full-height">
                <div className="buttons has-addons is-centered">     
                    {
                        ["DEAN", "ACAD"].includes(userType) ? (  
                            <Fragment>         
                            <button name="viewLoads" className={"button " + (selectedTab === "viewLoads" ? "is-info is-selected" : "")} 
                                    onClick={() => this.handleOnClickTab("viewLoads")}>
                                <span className="icon is-small">
                                    <i className="fas fa-desktop"></i>
                                </span>
                                <span>View</span>
                            </button>                    
                            <button name="loadTeachers" className={"button " + (selectedTab === "loadTeachers" ? "is-info is-selected" : "")} 
                                    onClick={() => this.handleOnClickTab("loadTeachers")}>
                                <span className="icon is-small">
                                    <i className="fas fa-edit"></i>
                                </span>
                                <span>Load</span>
                            </button> 
                            </Fragment>                     
                        ) : ""
                    }
                    {
                        ["REGISTRAR", "EDP"].includes(userType) ? (          
                            <button name="viewLoads" className={"button " + (selectedTab === "viewLoads" ? "is-info is-selected" : "")} 
                                    onClick={() => this.handleOnClickTab("viewLoads")}>
                                <span className="icon is-small">
                                    <i className="fas fa-desktop"></i>
                                </span>
                                <span>View</span>
                            </button>                   
                                       
                        ) : ""
                    }
                    <button name="myLoads" className={"button " + (selectedTab === "myLoads" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("myLoads")}>
                        <span className="icon is-small">
                            <i className="fas fa-chalkboard-teacher"></i>
                        </span>
                        <span>My Load</span>
                    </button> 
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0 mb-4"></div>
                </div> 
                {
                    ["DEAN", "ACAD", "REGISTRAR", "EDP"].includes(userType) && selectedTab !== "myLoads" ? (
                        <div className="columns">
                            <div className="column mt-0 mb-0 is-half-widescreen is-half-desktop"> 
                                <SearchTeacherPanel 
                                    searcheables={searcheables}
                                    teacherList={teacherList}
                                    handleOnchangeInput={this.handleOnchangeInput}
                                    handleOnSearchEvent={this.handleOnSearchEvent}
                                />
                            </div>
                        </div>    
                    ) : ""
                }          
                { selectedTab === "viewLoads" ? loadLoadTeachers : "" }
                { selectedTab === "loadTeachers" ? loadLoadTeachers: "" } 
                { selectedTab === "myLoads" ? loadMyLoad: "" }          
            </div>
        );
    }
}

export default withCookies(TeachersLoad)

export class TeachersLoadHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-edit"></i> Teachers Load
            </div> 
        )
    }
    
}