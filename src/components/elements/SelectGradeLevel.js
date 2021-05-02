import React, { Component } from "react";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import axios from 'axios';

class SelectGradeLevel extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        gradeLevels: null
    }
    componentDidMount = () => { 
        const { cookies, term, educLevel } = this.props;
        const data = { 
            department_abbr: educLevel ? educLevel.toLowerCase() : "",
            course_department: "",
            department: "",
            active_term: cookies.get("selterm") ? cookies.get("selterm") : term 
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
        };     
        axios.post(process.env.REACT_APP_API_UC_GET_OPEN_ENROLL_COURSES, data, {headers})
        .then(response => {
            //console.log(response.data)
            this.setState({ gradeLevels: response.data.colleges });      
        })
        .catch(error => {
            console.log(error);
        });
    }
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    
    render(){
        const { gradeLevels } = this.state; 
        const { value, required, fieldname, name } = this.props; 
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="30px" height="30px" />;  
        const gradesOptions = gradeLevels ? gradeLevels.map((grade, i) => {
            //let gradeLevelValue = ["N1","K1"].includes(grade.college_code) ? grade.college_code : ""; 
            return <option key={i} value={grade.college_code}>{grade.college_name}</option>
        }) : "";

        return(
            <div className="control is-expanded has-icons-left">
                <span className="select is-fullwidth">
                    <select name={name} value={value} disabled={gradeLevels && gradeLevels.length > 0 ? false : true} 
                            onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                        <option value="">{gradeLevels && gradeLevels.length > 0 ? "Select Grade" : "Enrollment Closed"}</option>
                        {gradesOptions}
                    </select>
                </span>
                <span className="icon is-small is-left">
                {gradeLevels ? <i className="fas fa-bars"></i> : SpinnerIcon}
                </span>
            </div>
        );
    }
}

export default withCookies(SelectGradeLevel)