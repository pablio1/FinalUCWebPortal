import React, { Component } from "react";
import { sortArrayObjectsByProp } from '../../helpers/helper';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import axios from 'axios';

export default class SelectProvince extends Component {
    state = {
        provinces: null
    }
    componentDidMount = () => {
        axios.get(process.env.REACT_APP_API_PH_PROVINCES)
        .then(response => {
            this.setState({ provinces: sortArrayObjectsByProp(response.data, "name") });      
        }).catch(error => {
            console.log(error);
        });
    }
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    
    render(){
        const { provinces } = this.state; 
        const { value, required, fieldname, name } = this.props; 
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="30px" height="30px" />;  
        const provincesOptions = provinces ? provinces.map((province, i) => {
            return <option key={i} value={province.code}>{province.name}</option>
        }) : "";

        return(
            <div className="control is-expanded has-icons-left">
                <span className="select is-fullwidth">
                    <select name={name} value={value} 
                            onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                        <option value="">Select Province</option>
                        {provincesOptions}
                    </select>
                </span>
                <span className="icon is-small is-left">
                {provincesOptions ? <i className="fas fa-map-marked"></i> : SpinnerIcon}
                </span>
            </div>
        );
    }
}