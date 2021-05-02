import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';
import SpinnerGif from '../../assets/sysimg/spinner.gif'

export default class SearchSubjectPanel extends Component {
    state = {
        isChecked: false
    }
    handleOnChangeInput = e => {
        if(e.target.name === "searchEdpCodes") {
            if(/^[0-9 _ ,]*$/.test(e.target.value)) {
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            } 
        }
        else this.props.handleOnchangeInput(e.target.name, e.target.value);        
    }
    handleKeyDown = e => {     
        if (e.key === 'Enter') {            
            this.props.handleOnSearchEvent(e);
        }
    }
    handleOnChangeCheckBox = () => {
        const { isChecked } = this.state;
        this.setState({
            isChecked: !isChecked
        }, () => this.props.handleOnChangeCheckBox(this.state.isChecked));
    }
    render() {        
        const { edpcodes, subject, courses, sections, course, section, status, module } = this.props;
        const { isChecked } = this.state;
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="25px" height="25px" />; 
        const showIcon = courses ? <i className="fas fa-book"></i> : SpinnerIcon;
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{(course.college_name).split(" ")[0]}</option>
        }) : "";
        const sectionsOptions = sections ? sections.map((section, i) => {
            return <option key={i} value={section.section}>{(section.section).split(" ")[0]}</option>
        }) : "";   
        return(  
            <Fragment>    
                <div className="columns is-vcentered"> 
                    {
                        module === "EditSchedule" ? "" : (
                            <div className="column is-narrow"> 
                                <h5 className="has-text-weight-bold is-size-7">Assigned GenEd</h5>                        
                                <div className="field mt-3 mb-2">
                                    <div className="control pr-0 mr-0">
                                        <input id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" className="switch is-rounded is-info is-small" checked={isChecked} 
                                                onChange={this.handleOnChangeCheckBox} />
                                        <label htmlFor="switchRoundedInfo"></label>
                                    </div>
                                </div>   
                            </div>     
                        )
                    }                
                    <div className="column pt-1">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Course</h5>                        
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="filterCourse" value={course} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Course</option>
                                        {coursesOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {showIcon}
                                </span>
                            </div>
                        </div>   
                    </div>
                    <div className="column pt-1">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Filter by Section</h5>                         
                        <div className="field">
                            <div className="control has-icons-left">
                                <span className="select is-fullwidth is-small">
                                    <select name="filterSection" value={section} onChange={this.handleOnChangeInput}>
                                        <option value="">Select Section</option>
                                        {sectionsOptions}
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    {showIcon}
                                </span>
                            </div>
                        </div>    
                    </div>
                    {
                        status > 0 || module === "EditSchedule" || module === "TeachersLoading" ? (
                            <div className="column pt-1">
                                <h5 className="has-text-weight-bold mb-2 is-size-7">Filter By Status</h5>
                                <div className="field">
                                    <div className="control has-icons-left">
                                        <span className="select is-fullwidth is-small">
                                            <select name="filterStatus" value={status} onChange={this.handleOnChangeInput}>
                                                <option value="9">Select Status</option>
                                                {module === "EditSchedule" || module === "TeachersLoading" ? <option value="0">Undeployed</option> : "" }                                                
                                                <option value="1">Deployed</option>
                                                <option value="2">Dissolved</option>
                                                <option value="3">Requested</option>
                                                <option value="4">Deferred</option>
                                                <option value="5">Closed</option>
                                            </select>
                                        </span>
                                        <span className="icon is-small is-left">
                                            {showIcon}
                                        </span>
                                    </div>
                                </div> 
                            </div>
                        ) : ""
                    }                              
                    <div className="column pt-1">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Search by EDP Codes</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="searchEdpCodes" className="input is-small" type="text" placeholder="Search EDP Codes"
                                    onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} value={edpcodes} data-fieldname="EDP Codes"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>   
                    </div>
                    <div className="column pt-1">
                        <h5 className="has-text-weight-bold mb-2 is-size-7">Search by Subject Name</h5>
                        <div className="field">
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="searchSubject" className="input is-small" type="text" placeholder="Search Subject" 
                                    onChange={this.handleOnChangeInput} onKeyDown={this.handleKeyDown} value={subject} data-fieldname="Subject"/>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </div>
                        </div>
                    </div>                                                                                                                             
                </div>     
            </Fragment> 
        )
    }
}