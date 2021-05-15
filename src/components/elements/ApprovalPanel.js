import React, { Component, Fragment } from 'react';
//import { withRouter } from 'react-router-dom';
//import axios from 'axios';

export default class ApprovalPanel extends Component {
    state = {
        showDisapprovedModal: false, disapproveButtonLabel: "Disapprove", showApprovedModal: false, approveButtonLabel: "Approve"
    }
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e.target.name, e.target.value);
    }
    handleOnButtonClick = (e) => {
        //const { approver, currentTab, sections } = this.props;        
        //if(approver === "DEAN" && currentTab === "pending" && sections !== "disable") {
        //    this.props.handleApprovalButton(e);
        //}
        //else this.props.handleApprovalButton(e);
        this.props.handleApprovalButton(e);
    }
    toggleDisapprovedModal = () => {
        const { showDisapprovedModal, disapproveButtonLabel } = this.state;
        this.setState({
            showDisapprovedModal: !showDisapprovedModal,
            disapproveButtonLabel: disapproveButtonLabel === "Disapprove" ? "Cancel" : "Disapprove"
        });
    }
    toggleApprovedModal = () => {        
        const { courseDepartment, step } = this.props;        
        if((["SHS","JHS","BED"].includes(courseDepartment) && step === "DeanRegistration") || step === "DeanPromissory" || step === "promissoryExam") {
            const { showApprovedModal, approveButtonLabel } = this.state;
            this.setState({
                showApprovedModal: !showApprovedModal,
                approveButtonLabel: approveButtonLabel === "Approve" ? "Cancel" : "Approve"
            });
        } 
        else this.handleOnButtonClick("approved");
        
    }
    handleOnChangeMessage = e => {
        this.props.handleOnchangeInput("disapproveMsg", e.target.value);
    }
    handleOnClickEvaluate = () =>{
        this.props.handleOnClickEvaluate();
    }
    handleOnClickBack = () =>{
        this.props.handleOnClickBack();
    }
    handleSubmitEvaluation = () =>{
        this.props.handleSubmitEvaluation();
    }
    render() {        
        const {studentInfo,isEvaluate ,approver, sections, currentTab, disapproveMsg, sectionValue, title, disableApproveBtn, step, amountCanPay, textMsgMaxChar, curr_year,selectedCurrYear} = this.props;   
        const { showDisapprovedModal, disapproveButtonLabel, showApprovedModal, approveButtonLabel } = this.state;
        let sectionsOption = "";
        if(sections !== "disable") {  
            sectionsOption = ["DEAN", "CHAIRPERSON", "COOR"].includes(approver) && sections ? sections.map((section, index ) => {
                return <option key={index+1} value={section}>{section}</option>       
            }) : "";
        }
        var currOption = curr_year ? curr_year.filter(filt => filt.isDeployed == 1).map((curr, indx) => {
            return <option key={indx+1} value={curr.year}>{curr.year}</option>
        }):"";
        const deansPanel = (
            <Fragment>
                {
                    step !== "DeanEvaluation" &&
                    <Fragment>
                        <div className="control">
                            <button className="button is-static is-small">
                                Assign Section
                            </button>                                                
                        </div>
                        <div className="control">
                            <span className="select is-small">                            
                                <select name="section" onChange={this.handleOnchangeInput} value={sectionValue}
                                        required data-fieldname="Section Assignment">
                                    <option kay={0} value="">Select</option>
                                    {sectionsOption}
                                </select>
                            </span>       
                        </div>
                    </Fragment>
                }
                {
                    
                }
                <div className="control">
                    <button className="button is-static is-small">
                        Assign Curriculum
                    </button>                                                
                </div>
                <div className="control">
                    <span className="select is-small">                            
                        <select name="selectedCurrYear" onChange={this.handleOnchangeInput} value={selectedCurrYear}
                                required data-fieldname="Curriculum Assignment">
                            <option kay={0} value="">Select</option>
                            {currOption}
                        </select>
                    </span>       
                </div>
            </Fragment>
        );
        const approvedBtn = (
            <button className="button is-small is-success mt-0 has-text-weight-semibold" name="approveBtn"
                    onClick={this.toggleApprovedModal} disabled={disableApproveBtn}>
                <span className="icon is-small">
                    <i className="fas fa-check-circle"></i>
                </span>
                <span>{approveButtonLabel}</span>                                    
            </button>
        );
        const evaluateBtn = (
            <button className={"button is-small mt-0 has-text-weight-semibold "+(isEvaluate?" is-danger":" is-info ")} name="approveBtn"
                    onClick={this.handleOnClickEvaluate} disabled={disableApproveBtn}>
                <span className="icon is-small">
                    <i className={"fas "+(isEvaluate?"fa-arrow-circle-left":"fa-check-circle")}></i>
                </span>
                <span>{isEvaluate?"Back":"Evaluate"}</span>                                    
            </button>
        );
        const disapprovedBtn = (
            <button className="button is-small is-danger mt-0 has-text-weight-semibold" name="disapproveBtn"
                    onClick={this.toggleDisapprovedModal}>
                <span className="icon is-small">
                    <i className="fas fa-ban"></i>
                </span>
                <span>{disapproveButtonLabel}</span>                                
            </button>
        );
        const submitBtn = (
            <button className="button is-small is-info mt-0 has-text-weight-semibold" name="disapproveBtn"
                    onClick={this.handleSubmitEvaluation}>
                <span className="icon is-small">
                    <i className="fas fa-check"></i>
                </span>
                <span>Submit</span>                                
            </button>
        );
        /*const pendingBtn = (
            <button className="button is-small is-info mt-0 has-text-weight-semibold" name="pendingBtn"
                    onClick={() => this.handleOnButtonClick("pending")}>
                <span className="icon is-small">
                    <i className="fas fa-envelope-open-text"></i>
                </span>
                <span>Pending</span>                                    
            </button>
        );*/

        let showButtons = "";
        if (currentTab === "pending" || currentTab === "requests" || currentTab === "evaluate") {
            showButtons = (
                <Fragment>
                    {currentTab !== "evaluate"? approvedBtn:""}
                    {isEvaluate? submitBtn: ""}
                    {currentTab === "evaluate"?evaluateBtn:""}
                    {currentTab !== "evaluate"? (approver === "ACCOUNTING" || approver === "CASHIER" || step === "DeanPromissory" || step === "promissoryExam" ? "" : disapprovedBtn):""}  
                </Fragment>
            );
        } 
       
        /*if (currentTab === "approved") {
            showButtons = (
                <Fragment>
                    {pendingBtn}
                    {disapprovedBtn}  
                </Fragment>
            );
        }
        if (currentTab === "disapproved") {
            showButtons = (
                <Fragment>
                    {pendingBtn}
                    {approvedBtn}  
                </Fragment>
            );
        } */
        const loadPromissoryForm = (
            <Fragment>
                <nav className="level p-0 m-0">
                    <div className="level-left mb-0 pb-0"><h4 className="has-text-weight-semibold mt-2 mb-2">Override Payable Amount: </h4></div>
                    <div className="level-right mt-0 pt-0 pr-3"><h4 className="is-size-7 has-text-weight-semibold">Msg Chars Left: {textMsgMaxChar}</h4></div>  
                </nav>                
                <input className="input mt-0" name="amountCanPay" type="text" value={amountCanPay} onChange={this.handleOnchangeInput}/>
            </Fragment>
        );
        return(  
            <Fragment>    
                <div className="columns mb-0">
                    <div className="column">
                        <h3 className="has-text-weight-bold is-size-5">{title}</h3>
                    </div>
                    <div className="column is-narrow">
                        <div className="field has-addons">
                            {["DEAN", "CHAIRPERSON", "COOR"].includes(approver) && (currentTab === "pending" || currentTab === "evaluate") && (step === "DeanRegistration" || step === "DeanEvaluation") ?  deansPanel : ""}
                            <div className="control ml-3">
                                <div className="buttons">
                                    {showButtons}
                                </div>   
                            </div>
                        </div>                                                   
                        <div className="is-hidden-desktop"></div>
                    </div>
                </div>  
                {
                    showDisapprovedModal ? (
                        <div className="columns mb-0">
                            <div className="column">
                                <textarea className="textarea" rows="3" maxLength="500" placeholder="Enter Disapproval Message" value={disapproveMsg} onChange={this.handleOnChangeMessage}></textarea>
                                <nav className="level">
                                    <div className="level-left mb-0 pb-0"></div>
                                    <div className="level-right mt-1 pt-0">
                                        <button className="button is-small is-primary mt-1 has-text-weight-semibold" name="disapproveBtn"
                                                onClick={() => this.handleOnButtonClick("disapproved")} disabled={ disapproveMsg < 10 ? true : false} >
                                            <span className="icon is-small">
                                                <i className="fas fa-paper-plane"></i>
                                            </span>
                                            <span>Send</span>                                
                                        </button>        
                                    </div>  
                                </nav>                                 
                            </div>
                        </div>   
                    ) : ""
                }
                {
                    showApprovedModal ? (
                        <div className="columns mb-0">
                            <div className="column">
                                <textarea className="textarea" rows="3" maxLength="500" placeholder="Enter Message" value={disapproveMsg} onChange={this.handleOnChangeMessage}></textarea>
                                {step === "DeanPromissory" || step === "promissoryExam" ? loadPromissoryForm : ""}
                                <nav className="level">
                                    <div className="level-left mb-0 pb-0"></div>
                                    <div className="level-right mt-1 pt-0">
                                        <button className="button is-small is-primary mt-1 has-text-weight-semibold" name="disapproveBtn"
                                                onClick={() => this.handleOnButtonClick("approved")} disabled={ disapproveMsg < 10 ? true : false} >
                                            <span className="icon is-small">
                                                <i className="fas fa-paper-plane"></i>
                                            </span>
                                            <span>Send</span>                                
                                        </button>        
                                    </div>  
                                </nav>                                 
                            </div>
                        </div>   
                    ) : ""
                }        
            </Fragment> 
        )
    }
}