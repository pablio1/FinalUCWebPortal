import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import axios from 'axios';
import store from 'store2';
import { v4 as uuidv4 } from 'uuid';

import { getLoggedUserDetails, sortArraySpecificOrder, formatMoney } from '../../helpers/helper';
import { getStudentAssessment, savePayment, getStudentInfo, getOldStudentInfo, studentApplyPromissory, getStudentPayments } from '../../helpers/apiCalls';

import AssessmentTable from './AssessmentTable';
import PaymentChannels from '../../components/enrollment/PaymentChannels';
import FileUploadDialog from '../../components/elements/FileUploadDialog';
import ModalImage from '../../components/elements/ModalImage';

class Student extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            educLevel: '', currentExam: '', selectAssessExam: '', studentAssessmentAll: null, studentAssessment: null, currentTerm: '',
            selectedFile: '', studentInfo: '', studentID: '',
            promissoryBtnClicked: false, promiRequestMsg: '', amountCanPay: 0, promiRequestMsgMaxChar: 1500, promiApproveMsg: '', appliedPromissory: 0,
            approvedPromissoryAmt: 0, studentPayments: null, documentPath: '', showImageModal: false
        }
    }
    componentDidMount = () => {
        const { cookies } = this.props; 
        let studentEducLevel = "CL";
        if(getLoggedUserDetails("deptabbr") === "SHS") studentEducLevel = "SH";
        if(getLoggedUserDetails("deptabbr") === "JHS") studentEducLevel = "JH";
        if(getLoggedUserDetails("deptabbr") === "BED") studentEducLevel = "BE";
        this.setState({
            educLevel: studentEducLevel,
            currentTerm: process.env.REACT_APP_CURRENT_SCHOOL_TERM,
            appliedPromissory: getLoggedUserDetails("pendingexampromi"),
            approvedPromissoryAmt: getLoggedUserDetails("approvedpromiamount"),
            selectAssessExam: getLoggedUserDetails("currentexam"),
            currentExam: getLoggedUserDetails("currentexam"),
            studentID: getLoggedUserDetails("idnumber")
        }, () => {            
            getStudentAssessment(this.state.educLevel,this.state.studentID,"", cookies.get("selterm"))
            .then(response => {
                if(response.data.exams && response.data.exams.length > 0) {
                    const examsData = response.data.exams;
                    const studentAssessment = examsData.filter(assess => assess.examName === getLoggedUserDetails("currentexam"))[0];
                    this.setState({
                        studentAssessmentAll: examsData,
                        studentAssessment: studentAssessment
                    });
                    this.getStudentPaymentsData();                    
                }
                else {
                    this.setState({
                        studentAssessmentAll: null
                    })
                }                 
            });
            if(["O", "R", "S"].includes(getLoggedUserDetails("classification"))) {        
                getOldStudentInfo(this.state.studentID, 0, cookies.get("selterm")) 
                .then(response => {
                    this.setState({
                        studentInfo: response.data,
                    });
                });   
            }
            else {            
                getStudentInfo(this.state.studentID, 0, cookies.get("selterm")) 
                .then(response => {            
                    this.setState({
                        studentInfo: response.data,                        
                    });
                }); 
            }
        });
    }
    handleOnChangeInput = e => {
        if(e.target.name === "selectAssessExam") {
            this.setState({
                selectAssessExam : e.target.value,
                //selectAssessExamText: e.target.options[e.target.selectedIndex].text
            }, () => {
                if(this.state.selectAssessExam) {
                    const { studentAssessmentAll, selectAssessExam } = this.state;
                    const filteredAssessment = studentAssessmentAll.filter(assess => assess.examName === selectAssessExam)[0];
                    this.setState({
                        studentAssessment: filteredAssessment
                    })
                }
                else {
                    this.setState({
                        studentAssessment: null,
                        //selectAssessExamText: ''
                    })
                }
            })
        }
        else if(e.target.name === "amountCanPay") {
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
    }
    handleSelectedFile = (id, e) => {
        this.setState({
            selectedFile: e
        })
    }
    handleUploadFile = e => {
        const { cookies } = this.props;
        //File Upload
        const { selectedFile, studentInfo, selectAssessExam } = this.state;
        const fileUuid = uuidv4();
        const fileExtension = selectedFile.name.substr(selectedFile.name.lastIndexOf('.') + 1).toLowerCase();
        //const fullname = (studentInfo.last_name.trim() + "_" +  studentInfo.first_name.trim() + (studentInfo.middle_name ? "_" + studentInfo.middle_name.trim() : "") + "_" + (studentInfo.suffix ? studentInfo.suffix.trim() : "")).split(" ").join("_");   
        const filename = studentInfo.stud_id + "_[payment]_[" + selectAssessExam + "]_" + fileUuid + "." + fileExtension;
        let formData = new FormData(); 
        //formData.append('formFiles', selectedFile, fullname + "_[payment]_" + selectAssessExam + "." + fileExtension); 
        formData.append('formFiles', selectedFile, filename); 
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
                        filename: filename
                    }],
                    active_term: cookies.get("selterm")
                }                  
                savePayment(data)
                .then(res => {
                    if(res.data.success) {
                        alert("File successfully upload. Please wait for the cashier to check and validate your payment.");
                        this.setState({
                            selectedFile: ''
                        });
                        this.getStudentPaymentsData();
                    }
                    else alert("File upload failed! Please try again. If issue persist contact EDP Office.");
                });   
            }     
        }).catch(error => {
            console.log(error);
        }); 
    }
    handleOnButtonClick = e => {
        if(e === "applyPromi") {
            this.setState({
                promissoryBtnClicked: true
            });
        }
        else if(e === "cancelPromi") {
            this.setState({
                promissoryBtnClicked: false,
                promiRequestMsg: '',
                amountCanPay: 0,
                promiRequestMsgMaxChar: 1500
            })
        }
    }
    handleOnApplyPromissory = () => {
        const { cookies } = this.props;
        const { promiRequestMsg, amountCanPay, selectAssessExam, educLevel } = this.state;
        if(promiRequestMsg.trim() === '' || amountCanPay.trim() === '0' || amountCanPay.trim() === '') {
            alert("These required fields cannot be empty. 'Request Message' and/or 'Amount you can pay'.");
        }
        else {
            const confirmMsg = "Are you sure you want to apply for a Promissory Note? You request to pay only " + formatMoney(amountCanPay) + ". Click Ok to proceed, Cancel Application";
            if(window.confirm(confirmMsg)) {  
                const data = {
                    stud_id: this.state.studentID,
                    message: promiRequestMsg,
                    promise_pay: amountCanPay,
                    exam: selectAssessExam,
                    department: educLevel
                };
                studentApplyPromissory(data, "exam", cookies.get("selterm"))
                .then(response => {  
                    if(response.data.success) {  
                        alert("Your Promissory Note application has been submitted, please be patient while your Dean/Acad Head is evaluating your request.");
                        this.setState({
                            promissoryBtnClicked: false,
                            promiRequestMsg: '',
                            amountCanPay: 0,
                            appliedPromissory: 1
                        });
                    }
                    else {
                        alert("Application submission error, please try again. If issue persist kindly contact EDP office.");
                        this.setState({
                            promissoryBtnClicked: false,
                            promiRequestMsg: '',
                            amountCanPay: 0,
                            appliedPromissory: 0
                        });
                    }
                });
            }
        }
    }
    getStudentPaymentsData = () => {
        const { cookies } = this.props;
        const data = {
            id_number: this.state.studentID,
            exam_type: this.state.selectAssessExam,
            status: 3,
            active_term: cookies.get("selterm")
        }
        getStudentPayments(data)
        .then(response => {    
            if(response.data && response.data.images.length > 0) {       
                this.setState({
                    studentPayments: response.data.images,                
                });
            }
            else {
                this.setState({
                    studentPayments: null,                
                });
            }
        });
    }
    handleOnCloseImageModal = () => {
        this.setState({ 
            documentPath: '', 
            showImageModal: false
        })
    }
    handleOnClickUploadedImage = e => {
        if(e) {
            this.setState({
                documentPath: e, 
                showImageModal: true
            })
        }
    }
    render() {
        const { 
            currentTerm, educLevel, selectAssessExam, studentAssessment, studentAssessmentAll, selectedFile, studentPayments,
            promissoryBtnClicked, promiRequestMsg, promiRequestMsgMaxChar, amountCanPay, appliedPromissory, approvedPromissoryAmt,
            documentPath, showImageModal, currentExam
        } = this.state;
        const examOrder = ["P","M","S","F"];
        const examsCL = { P:"Prelim", M:"Midterm", S:"Semi-Final", F:"Final"};
        const examsSH = { P:"First Mastery Test", M:"First Quarter Test", S:"Second Mastery Test", F:"Second Quarter Test", P1:"Third Mastery Test", M1:"Third Quarter Test", S1:"Semi-Final Exam", F1:"Final Exam"};
        const examMonths = ["Month","January","February","March","April","May","June","July","August","September","October","November","December"];
        const availableExams = studentAssessmentAll ? [...new Set(studentAssessmentAll.map(exam => exam.examName))] : null;  
        const isLaw = ["JD","JT"].includes(getLoggedUserDetails("coursecode")) ? true : false;      
        let loadExamOptions = "";
        let selectAssessExamText = "";
        if(educLevel === "CL") {  
            selectAssessExamText = examsCL[selectAssessExam];
            loadExamOptions = availableExams ? sortArraySpecificOrder(availableExams, examOrder).map((exam, index) => {
                return <option key={index} value={exam}>{examsCL[exam]}</option>
            }) : "";
        }
        if(educLevel === "SH") {  
            selectAssessExamText = currentTerm.substring(4) === "1" ? examsSH[selectAssessExam] : examsSH[selectAssessExam+"1"];
            loadExamOptions = availableExams ? sortArraySpecificOrder(availableExams, examOrder).map((exam, index) => {
                return <option key={index} value={exam}>{currentTerm.substring(4) === "1" ? examsSH[exam] : examsSH[exam+"1"]}</option>
            }) : "";  
        }
        if(educLevel === "JH" || educLevel === "BE") {
            selectAssessExamText = examMonths[selectAssessExam];
            const sortedArr = availableExams ? availableExams.sort(function(a, b) { return parseInt(a) > parseInt(b) }) : ""; //sort by numeric string values
            loadExamOptions = sortedArr ? sortedArr.map((exam, index) => {
                return <option key={index} value={exam}>{examMonths[exam]}</option>
            }) : "";
        }  
        const loadApplyPromiNotif = appliedPromissory === 1 ? (
            <div className="columns">
                <div className="column is-half-widescreen">
                    <div className="notification is-info">
                        <span className="icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </span>
                        You have applied for a promissory note and your application is now under evaluation. please be patient while your Dean/Acad Head is evaluating your request.
                    </div>        
                </div>
            </div>
        ) : (
            <div className="columns">
                <div className="column is-half-widescreen">
                    <div className="notification is-success">
                        <span className="icon">
                            <i className="fas fa-check"></i>
                        </span>
                        Your Promissory Note Application has been reviewed and you are granted to pay <strong>{formatMoney(parseInt(approvedPromissoryAmt, 10))}</strong>. Please upload your proof of payment below. 
                    </div>        
                </div>
            </div>
        );
        const loadPromisorryBtnRequest = appliedPromissory !== 0 ? loadApplyPromiNotif : (
            <button className="button is-info ml-2 mt-1 mb-1"  onClick={() => this.handleOnButtonClick("applyPromi")} disabled={promissoryBtnClicked} >                                                        
                <span>Apply for Promissory</span>         
            </button>
        );
        const loadPromissoryForm = promissoryBtnClicked ? (
            <div className="columns mb-0">
                <div className="column mt-2 is-half-desktop">
                    <textarea className="textarea" rows="3" maxLength="1500" placeholder="Enter Request Message" name="promiRequestMsg"
                              value={promiRequestMsg} onChange={this.handleOnChangeInput}></textarea>
                    <nav className="level p-0 m-0">
                        <div className="level-left mb-0 pb-0"><h4 className="has-text-weight-semibold mt-2 mb-2">Enter Amount you can pay: </h4></div>
                        <div className="level-right mt-0 pt-0 pr-3"><h4 className="is-size-7 has-text-weight-semibold">Msg Chars Left: {promiRequestMsgMaxChar}</h4></div>  
                    </nav>
                    
                    <input className="input mt-0" name="amountCanPay" type="text" value={amountCanPay} onChange={this.handleOnChangeInput}/>
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
        ) : "";        
        const loadPromissoryPanel = isLaw || ["JH","BE"].includes(educLevel) || currentExam !== selectAssessExam ? "" : (
            <Fragment>
            <h3 className="has-text-weight-semibold is-size-5 mb-3">Promissory Note Application</h3>
            {loadPromisorryBtnRequest}                             
            {loadPromissoryForm}
            </Fragment>
        )
        const loadUploadedPayments = studentPayments ? studentPayments.map((payment, index) => {
            let paymentStatus = "Pending";
            let paymentStatusIcon = <i className="fas fa-hourglass-start fa-pulse">&nbsp;</i>;
            if(payment.status === 1) {
                paymentStatus = "Received";
                paymentStatusIcon = <i className="fas fa-check"></i>;
            }
            if(payment.status === 2) {
                paymentStatus = "Duplicate";
                paymentStatusIcon = <i className="far fa-copy">&nbsp;</i>;
            }
            return (
                <tr key={index}>                                                        
                    <th className="is-narrow">                         
                        {paymentStatusIcon}
                        {paymentStatus}
                    </th>   
                    <td><div className="is-clickable has-text-link" onClick={() => this.handleOnClickUploadedImage(process.env.REACT_APP_PATH_STORAGE_PAYMENTS + payment.file_name)}>{payment.file_name}</div></td>
                    {/*<td><a href={process.env.REACT_APP_PATH_STORAGE_ATTACHMENTS + payment.file_name} target="_blank">{payment.file_name}</a></td> */}                                               
                </tr>
            );
        }) : <tr><td></td></tr>;
        return(
            <div className="box ml-1" style={{ minHeight: "300px" }}>
                <ModalImage               
                    documentPath={documentPath}
                    showImageModal={showImageModal} 
                    handleOnCloseImageModal={this.handleOnCloseImageModal}
                />
                <div className="control mb-3">
                    <div className="select is-small">
                        <select name="selectAssessExam" value={selectAssessExam} onChange={this.handleOnChangeInput}>
                            <option value="">Select Assessment</option>
                            {loadExamOptions}
                        </select>
                    </div>
                </div>  
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0 mb-3"></div>
                </div> 
                <article className="message is-info mb-2">
                    <div className="message-body">
                        <h4 className="is-size-7">
                            The information posted here is not realtime. Adjustments/ payments made after the posting date is not reflected here. {process.env.REACT_APP_CAMPUS === "Banilad" ? "" : "Lab Fees are subject for adjustment."}   
                            For any assessment related concerns, please contact the accounting office through <strong>{process.env.REACT_APP_ACCOUNTING_EMAIL}</strong> with email subject <strong>"Assessment"</strong>.
                            Please indicate your full name and ID number in your email.    
                        </h4>                            
                    </div>
                </article>
             
                <div className="columns">
                    <div className="column is-4">                        
                        <AssessmentTable
                            educLabel={educLevel}
                            studentAssessment={studentAssessment}
                            selectAssessExamText={selectAssessExamText}
                        />                          
                    </div>
                    <div className="column">
                        {
                            studentAssessment ? (
                                <Fragment>
                                <div className="notification is-success is-light">
                                    <div className="content">
                                        <h4 className="is-size-5">Payment Channels</h4> 
                                        <PaymentChannels courseCode={getLoggedUserDetails("coursecode")} /> 
                                    </div>
                                </div>
                                {loadPromissoryPanel}
                                <div className="">
                                    <div className="divider is-size-6 mt-3 pt-0 mb-3"></div>
                                </div> 
                                {
                                    (appliedPromissory && appliedPromissory !== 3) && !isLaw ? "" : (
                                        <Fragment>
                                        <h3 className="has-text-weight-semibold is-size-5 mb-3">Upload Proof of Payment</h3>    
                                        <div className="columns">   
                                            <div className="column">   
                                                <FileUploadDialog
                                                    label="File"
                                                    handleSelectedFile={this.handleSelectedFile}
                                                    id="payment"                                    
                                                    requiredExtensions={["jpg","png"]}
                                                    filename={selectedFile ? selectedFile.name : " "}
                                                />                                                                                           
                                            </div> 
                                            <div className="column is-3">                                                        
                                                <button className="button is-primary is-fullwidth"  onClick={this.handleUploadFile} >                                                        
                                                    <div className="icon">
                                                        <i className="fas fa-paper-plane"></i>
                                                    </div> 
                                                    <span>Submit File</span>         
                                                </button>                                             
                                            </div>  
                                        </div>
                                        <h3 className="has-text-weight-semibold is-size-5 mb-3">Uploaded Proof Payment</h3>   
                                        <div className="columns">   
                                            <div className="column">   
                                                <div className="table-container">
                                                    <table className="table is-striped is-fullwidth is-size-7">
                                                        <tbody>
                                                            {loadUploadedPayments}                                                                                         
                                                        </tbody>
                                                    </table>    
                                                </div>                                                                    
                                            </div>  
                                        </div>                                         
                                        </Fragment>
                                    )
                                }
                                </Fragment>
                            ) : ""
                        }
                    </div>
                </div>    
            </div>     
        );
    }

}

export default withCookies(Student)