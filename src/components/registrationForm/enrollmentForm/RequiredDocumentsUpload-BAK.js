import React, { Component, Fragment } from 'react';
import RegistrationFormSteps from '../../elements/RegistrationFormSteps';
import SelectDocsToUpload from '../../elements/SelectDocsToUpload';
import { getDifferenceBetweenArrayObjects } from '../../../helpers/helper';
import { requiredEnrollmentCredentials } from '../../../helpers/configObjects'
import { v_RequiredDocumentsUpload } from '../../../helpers/formValidation';

export default class RequiredDocumentsUpload extends Component {   
    state= {
        requiredDocuments: [], selectedDocument: "", selectedDocuments: []
    }
    componentDidMount = () => {
        const { values, educLevel } = this.props;
        let requiredDocuments =  requiredEnrollmentCredentials(educLevel); 
        const notSelectedDocsObj = getDifferenceBetweenArrayObjects(requiredDocuments, values.SelectedFilesDetails, "slug_id");  
        const selectedDocsObj = getDifferenceBetweenArrayObjects(requiredDocuments, notSelectedDocsObj, "slug_id");  
        this.setState({ 
            requiredDocuments: notSelectedDocsObj,
            selectedDocuments: selectedDocsObj
        });           
    }
    handleButtonClick = e => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {
            const {values} = this.props;  
            //Simple Validation - Check only if required field filled 
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_RequiredDocumentsUpload(values) === 0) this.props.nextStep();  
            }
            else this.props.nextStep();  
        }    
    }
    handleAddDocumentBtn = () => {
        const { selectedDocuments, selectedDocument, requiredDocuments } = this.state;
        //get selected document from requiredDocuments to be added to selectedDocuments
        const selectedDocumentObj = requiredDocuments.filter(document => document.slug_id === selectedDocument); 
        //remove selected document from requiredDocuments
        const requiredDocumentsObj = requiredDocuments.filter(document => document.slug_id !== selectedDocument);  
        this.setState({ 
            selectedDocuments: [...selectedDocuments, ...selectedDocumentObj ],
            requiredDocuments: [...requiredDocumentsObj],
            selectedDocument: ""
        });
    }
    handleSelectFile = (id,e) => {
        const { selectedDocuments } = this.state;
        const selectedDocumentObj = selectedDocuments.filter(document => document.slug_id === id); 
        this.props.handleSelectFile(id, selectedDocumentObj[0].name, e);
    }
    handleSelectDocument = e => {
        this.setState({ selectedDocument: e.target.value });
    } 
    removeDocument = e => {
        const { selectedDocuments, requiredDocuments } = this.state;
        //get selected document from selectedDocuments and add to requiredDocuments
        const requiredDocumentsObj = selectedDocuments.filter(document => document.slug_id === e.target.value); 
        //remove selected document from selectedDocuments
        const selectedDocumentsObj = selectedDocuments.filter(document => document.slug_id !== e.target.value);  
        this.setState({ 
            selectedDocuments: [...selectedDocumentsObj ],
            requiredDocuments: [...requiredDocuments, ...requiredDocumentsObj],
            selectedDocument: ""
        });
        
        this.props.removeSelectedFile(e.target.value);
    }   
    render() {
        const { values } = this.props; 
        const { requiredDocuments, selectedDocuments, selectedDocument } = this.state;
        const selectOptions = requiredDocuments.map((doc, index) => 
            <option key={index + 1} value={doc.slug_id}>{doc.name}</option>    
        );
        const uploadPanels = selectedDocuments ? selectedDocuments.map((document, index) =>         
            <SelectDocsToUpload 
                key={index}
                id={document.slug_id}
                values={values}
                filetitle={document.name}
                handleSelectFile={this.handleSelectFile}                                       
                removeDocument={this.removeDocument}
            />
        ) : "";
        let formSteps = "";    
        if(values.educLevel === "col") formSteps = ["Course Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        else if(values.educLevel === "shs") formSteps = ["Strand Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        else formSteps = ["Grade Level Selection", "Personal Details", "Address & Contact Details", "Previous School Details", "Required Documents Upload"];
        return(      
            <Fragment>             
                <div className="columns">
                    <div className="column">
                        <RegistrationFormSteps 
                            styles="is-small is-centered has-content-centered is-horizontal"
                            steps={formSteps}
                            formStep={4} //for Required Documents Upload
                        />
                    </div>
                </div>  
                <div className="section">
                    <div className="columns">
                        <div className="column pt-0">
                            <div className="has-text-centered"> 
                                <h3 className="has-text-weight-semibold is-size-4">Required Documents Upload</h3>  
                                <h4 className="mt-1">
                                    Clear legible scanned or photo finished copy are accepted. Each files must not exceed to 10MB. Accepted file formats are jpeg/jpg, png and pdf.  
                                </h4>   
                            </div> 
                            <div className="">
                                <div className="divider is-size-6"></div>
                            </div>
                            {uploadPanels}
                            <div>
                                <div className="divider is-size-6 mb-0 pb-1"></div>
                            </div>
                            <div className="mt-0 pt-0">
                                <h5 className="has-text-weight-bold mb-2 has-text-centered">Select Document(s) To Upload</h5>
                            </div>
                            <div className="columns is-vcentered">
                                <div className="column is-1 is-hidden-mobile"></div>
                                    <div className="column">
                                        <div className="control is-expanded has-icons-left">
                                            <span className="select is-fullwidth">
                                                <select name="documentSelection" onChange={this.handleSelectDocument} value={selectedDocument}>   
                                                    <option key={0} value="">Select Document</option>                                                     
                                                    {selectOptions}
                                                </select>
                                            </span>
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-file-upload"></i>
                                            </span>
                                        </div>    
                                    </div> 
                                    <div className="column">
                                        <button 
                                            className="button is-success is-fullwidth"
                                            onClick={this.handleAddDocumentBtn}                                                
                                        >                                                
                                            <span>Add Document</span>      
                                            <span className="icon">
                                                <i className="fas fa-plus"></i>
                                            </span>                                                  
                                        </button> 
                                    </div>                                                 
                                <div className="column is-1 is-hidden-mobile"></div>                                           
                            </div>
                            <div>
                                <div className="divider is-size-6"></div>
                            </div>
                            <nav className="level">
                                <div className="level-left mb-0 pb-0">
                                    <button 
                                        className="button is-info is-fullwidth"
                                        onClick={() => this.handleButtonClick("back")}                                                
                                    >
                                        <span className="icon">
                                            <i className="fas fa-chevron-left"></i>
                                        </span>
                                        <span>Back</span>
                                    </button>
                                </div>
                                <div className="level-right mt-1 pt-0">
                                    <button 
                                        className="button is-info is-fullwidth"
                                        onClick={() => this.handleButtonClick("continue")}                                                
                                    >                                                
                                        <span>Preview Form</span>
                                        <span className="icon">
                                            <i className="fas fa-chevron-right"></i>
                                        </span>
                                    </button>
                                </div>  
                            </nav>                                                               
                        </div>
                    </div> 
                </div>                                  
            </Fragment>
        )   
    }
}
