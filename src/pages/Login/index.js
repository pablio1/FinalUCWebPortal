import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import store from 'store2';
import isLoggedIn from '../../helpers/isLoggedIn';
import { checkStudentType } from '../../helpers/helper'

import UCLogo160x83 from "../../assets/sysimg/uc-logo-bg-160x83.png";
import baniladInfoGraphics from "../../assets/sysimg/banilad_info.jpg";
import lmInfoGraphics from "../../assets/sysimg/lm_info.jpg";

class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            idnumber: "",
            password: "",
            error: "",
            loginBtnIsLoading: false
        };
    }
    
    componentDidMount = () => {
        store.remove('token');
        store.remove('loggeduser');
    }

    onSubmit = e => {
        e.preventDefault();    
        const { idnumber, password } = this.state;
        const email = idnumber;
        const { history, cookies } = this.props;
        this.setState({
            loginBtnIsLoading: true
        }, () => {
            if (!email || !password) {
                return this.setState({ 
                    error: "Please enter your ID (or Email) and password",
                    loginBtnIsLoading: false 
                });
            } 
            else {
                const data = { 
                    id_number: email,
                    password: password
                };
                const headers = { 
                    'Access-Control-Allow-Origin': '*',
                };
                axios.post(process.env.REACT_APP_API_UC_LOGIN, data, {headers})
                .catch((e) => {
                    console.log(e);
                    return { status: 401, message: 'Unauthorized' }
                })
                .then(result => {
                    const data = result.data;
                    if(data.success) { 
                        const userInfo = data.student_info;
                        const courseArr = userInfo.course ? userInfo.course.split(',') : data.user_type;
                        const courseString = userInfo.course ? courseArr[0] : data.user_type;                    
                        const yearLevel = courseString.split(' ')[1];
                        const genEd = courseArr.slice(1);
                        const userType = data.user_type;
                        const acadHeadLabel = userType === "DEAN" && ["SHS", "JHS", "BED"].includes(courseString) ? "PRINCIPAL" : userType;
                        const user = {
                            idnumber: data.id_number,
                            email: data.email,
                            usertype: userType,
                            fullname: userInfo.fullname,
                            courseyear: courseString + (["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType) ? " " + acadHeadLabel.substring(0, 5) : ""),
                            coursecode: userInfo.course_code,
                            courseabbr: userType === "STUDENT" ? courseString.substring(0, courseString.length - 2) : courseString,
                            //yearlevel: userType === "STUDENT" ? courseString.substr(courseString.length - 1) : courseString,
                            yearlevel: userType === "STUDENT" ? yearLevel : courseString,
                            studenttype: userType === "STUDENT" ? checkStudentType(data.id_number, "20") : "",
                            classification: data.classification,
                            gened: ["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType) ? genEd : [],
                            avatar: data.profile,
                            deptabbr: userInfo.department_abbr,
                            hasload: data.has_load,
                            pendingexampromi: userInfo.pending_exam_promi,
                            currentexam: data.current_exam,
                            approvedpromiamount: userInfo.approved_promi_amount,
                            activeterms: data.active_terms,
                            hasactiveterm: data.has_active_term,
                            curryear: data.curr_year,
                            allowedunits: data.allowed_units
                        }
                        console.log("user", user);
                        // Cookies not implemented, Local Storage used instead
                        /*cookies.set('idnumber', data.id_number, { path: '/' });
                        cookies.set('email', data.email, { path: '/' });
                        cookies.set('usertype', userType, { path: '/' });
                        cookies.set('fullname', userInfo.fullname, { path: '/' });
                        cookies.set('courseyear', courseString + (["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(userType) ? " " + userType.substring(0, 5) : ""), { path: '/' });
                        cookies.set('coursecode', userInfo.course_code, { path: '/' });
                        cookies.set('courseabbr', userType === "STUDENT" ? courseString.substring(0, courseString.length - 2) : courseString, { path: '/' });
                        cookies.set('yearlevel', userType === "STUDENT" ? courseString.substr(courseString.length - 1) : courseString, { path: '/' });
                        cookies.set('studenttype', userType === "STUDENT" ? checkStudentType(data.id_number, "20") : "", { path: '/' }); */
                        //cookies.set('loggedIn', true, { path: '/' });
                        
                        //Local Storage
                        store.set('loggeduser', user);
                        store.set('token', data.token);
                        cookies.set('selterm', process.env.REACT_APP_CURRENT_SCHOOL_TERM, { path: '/' });                 
                        //store.set('loggedIn', true); 
                        history.push('/dashboard');
                        return;
                    } 
                    else {
                        return this.setState({ 
                            error: "Invalid Login Credentials",
                            loginBtnIsLoading: false 
                        });
                    }
                });        
            }
        })
            
        
    }
    
    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { error, loginBtnIsLoading } = this.state;
        if (isLoggedIn()) {
            return <Redirect to="/dashboard" />;
        }
        const loadInfoGraphics = process.env.REACT_APP_CAMPUS === "Banilad" ? baniladInfoGraphics : lmInfoGraphics;
        return(
            <section className="hero is-fullheight landing-page-body ">
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
                                <form onSubmit={this.onSubmit}>
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
                                    <button type="submit" className={"button is-block is-info is-medium is-fullwidth " + (loginBtnIsLoading ? "is-loading" : "")}>
                                        Login <i className="fas fa-sign-in-alt"></i>
                                    </button>                        
                                </form>
                            </div>
                            <p className="has-text-grey">
                                <a className="has-text-primary-light" href="/registration">Register</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href="/resetpassword">Forgot Your Password?</a> &nbsp;·&nbsp;
                                <a className="has-text-primary-light" href={loadInfoGraphics} target="_blank" rel="noreferrer">Need Help?</a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        );
    };
}

export default withCookies(Login);