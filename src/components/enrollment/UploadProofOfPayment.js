import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import store from 'store2';

import PaymentChannels from '../enrollment/PaymentChannels';
import FileUploadDialog from '../elements/FileUploadDialog';
import { getLoggedUserDetails, formatMoney, getEnrollFeeByDept } from '../../helpers/helper';
import { savePayment, studentApplyPromissory } from '../../helpers/apiCalls';
//import { v_RequiredDocumentsUpload } from '../../helpers/formValidation';

class UploadProofOfPayment extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        showErrors: false, errorMsg: '', studentInfo: null, selectedFile: '', paymentAttachments: null, needed_payment: 0, pending_promissory: 0, promi_pay: 0,
        promissoryBtnClicked: false, promiRequestMsg: '', amountCanPay: 0, promiRequestMsgMaxChar: 1500, promiApproveMsg: '', enrollmentFee: 0
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        const idNumber = getLoggedUserDetails("idnumber");
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        const apiResource = ["O","R","S"].includes(getLoggedUserDetails("classification")) ? process.env.REACT_APP_API_UC_OLD_STUDENT_INFO : process.env.REACT_APP_API_UC_GET_STUDENT_INFO;
        const apiRequest1 = axios.post(apiResource, { id_number: idNumber, payment: 0, active_term: cookies.get("selterm") }, {headers});
        const apiRequest2 = axios.post(apiResource, { id_number: idNumber, payment: 1, active_term: cookies.get("selterm") }, {headers});
        const apiRequest3 = axios.post(process.env.REACT_APP_API_UC_CHECK_ENROLLMENT_STATUS, { id_number: idNumber, active_term: cookies.get("selterm") }, {headers});
        Promise.all([apiRequest1, apiRequest2, apiRequest3]).then(values =>  {
            this.setState({
                studentInfo: values[0].data, 
                paymentAttachments:  values[1].data.attachments,
                needed_payment: values[2].data.needed_payment,
                pending_promissory: values[2].data.pending_promissory,
                promi_pay: values[2].data.promi_pay,
                enrollmentFee: getEnrollFeeByDept(values[0].data.dept, values[0].data.course_code)
            });  
        }).catch(error => {
            console.log(error);
        });  
    }
    handleOnChange = e => {
        if(e.target.name === "amountCanPay") {
            if(/^[0-9 _ ]*$/.test(e.target.value)) {
                this.setState({
                    [e.target.name] : e.target.value    
                });
            }
        }
        else if(e.target.name === "promiRequestMsg") {
            this.setState({
                promiRequestMsg: e.target.value
            }, () => {
                this.setState({
                    promiRequestMsgMaxChar : 1500 - parseInt(this.state.promiRequestMsg.length, 10) ,
                })
            }); 
        }
        else {
            this.setState({
                [e.target.name] : e.target.value
            });
        }
    }
    toggleShowErrors = () => {
        const {showErrors} = this.state;
        this.setState({
            showErrors: !showErrors
        })
    }
    handleOnButtonClick = e => {
        if(e === "backToSteps") {
            const { history } = this.props;
            history.push("/enrollment/student/steps");
        }
        else if(e === "applyPromi") {
            this.setState({
                promissoryBtnClicked: true
            })
        }
        else if(e === "cancelPromi") {
            this.setState({
                promissoryBtnClicked: false,
                promiRequestMsg: '',
                amountCanPay: 0,
            })
        }
    }
    handleSelectedFile = (id, e) => {
        this.setState({
            selectedFile: e
        })
    }
    handleOnApplyPromissory = () => {
        const { cookies } = this.props;
        const { promiRequestMsg, amountCanPay } = this.state;
        if(promiRequestMsg.trim() === '' || amountCanPay === 0 || amountCanPay.trim() === '') {
            alert("These required fields cannot be empty. 'Request Message' and/or 'Amount you can pay'.");
        }
        else {
            const confirmMsg = "Are you sure you want to apply for a Promissory Note? You request to pay only " + formatMoney(amountCanPay) + ". Click Ok to proceed, Cancel Application";
            if(window.confirm(confirmMsg)) {  
                const data = {
                    stud_id: getLoggedUserDetails("idnumber"),
                    message: promiRequestMsg,
                    promise_pay: amountCanPay
                };
                studentApplyPromissory(data, "enrollment", cookies.get("selterm"))
                .then(response => {  
                    if(response.data.success) {  
                        alert("Your Promissory Note application has been submitted, please be patient while your Dean/Acad Head is evaluating your request.");
                        this.setState({
                            promissoryBtnClicked: false,
                            promiRequestMsg: '',
                            amountCanPay: 0,
                        }, () => {
                            const { history } = this.props;
                            history.push("/enrollment/student/steps");
                        });
                    }
                    else {
                        alert("Application submission error, please try again. If issue persist kindly contact EDP office.");
                        this.setState({
                            promissoryBtnClicked: false,
                            promiRequestMsg: '',
                            amountCanPay: 0,
                        });
                    }
                });
            }
        }
    }
    handleUploadFile = e => {
        const { cookies } = this.props;
        //File Upload
        const { selectedFile, studentInfo } = this.state;
        const fileExtension = selectedFile.name.substr(selectedFile.name.lastIndexOf('.') + 1).toLowerCase();
        const fullname = (studentInfo.last_name.trim() + "_" +  studentInfo.first_name.trim() + (studentInfo.middle_name ? "_" + studentInfo.middle_name.trim() : "") + "_" + (studentInfo.suffix ? studentInfo.suffix.trim() : "")).split(" ").join("_");   
        let formData = new FormData(); 
        formData.append('formFiles', selectedFile, fullname + "_[payment]" + "." + fileExtension); 
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data'
        };
        axios.post(process.env.REACT_APP_API_UC_UPLOAD_FILE, formData, {headers})
        .then(response => {
            //console.log(response.data.success)
            if(response.data.success) {
                const data = {
                    id_number: studentInfo.stud_id,
                    attachments: [{
                        email: studentInfo.email,
                        filename: fullname + "_[payment]" + "." + fileExtension
                    }],
                    active_term: cookies.get("selterm")
                }                  
                savePayment(data)
                .then(res => {
                    if(res.data.success) {
                        alert("File successfully upload. Please wait for the cashier to check and validate your payment.");
                        const { history } = this.props;
                        history.push("/enrollment/student/steps");
                    }
                    else alert("File upload failed! Please try again. If issue persist contact EDP Office.");
                });   
            }     
        }).catch(error => {
            console.log(error);
        }); 
    }
    render() { 
        const {
            showErrors, studentInfo, selectedFile, paymentAttachments, needed_payment, pending_promissory, 
            promiRequestMsg, promissoryBtnClicked, amountCanPay, promiRequestMsgMaxChar, promi_pay, enrollmentFee
        } = this.state;
        const currentCampus = process.env.REACT_APP_CAMPUS;
        const isEarlyEnrollment = ["1","2","3"].includes(process.env.REACT_APP_EARLY_ENROLLMENT) ? true : false;
        const filteredPayments = paymentAttachments ? paymentAttachments.filter(file => file.type === "Payment") : "";
        const loadPromisorryBtnRequest = parseInt(needed_payment, 10) >= 1500 && pending_promissory === 0 && parseInt(promi_pay, 10) === 0 ? (
            <button className="button is-info ml-2 mt-1 mb-1"  onClick={() => this.handleOnButtonClick("applyPromi")} disabled={promissoryBtnClicked} >                                                        
                <span>Apply for Promissory</span>         
            </button> 
        ) : "";
        const loadPromissoryForm = (
            <div className="columns mb-0">
                <div className="column mt-2 is-half-desktop">
                    <textarea className="textarea" rows="3" maxLength="1500" placeholder="Enter Request Message" name="promiRequestMsg"
                              value={promiRequestMsg} onChange={this.handleOnChange}></textarea>
                    <nav className="level p-0 m-0">
                        <div className="level-left mb-0 pb-0"><h4 className="has-text-weight-semibold mt-2 mb-2">Enter Amount you can pay: </h4></div>
                        <div className="level-right mt-0 pt-0 pr-3"><h4 className="is-size-7 has-text-weight-semibold">Msg Chars Left: {promiRequestMsgMaxChar}</h4></div>  
                    </nav>
                    
                    <input className="input mt-0" name="amountCanPay" type="text" value={amountCanPay} onChange={this.handleOnChange}/>
                    <nav className="level">
                        <div className="level-left mb-0 pb-0"></div>
                        <div className="level-right mt-1 pt-0">
                            <div className="buttons">
                                <button className="button is-small is-info mt-1 has-text-weight-semibold" name="cancelPromiRequestBtn"
                                        onClick={() => this.handleOnButtonClick("cancelPromi")}>
                                    <span>Cancel</span>                                
                                </button>  
                                <button className="button is-small is-primary mt-1 has-text-weight-semibold" name="sendPromiRequestBtn"
                                        onClick={this.handleOnApplyPromissory} disabled={ promiRequestMsg < 15 ? true : false} >
                                    <span className="icon is-small">
                                        <i className="fas fa-paper-plane"></i>
                                    </span>
                                    <span>Apply</span>                                
                                </button>        
                            </div>
                        </div>  
                    </nav>
                </div>
            </div>
        )
        const loadPayment = (
            <div>
                <p className="mb-4">
                    Please pay the Total Enrollment Fee below to any of our payment channels indicated in the following table. <br />
                    It is required to indicate your <strong>ID# {studentInfo ? studentInfo.stud_id : ""}</strong> and full name in the bank deposit slip or transaction form.<br />                    
                </p>
                <p>
                    <strong>{studentInfo && studentInfo.course_code === "PD" ? "For School of Medicine students the enrollment fee displayed below may not be correct. Please contact the accounting office to get the accurate enrollment fee." : ""}</strong>
                </p>
                <table className="table is-bordered is-striped is-narrow is-hoverable m-2">     
                    <tbody>
                        {
                            isEarlyEnrollment ? null : (
                                <tr>
                                    <th>Old Accounts</th>
                                    <td>{formatMoney(parseInt(needed_payment, 10) - parseInt(enrollmentFee, 10))}</td>                                  
                                </tr>
                            ) 
                        }                       
                            <tr>
                                <th>Enrollment Fee</th>
                                <td>{formatMoney(enrollmentFee)}</td>   
                            </tr>                             
                        <tr>
                            <th><strong>Total Enrollment Fee</strong></th>
                            <td><strong>{formatMoney(needed_payment)}</strong></td>                                   
                        </tr>                                                                                        
                    </tbody>
                </table>
                {loadPromisorryBtnRequest}
                {promissoryBtnClicked ? loadPromissoryForm : ""}
            </div>
        );
        const loadAppliedPromiNotif = (
            <div className="notification is-danger is-light">
                <p className="mb-4">
                    You have applied for a Promissory Note. Please wait for the approval from the Dean/Acad Head.                   
                </p>                                     
            </div>
        );
        const loadApprovedPromiNotif = (
            <div className="notification is-primary is-light">
                <p className="mb-4 has-text-weight-semibold">
                    Your Promissory Note Application has been approved! You are granted to pay {formatMoney(parseInt(promi_pay, 10))}. Please upload your proof of payment below.                  
                </p>                                     
            </div>
        );
        return(
            <Fragment>
                <h4 className="is-size-4 has-text-weight-bold mb-2">Upload Proof of Payment</h4>   
                <div className="buttons">
                    <button className="button is-small is-link" onClick={() => this.handleOnButtonClick("backToSteps")}>
                        <span className="icon is-small">
                        <i className="fas fa-angle-left"></i>
                        </span>
                        <span>Back to Enrollment Steps</span>
                    </button>            
                    {/*<button className="button is-info is-small mb-2" onClick={this.toggleShowErrors} >Show/Hide Errors</button>*/} 
                </div>
                {pending_promissory === 1 ? loadAppliedPromiNotif : ""}
                {pending_promissory === 0 && parseInt(promi_pay, 10) > 0 ? loadApprovedPromiNotif : ""}
                {
                    filteredPayments && filteredPayments.length > 0 ? (
                        <div className="mb-2">                            
                            <div className="notification is-info is-light">
                                <strong>You already submitted your proof of payment.</strong> <br />
                                Please wait for the cashier to validate your payment.<br />                                       
                            </div>
                        </div>
                    ) : (
                        <Fragment>
                        <div className="notification">
                            {
                                needed_payment ? loadPayment : (
                                    <Fragment>
                                    <p className="mb-4">
                                        Please pay <strong>{formatMoney(enrollmentFee)} Php</strong> for the Enrollment Fee to any of our payment channels below. <br />
                                        It is required to indicate your <strong>ID# {studentInfo ? studentInfo.stud_id : ""}</strong>, full name and payment type <strong>(Enrollment Fee)</strong> in the bank deposit slip or transaction form.
                                    </p>
                                    <p>
                                        <strong>{studentInfo && studentInfo.course_code === "PD" ? "For School of Medicine students the enrollment fee displayed below may not be correct. Please contact the accounting office to get the accurate enrollment fee." : ""}</strong>
                                    </p>
                                    </Fragment>
                                ) 
                            }
                            <h4 className="has-text-weight-bold is-size-5 pl-2 mt-3"> Payment Channels</h4>                            
                            <PaymentChannels courseCode={studentInfo ? studentInfo.course_code : ""} />                                     
                        </div>
                        {
                            pending_promissory === 1 ? "" : (
                                <div className="columns"> 
                                    <div className="column is-narrow">                                             
                                        <h3 className="has-text-weight-semibold is-size-5">Proof of Payment</h3>                                
                                    </div>    
                                    <div className="column">   
                                        <FileUploadDialog
                                            label="File"
                                            handleSelectedFile={this.handleSelectedFile}
                                            id="payment"                                    
                                            requiredExtensions={["jpg","png"]}
                                            filename={selectedFile ? selectedFile.name : " "}
                                        />                                                                                           
                                    </div> 
                                    <div className="column">                                                        
                                        <button className="button is-primary is-fullwidth"  onClick={this.handleUploadFile} >                                                        
                                            <div className="icon">
                                                <i className="fas fa-paper-plane"></i>
                                            </div> 
                                            <span>Submit File</span>         
                                        </button>                                             
                                    </div>  
                                </div> 
                            )
                        }                        
                        </Fragment>
                    )
                }
                
                       
                {
                    showErrors ? (
                        <div className="mb-2">                            
                            <div className="notification is-danger">
                                <span className="icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </span>
                                <strong>File Size Limit Exceeded</strong> <br />
                                Please insure that the file size does not exceed 10MB.<br />                                       
                            </div>
                        </div>
                    ) : ""
                }
                

            </Fragment>
        )
    };
}

export default withCookies(withRouter(UploadProofOfPayment))
//export default withRouter(UploadProofOfPayment)