import React, { Component, Fragment } from 'react';
import store from 'store2';
import { toast } from 'bulma-toast';

import PromptSuccess from '../elements/PromptSuccess';
import PromptFailed from '../elements/PromptFailed';
import { errToasterOptions } from '../../helpers/configObjects';
import { getLoggedUserDetails, ValidateEmail } from '../../helpers/helper';
import { updateEmail, checkEmailVerificationCode } from '../../helpers/apiCalls';

export default class UpdateVerifyEmail extends Component {
    state = {
        isBtnLoading: false, email: '', codeSent: false, verificationFailed: false, verificationCode: ''
    }
    handleButtonClick = e => {
        if(e === "update") {
            if(!ValidateEmail(this.state.email)) {
                let toasterOptions = errToasterOptions;
                toasterOptions["message"] = "Please fill in a valid <strong>Email Address</strong>.";
                toasterOptions["position"] = "top-right";
                toast(toasterOptions);
            }
            else {
                this.toggleIsLoadingBtn();
                updateEmail(getLoggedUserDetails("idnumber"), this.state.email)
                .then(result => {
                    const data = result.data;
                    if(data.success) { 
                        this.setState({
                            codeSent: true
                        });
                    }
                    else {
                        let toasterOptions = errToasterOptions;
                        toasterOptions["message"] = "The email <strong>" + this.state.email + "</strong> you entered already exist. " +
                                                    "Please use another email address or contact the campus EDP Department if you are the rightful owner of <strong>" 
                                                    + this.state.email + "</strong>";
                        toasterOptions["duration"] = 14000;
                        toasterOptions["position"] = "top-right";
                        toast(toasterOptions); 
                    } 
                    this.toggleIsLoadingBtn();
                });                 
            }
        }
        if(e === "verify") {           
            this.toggleIsLoadingBtn();
            checkEmailVerificationCode(this.state.email, this.state.verificationCode)
            .then(result => {
                const data = result.data;
                if(data.success) { 
                    let localData = store.get("loggeduser");
                        localData["email"] = this.state.email;
                        store.set('loggeduser', localData);
                    const { history } = this.props;
                    history.push("/enrollment/student/updatecontacts/" + this.state.email);
                } 
                else {
                    this.setState({
                        verificationFailed: true
                    })
                }
                this.toggleIsLoadingBtn();
            });            
        }
    }
    handleOnChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    toggleIsLoadingBtn = () => {
        const { isBtnLoading } = this.state;
        this.setState({
            isBtnLoading: !isBtnLoading
        })
    }
    render() {
        const { email, isBtnLoading, codeSent, verificationFailed, verificationCode } = this.state;
        if(codeSent) {
            return (
                <div className="section mt-0 pt-0">
                    <div className="columns">
                        <div className="column pt-2"> 
                            {verificationFailed ? <PromptFailed /> : <PromptSuccess />}
                            <h3 className="subtitle has-text-centered">
                                {verificationFailed ? "Invalid Verification Code" : "Email Address Updated"}   
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
                                                    value={verificationCode} onChange={this.handleOnChange} />
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
                                        onClick={() => this.handleButtonClick("verify")}   
                                        disabled={verificationCode.length >= 6 ? false : true}                                             
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
        else {
            return(
                <Fragment>
                <h4 className="is-size-4 has-text-weight-bold mb-2">Update and Verify Email Address</h4>
                <p>
                    We require to verify your email address. Please enter your valid and working email address. You are still required to enter your email address to be verified even if the existing email address you registered to us is still working.  
                </p>
                <div className="columns is-vcentered">                
                    <div className="column is-3"> 
                        <h5 className="has-text-weight-bold mb-2"><i className="fas fa-exclamation-circle has-text-info"></i> Email</h5>
                        <div className="field">                                                    
                            <div className="control has-icons-left has-icons-right">                                                    
                                <input name="email" className="input" type="text" placeholder="Enter Email Address"
                                        onChange={this.handleOnChange} value={email} />  
                                <span className="icon is-small is-left">
                                    <i className="fas fa-envelope"></i>
                                </span>
                            </div>
                        </div>                                                                                                                                                                                                                                                        
                    </div>                                                  
                </div> 
                <p className="mb-2">** A verification code will be sent to your email address.</p>
                <nav className="level">
                    <div className="level-left mb-0 pb-0">
                        <button className={"button is-info is-fullwidth " + (isBtnLoading ? "is-loading" : "")}  onClick={() => this.handleButtonClick("update")} >                                                
                            <span>Update and Verify</span>
                        </button>
                    </div>
                    <div className="level-right mt-1 pt-0">
                        
                    </div>  
                </nav> 
                </Fragment>
            )
        }
    }

}