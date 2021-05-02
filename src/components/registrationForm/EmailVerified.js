import React, { Component } from 'react';
import PromptSuccess from '../elements/PromptSuccess';
import { convertTermToReadable } from '../../helpers/helper';
import { Fragment } from 'react';

export default class EmailVerified extends Component {
    handleButtonClick = e => {
        this.props.handleEducLevel(e);  
    }
    handleOnSelectTerm = e => {
        this.props.handleSelectTerm(e.target.value);
    }
    handleProceedBtn = () => {
        this.props.nextStep(); 
    }
    render() {
        const { term, activeTerms, educLevel } = this.props;   
        let arrTerms = [activeTerms.substring(0,5)];
        if(process.env.REACT_APP_EARLY_ENROLLMENT === "1") arrTerms.push(activeTerms.split(",").pop());
        if(process.env.REACT_APP_EARLY_ENROLLMENT === "2") arrTerms = activeTerms.split(",");
        if(process.env.REACT_APP_EARLY_ENROLLMENT === "3") arrTerms = activeTerms.split(",").slice(0, -1);     
        const loadTermsOption = arrTerms ? arrTerms.map((term, index) => {
            let readableTerm = convertTermToReadable(term, false);
            if(educLevel === "jhs" || educLevel === "bed") readableTerm = readableTerm.includes("Summer") ? readableTerm : readableTerm.substr(readableTerm.length - 16); 
            return (
                <option key={index} value={term}>{readableTerm}</option>
            );
        }) : <option selected>No Terms Loaded</option>;
        return(      
            <div className="section mt-0 pt-0">
                <div className="columns">
                    <div className="column pt-0"> 
                        <PromptSuccess />
                        <h3 className="subtitle has-text-centered">
                            Email Account Verified!
                        </h3>
                        <div className="">
                            <div className="divider is-size-6"></div>
                        </div>
                        <div className="" style={{ /*width: "94%"*/ }}>
                            <div className="columns">
                                <div className="column is-1"></div>
                                <div className="column"> 
                                    <h3 className="mb-4 has-text-centered">
                                        You can now proceed to process your online enrollment. Please make sure that you have your personal particulars, previous school info and scanned copies of your credentials ready. 
                                        You will fill up series of Forms shown below. Please be patient and remain online until all form are filled and submitted.                                                 
                                    </h3> 
                                    <div className="columns">
                                        <div className="column">
                                            <ul className="steps is-centered has-content-centered is-horizontal">
                                                <li className="steps-segment">
                                                    <span className="steps-marker"></span>
                                                    <div className="steps-content">
                                                    <p>Course Selection</p>
                                                    </div>
                                                </li>
                                                <li className="steps-segment">
                                                    <span className="steps-marker"></span>
                                                    <div className="steps-content">
                                                    <p>Personal Details</p>
                                                    </div>
                                                </li>
                                                <li className="steps-segment">
                                                    <span className="steps-marker"></span>
                                                    <div className="steps-content">
                                                    <p>Address & Contact Details</p>
                                                    </div>
                                                </li>
                                                <li className="steps-segment">
                                                    <span className="steps-marker"></span>
                                                    <div className="steps-content">
                                                    <p>Previous School Details</p>
                                                    </div>
                                                </li>
                                                <li className="steps-segment is-active">
                                                    <span className="steps-marker"></span>
                                                    <div className="steps-content">
                                                    <p>Required Documents Upload</p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>                                                                                                
                                    <h1 className="mb-0 has-text-centered is-size-5 has-text-weight-bold">Please Choose Level to Enroll</h1>
                                    <h1 className="mb-5 has-text-centered">
                                        Once you have chosen the Level to Enroll you cannot go back to this menu unless you refresh the page or press the browsers back button losing 
                                        the data you entered in the subsequent forms. 
                                    </h1>
                                    <div className="columns">
                                        <div className="column">
                                            <button 
                                                className={"button is-medium is-fullwidth " + (educLevel === "col" ? "is-success" : "is-info")}
                                                onClick={() => this.handleButtonClick("col")} 
                                            >College</button>
                                        </div>                                                     
                                        <div className="column">
                                            <button 
                                                className={"button is-medium is-fullwidth " + (educLevel === "shs" ? "is-success" : "is-info")}
                                                onClick={() => this.handleButtonClick("shs")}    
                                            >Senior High School</button>
                                        </div> 
                                    
                                        <div className="column">
                                            <button 
                                                className={"button is-medium is-fullwidth " + (educLevel === "jhs" ? "is-success" : "is-info")}
                                                onClick={() => this.handleButtonClick("jhs")}    
                                            >Junior High School (Grade 7 - 10)</button>
                                        </div> 
                                        <div className="column">
                                            <button 
                                                className={"button is-medium is-fullwidth " + (educLevel === "bed" ? "is-success" : "is-info")}
                                                onClick={() => this.handleButtonClick("bed")}
                                            >Elementary (N1, K1, Grade 1 - 6)</button>
                                        </div>
                                    
                                    </div>                                                                                                                                                                          
                                </div>  
                                <div className="column is-1"></div>                                           
                            </div>
                            { 
                                educLevel ? (
                                    <Fragment>
                                    <div className="columns">    
                                        <div className="column is-center">     
                                            <h4 className="has-text-weight-bold is-size-5 mt-2">Select School Year/Term</h4>                                   
                                        </div>
                                    </div>
                                    <div className="columns"> 
                                        <div className="column is-hidden-mobile"></div>   
                                        <div className="column is-center mt-0 is-narrow">         
                                            <div className="control has-icons-left">
                                                <div className="select">
                                                    <select name="selectTerm" value={term} onChange={this.handleOnSelectTerm}>
                                                        {loadTermsOption}
                                                    </select>
                                                </div>
                                                <span className="icon is-small is-left">
                                                    <i className="far fa-calendar-alt"></i>
                                                </span>
                                            </div>                                         
                                        </div>
                                        <div className="column is-narrow">
                                            <button className="button is-info" onClick={this.handleProceedBtn}>
                                                <span>Proceed</span>
                                                <span className="icon">
                                                    <i className="fas fa-chevron-right"></i>
                                                </span>    
                                            </button>
                                        </div>
                                        <div className="column is-hidden-mobile"></div> 
                                    </div>
                                    </Fragment>
                                ) : ""
                            }
                        </div>
                        <div>
                            <div className="divider is-size-6"></div>
                        </div>
                        <nav className="level">
                            <div className="level-left mb-0 pb-0">
                                
                            </div>
                            <div className="level-right mt-1 pt-0">
                                
                            </div>  
                        </nav>                                                                
                    </div>
                </div> 
            </div>                                  
        )
    }
}
