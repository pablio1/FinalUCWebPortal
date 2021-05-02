import React, { Component } from "react";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import SpinnerGif from '../../assets/sysimg/spinner.gif'

import { getStudentInfo, loginUser, changePassword, getOldStudentInfo, updateEmail, checkEmailVerificationCode } from '../../helpers/apiCalls';
import { getLoggedUserDetails, ValidatePassword, ValidateEmail } from '../../helpers/helper';

import StudentProfilePanel  from '../../components/elements/StudentProfilePanel';
import StaffProfilePanel  from '../../components/elements/StaffProfilePanel';

class Profile extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        studentInfo: null, personelInfo: null, showCurrentPassWordInput: false, currentPassWordInput: '', isLoadingBtnCurrentPassword: false,
        disableMainBtns: false, showNewPassWordInput: false, newPassWordInput: '', newPassWordInputConfirm: '', isLoadingBtnNewPassword: false,
        errorMsg: '', showError: false, userType: '', notifMsg: '', showNotif: false,
        showSendVerificationCode: false, newEmail: '', isLoadingBtnVerify: false, verificationCodeSent: false, verificationCode: ''
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        if(getLoggedUserDetails("usertype") === "STUDENT") {
            if(["O","R","S"].includes(getLoggedUserDetails("classification"))) {
                getOldStudentInfo(getLoggedUserDetails("idnumber"), 0, cookies.get("selterm")) 
                .then(response => {
                    if(response.data) {
                        this.setState({
                            studentInfo: response.data,
                            userType: getLoggedUserDetails("usertype"),
                        })
                    }
                });
            }
            else {
                getStudentInfo(getLoggedUserDetails("idnumber"), 0, cookies.get("selterm")) 
                .then(response => {
                    if(response.data) {
                        this.setState({
                            studentInfo: response.data,
                            userType: getLoggedUserDetails("usertype"),
                        })
                    }
                });
            }
        }
        else {
            const userData = {
                courseabbr: getLoggedUserDetails("courseabbr"),
                coursecode: getLoggedUserDetails("coursecode"),
                courseyear: getLoggedUserDetails("courseyear"),
                email: getLoggedUserDetails("email"),
                fullname: getLoggedUserDetails("fullname"),
                gened: getLoggedUserDetails("gened"),
                idnumber: getLoggedUserDetails("idnumber"),
                studenttype: getLoggedUserDetails("studenttype"),
                usertype: getLoggedUserDetails("usertype"),
                yearlevel: getLoggedUserDetails("yearlevel"),
                avatar: getLoggedUserDetails("avatar")
            }
            this.setState({
                personelInfo: userData,
                userType: getLoggedUserDetails("usertype")
            })
        }        
    }
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmitCurrentPassword = e => {
        if(e === "submit") {
            this.setState({
                isLoadingBtnCurrentPassword: true
            }, () => {
                loginUser(getLoggedUserDetails("idnumber"), this.state.currentPassWordInput)
                .then(result => {
                    if(result.data.success) { 
                        this.setState({
                            showNewPassWordInput: true,
                            isLoadingBtnCurrentPassword: false,
                            showCurrentPassWordInput: false,
                            currentPassWordInput: '',
                            errorMsg: '',
                            showError: false
                        })    
                    }
                    else {
                        this.setState({
                            errorMsg: "Incorrect Password. Please try again.",
                            showError: true,
                            isLoadingBtnCurrentPassword: false
                        })
                    }
                });
            });
        }
        else if(e === "cancel") {
            this.setState({
                showCurrentPassWordInput: false,
                disableMainBtns: false,
                currentPassWordInput: ''
            })
        }
    }
    handleSubmitNewPassword = e => {
        if(e === "submit") {
            const { newPassWordInputConfirm, newPassWordInput } = this.state;
            if(newPassWordInputConfirm !== newPassWordInput) {        
                this.setState({
                    errorMsg: "Passwords did not match.",
                    showError: true
                })
            }
            else if(newPassWordInputConfirm === "" || newPassWordInput === "") {        
                this.setState({
                    errorMsg: "Password fields can't be empty.",
                    showError: true
                })
            }
            else if(!ValidatePassword(newPassWordInput)) {
                this.setState({
                    errorMsg: "Password must contain a number, lower case and upper case letters. \nPassword must be at least 6 characters long.",
                    showError: true
                })
            }
            else {
                this.setState({
                    isLoadingBtnNewPassword: true
                }, () => {
                    changePassword(getLoggedUserDetails("idnumber"), newPassWordInput)
                    .then(result => {
                        if(result.data.success) { 
                            this.setState({
                                showNewPassWordInput: false,
                                isLoadingBtnNewPassword: false,
                                showNewPassWordInput: false,
                                disableMainBtns: false,
                                currentPassWordInput: '',
                                newPassWordInput: '', 
                                newPassWordInputConfirm: '',
                                errorMsg: '',
                                showError: false
                            })    
                        }
                    });
                });
            }
        }
        else if(e === "cancel") {
            this.setState({
                showNewPassWordInput: false,
                disableMainBtns: false,
                currentPassWordInput: '',
                newPassWordInput: '', 
                newPassWordInputConfirm: '',
                errorMsg: '',
                showError: false
            })
        }        
    }
    handleSendVerificationCode = e => {
        if (e === "verify") {
            if(!ValidateEmail(this.state.newEmail)) {
                this.setState({
                    errorMsg: "Please enter a valid email address.",
                    showError: true
                })
            }
            else {
                this.setState({
                    isLoadingBtnVerify: true
                }, () => {
                    updateEmail(getLoggedUserDetails("idnumber"), this.state.newEmail)
                    .then(result => {
                        const data = result.data;
                        if(data.success) { 
                            let notifMsg = "A verification code has been sent to your email address. " +
                                           "Please check your email and enter the verification code above then click save.";
                            this.setState({
                                verificationCodeSent: true,
                                disableMainBtns: false,
                                isLoadingBtnVerify: false,
                                notifMsg: notifMsg, 
                                showNotif: true,
                                showError: false,
                            });
                        }
                        else {
                            let errMsg = "The email " + this.state.newEmail + " you entered already exist. " +
                                        "Please use another email address or contact the campus EDP Department if you are the rightful owner of " 
                                        + this.state.newEmail;

                            this.setState({
                                errorMsg: errMsg,
                                showError: true,
                                isLoadingBtnVerify: false,
                            })
                        } 
                    });
                });
            }
        }
        else if(e === "check") {
            if(this.state.verificationCode) {
                this.setState({
                    isLoadingBtnVerify: true
                }, () => {
                    checkEmailVerificationCode(this.state.newEmail, this.state.verificationCode)
                    .then(result => {
                        const data = result.data;
                        if(data.success) { 
                            let notifMsg = "You have successfuly updated your email addess. Please logout and login again to take effect.";
                            this.setState({
                                showSendVerificationCode: false, 
                                newEmail: '',
                                disableMainBtns: false,
                                showError: false,
                                notifMsg: notifMsg, 
                                showNotif: true,
                            });
                        } 
                        else {
                            this.setState({
                                errorMsg: "You have entered an invalid verification, please check your email and try again.",
                                showError: true,
                                isLoadingBtnVerify: false,
                            })
                        }
                    });   
                });             
            }
            else {
                this.setState({
                    errorMsg: "You have to enter the verification code sent to your email.",
                    showError: true,
                    isLoadingBtnVerify: false,
                })
            }
        }
        else if(e === "cancel") {
            this.setState({
                showSendVerificationCode: false, 
                newEmail: '',
                disableMainBtns: false,
                showError: false,
                notifMsg: '', 
                showNotif: false,
            })
        }   
    }
    handleOnClickBtn = e => {
        this.setState({
            showCurrentPassWordInput: e === "changePassword" ? true : false,
            showSendVerificationCode: e === "changeEmail" ? true : false,
            disableMainBtns: true
        })
    }
    render() {
        const { 
            studentInfo, personelInfo, showCurrentPassWordInput, currentPassWordInput, disableMainBtns, notifMsg, showNotif,
            showNewPassWordInput, isLoadingBtnCurrentPassword, errorMsg, showError, isLoadingBtnNewPassword, userType,
            showSendVerificationCode, newEmail, isLoadingBtnVerify, verificationCodeSent, verificationCode
        } = this.state;
        const avatarPath = studentInfo && studentInfo.attachments.length > 0 ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + studentInfo.attachments.filter(file => file.type === "2x2 ID Picture")[0].filename : "";
        const currentPasswordInput = (
                <div className="field is-grouped">
                    <p className="control is-expanded">
                        <input className="input" name="currentPassWordInput" type="password" placeholder="Enter Current Password" 
                                value={currentPassWordInput} onChange={this.handleOnChangeInput}/>
                    </p>
                    <p className="control">
                        {
                            currentPassWordInput.length >= 2 ?  
                            <button className={"button is-info " + (isLoadingBtnCurrentPassword ? "is-loading" : "")}
                                onClick={() => this.handleSubmitCurrentPassword("submit")} >Submit
                            </button> :    
                            <button className="button is-danger" onClick={() => this.handleSubmitCurrentPassword("cancel")} >Cancel</button>    
                        }
                    </p>
                </div>   
        );
        const sendVerificationCode = verificationCodeSent ? (
            <div className="field is-grouped">
                <p className="control is-expanded">
                    <input className="input" name="verificationCode" placeholder="Enter Verification Code" 
                            value={verificationCode} onChange={this.handleOnChangeInput}/>
                </p>
                <p className="control"> 
                    <div className="buttons">
                        <button className={"button is-info " + (isLoadingBtnVerify ? "is-loading" : "")}
                            onClick={() => this.handleSendVerificationCode("check")} >Submit
                        </button>    
                        <button className="button is-danger" onClick={() => this.handleSendVerificationCode("cancel")} >Cancel</button>    
                    </div>
                </p>
            </div>  
        ) : (
            <div className="field is-grouped">
                <p className="control is-expanded">
                    <input className="input" name="newEmail" placeholder="Enter New Email" 
                            value={newEmail} onChange={this.handleOnChangeInput}/>
                </p>
                <p className="control"> 
                    <div className="buttons">
                        <button className={"button is-info " + (isLoadingBtnVerify ? "is-loading" : "")}
                            onClick={() => this.handleSendVerificationCode("verify")} >Verify
                        </button>    
                        <button className="button is-danger" onClick={() => this.handleSendVerificationCode("cancel")} >Cancel</button>    
                    </div>
                </p>
            </div>    
        );
        const newPasswordInput = (
            <div className="columns">
                <div className="column is-one-quarter-widescreen">
                    <div className="field">
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="password" placeholder="New Password" name="newPassWordInput"
                                   onChange={this.handleOnChangeInput} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control has-icons-left">
                            <input className="input" type="password" placeholder="Confirm Password" name="newPassWordInputConfirm"
                                   onChange={this.handleOnChangeInput} />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <div className="buttons">
                                <button className={"button is-success " + (isLoadingBtnNewPassword ? "is-loading" : "")} 
                                        onClick={() => this.handleSubmitNewPassword("submit")} >
                                        Change Password
                                </button>
                                <button className="button is-danger" onClick={() => this.handleSubmitNewPassword("cancel")} >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        const loadErrorMsg = (
            <div className="columns">
                <div className="column is-half-widescreen">
                    <div className="notification is-danger">
                        <span className="icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </span>
                        {errorMsg}
                    </div>        
                </div>
            </div>
        );
        const loadNotifMsg = (
            <div className="columns">
                <div className="column is-half-widescreen">
                    <div className="notification is-success">
                        <span className="icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </span>
                        {notifMsg}
                    </div>        
                </div>
            </div>
        );
        return studentInfo || personelInfo ? (
            <div className="box ml-1">
                 <div className="columns">
                    <div className="column is-three-quarters-widescreen">
                        {
                            userType && userType === "STUDENT" ? (
                                <StudentProfilePanel
                                    studentInfo={studentInfo}
                                    avatarPath={avatarPath}
                                />
                            ) : (
                                <StaffProfilePanel
                                    staffInfo={personelInfo}
                                    avatarPath={avatarPath}
                                />
                            )
                        }   
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-2">
                        <button className="button is-fullwidth is-info mb-3" onClick={() => this.handleOnClickBtn("changePassword")} disabled={disableMainBtns}>Change Password</button> 
                        <button className="button is-fullwidth is-info" onClick={() => this.handleOnClickBtn("changeEmail")} disabled={disableMainBtns}>Change Email</button>   
                    </div>
                    <div className="column is-4">
                        {showCurrentPassWordInput ? currentPasswordInput : ""}
                        {showSendVerificationCode ? sendVerificationCode : ""}
                    </div>                    
                </div> 
                {showNotif ? loadNotifMsg : ""}
                {showError ? loadErrorMsg : ""}
                {showNewPassWordInput ? newPasswordInput : ""}            
            </div>
        ):(
            <div className="box ml-1">
                <div className="columns is-vcentered">
                    <div className="column is-center">
                        <figure className="image is-128x128">
                            <img src={SpinnerGif} alt="" />
                        </figure>
                    </div>
                </div> 
            </div>  
        );
    };
}

export default withCookies(Profile);

export const ProfileHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-user"></i> Profile
    </div> 
);
