import React, { Component, Fragment } from 'react';

import { YearsBetween } from '../../../../helpers/helper'

export default class PreviousSchoolPrimary extends Component {   
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e);
        if(e.target.name === "isSameSecondary" && e.target.checked) {
            this.props.handleOnChangeInput("schoolNamePrimary", this.props.values.schoolNameSecondary);
        }
    }
    handleOnChangeInput = e => {     
        this.props.handleOnChangeInput(e.target.name, e.target.value);
    }

    render() {
        const { values } = this.props; 
        const schoolName = (values.isSameSecondary) ? values.schoolNameSecondary : values.schoolNamePrimary;
        const yearsOptionsAsc = YearsBetween(new Date("1970-01-01"), new Date()).map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );
        const yearsOptionsDesc = YearsBetween(new Date("1970-01-01"), new Date(),"desc").map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );      

        const escPrimary = (values.schoolTypePrimary === "private") ? (
            <Fragment>
            <div className="column">                                                
                <h5 className="has-text-weight-bold mb-2">ESC Student #</h5>
                <div className="field">
                    <p className="control has-icons-left has-icons-right">                                                    
                        <input 
                            name="escStudentNumPrimary" className="input" type="text" placeholder="Enter ESC Student #" 
                            maxLength="100" value={values.escStudentNumPrimary} onChange={this.handleOnChangeInput}     
                        />
                        <span className="icon is-small is-left">
                            <i className="fas fa-barcode"></i>
                        </span>
                    </p>
                </div>                                                                                                                                                                                                                                                                
            </div>
            <div className="column" >                                                
                <h5 className="has-text-weight-bold mb-2">ESC School #</h5>
                <div className="field">
                    <p className="control has-icons-left has-icons-right">                                                    
                        <input 
                            name="escSchoolNumPrimary" className="input" type="text" placeholder="ESC School #" 
                            maxLength="100" value={values.escSchoolNumPrimary} onChange={this.handleOnChangeInput}  
                        />
                        <span className="icon is-small is-left">
                            <i className="fas fa-barcode"></i>
                        </span>
                    </p>
                </div>                                                                                                                                                                                                                                                                
            </div>
            </Fragment>            
        ) : (
            <div className="column"></div>
        );
        return(                
            <Fragment>                
                {
                   values.educLevel === "bed" && values.selectedEntryStatusPrimary === "H" && ["N1","K1"].includes(values.selectedGradeLevel) ? (
                        <div className="columns is-vcentered">
                            <div className="column mt-4">
                                <h4 className="has-text-weight-semibold has-text-centered is-size-5 mb-0 pb-0">Since you're enrolling a new Nursery/Kindergarten Student, this section of the form is not required. Please click proceed.</h4>
                            </div>
                        </div>    
                   ) : (
                        <Fragment>
                            <div className="columns is-vcentered mt-0 pt-0">
                                <div className="column is-1 is-hidden-mobile"></div>
                                <div className="column is-narrow mb-0 pb-0">
                                    <h3 className="has-text-weight-bold is-size-5 mb-0 pb-0">Primary School</h3>
                                    {
                                        (values.educLevel === "shs" && values.selectedYearLevelSecondary === 12) || values.educLevel === "col" ? (
                                            <Fragment>
                                            <label className="checkbox">
                                                <input type="checkbox" name="isSameSecondary" checked={values.isSameSecondary} onChange={this.handleCheckBoxChange} />
                                                &nbsp;Same as Secondary
                                            </label>
                                            <br />
                                            </Fragment>
                                        ) : ""
                                    } 
                                </div>
                            </div>
                            <div className="columns is-vcentered">
                                <div className="column is-1 is-hidden-mobile"></div>                                                  
                                <div className="column">                                                
                                    <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> School Name</h5>
                                    <div className="field">
                                        <p className="control has-icons-left has-icons-right">                                                    
                                            <input 
                                                name="schoolNamePrimary" className="input" type="text" placeholder="Enter School Name" 
                                                maxLength="200" value={schoolName} onChange={this.handleOnChangeInput}  disabled={values.isSameSecondary}      
                                                required data-fieldname="Primary School Name"
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-school"></i>
                                            </span>
                                        </p>
                                    </div>                                                                                                                                                                                                                                                                
                                </div>
                                <div className="column is-narrow">                                                
                                    <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Last Year Level</h5>
                                    <div className="field">
                                        <div className="field">
                                            <p className="control is-expanded has-icons-left">
                                                <span className="select is-fullwidth">
                                                    <select name="lastYearLevelPrimary" value={values.lastYearLevelPrimary} onChange={this.handleOnChangeInput}
                                                            required data-fieldname="Primary Last Year Level">
                                                        <option value="">Select Year Level</option>
                                                        <option value="6">6</option>
                                                        <option value="5">5</option>
                                                        <option value="4">4</option>
                                                        <option value="3">3</option>
                                                        <option value="2">2</option>
                                                        <option value="1">1</option>
                                                        <option value="K1">K1</option> 
                                                        <option value="N1">N1</option> 
                                                    </select>
                                                </span>
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-bars"></i>
                                                </span>
                                            </p>
                                        </div>                                                     
                                    </div>                                                                                                                                                                                                                                                                
                                </div>
                                <div className="column is-narrow">                                                
                                    <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> School Year</h5>
                                    <div className="field has-addons">
                                        <p className="control">                                                   
                                            <span className="select is-fullwidth">
                                                <select name="schoolYearStartPrimary" value={values.schoolYearStartPrimary} onChange={this.handleOnChangeInput}
                                                        required data-fieldname="Primary School Year From">
                                                    <option key={0} value="">From</option>
                                                    {yearsOptionsAsc} 
                                                </select>
                                            </span>
                                        </p>
                                        <p className="control">
                                            <a className="button is-info" href="#top">
                                            -
                                            </a>
                                        </p>
                                        <p className="control">                                                    
                                            <span className="select is-fullwidth">
                                                <select name="schoolYearEndPrimary" value={values.schoolYearEndPrimary} onChange={this.handleOnChangeInput}
                                                        required data-fieldname="Primary School Year To">
                                                    <option key={0} value="">To</option>
                                                    {yearsOptionsDesc} 
                                                </select>
                                            </span>
                                        </p>
                                    </div>                                                                                                                                                                                                                                                                
                                </div>
                                <div className="column is-narrow">                                             
                                    <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> School Type</h5>
                                    <div className="field">
                                        <p className="control is-expanded has-icons-left">
                                            <span className="select is-fullwidth">
                                                <select name="schoolTypePrimary" value={values.schoolTypePrimary} onChange={this.handleOnChangeInput}
                                                        required data-fieldname="Primary School Type">
                                                    <option value="">Select School Type</option>
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                </select>
                                            </span>
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-award"></i>
                                            </span>
                                        </p>
                                    </div>                                                                                                                                                                                                                                                                    
                                </div>                                                
                                <div className="column is-1 is-hidden-mobile"></div>                                                               
                            </div>
                            <div className="columns is-vcentered">
                                <div className="column is-1 is-hidden-mobile"></div>                                                  
                                <div className="column">                                                
                                    <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> LRN
                                        <span className="has-text-weight-normal is-size-6"> ( Indicate TBA if information not available now )</span>
                                    </h5>
                                    <div className="field">
                                        <p className="control has-icons-left has-icons-right">                                                    
                                            <input 
                                                name="lrnNumberPrimary" className="input" type="text" placeholder="Enter LRN" 
                                                maxLength="12" value={values.lrnNumberPrimary} onChange={this.handleOnChangeInput}
                                                required data-fieldname="Primary LRN" 
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-barcode"></i>
                                            </span>
                                        </p>
                                    </div>                                                                                                                                                                                                                                                                
                                </div> 
                                {escPrimary}                                                                      
                                                                       
                            </div> 
                        </Fragment>
                   )  
                }                
            </Fragment>  
        );
    }

}