import React, { Component } from 'react';
import { v_PortalAccountCreation } from '../../helpers/formValidation';
import axios from 'axios';
import { toast } from 'bulma-toast';
import { errToasterOptions } from '../../helpers/configObjects';
import store from 'store2';

export default class PortalAccountCreation extends Component {
    state = {
        isBtnLoading: false
    }
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {            
            const {values} = this.props;  
            //Simple Validation - Check only if required field filled, email, password format 
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_PortalAccountCreation(values) === 0) { 
                    this.toggleIsLoadingBtn();
                    const data = { 
                        email: values.email,
                        fullname: values.firstName + " " + values.middleName + " " + values.lastName + " " + values.suffixName
                    };
                    const headers = { 
                        'Access-Control-Allow-Origin': '*',
                    };
                    axios.post(process.env.REACT_APP_API_UC_EMAIL_SEND_VERIFICATION, data, {headers})
                    .catch((e) => {
                        console.log(e);
                    })
                    .then(result => {
                        const data = result.data;
                        if(data.success) { 
                            this.props.nextStep();
                        } 
                        else {
                            this.toggleIsLoadingBtn();
                            let toasterOptions = errToasterOptions;
                            toasterOptions["message"] = "The email <strong>" + values.email + "</strong> you entered already exist. " +
                                                        "Please use another email address or contact the campus EDP Department if you are the rightful owner of <strong>" 
                                                        + values.email + "</strong>";
                            toasterOptions["duration"] = 14000;
                            toast(toasterOptions);    
                        }
                    }); 
                }
            }
            else this.props.nextStep();   
        }
    }
    toggleIsLoadingBtn = () => {
        const { isBtnLoading } = this.state;
        this.setState({
            isBtnLoading: !isBtnLoading
        })
    }
    handleOnChangeInput = e => {     
        this.props.handleChange(e.target.name, e.target.value);
    }
    render() {
        const { values } = this.props;
        const { isBtnLoading } = this.state;
        return(                
            <div className="section mt-0 pt-0">
                <div className="columns">
                    <div className="column pt-0"> 
                        <h3 className="subtitle has-text-centered">
                            Thank you for choosing University of Cebu as your partner to success; but first, lets create your portal account.
                        </h3>
                        <div className="">
                            <div className="divider is-size-6"></div>
                        </div>
                        <div className="" id="formBody">
                            <div className="columns">
                                <div className="column is-1"></div>
                                <div className="column"> 
                                    <h3 className="mb-4">Please enter your name. Fill out all the fields if possible. Required fields are marked with <i className="fas fa-exclamation-circle has-text-info"></i></h3> 
                                    <div className="field">
                                        <label className="label is-small mt-1"><i className="fas fa-exclamation-circle has-text-info"></i> First Name</label>
                                        <p className="control has-icons-left has-icons-right">                                                    
                                            <input name="firstName" className="input" type="text" placeholder="First Name" 
                                                   value={values.firstName} onChange={this.handleOnChangeInput} required data-fieldname="First Name" />  
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-id-card"></i>
                                            </span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label is-small mt-1">Middle Name</label>
                                        <p className="control has-icons-left">                                                    
                                            <input name="middleName" className="input" type="text" placeholder="Middle Name" 
                                                   value={values.middleName} onChange={this.handleOnChangeInput} data-fieldname="Middle Name" />
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-id-card"></i>
                                            </span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label is-small mt-1"><i className="fas fa-exclamation-circle has-text-info"></i> Last Name</label>
                                        <p className="control has-icons-left">                                                    
                                            <input name="lastName" className="input" type="text" placeholder="Last Name" 
                                                   value={values.lastName} onChange={this.handleOnChangeInput} required data-fieldname="Last Name" />   
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-id-card"></i>
                                            </span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label is-small mt-1">Name Suffix</label>
                                        <p className="control has-icons-left">                                                    
                                            <input name="suffixName" className="input" type="text" placeholder="Name Suffix" 
                                                   value={values.suffixName} onChange={this.handleOnChangeInput} data-fieldname="Name Suffix" />     
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-id-card"></i>
                                            </span>
                                        </p>
                                    </div>                                                                                    
                                </div>  
                                <div className="column is-1"></div>             
                                <div className="column">
                                    <h3 className="mb-4">Please enter your email address and password. Make sure the email address you enter is valid.</h3>  
                                    <div className="field">
                                        <label className="label is-small mt-1"><i className="fas fa-exclamation-circle has-text-info"></i> Email</label>    
                                        <p className="control has-icons-left has-icons-right">
                                            <input name="email" className="input" type="email" placeholder="Email" 
                                                   value={values.email} onChange={this.handleOnChangeInput} required data-fieldname="Email" />
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-envelope"></i>
                                            </span>
                                        </p>
                                    </div>
                                    <div className="field">
                                        <label className="label is-small mt-1"><i className="fas fa-exclamation-circle has-text-info"></i> Password</label>
                                        <p className="control has-icons-left">
                                            <input name="password" className="input" type="password" placeholder="Password" 
                                                   value={values.password} onChange={this.handleOnChangeInput} required data-fieldname="Password" />
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                            </span>
                                        </p>
                                    </div>  
                                    <div className="field">
                                        <label className="label is-small mt-1"><i className="fas fa-exclamation-circle has-text-info"></i> Confirm Password</label>
                                        <p className="control has-icons-left">
                                            <input name="passwordCon" className="input" type="password" placeholder="Confirm Password"
                                                   value={values.passwordCon} onChange={this.handleOnChangeInput} data-fieldname="Confirm Password" />
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                            </span>
                                        </p>
                                    </div>      
                                </div> 
                                <div className="column is-1"></div>                              
                            </div>
                        </div>
                        <div>
                            <div className="divider is-size-6"></div>
                        </div>
                        <nav className="level">
                            <div className="level-left mb-0 pb-0">
                                <a 
                                    className="button is-info is-fullwidth"
                                    href="/registration"                                                
                                >
                                    <span className="icon">
                                        <i className="fas fa-chevron-left"></i>
                                    </span>
                                    <span>Back</span>
                                </a>
                            </div>

                            <div className="level-right mt-1 pt-0">
                                <button 
                                    className={"button is-info is-fullwidth " + (isBtnLoading ? "is-loading" : "")} 
                                    onClick={() => this.handleButtonClick("continue")}                                                
                                >                                                    
                                    <span>Continue</span>
                                    <span className="icon">
                                        <i className="fas fa-chevron-right"></i>
                                    </span>
                                </button>
                            </div>  
                        </nav>                                                                
                    </div>
                </div> 
            </div>                                 
        )
    }
}
