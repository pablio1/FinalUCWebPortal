import React, { Component } from "react";
import SpinnerGif from '../../assets/sysimg/spinner.gif'

export default class SelectCourse extends Component {
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    
    render(){
        const { value, required, fieldname, name, courses, isCollegeSelected } = this.props;   
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="30px" height="30px" />;  
        const showIcon = isCollegeSelected ? SpinnerIcon : <i className="fas fa-book"></i>;
        const coursesOptions = courses ? courses.map((course, i) => {
            return <option key={i} value={course.college_code}>{course.college_name}</option>
        }) : "";

        return(
            <div className="control is-expanded has-icons-left">
                <span className="select is-fullwidth">
                    <select name={name} value={value} disabled={courses && courses.length > 0 ? false : true}
                            onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                        <option value="">{courses && courses.length > 0 ? "Select Course" : "Enrollment Closed"}</option>
                        {coursesOptions}
                    </select>
                </span>
                <span className="icon is-small is-left">
                {showIcon}
                </span>
            </div>
        );
    }
}