import React, { Component } from "react";
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import isLoggedIn from '../../helpers/isLoggedIn';
import store from 'store2';

import UCLogo160x83 from "../../assets/sysimg/uc-logo-bg-160x83.png";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idnumber: "",
            error: "",
            success: false
        };
    }

    onSubmit = e => {
        e.preventDefault();    
        const { idnumber } = this.state;
        const email = idnumber;
        if (!email) {
            return this.setState({ error: "Please enter your ID (or Email)" });
        } 
        else {
            const data = { 
                id_number: email,
            };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
            };
            axios.post(process.env.REACT_APP_API_UC_RESET_PASSWORD, data, {headers})
            .catch((e) => {
                return this.setState({ error: "Connection to Server Lost. Please Try Again" });
            })
            .then(result => {
                const data = result.data;
                //console.log(data);
                if(data.success) { 
                    return this.setState({ success: true });                    
                } 
                else {
                    return this.setState({ error: "Invalid Login Credentials" });
                }
            });        
        }    
        
    }
    
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { error, success } = this.state;
        if (isLoggedIn()) {
            return <Redirect to="/dashboard" />;
        }
        return(
            <section className="hero is-fullheight landing-page-body">
                <div className="hero-body">        
                    <div className="container has-text-centered">
                        <div className="column is-4 is-offset-4">                                                  
                            <div className="box">
                                <figure className="avatar my-1">
                                    <img src={UCLogo160x83} alt="" />
                                </figure>
                                <div>
                                    <div className="divider is-size-6">WEB PORTAL</div>
                                </div>
                                {
                                    error && 
                                    (
                                        <div className="notification is-danger has-text-left">
                                                <span className="icon">
                                                    <i className="fas fa-exclamation-triangle"></i>
                                                </span>
                                                <strong> {error}</strong>
                                        </div>
                                    )
                                }                           
                                
                                {
                                    success ? 
                                    (
                                        <div>
                                            <div className="notification is-success has-text-left">
                                                <span className="icon">
                                                    <i className="fas fa-check"></i>
                                                </span>

                                                <strong>Password Reset Request has been successfully sent.</strong> <br />
                                                A password reset email will be sent to your registered email shortly.
                                                Please check both your Inbox and Spam folder. Have a good day!
                                          
                                            </div>
                                            <a className="button is-block is-info is-medium is-fullwidth" href="/login">
                                                Go to Login <i className="fas fa-sign-in-alt"></i>
                                            </a>
                                        </div>    
                                    ) :
                                    (
                                        <form onSubmit={this.onSubmit}>
                                            <div>
                                                <div className="field px-1 mt-2">
                                                    <div className="control has-icons-left">
                                                        <input id="idnumber" type="text" className="input" 
                                                            name="idnumber" autoFocus placeholder="ID Number or Email" onChange={this.handleChange} />
                                                        <span className="icon is-small is-left">
                                                            <i className="fas fa-user"></i>
                                                        </span>                                
                                                    </div>
                                                </div>
                                                <button type="submit" className="button is-block is-info is-medium is-fullwidth">
                                                    Reset Password <i className="fas fa-paper-plane"></i>
                                                </button>
                                            </div>
                                        </form>
                                    )
                                }                                                                      
                            </div>
                            <p className="has-text-grey">
                                <a className="has-text-primary-light" href="/registration">Register</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href="/login">Login</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href="/">Need Help?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
}