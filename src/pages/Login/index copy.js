import React, { Component } from "react";
import withContext from "../../services/withContext";

import UCLogo160x83 from "../../assets/sysimg/uc-logo-bg-160x83.png";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idnumber: "",
            password: ""
        };
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value, error: "" });
    }

    login = e => {
        e.preventDefault();
    
        const { idnumber, password } = this.state;
        if (!idnumber || !password) {
            return this.setState({ error: "Please enter your ID (or Email) and password" });
        }
        this.props.context.login(idnumber, password)
            .then((loggedIn) => {
                if (!loggedIn) {
                this.setState({ error: "Invalid Credentials" });
                }
        })
    };

    render() {
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
                                    this.state.error && 
                                    (
                                        <div className="has-text-danger" style={{ paddingTop: "0px" }}>{this.state.error}</div>
                                    )
                                }                           
                                <form onSubmit={this.login}>
                                    <div className="field px-1 mt-2">
                                        <div className="control has-icons-left">
                                            <input id="idnumber" type="text" className="input" 
                                                name="idnumber" autoFocus placeholder="ID Number or Email" onChange={this.handleChange} />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-user"></i>
                                            </span>                                
                                        </div>
                                    </div>

                                    <div className="field px-1">
                                        <div className="control has-icons-left">        
                                            <input id="password" type="password" className="input" 
                                                name="password" placeholder="Password" onChange={this.handleChange} />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-lock"></i>
                                            </span>                                
                                        </div>
                                    </div>
                                    <div className="field is-pulled-right">
                                        <div className="checkbox">
                                            <label className="checkbox">
                                                <input type="checkbox" name="remember" id="remember" />                                
                                                <span className="is-size-6 ml-2 pr-2">Remember Me</span>
                                            </label>
                                        </div>                            
                                    </div>                        
                                    <button type="submit" className="button is-block is-info is-medium is-fullwidth">
                                        Login <i className="fas fa-sign-in-alt"></i>
                                    </button>                        
                                </form>
                            </div>
                            <p className="has-text-grey">
                                <a className="has-text-primary-light" href="/registration">Register</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href="/">Forgot Your Password?</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href="/">Need Help?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
}

export default withContext(Login);