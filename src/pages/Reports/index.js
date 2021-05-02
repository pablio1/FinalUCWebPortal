import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import axios from 'axios';
import store from 'store2';

import { getLoggedUserDetails } from '../../helpers/helper';
import { getEnrollmentReport } from '../../helpers/apiCalls';
import ReportHeaderTiles from '../../components/enrollment/ReportHeaderTiles';
import ReportChartsMain from '../../components/enrollment/ReportChartsMain';
import ReportTableData from '../../components/enrollment/ReportTableData';
import LmsTools from './LmsTools';

import SpinnerGif from '../../assets/sysimg/spinner.gif';

class Reports extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'col', college: "CL", date: '', isShowAllDate: true,
            headerTilesValues: null, tableValues: null, toggleLoading: false,
            selectStudTypeExportLMS: 0, studExportLMSBtnIsLoading: false
        }
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        this.setState({
            toggleLoading: true
        }, () => {        
            getEnrollmentReport("", this.state.college, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    headerTilesValues: response.data.courseStat.filter(stat => stat.courseName === "All"),
                    tableValues: response.data.courseStat.filter(stat => stat.courseName !== "All"),
                    date: new Date(),
                    toggleLoading: false
                });
            }); 
        });
    }
    handleOnChangeDate = e => {
        const { cookies } = this.props;
        this.setState({
            date: e.target.value
        }, () => {
            getEnrollmentReport(this.state.date, this.state.college, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    tableValues: response.data.courseStat.filter(stat => stat.courseName !== "All"),
                });
            }); 
        });
    }
    handleOnChangeCheckBox = e => {
        const { cookies } = this.props;
        this.setState({
            isShowAllDate: e.target.checked,
        }, () => {
            getEnrollmentReport("", this.state.college, cookies.get("selterm"))
            .then(response => {            
                this.setState({
                    tableValues: response.data.courseStat.filter(stat => stat.courseName !== "All"),
                });
            }); 
        });
    }
    handleOnClickTab = e => {
        const { cookies } = this.props;
        if(e === "lms") {
            this.setState({
                selectedTab: e,
            }, () => {
                 
            });
        }
        else {
            const educLevel = { col: "CL", shs: "SH", jhs: "JH" };
            this.setState({
                selectedTab: e,
                college: educLevel[e],
                toggleLoading: true
            }, () => {
                if(e === "col" || e === "shs") {
                    getEnrollmentReport("", this.state.college, cookies.get("selterm"))
                    .then(response => {            
                        this.setState({
                            headerTilesValues: response.data.courseStat.filter(stat => stat.courseName === "All"),
                            tableValues: response.data.courseStat.filter(stat => stat.courseName !== "All"),
                            isShowAllDate: true,
                            date: '',
                            toggleLoading: false
                        });
                    }); 
                }
                if(e === "jhs") this.getJHBEData("");
            });
        }
    }

    getJHBEData = date => {
        const { cookies } = this.props;
        let data1 = {
            department: "JH",
            active_term: cookies.get("selterm") ? cookies.get("selterm") : process.env.REACT_APP_CURRENT_SCHOOL_TERM 
        };
        let data2 = {
            department: "BE",
            active_term: cookies.get("selterm") ? cookies.get("selterm") : process.env.REACT_APP_CURRENT_SCHOOL_TERM 
        };
        if(date) {
            data1["dte"] = date; //2020-12-23
            data2["dte"] = date; //2020-12-23
        } 
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        const apiRequest1 = axios.post(process.env.REACT_APP_API_UC_ENROLLMENT_REPORTS, data1, {headers});
        const apiRequest2 = axios.post(process.env.REACT_APP_API_UC_ENROLLMENT_REPORTS, data2, {headers});
        
        Promise.all([apiRequest1, apiRequest2]).then(values =>  { 
            const headerTilesValuesJH = values[0].data.courseStat.filter(stat => stat.courseName === "All");
            const headerTilesValuesBE = values[1].data.courseStat.filter(stat => stat.courseName === "All");
            const tableValuesJH = values[0].data.courseStat.filter(stat => stat.courseName !== "All");
            const tableValuesBE = values[1].data.courseStat.filter(stat => stat.courseName !== "All");
            let tableValuesCombined = tableValuesJH.concat(tableValuesBE);
            const headerTilesValuesCombined = [{
                courseName: "All",
                pending_registered: headerTilesValuesJH[0].pending_registered + headerTilesValuesBE[0].pending_registered,
                subject_selection: headerTilesValuesJH[0].subject_selection + headerTilesValuesBE[0].subject_selection,
                pending_dean: headerTilesValuesJH[0].pending_dean + headerTilesValuesBE[0].pending_dean,
                pending_accounting: headerTilesValuesJH[0].pending_accounting + headerTilesValuesBE[0].pending_accounting,
                pending_payment: headerTilesValuesJH[0].pending_payment + headerTilesValuesBE[0].pending_payment,
                pending_cashier: headerTilesValuesJH[0].pending_cashier + headerTilesValuesBE[0].pending_cashier,
                pending_total: headerTilesValuesJH[0].pending_total + headerTilesValuesBE[0].pending_total,
                official_total: headerTilesValuesJH[0].official_total + headerTilesValuesBE[0].official_total,
                year_level: null
            }];
            this.setState({
                headerTilesValues: headerTilesValuesCombined,
                tableValues: tableValuesCombined,
                isShowAllDate: true,
                date: '',
                toggleLoading: false
            });
            
        }).catch(error => {
            console.log(error);
        }); 
    }
    
    render() {
        if (!["DEAN", "CHAIRPERSON", "COOR", "ACAD", "EDP", "REGISTRAR", "CASHIER", "ACCOUNTING", "LINKAGE", "MANAGEMENT"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { 
            selectedTab, headerTilesValues, date, tableValues, isShowAllDate, toggleLoading, selectStudTypeExportLMS, studExportLMSBtnIsLoading,
        } = this.state;
        const userType = getLoggedUserDetails("usertype");
        return(
            <div className="box ml-1">
                <div className="buttons has-addons is-centered">                
                    <button name="colTab" className={"button " + (selectedTab === "col" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("col")}>
                        <span className="icon is-small">
                        <i className="fas fa-university"></i>
                        </span>
                        <span>College</span>
                    </button>
                    <button name="shsTab" className={"button " + (selectedTab === "shs" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("shs")}>
                        <span className="icon is-small">
                            <i className="fas fa-school"></i>
                        </span>
                        <span>Senior High</span>
                    </button> 
                    <button name="jhsTab" className={"button " + (selectedTab === "jhs" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("jhs")}>
                        <span className="icon is-small">
                            <i className="fas fa-chalkboard-teacher"></i>
                        </span>
                        <span>Basic Ed</span>
                    </button>      
                    {   
                        ["DEAN", "CHAIRPERSON", "EDP"].includes(userType) ? (
                            <button name="lmsTab" className={"button " + (selectedTab === "lms" ? "is-info is-selected" : "")}
                                    onClick={() => this.handleOnClickTab("lms")}>
                                <span className="icon is-small">
                                    <i className="fas fa-laptop"></i>
                                </span>
                                <span>LMS</span>
                            </button>
                        ) : ""                            
                    }
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                {selectedTab === "lms" ? <LmsTools /> : ""}
                { 
                    selectedTab !== "lms" && toggleLoading ? (
                        <div className="columns is-vcentered">
                            <div className="column is-center">
                                <figure className="image is-128x128">
                                    <img src={SpinnerGif} alt="" />
                                </figure>
                            </div>
                        </div> 
                    ) : ""
                }  

                {selectedTab !== "lms" && headerTilesValues && headerTilesValues.length > 0 ? <ReportHeaderTiles values={headerTilesValues[0]} /> : ""}
                {selectedTab !== "lms" && headerTilesValues && headerTilesValues.length > 0 ? <ReportChartsMain values={headerTilesValues[0]} /> : ""}
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                {
                    selectedTab !== "lms" && tableValues && tableValues.length > 0 ? (
                        <ReportTableData 
                            values={tableValues} 
                            date={date}
                            isChecked={isShowAllDate} 
                            educLevel={selectedTab}
                            handleOnChangeDate={this.handleOnChangeDate} 
                            handleOnChangeCheckBox={this.handleOnChangeCheckBox}
                        /> 
                    ) : ""
                }
            </div>
        )
    }


}

export default withCookies(Reports)


export class ReportsHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="far fa-chart-bar"></i> Reports
            </div> 
        );
    }   
}