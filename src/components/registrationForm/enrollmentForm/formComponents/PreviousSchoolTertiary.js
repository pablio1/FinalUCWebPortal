import React, { Component, Fragment } from 'react';

import { YearsBetween } from '../../../../helpers/helper'


export default class PreviousSchoolTertiary extends Component {   
    handleOnChangeInput = e => {     
        this.props.handleOnChangeInput(e.target.name, e.target.value);
    }

    render() { 
        const { values } = this.props;     
        const yearsOptionsAsc = YearsBetween(new Date("1970-01-01"), new Date()).map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );
        const yearsOptionsDesc = YearsBetween(new Date("1970-01-01"), new Date(),"desc").map((year, index) =>
            <option key={index+1} value={year}>{year}</option>
        );
        return(
            <Fragment>
                <div className="columns is-vcentered mt-0 pt-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column">
                        <h3 className="has-text-weight-bold is-size-5 mb-0 pb-0">College / University</h3>
                    </div>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column is-3">                                             
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Last Course Attended</h5>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">                                                    
                                <input 
                                    name="lastCourseCollege" className="input" type="text" placeholder="Enter Last Course" 
                                    maxLength="150" value={values.lastCourseCollege} onChange={this.handleOnChangeInput}
                                    required data-fieldname="Last Course Attended"
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-book"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                    
                    </div>      
                    <div className="column">                                                
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> School Name</h5>
                        <div className="field">
                            <p className="control has-icons-left has-icons-right">                                                    
                                <input 
                                    name="schoolNameCollege" className="input" type="text" placeholder="Enter School Name" 
                                    maxLength="200" value={values.schoolNameCollege} onChange={this.handleOnChangeInput} 
                                    required data-fieldname="College School Name" 
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
                                        <select name="lastYearLevelCollege" value={values.lastYearLevelCollege} onChange={this.handleOnChangeInput}
                                                required data-fieldname="College Last Year Level">
                                            <option value="">Select Year Level</option>
                                            <option value="5">5</option>
                                            <option value="4">4</option>
                                            <option value="3">3</option>
                                            <option value="2">2</option> 
                                            <option value="1">1</option> 
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
                                    <select name="schoolYearStartCollege" value={values.schoolYearStartCollege} onChange={this.handleOnChangeInput}
                                            required data-fieldname="College School Year From">
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
                                    <select name="schoolYearEndCollege" value={values.schoolYearEndCollege} onChange={this.handleOnChangeInput}
                                            required data-fieldname="College School Year To">
                                        <option key={0} value="">To</option>
                                        {yearsOptionsDesc} 
                                    </select>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                
                    </div>                                                
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
    }

}