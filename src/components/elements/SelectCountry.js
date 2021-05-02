import React, { Component } from "react";
import axios from 'axios';

export default class SelectCountry extends Component {
    state = {
        countries: null
    }
    componentDidMount = () => {
        axios.get(process.env.REACT_APP_API_COUNTRIES)
        .then(response => {
            if(response.data) {
                this.setState({ countries: response.data });  
            }    
        }).catch(error => {
            console.log(error);
        });
    }
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    render(){         
        const { countries } = this.state; 
        const { value, required, fieldname, name } = this.props; 
    
        const countriesOptions = countries ? countries.map((country, i) => {
            return <option key={i} value={country.name}>{country.name}</option>
        }) : "";

        return(
            <div className="control is-expanded has-icons-left">
                <span className="select is-fullwidth">
                    <select name={name} value={value} 
                            onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                        <option value="">Select Country</option>
                        {countriesOptions}
                    </select>
                </span>
                <span className="icon is-small is-left">
                    <i className="fab fa-font-awesome-flag"></i>
                </span>
            </div>
        );
    }
}