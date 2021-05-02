import React, { Component } from "react";
import Select from 'react-select';

export default class SelectBarangay extends Component { 
    handleOnChange = e => {
        const { id } = this.props;
        this.props.handleOnChange(id, e);
    }
    render(){
        const {defaultValue,barangays} = this.props;
        let barangaysOptions = [];
        if(barangays) {
            barangays.map((barangay, i) => {
                barangaysOptions.push({ value: barangay.code, label: barangay.name });
                return true;
            });
        }

        return(
            <Select
                defaultValue={defaultValue}
                onChange={this.handleOnChange}
                options={barangaysOptions}                               
            /> 
        );
    }
}