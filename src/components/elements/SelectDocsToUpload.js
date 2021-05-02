import React, { Component, Fragment } from 'react';
import FileUploadDialog from './FileUploadDialog';
import { checkIfObjectExistInArray  } from '../../helpers/helper';
import { requiredEnrollmentCredentials } from '../../helpers/configObjects'

export default class SelectDocsToUpload extends Component {

    handleRemoveButton = e => {
        this.props.removeDocument(e);
    }
    handleSelectedFile = (id,e) => {
        this.props.handleSelectFile(id, e);
    }

    
    render() {
        const { filetitle, id, values } = this.props;
        let educationLevel = values.educLevel;
        if(["JD", "JT"].includes(values.selectedCourseCode)) educationLevel = "law"
        const SelectedFilesDetails = values.SelectedFilesDetails ? values.SelectedFilesDetails.filter(document => document.slug_id === id) : "";
        const filename = (SelectedFilesDetails  === undefined || SelectedFilesDetails.length === 0) ? "" : SelectedFilesDetails[0].data.filename;
        const foundRequired = checkIfObjectExistInArray(requiredEnrollmentCredentials(educationLevel).filter(document => document.required === true), "slug_id", id); 
        const allDocumentObj = requiredEnrollmentCredentials(educationLevel).filter(document => document.slug_id === id); 
        //const showDeleteBtn = values.SelectedFiles 
        return (                                                      
            <div className="columns">
                <div className="column is-1 is-hidden-mobile"></div>
                <div className="column"> 
                    <div className="box">
                        <div className="columns"> 
                            <div className="column is-4">                                             
                                <h3 className="has-text-weight-semibold is-size-5" >{filetitle}</h3>                                
                            </div>    
                            <div className="column is-7">   
                                <FileUploadDialog
                                    label="File"
                                    handleSelectedFile={this.handleSelectedFile}
                                    id={id}                                    
                                    requiredExtensions={allDocumentObj.length > 0 ? allDocumentObj[0].fileformat : ""}
                                    filename={filename}
                                />                                                                                           
                            </div> 
                            <div className="column">  
                            {
                                foundRequired.length > 0 ? "" : (
                                    <button 
                                        className="button is-danger is-fullwidth"
                                        onClick={this.handleRemoveButton} 
                                        text="Remove Document" 
                                        value={id}                                           
                                    >                                                
                                        <span className="is-hidden-tablet">Remove Document</span>       
                                        <div className="is-hidden-mobile">
                                            <i className="fas fa-trash-alt"></i>
                                        </div>         
                                    </button>
                                )
                            }                                                                                                      
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="column is-1 is-hidden-mobile"></div> 
            </div>                                                                                                          
        );
    }
}