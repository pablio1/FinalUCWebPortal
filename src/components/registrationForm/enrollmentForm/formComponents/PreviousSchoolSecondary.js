import React, { Component, Fragment } from 'react';

import { YearsBetween } from '../../../../helpers/helper'

export default class PreviousSchoolSecondary extends Component {   
    handleCheckBoxChange = e => {        
        this.props.handleCheckBoxChange(e);
        if(e.target.name === "isSameCollege" && e.target.checked) {
            this.props.handleOnChangeInput("schoolNameSecondary", this.props.values.schoolNameCollege);
        }
        if(e.target.name === "isK12Secondary" && !e.target.checked) {
            this.props.handleOnChangeInput("lastStrandSecondary", "N/A - Non K12");
        }
    }
    handleOnChangeInput = e => {  
        this.props.handleOnChangeInput(e.target.name, e.target.value);
    }

    render() {
        const { values } = this.props; 
        const schoolName = (values.isSameCollege) ? values.schoolNameCollege : values.schoolNameSecondary;
        const yearsOptionsAsc = YearsBetween(new Date("1970-01-01"), new Date()).map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );
        const yearsOptionsDesc = YearsBetween(new Date("1970-01-01"), new Date(),"desc").map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );      
        const lastYearLevel = (values.isK12Secondary) ? (
            <Fragment>
                <option value="12">12</option>
                <option value="11">11</option>
                <option value="10">10</option>
                <option value="9">9</option>
                <option value="8">8</option> 
                <option value="7">7</option> 
            </Fragment>
        ) : (
            <Fragment>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option> 
                <option value="1">1</option> 
            </Fragment>
        );
        const escSecondary = (values.schoolTypeSecondary === "private") ? (
            <Fragment>
            <div className="column">                                                
                <h5 className="has-text-weight-bold mb-2">ESC Student #</h5>
                <div className="field">
                    <p className="control has-icons-left has-icons-right">                                                    
                        <input 
                            name="escStudentNumSecondary" className="input" type="text" placeholder="Enter ESC Student #" 
                            maxLength="100" value={values.escStudentNumSecondary} onChange={this.handleOnChangeInput}     
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
                            name="escSchoolNumSecondary" className="input" type="text" placeholder="ESC School #" 
                            maxLength="100" value={values.escSchoolNumSecondary} onChange={this.handleOnChangeInput}  
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
                <div className="columns is-vcentered mt-0 pt-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column is-narrow mb-0 pb-0">
                        <h3 className="has-text-weight-bold is-size-5 mb-0 pb-0">Secondary School</h3>
                        {
                            values.educLevel === "col" && values.selectedEntryStatusCollege !== "H" ? (
                                <Fragment>
                                <label className="checkbox">
                                    <input type="checkbox" name="isSameCollege" checked={values.isSameCollege} onChange={this.handleCheckBoxChange} />
                                    &nbsp;Same as College
                                </label>
                                <br />
                                </Fragment>
                            ) : ""
                        }
                        {
                            ["jhs","shs"].includes(values.educLevel) ? "" : (
                                <label className="checkbox">
                                    <input type="checkbox" name="isK12Secondary" checked={values.isK12Secondary} onChange={this.handleCheckBoxChange} />
                                    &nbsp;K12 (Untick for non-K12)
                                </label>
                            )
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
                                    name="schoolNameSecondary" className="input" type="text" placeholder="Enter School Name" 
                                    maxLength="200" value={schoolName} onChange={this.handleOnChangeInput}  disabled={values.isSameCollege}    
                                    required data-fieldname="Secondary School Name"  
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-school"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                
                    </div> 
                    <div className="column is-3">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Last Strand</h5>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">                                                    
                                <input 
                                    name="lastStrandSecondary" className="input" type="text" placeholder="Enter Last Strand" disabled={!values.isK12Secondary}
                                    maxLength="200" value={values.isK12Secondary ? values.lastStrandSecondary : "N/A"} onChange={this.handleOnChangeInput}    
                                    required data-fieldname="Secondary Last Strand"  
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-book"></i>
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
                                        <select name="lastYearLevelSecondary" value={values.lastYearLevelSecondary} onChange={this.handleOnChangeInput}
                                                required data-fieldname="Secondary Last Year Level">
                                            <option value="">Select Year Level</option>        
                                            {lastYearLevel}
                                        </select>
                                    </span>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-bars"></i>
                                    </span>
                                </p>
                            </div>                                                     
                        </div>                                                                                                                                                                                                                                                                
                    </div>
                    <div className="column is-1 is-hidden-mobile"></div>   
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>                                                  
                    <div className="column is-narrow">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> School Year</h5>
                        <div className="field has-addons">
                            <p className="control">                                                   
                                <span className="select is-fullwidth">
                                    <select name="schoolYearStartSecondary" value={values.schoolYearStartSecondary} onChange={this.handleOnChangeInput}
                                            required data-fieldname="Secondary School Year From">
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
                                    <select name="schoolYearEndSecondary" value={values.schoolYearEndSecondary} onChange={this.handleOnChangeInput}
                                            required data-fieldname="Secondary School Year To">
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
                                    <select name="schoolTypeSecondary" value={values.schoolTypeSecondary} onChange={this.handleOnChangeInput}
                                            required data-fieldname="Secondary School Type">
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
                    <div className="column">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> LRN
                            <span className="has-text-weight-normal is-size-6"> ( Indicate TBA if information not available now )</span>
                        </h5>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">                                                    
                                <input 
                                    name="lrnNumberSecondary" className="input" type="text" placeholder="Enter LRN" 
                                    maxLength="100" value={values.lrnNumberSecondary} onChange={this.handleOnChangeInput} 
                                    required data-fieldname="Secondary School LRN"
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-barcode"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                
                    </div>                                                
                    <div className="column is-1 is-hidden-mobile"></div>                                                               
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>                                                 
                    {escSecondary}         
                    <div className="column"></div>                                                             
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div> 
            </Fragment>    
        );
    }

}