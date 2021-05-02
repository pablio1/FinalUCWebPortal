import React, { Component } from "react";
import { v_ValidateFileSelect } from '../../helpers/formValidation';

export default class FileUploadDialog extends Component {

    handleFileOnChange = e => {
        const {id, requiredExtensions} = this.props;
        if (v_ValidateFileSelect(e.target.files[0], requiredExtensions) === 0) this.props.handleSelectedFile(id, e.target.files[0]);               
    }
    
    render(){
        const { label, filename } = this.props;
        return (
            <div className={"file has-name " + (filename.length < 50 ? "is-fullwidth" : "")} >
                <label className="file-label">
                    <input className="file-input" type="file" accept=".pdf, image/*"  onChange={this.handleFileOnChange} />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">
                            {label}
                        </span>
                    </span>
                    <span className="file-name">
                        {filename}
                    </span>
                </label>
            </div> 
        );
    };    
}