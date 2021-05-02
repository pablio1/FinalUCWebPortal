import React, { Component } from "react";
import SpinnerGif from '../../assets/sysimg/spinner.gif'

export default class SelectCity extends Component {
    handleOnChangeInput = e => {
        this.props.handleOnChangeInput(e);
    }
    render(){ 
        const { value, required, fieldname, name, cities, isProvinceSelected } = this.props;         
        const SpinnerIcon = <img src={SpinnerGif} alt="" width="30px" height="30px" />; 
        const showIcon = isProvinceSelected ? SpinnerIcon : <i className="fas fa-city"></i> ;
        const citiesOptions = cities ? cities.map((city, i) => {
            return <option key={i} value={city.name}>{city.name}</option>
        }) : "";     
        return(
            <div className="field">
                <div className="control has-icons-left">
                    <span className="select is-fullwidth">
                        <select name={name} value={value} 
                                onChange={this.handleOnChangeInput} required={required} data-fieldname={fieldname}>
                            <option value="">{citiesOptions ? "Select City" : "Select Province First"}</option>
                            {citiesOptions}
                        </select>
                    </span>
                    <span className="icon is-small is-left">
                        {showIcon}
                    </span>
                </div>
            </div>
        );
    }
}