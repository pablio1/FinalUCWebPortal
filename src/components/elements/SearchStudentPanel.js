import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';

import { isValidDate } from '../../helpers/helper';

export default class SearchStudentPanel extends Component {
    handleOnchangeInput = e => {
        if(e.target.name === "id_number") {
            if(/^[0-9 _]*$/.test(e.target.value)) { 
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            }
        } 
        else if(e.target.name === "date") {
            if(/^[0-9 _ -]*$/.test(e.target.value)) {
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            }
        }
        else {
            this.props.handleOnchangeInput(e.target.name, e.target.value);
        }   
    }
    handleKeyDown = e => {
        if (e.key === 'Enter') {
            if(e.target.name === "date" && e.target.value !== "") {
                if(isValidDate(e.target.value)) this.props.handleOnSearchEvent(e);
                else alert("Please enter a valid date.") 
            } 
            else this.props.handleOnSearchEvent(e);
        }
    }
    render() {        
        const { searcheables, searcher, courses, deptabbr } = this.props;
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{course.college_name}</option>
        }) : "";
        let yearOptions = (
            <Fragment>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </Fragment>
        )
        if(deptabbr === "SHS") {
            yearOptions = (
                <Fragment>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </Fragment>
            )
        } 
        if(deptabbr === "JHS") {
            yearOptions = (
                <Fragment>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </Fragment>
            )
        }
        if(deptabbr === "BED") {
            yearOptions = (
                <Fragment>
                    <option value="N1">N1</option>
                    <option value="K1">K1</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </Fragment>
            )
        }
        const loadSearchIDNumber = ["REGISTRAR", "CASHIER", "ACCOUNTING", "COOR", "DEAN", "CHAIRPERSON", "EDP", "ACAD"].includes(searcher) ? (
            <div className="column mb-2"> 
                <h5 className="has-text-weight-bold is-size-7">Search by ID Number</h5>
                <div className="field">
                    <p className="control has-icons-left">                                                    
                        <input name="id_number" className="input is-small" type="text" placeholder="Enter ID Number" 
                                value={searcheables.id_number} onChange={this.handleOnchangeInput} onKeyDown={this.handleKeyDown} />
                        <span className="icon is-small is-left">
                            <i className="fas fa-search"></i>
                        </span>
                    </p>
                </div>                                                                                                                                                                                                                                                                    
            </div>
        ) : "";
        const loadFilterCourse = ["REGISTRAR", "CASHIER", "ACCOUNTING", "COOR", "DEAN", "CHAIRPERSON", "EDP", "ACAD"].includes(searcher) ? (
            <div className="column mb-2"> 
                <h5 className="has-text-weight-bold is-size-7">Filter by Course</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="course" value={searcheables.course} onChange={this.handleOnchangeInput}>
                                    <option value="">Select Course</option>
                                    {coursesOptions}
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                <i className="fas fa-book"></i>
                            </span>
                        </div>
                    </div>                                                                                                                                                                                                                                                                      
            </div>
        ) : "";
        const loadFilterYear = ["COOR", "DEAN", "CHAIRPERSON", "ACAD"].includes(searcher) ? (
            <div className="column mb-2"> 
                <h5 className="has-text-weight-bold is-size-7">Filter by Year</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="filterYearLevel" value={searcheables.filterYearLevel} onChange={this.handleOnchangeInput}>
                                    <option value="0">Select Year</option>
                                    {yearOptions}
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                <i className="fas fa-book"></i>
                            </span>
                        </div>
                    </div>                                                                                                                                                                                                                                                                      
            </div>
        ) : "";
        return(  
            <Fragment>    
                <div className="columns is-vcentered"> 
                    {loadFilterCourse}
                    {loadFilterYear}                               
                    {loadSearchIDNumber}                    
                    <div className="column mb-2"> 
                        <h1 className="has-text-weight-bold is-size-7">Search by Name</h1>
                        <div className="field">
                            <p className="control has-icons-left">                                                    
                                <input name="name" className="input is-small" type="text" placeholder="Enter Name" 
                                        value={searcheables.name} onChange={this.handleOnchangeInput} onKeyDown={this.handleKeyDown} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>   
                    {/*                                  
                    <div className="column mb-2"> 
                        <h5 className="has-text-weight-bold is-size-7">Search by Date</h5>
                        <div className="field">
                            <p className="control has-icons-left">                                    
                                <input name="date" className="input is-small" type="text" placeholder="YYYY-MM-DD" 
                                        value={searcheables.date} onChange={this.handleOnchangeInput} onKeyDown={this.handleKeyDown}/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-search"></i>
                                </span> 
                            </p>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>
                    */}                                                                                           
                </div>     
            </Fragment> 
        )
    }
}