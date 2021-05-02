import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import { isValidDate } from '../../helpers/helper';

export default class SearchStudentPanelFull extends Component {
    state = {
        collegeSelected: false
    }
    handleOnChangeInput = e => {
        if(e.target.name === "searchIDNumber") {
            if(/^[0-9 _]*$/.test(e.target.value)) { 
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            }
        } 
        else if(e.target.name === "searchDate") {
            if(/^[0-9 _ -]*$/.test(e.target.value)) {
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            }
        }
        else {            
            this.props.handleOnchangeInput(e.target.name, e.target.value);
            if(e.target.name === "searchFilterCollege") {
                const { collegeSelected } = this.state;
                this.setState({
                    collegeSelected: !collegeSelected
                });
            }
        }
    }
    handleKeyDown = e => {
        if (e.key === 'Enter') {
            if(e.target.name === "searchDate" && e.target.value !== "") {
                if(isValidDate(e.target.value)) this.props.handleOnSearchEvent(e);
                else alert("Please enter a valid date.") 
            } 
            else this.props.handleOnSearchEvent(e);
        }
    }
    render() {        
        const { searcheables, courses, colleges, searcher, educLevel, module } = this.props;
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="25px" height="25px" />; 
        const showIconCourses = courses ? <i className="fas fa-book"></i> : SpinnerIcon;
        const showIconColleges = colleges ? <i className="fas fa-book"></i> : SpinnerIcon;
        const collegesOptions = colleges ? colleges.map((college, i) => {
            return <option key={i} value={college.dept_abbr}>{college.dept_name}</option>
        }) : "";
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{(course.college_name).split(" ")[0]}</option>
        }) : "";
        const loadFilterSteps = module === "studentEnrollmentTracker" ? (
            <div className="column mb-0">
                <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Step</h5>                        
                <div className="field">
                    <div className="control has-icons-left">
                        <span className="select is-fullwidth is-small">
                            <select name="filterEnrollStep" value={searcheables.filterEnrollStep} onChange={this.handleOnChangeInput}>
                                <option value="99">Select Step</option>                
                                <option value="0">Step 1</option>
                                <option value="1">Step 2 (Approved)</option>
                                <option value="2">Step 2 (Disapproved)</option>
                                <option value="3">Step 3 (Approved)</option>
                                <option value="4">Step 3 (Disapproved)</option>
                                <option value="5">Step 4</option>
                                <option value="6">Step 5</option>
                                <option value="8">Step 6 / Step 7 (Pending)</option>
                                <option value="10">Step 7 (Approved) / Step 8</option>   
                                <option value="13">Cancelled</option>                       
                            </select>
                        </span>
                        <span className="icon is-small is-left">
                            <i className="fas fa-shoe-prints"></i>
                        </span>
                    </div>
                </div>   
            </div>
        ) : "";
        return(  
            <div className="columns is-vcentered">
                {
                    //searcher && searcher !== "DEAN" ? (
                    searcher && !["DEAN", "CHAIRPERSON", "COOR"].includes(searcher) ? (  
                        <div className="column mb-0">
                            <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by College</h5>                        
                            <div className="field">
                                <div className="control has-icons-left">
                                    <span className="select is-fullwidth is-small">
                                        <select name="searchFilterCollege" value={searcheables.searchFilterCollege} onChange={this.handleOnChangeInput}>
                                            <option value="">Select College</option>
                                            {collegesOptions}
                                            <option value="SHS">Senior High</option>
                                            <option value="JHS">Junior High</option>
                                            <option value="BED">Elementary</option>
                                        </select>
                                    </span>
                                    <span className="icon is-small is-left">
                                        {showIconColleges}
                                    </span>
                                </div>
                            </div>   
                        </div> 
                    ) : ""
                }
                <div className="column mb-0">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Course</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="searchFilterCourse" value={searcheables.searchFilterCourse} onChange={this.handleOnChangeInput}>
                                    <option value="">Select Course</option>
                                    {coursesOptions}
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                {this.state.collegeSelected ? showIconCourses : <i className="fas fa-book"></i>}
                            </span>
                        </div>
                    </div>   
                </div>
                <div className="column mb-0">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Year Level</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="searchFilterYear" value={searcheables.searchFilterYear} onChange={this.handleOnChangeInput}>
                                    <option value="0">Select Year</option>
                                    {
                                        educLevel === "shs" ? (
                                            <Fragment>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            </Fragment> 
                                        ) : (
                                            <Fragment>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            </Fragment>
                                        )
                                    }                                    
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                <i className="fas fa-book"></i>
                            </span>
                        </div>
                    </div>   
                </div>
                <div className="column mb-0">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Filter By Classification</h5>
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="searchFilterClassification" value={searcheables.searchFilterClassification} onChange={this.handleOnChangeInput}>
                                    <option value="">Select Classification</option>
                                    <option value="H">New Student</option>
                                    <option value="O">Old Student</option>
                                    <option value="T">Transferee</option>
                                    <option value="C">Cross Enrollee</option>
                                    <option value="R">Returnee</option>
                                    <option value="S">Shiftee</option>
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                <i className="fas fa-book"></i>
                            </span>
                        </div>
                    </div> 
                </div>     
                {loadFilterSteps}                           
                <div className="column mb-0"> 
                    <h5 className="has-text-weight-bold is-size-7 mb-2">Search by ID Number</h5>
                    <div className="field">
                        <p className="control has-icons-left">                                                    
                            <input name="searchIDNumber" className="input is-small" type="text" placeholder="Enter ID Number" 
                                    value={searcheables.searchIDNumber} onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-search"></i>
                            </span>
                        </p>
                    </div>                                                                                                                                                                                                                                                                    
                </div>
                <div className="column mb-0"> 
                    <h1 className="has-text-weight-bold is-size-7 mb-2">Search by Name</h1>
                    <div className="field">
                        <p className="control has-icons-left">                                                    
                            <input name="searchName" className="input is-small" type="text" placeholder="Enter Name" 
                                    value={searcheables.searchName} onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-search"></i>
                            </span>
                        </p>
                    </div>                                                                                                                                                                                                                                                                    
                </div>                                     
                <div className="column mb-0"> 
                    <h5 className="has-text-weight-bold is-size-7 mb-2">Search by Date</h5>
                    <div className="field">
                        <p className="control has-icons-left">                                    
                            <input name="searchDate" className="input is-small" type="text" placeholder="YYYY-MM-DD" 
                                    value={searcheables.searchDate} onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown}/>
                            <span className="icon is-small is-left">
                                <i className="fas fa-search"></i>
                            </span> 
                        </p>
                    </div>                                                                                                                                                                                                                                                                    
                </div>                                                                                           
            </div>  
        )
    }
}