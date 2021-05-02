import React, { Component } from 'react';
import PromptSuccess from '../elements/PromptSuccess';
import PromptFailed from '../elements/PromptFailed';
import { v_EmailVerification } from '../../helpers/formValidation';
import axios from 'axios';
import store from 'store2';

export default class EmailVerification extends Component {
    state = {
        isBtnLoading: false,
        verificationFailed: false
    }
    handleButtonClick = (e) => {
        if(e === "back") this.props.prevStep();
        if(e === "continue") {
            const {values} = this.props;  
            //Simple Validation - Check if verification code is valid
            //display error in toasters and wont proceed 
            if(process.env.REACT_APP_FORM_VALIDATION_ON === "true") {
                if (v_EmailVerification(values) === 0) {
                    this.toggleIsLoadingBtn();
                    const data = { 
                        email: values.email,
                        token: values.verificationCode,                        
                    };
                    const headers = { 
                        'Access-Control-Allow-Origin': '*',
                    };
                    axios.post(process.env.REACT_APP_API_UC_EMAIL_CHECK_VERIFICATION, data, {headers})                    
                    .then(result => {
                        const data = result.data;
                        if(data.success) { 
                            this.props.nextStep();
                        } 
                        else {
                            this.setState({
                                verificationFailed: true
                            })
                        }
                        this.toggleIsLoadingBtn();
                    }).catch((e) => {
                        console.log(e);
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
        const { isBtnLoading, verificationFailed } = this.state;
        return(
            <div className="section mt-0 pt-0">
                <div className="columns">
                    <div className="column pt-0"> 
                        {verificationFailed ? <PromptFailed /> : <PromptSuccess />}
                        <h3 className="subtitle has-text-centered">
                            {verificationFailed ? "Invalid Verification Code" : "Portal Account Successfully Created"}   
                        </h3>
                        <div className="">
                            <div className="divider is-size-6"></div>
                        </div>
                        <div className="" style={{ /*width: "94%"*/ }}>
                            <div className="columns">
                                <div className="column is-3"></div>
                                <div className="column"> 
                                    {
                                        verificationFailed ? 
                                        <h3 className="mb-4">You have entered an invalid verification code. Please try again. If the issue persist please contact the EDP Office</h3>
                                        :
                                        <h3 className="mb-4">But not so fast! We need to verify your email address first. A <strong>6-digit verification code</strong> was sent to your email address. Enter the code you received in the field below and click verify to proceed.</h3>
                                    }                                     
                                    <div className="field">
                                        <p className="control has-icons-left has-icons-right">                                                    
                                            <input name="verificationCode" className="input" type="text" placeholder="Enter Verification Code Here" 
                                                   value={values.verificationCode} onChange={this.handleOnChangeInput} required data-fieldname="Verification Code"/>
                                            <span className="icon is-small is-left">
                                            <i className="fas fa-barcode"></i>
                                            </span>
                                        </p>
                                    </div>                                                                                                                          
                                </div>  
                                <div className="column is-3"></div>                                           
                            </div>
                        </div>
                        <div>
                            <div className="divider is-size-6"></div>
                        </div>
                        <nav className="level">
                            <div className="level-left mb-0 pb-0">
                                
                            </div>

                            <div className="level-right mt-1 pt-0">
                                <button 
                                    className={"button is-info is-fullwidth " + (isBtnLoading ? "is-loading" : "")} 
                                    onClick={() => this.handleButtonClick("continue")}   
                                    disabled={values.verificationCode.length >= 6 ? false : true}                                             
                                >                                                    
                                    <span>Verify</span>
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
