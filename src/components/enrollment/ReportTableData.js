
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { sortArrayObjectsByProp } from '../../helpers/helper';

export default class ReportTableData extends Component {
    handleOnChangeDate = e => {
        this.props.handleOnChangeDate(e);
    }
    handleOnChangeCheckBox = e => {
        this.props.handleOnChangeCheckBox(e);
    }
    render() {
        const { values, date, isChecked, educLevel } = this.props;  
        const today = moment().format("DD-MM-YYYY")
        let subTotalRegistered = 0; 
        let subTotalSubject = 0;
        let subTotalPayment = 0;  
        let subTotalDean = 0; 
        let subTotalAccounting = 0;        
        let subTotalCashier = 0; 
        let subTotalPending = 0; 
        let subTotalOfficial = 0;  

        let rowSubTotalRegistered = 0; 
        let rowSubTotalSubject = 0; 
        let rowSubTotalPayment = 0;
        let rowSubTotalDean = 0; 
        let rowSubTotalAccounting = 0;          
        let rowSubTotalCashier = 0; 
        let rowSubTotalPending = 0; 
        let rowSubTotalOfficial = 0;  

        let subTotalSubjectYearLevel = [0,0,0,0,0];
        let subTotalDeanYearLevel = [0,0,0,0,0];
        let subTotalPaymentYearLevel = [0,0,0,0,0];
        let subTotalCashierYearLevel = [0,0,0,0,0];
        let subTotalOfficialYearLevel = [0,0,0,0,0];

        if(values && values.length > 0) {
            values.forEach(report => {
                if(educLevel.toUpperCase() === "COL") {
                    subTotalSubjectYearLevel[report.year_level - 1] += parseInt(report.subject_selection, 10);
                    subTotalDeanYearLevel[report.year_level - 1] += parseInt(report.pending_dean, 10);
                    subTotalPaymentYearLevel[report.year_level - 1] += parseInt(report.pending_payment, 10);
                    subTotalCashierYearLevel[report.year_level - 1] += parseInt(report.pending_cashier, 10);
                    subTotalOfficialYearLevel[report.year_level - 1] += parseInt(report.official_total, 10);
                }
                else {
                    subTotalSubjectYearLevel[report.year_level - 10] += parseInt(report.subject_selection, 10);
                    subTotalDeanYearLevel[report.year_level - 10] += parseInt(report.pending_dean, 10);
                    subTotalPaymentYearLevel[report.year_level - 10] += parseInt(report.pending_payment, 10);
                    subTotalCashierYearLevel[report.year_level - 10] += parseInt(report.pending_cashier, 10);
                    subTotalOfficialYearLevel[report.year_level - 10] += parseInt(report.official_total, 10);
            }                
            });
        }
        
        let courseRowCount = 0;
        let sortedValues = values && values.length > 0 && ["col","shs"].includes(educLevel) ? sortArrayObjectsByProp(values, "courseName") : values;
        const loadTableRows = values && values.length > 0 ? sortedValues.map((report, index) => {
            const courseRowNum = values.filter(course => course.courseName.split(" - ")[1] === report.courseName.split(" - ")[1]).length;
            const courseName = report.courseName.split(" - ");
            subTotalRegistered += parseInt(report.pending_registered, 10); 
            subTotalSubject += parseInt(report.subject_selection, 10);  
            subTotalDean += parseInt(report.pending_dean, 10);  
            subTotalAccounting += parseInt(report.pending_accounting, 10);  
            subTotalPayment += parseInt(report.pending_payment, 10);  
            subTotalCashier += parseInt(report.pending_cashier, 10);  
            subTotalPending += parseInt(report.pending_total, 10);  
            subTotalOfficial += parseInt(report.official_total, 10);
            
            rowSubTotalRegistered += parseInt(report.pending_registered, 10); 
            rowSubTotalSubject += parseInt(report.subject_selection, 10);  
            rowSubTotalDean += parseInt(report.pending_dean, 10);  
            rowSubTotalAccounting += parseInt(report.pending_accounting, 10);  
            rowSubTotalPayment += parseInt(report.pending_payment, 10);  
            rowSubTotalCashier += parseInt(report.pending_cashier, 10);  
            rowSubTotalPending += parseInt(report.pending_total, 10);  
            rowSubTotalOfficial += parseInt(report.official_total, 10);
            courseRowCount++;
            if(courseRowNum < courseRowCount + 1) {                
                let lastRowSubTotalRegistered = rowSubTotalRegistered; 
                let lastRowSubTotalSubject = rowSubTotalSubject;  
                let lastRowSubTotalDean = rowSubTotalDean;  
                let lastRowSubTotalAccounting = rowSubTotalAccounting;  
                let lastRowSubTotalPayment = rowSubTotalPayment;  
                let lastRowSubTotalCashier = rowSubTotalCashier;  
                let lastRowSubTotalPending = rowSubTotalPending;  
                let lastRowSubTotalOfficial = rowSubTotalOfficial;
                
                courseRowCount = 0;
                rowSubTotalRegistered = 0; 
                rowSubTotalSubject = 0; 
                rowSubTotalDean = 0; 
                rowSubTotalAccounting = 0; 
                rowSubTotalPayment = 0; 
                rowSubTotalCashier = 0; 
                rowSubTotalPending = 0; 
                rowSubTotalOfficial = 0; 
                return (    
                    <Fragment key={index}>           
                    <tr>
                        <td className="">{courseName[0]}</td>
                        <td className="">{courseName[1]}</td>
                        { ["col","shs"].includes(educLevel) ? <td className="">{report.year_level}</td> : null }
                        <td className="has-text-centered">{report.pending_registered}</td>
                        <td className="has-text-centered">{report.subject_selection}</td>
                        <td className="has-text-centered">{report.pending_payment}</td>
                        <td className="has-text-centered">{report.pending_dean}</td>
                        <td className="has-text-centered">{report.pending_accounting}</td>                    
                        <td className="has-text-centered">{report.pending_cashier}</td>
                        <td className="has-text-centered">{report.pending_total}</td>
                        <td className="has-text-centered">{report.official_total}</td>
                    </tr>
                    {
                        ["col","shs"].includes(educLevel) ? (
                            <tr className="has-background-grey-lighter">
                                <td className="">{courseName[0]}</td>
                                <td className="has-text-weight-semibold" colSpan="2">TOTAL {courseName[1]}</td>                        
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalRegistered}</td>
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalSubject}</td>
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalPayment}</td> 
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalDean}</td>
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalAccounting}</td>                                           
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalCashier}</td>
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalPending}</td>
                                <td className="has-text-centered has-text-weight-semibold">{lastRowSubTotalOfficial}</td>
                            </tr>
                        ) : ""
                    }
                    </Fragment>
                )
            }   
            else {
                return (               
                    <tr key={index}>
                        <td className="">{courseName[0]}</td>
                        <td className="">{courseName[1]}</td>
                        { ["col","shs"].includes(educLevel) ? <td className="">{report.year_level}</td> : null }
                        <td className="has-text-centered">{report.pending_registered}</td>
                        <td className="has-text-centered">{report.subject_selection}</td>
                        <td className="has-text-centered">{report.pending_payment}</td>
                        <td className="has-text-centered">{report.pending_dean}</td>
                        <td className="has-text-centered">{report.pending_accounting}</td>                    
                        <td className="has-text-centered">{report.pending_cashier}</td>
                        <td className="has-text-centered">{report.pending_total}</td>
                        <td className="has-text-centered">{report.official_total}</td>
                    </tr>
                )
            }
            
        }) : ""; 

        const loadTableByYearLevel = ["col","shs"].includes(educLevel) ? (
            <Fragment> 
            <h4 className="has-text-weight-bold is-size-5 m-3">ENROLLMENT STATS BY YEAR LEVEL</h4>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="button is-info is-small ml-3 mb-3"
                table="byYearLevel"
                filename={"EnrollmentStatYearLevel_" + today} 
                sheet="Enrollment"
                buttonText="Export to Excel"
            />
            
            <div className="columns">
                <div className="column">
                    <table id="byYearLevel" className="table is-bordered is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>YEAR LEVEL</th>
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>STUDENT<br />SUBJECT SELECTION</th>
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>PENDING DEAN<br />APPROVAL</th> 
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>STUDENT<br />PENDING PAYMENT</th>
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>PENDING CASHIER<br />APPROVAL</th>
                                <th className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>OFFICIALLY<br />ENROLLED</th>                                   
                            </tr>
                        </thead> 
                        { 
                            educLevel.toUpperCase() === "COL" ? (   
                                <Fragment>                        
                                <tbody>
                                    <tr>
                                        <td className="has-text-centered">1</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[0]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[0]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[0]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[0]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[0]}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered">2</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[1]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[1]}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered">3</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[2]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[2]}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered">4</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[3]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[3]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[3]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[3]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[3]}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered">5</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[4]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[4]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[4]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[4]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[4]}</td>
                                    </tr> 
                                    <tr className="has-background-grey-lighter">  
                                        <td>TOTAL</td>   
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalSubjectYearLevel[0], 10) + 
                                                parseInt(subTotalSubjectYearLevel[1], 10) + 
                                                parseInt(subTotalSubjectYearLevel[2], 10) + 
                                                parseInt(subTotalSubjectYearLevel[3], 10) +
                                                parseInt(subTotalSubjectYearLevel[4], 10)
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalDeanYearLevel[0], 10) + 
                                                parseInt(subTotalDeanYearLevel[1], 10) + 
                                                parseInt(subTotalDeanYearLevel[2], 10) + 
                                                parseInt(subTotalDeanYearLevel[3], 10) +
                                                parseInt(subTotalDeanYearLevel[4], 10)
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalPaymentYearLevel[0], 10) + 
                                                parseInt(subTotalPaymentYearLevel[1], 10) + 
                                                parseInt(subTotalPaymentYearLevel[2], 10) + 
                                                parseInt(subTotalPaymentYearLevel[3], 10) +
                                                parseInt(subTotalPaymentYearLevel[4], 10)
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalCashierYearLevel[0], 10) + 
                                                parseInt(subTotalCashierYearLevel[1], 10) + 
                                                parseInt(subTotalCashierYearLevel[2], 10) + 
                                                parseInt(subTotalCashierYearLevel[3], 10) +
                                                parseInt(subTotalCashierYearLevel[4], 10)
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalOfficialYearLevel[0], 10) + 
                                                parseInt(subTotalOfficialYearLevel[1], 10) + 
                                                parseInt(subTotalOfficialYearLevel[2], 10) + 
                                                parseInt(subTotalOfficialYearLevel[3], 10) +
                                                parseInt(subTotalOfficialYearLevel[4], 10)
                                            }
                                        </td>                    
                                    </tr>                         
                                </tbody>
                                </Fragment>
                            ) : (
                                <Fragment>                        
                                <tbody>
                                    <tr>
                                        <td className="has-text-centered">11</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[1]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[1]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[1]}</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-centered">12</td>
                                        <td className="has-text-centered">{subTotalSubjectYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalDeanYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalPaymentYearLevel[2]}</td>
                                        <td className="has-text-centered">{subTotalCashierYearLevel[2]}</td>                    
                                        <td className="has-text-centered">{subTotalOfficialYearLevel[2]}</td>
                                    </tr> 
                                    <tr className="has-background-grey-lighter">  
                                        <td>TOTAL</td>   
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalSubjectYearLevel[1], 10) + 
                                                parseInt(subTotalSubjectYearLevel[2], 10) 
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalDeanYearLevel[1], 10) + 
                                                parseInt(subTotalDeanYearLevel[2], 10) 
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalPaymentYearLevel[1], 10) + 
                                                parseInt(subTotalPaymentYearLevel[2], 10) 
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalCashierYearLevel[1], 10) + 
                                                parseInt(subTotalCashierYearLevel[2], 10) 
                                            }
                                        </td>
                                        <td className="has-text-centered has-text-weight-semibold">
                                            {
                                                parseInt(subTotalOfficialYearLevel[1], 10) + 
                                                parseInt(subTotalOfficialYearLevel[2], 10) 
                                            }
                                        </td>                                                            
                                    </tr>                                                           
                                </tbody>
                                </Fragment>
                            )
                        }
                    </table>
                </div>
            </div>
            </Fragment> 
        ) : "";
        const loadTableByCollege = ["col","shs"].includes(educLevel) ? (
            <Fragment>
            <div className="columns">
                <div className="column">
                    <table id="report" className="table is-bordered is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th rowSpan="2" className="has-text-centered" style={{  verticalAlign: "middle" }}>COLLEGE</th>
                                <th rowSpan="2" className="has-text-centered" style={{  verticalAlign: "middle" }}>{educLevel.toUpperCase() === "COL" ? "COURSE" : "STRAND"}</th>
                                <th rowSpan="2" className="has-text-centered" style={{  verticalAlign: "middle" }}>YEAR</th>
                                <th colSpan="3" className="has-text-centered is-narrow">PENDING STUDENT ACTION</th>
                                <th colSpan="3" className="has-text-centered is-narrow">PENDING APPROVAL</th>
                                <th rowSpan="2" className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>TOTAL<br />PENDING</th>   
                                <th rowSpan="2" className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>OFFICIALLY<br />ENROLLED</th>                                   
                            </tr>
                            <tr>
                                <th className="has-text-centered is-narrow">REGISTRATION</th>
                                <th className="has-text-centered is-narrow">SUBJECT SELECTION</th>
                                <th className="has-text-centered is-narrow">PAYMENT</th>
                                <th className="has-text-centered is-narrow">DEAN</th>
                                <th className="has-text-centered is-narrow">ACCOUNTING</th>                                    
                                <th className="has-text-centered is-narrow">CASHIER</th>                                   
                            </tr>
                        </thead>                            
                        <tbody>
                            {
                                loadTableRows ? loadTableRows : (
                                    <tr>
                                        <td className="">TBA</td>
                                        <td className="">TBA</td>
                                        <td className="">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                        <td className="has-text-centered">TBA</td>
                                    </tr>
                                )
                            }                                
                        </tbody>
                        <tfoot>
                            <tr>  
                                <th></th>
                                <th className="" colSpan="2">TOTAL COLLEGE</th>   
                                <th className="has-text-centered is-narrow">{subTotalRegistered}</th>
                                <th className="has-text-centered is-narrow">{subTotalSubject}</th>
                                <th className="has-text-centered is-narrow">{subTotalPayment}</th>
                                <th className="has-text-centered is-narrow">{subTotalDean}</th>
                                <th className="has-text-centered is-narrow">{subTotalAccounting}</th>                                    
                                <th className="has-text-centered is-narrow">{subTotalCashier}</th>
                                <th className="has-text-centered is-narrow">{subTotalPending }</th>
                                <th className="has-text-centered is-narrow">{subTotalOfficial}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            </Fragment>
        ) : (
            <div className="columns">
                <div className="column">
                        <table id="report" className="table is-bordered is-striped is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th rowSpan="2" className="has-text-centered" style={{  verticalAlign: "middle" }}>LEVEL</th>
                                    <th rowSpan="2" className="has-text-centered" style={{  verticalAlign: "middle" }}>GRADE</th>
                                    <th colSpan="3" className="has-text-centered is-narrow">PENDING STUDENT ACTION</th>
                                    <th colSpan="3" className="has-text-centered is-narrow">PENDING APPROVAL</th>
                                    <th rowSpan="2" className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>TOTAL<br />PENDING</th>   
                                    <th rowSpan="2" className="has-text-centered is-narrow" style={{  verticalAlign: "middle" }}>OFFICIALLY<br />ENROLLED</th>                                   
                                </tr>
                                <tr>
                                    <th className="has-text-centered is-narrow">REGISTRATION</th>
                                    <th className="has-text-centered is-narrow">SUBJECT SELECTION</th>
                                    <th className="has-text-centered is-narrow">PAYMENT</th>
                                    <th className="has-text-centered is-narrow">DEAN</th>
                                    <th className="has-text-centered is-narrow">ACCOUNTING</th>                                    
                                    <th className="has-text-centered is-narrow">CASHIER</th>                                   
                                </tr>
                            </thead>                            
                            <tbody>
                                {
                                    loadTableRows ? loadTableRows : (
                                        <tr>
                                            <td className="">TBA</td>
                                            <td className="">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                            <td className="has-text-centered">TBA</td>
                                        </tr>
                                    )
                                }                                
                            </tbody>
                            <tfoot>
                                <tr>  
                                    <th></th>
                                    <th className="">TOTAL</th>   
                                    <th className="has-text-centered is-narrow">{subTotalRegistered}</th>
                                    <th className="has-text-centered is-narrow">{subTotalSubject}</th>
                                    <th className="has-text-centered is-narrow">{subTotalPayment}</th>
                                    <th className="has-text-centered is-narrow">{subTotalDean}</th>
                                    <th className="has-text-centered is-narrow">{subTotalAccounting}</th>                                    
                                    <th className="has-text-centered is-narrow">{subTotalCashier}</th>
                                    <th className="has-text-centered is-narrow">{subTotalPending }</th>
                                    <th className="has-text-centered is-narrow">{subTotalOfficial}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
            </div>
        );

        return(
            <Fragment>
            <div className="columns">
                <div className="column"> 
                    <div className="field">
                        <div className="field-label"></div>
                        <div className="field-body">
                            <div className="field">
                                <div className="field has-addons">
                                    <p className="control has-text-weight-semibold is-size-6 mr-2">
                                        Show All
                                    </p>
                                    <p className="control">
                                        <input id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" className="switch is-rounded is-info is-small" checked={isChecked} 
                                                onChange={this.handleOnChangeCheckBox} />
                                        <label htmlFor="switchRoundedInfo"></label>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-label"></div>
                        <div className="field-body">
                            <div className="field">
                                <div className="field has-addons">
                                    <p className="control has-text-weight-semibold is-size-6 mr-2">
                                        Show by Date
                                    </p>
                                    <p className="control">
                                        <input name="showByDate" type="date" value={date} onChange={this.handleOnChangeDate} disabled={isChecked} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="button is-info is-small"
                        table="report"
                        filename={"EnrollmentStat_" + today} 
                        sheet="Enrollment"
                        buttonText="Export to Excel"
                    />                          
                </div> 
            </div>
            {loadTableByCollege}
            {loadTableByYearLevel}                  
            </Fragment>
        );
    };

}