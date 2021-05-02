import React, { Component } from "react";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import axios from 'axios';

class SelectStrand extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        strands: null
    }
    componentDidMount = () => { 
        const { cookies, term } = this.props;
        const data = { 
            department_abbr: "SHS",
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
            this.setState({ strands: response.data.colleges });      
        })
        .catch(error => {
            console.log(error);
        });
    }
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    
    render(){
        const { strands } = this.state; 
        const { value, required, fieldname, name } = this.props; 
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="30px" height="30px" />;  
        const strandsOptions = strands ? strands.map((strand, i) => {
            return <option key={i} value={strand.college_code}>{strand.college_name}</option>
        }) : "";

        return(
            <div className="control is-expanded has-icons-left">
                <span className="select is-fullwidth">
                    <select name={name} value={value} disabled={strands && strands.length > 0 ? false : true} 
                            onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                        <option value="">{strands && strands.length > 0 ? "Select Strand" : "Enrollment Closed"}</option>
                        {strandsOptions}
                    </select>
                </span>
                <span className="icon is-small is-left">
                {strandsOptions ? <i className="fas fa-university"></i> : SpinnerIcon}
                </span>
            </div>
        );
    }
}

export default withCookies(SelectStrand)