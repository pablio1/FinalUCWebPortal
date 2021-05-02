import React, { Component, Fragment } from 'react';

import { formatMoney } from '../../helpers/helper';

export default class AssessmentTable extends Component {

    render() {
        const { educLabel, studentAssessment, selectAssessExamText } = this.props;
        const campus = process.env.REACT_APP_CAMPUS;
        const loadCLTable = (
            <Fragment>
            <div className="table-container">
                <table className="table is-striped is-fullwidth">
                    <tbody>
                        <tr>
                            <th className="is-narrow" colSpan="2">OLD ACCOUNT</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.oldAccount) : "TBA"}</td>
                        </tr> 
                        {
                            campus !== "Banilad" ? (
                                <tr>
                                    <th className="is-narrow" colSpan="2">EXCESS PAYMENT</th>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.excessPayment) : "TBA"}</td>
                                </tr> 
                            ) : ""
                        }
                        <tr>
                            <th className="is-narrow" colSpan="3">FEES :</th>                            
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow"><h4 className="is-size-6">Tuition</h4></td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeTuition) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Laboratory</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeLab) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Registration</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeReg) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Miscellaneous</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeMisc) : "TBA"}</td>
                        </tr> 
                        {
                            campus === "Banilad" ? (
                                <tr>
                                    <td className="is-narrow">&nbsp;</td>
                                    <th className="is-narrow">Total Fees</th>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.assessTotal) : "TBA"}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="is-narrow">&nbsp;</td>
                                    <td className="is-narrow">Adjustment</td>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.adjustmentDebit) : "TBA"}</td>
                                </tr> 
                            )
                        }                         
                        <tr>
                            <th className="is-narrow" colSpan="2">TOTAL DUE</th>
                            <td>{studentAssessment ? formatMoney(parseFloat(studentAssessment.oldAccount) + parseFloat(studentAssessment.assessTotal)) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Total Payment</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.payment) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Discounts</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.discount) : "TBA"}</td>
                        </tr>
                        {
                            campus === "Banilad" ? (
                                <tr>
                                    <td className="is-narrow">{ studentAssessment && parseFloat(studentAssessment.adjustment) < 0 ? "LESS" : "ADD" }</td>
                                    <td className="is-narrow">Adjustments</td>
                                    <td>{studentAssessment ? formatMoney(parseFloat(studentAssessment.adjustment) < 0 ? parseFloat(studentAssessment.adjustment) * -1 : studentAssessment.adjustment) : "TBA"}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="is-narrow">LESS</td>
                                    <td className="is-narrow">Adjustment</td>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.adjustmentCredit) : "TBA"}</td>
                                </tr> 
                            )
                        } 
                        <tr>
                            <th className="is-narrow" colSpan="2">BALANCE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.balance) : "TBA"}</td>
                        </tr>                                                                                        
                    </tbody>
                </table>    
            </div>
            <article className="message is-info">
                <div className="message-body">
                    <h4 className="is-size-6">{selectAssessExamText} Amount Due</h4>  
                    <h4 className="is-size-5">{studentAssessment ? formatMoney(studentAssessment.amountDue) : "TBA"}</h4>                                  
                </div>
            </article>
            </Fragment>
        );
        const loadSHTable = (
            <Fragment>
            <div className="table-container">
                <table className="table is-striped is-fullwidth">
                    <tbody>
                        <tr>
                            <th className="is-narrow" colSpan="2">OLD ACCOUNT</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.oldAccount) : "TBA"}</td>
                        </tr>
                        {
                            campus !== "Banilad" ? (
                                <tr>
                                    <th className="is-narrow" colSpan="2">EXCESS PAYMENT</th>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.excessPayment) : "TBA"}</td>
                                </tr> 
                            ) : ""
                        }
                        <tr>
                            <th className="is-narrow" colSpan="3">FEES :</th>                            
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow"><h4 className="is-size-6">Tuition</h4></td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeTuition) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Laboratory</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeLab) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Registration</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeReg) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Miscellaneous/Others</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeMiscOthers) : "TBA"}</td>
                        </tr> 
                        {
                            campus === "Banilad" ? (
                                <tr>
                                    <td className="is-narrow">&nbsp;</td>
                                    <th className="is-narrow">Total Fees</th>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.feeTotal) : "TBA"}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="is-narrow">&nbsp;</td>
                                    <td className="is-narrow">Adjustment</td>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.adjustmentDebit) : "TBA"}</td>
                                </tr> 
                            )
                        }      
                        <tr>
                            <th className="is-narrow" colSpan="2">TOTAL DUE</th>
                            <td>{studentAssessment ? formatMoney(parseFloat(studentAssessment.oldAccount) + parseFloat(studentAssessment.feeTotal)) : "TBA"}</td>
                        </tr>
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Total Payment</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.payment) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Discounts</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.discount) : "TBA"}</td>
                        </tr> 
                        {
                            campus === "Banilad" ? (
                                <tr>
                                    <td className="is-narrow">{ studentAssessment && parseFloat(studentAssessment.adjustment) < 0 ? "LESS" : "ADD" }</td>
                                    <td className="is-narrow">Adjustments</td>
                                    <td>{studentAssessment ? formatMoney(parseFloat(studentAssessment.adjustment) < 0 ? parseFloat(studentAssessment.adjustment) * -1 : studentAssessment.adjustment) : "TBA"}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="is-narrow">LESS</td>
                                    <td className="is-narrow">Adjustment</td>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.adjustmentCredit) : "TBA"}</td>
                                </tr> 
                            )
                        } 
                        <tr>
                            <th className="is-narrow" colSpan="2">BALANCE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.balance) : "TBA"}</td>
                        </tr>
                        {
                            campus !== "Banilad" ? (
                                <tr>
                                    <th className="is-narrow" colSpan="2">GOVERNMENT SUBSIDY</th>
                                    <td>{studentAssessment ? formatMoney(studentAssessment.governmentSubsidy) : "TBA"}</td>
                                </tr>
                            ) : ""
                        }
                        <tr>
                            <th className="is-narrow" colSpan="2">STUDENT SHARE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.studShare) : "TBA"}</td>
                        </tr>
                        <tr>
                            <th className="is-narrow" colSpan="2">STUDENT SHARE BALANCE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.studShareBal) : "TBA"}</td>
                        </tr>                                                                                                                                  
                    </tbody>
                </table>    
            </div>
            <article className="message is-info">
                <div className="message-body">
                    <h4 className="is-size-6">{selectAssessExamText} Amount Due</h4>  
                    <h4 className="is-size-5">{studentAssessment ? formatMoney(studentAssessment.amountDue) : "TBA"}</h4>                                  
                </div>
            </article>
            </Fragment>
        );
        const loadJHTable = (
            <Fragment>
            <div className="table-container">
                <table className="table is-striped is-fullwidth">
                    <tbody>
                    <tr>
                            <th className="is-narrow" colSpan="2">OLD ACCOUNT</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.oldAccount) : "TBA"}</td>
                        </tr>
                        <tr>
                            <th className="is-narrow" colSpan="3">FEES :</th>                            
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow"><h4 className="is-size-6">Tuition</h4></td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeTuition) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Laboratory</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeLab) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Registration</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeReg) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <td className="is-narrow">Miscellaneous/Others</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeMiscOthers) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">&nbsp;</td>
                            <th className="is-narrow">Total Fees</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.feeTotal) : "TBA"}</td>
                        </tr>   
                        <tr>
                            <th className="is-narrow" colSpan="2">TOTAL DUE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.totalDue) : "TBA"}</td>
                        </tr>                        
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Total Payment</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.payment) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">LESS</td>
                            <td className="is-narrow">Discounts</td>
                            <td>{studentAssessment ? formatMoney(studentAssessment.discount) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <td className="is-narrow">{ studentAssessment && parseFloat(studentAssessment.adjustment) < 0 ? "LESS" : "ADD" }</td>
                            <td className="is-narrow">Adjustments</td>
                            <td>{studentAssessment ? formatMoney(parseFloat(studentAssessment.adjustment) < 0 ? parseFloat(studentAssessment.adjustment) * -1 : studentAssessment.adjustment) : "TBA"}</td>
                        </tr> 
                        <tr>
                            <th className="is-narrow" colSpan="2">BALANCE</th>
                            <td>{studentAssessment ? formatMoney(studentAssessment.balance) : "TBA"}</td>
                        </tr>                                                                                                            
                    </tbody>
                </table>    
            </div>
            <article className="message is-info">
                <div className="message-body">
                    <h4 className="is-size-5">{selectAssessExamText} Amount Due</h4>  
                    <h4 className="is-size-4">{studentAssessment ? formatMoney(studentAssessment.amountDue) : "TBA"}</h4>                                  
                </div>
            </article>
            </Fragment>
        );
        let loadTable = "";
        if(studentAssessment) {
            if(educLabel === "CL") loadTable = loadCLTable;
            if(educLabel === "SH") loadTable = loadSHTable;
            if(educLabel === "JH" || educLabel === "BE") loadTable = loadJHTable;
        }
        else {
            let msg = ""
            if(selectAssessExamText) msg = <h4 className="is-size-6">{selectAssessExamText} Assessment not available yet.</h4>;
            else msg = <h4 className="is-size-6">Select Assessment Period First</h4> 
            loadTable = (
                <article className="message is-danger">
                    <div className="message-body">
                        {msg}                                            
                    </div>
                </article>
            );
        }
        return(
            <Fragment>
                {loadTable}  
            </Fragment>    
        );
    }

}