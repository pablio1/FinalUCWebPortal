import React, { Component, Fragment } from 'react';

export default class PaymentChannels extends Component {

    render() {
        const currentCampus = process.env.REACT_APP_CAMPUS;
        const { courseCode } = this.props;
        const loadBaniladCL = (
            <table className="table is-bordered is-striped is-narrow is-hoverable m-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Account #</th>
                    </tr>
                </thead>     
                <tbody>
                    <tr>
                        <th>Metrobank</th>
                        <td>246-3-24655536-3</td>                                  
                    </tr>
                    <tr>
                        <th>BDO</th>
                        <td>001858022960</td>                                   
                    </tr>
                    <tr>
                        <th>Aspac Bank</th>
                        <td>13-0201-0004-6</td>                                   
                    </tr>
                    <tr>
                        <th>Cebuana Lhuillier</th>
                        <td>Specify University of Cebu Banilad as Receiver</td>                                    
                    </tr> 
                    <tr>
                        <td colSpan="2">Over-the-counter payment to the School, once community quarantine protocols are lifted</td>                                
                    </tr> 
                    <tr>
                        <td colSpan="2">
                            <strong>If Bills payment,  Pay Biller : University of Cebu Banilad, Subscriber name: Name of Student, Subscriber No: ID Number</strong>
                        </td>                                
                    </tr>                                                                                          
                </tbody>
            </table>
        );
        const loadBaniladSOM = (
            <table className="table is-bordered is-striped is-narrow is-hoverable m-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Account #</th>
                    </tr>
                </thead>     
                <tbody>
                    <tr>
                        <th>BDO</th>
                        <td>001851276716</td>                                  
                    </tr>
                    <tr>
                        <th>UNIONBANK</th>
                        <td>000-2600-37229</td>                                   
                    </tr> 
                    <tr>
                        <td colSpan="2">
                            <strong>Account name: University of Cebu College of Medicine Foundation, Inc.</strong>
                        </td>                                
                    </tr>                    
                    <tr>
                        <td colSpan="2">Over-the-counter payment to the School, once community quarantine protocols are lifted</td>                                
                    </tr>                                                                                                              
                </tbody>
            </table>
        );        
        const loadUCLM = (
            <table className="table is-bordered is-striped is-narrow is-hoverable m-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Account #</th>
                    </tr>
                </thead>     
                <tbody>                    
                    <tr>
                        <th className="is-narrow">Landbank</th>
                        <td>0141-4806-18 (for Senior High School students)</td>                                   
                    </tr>
                    <tr>
                        <th className="is-narrow">Landbank</th>
                        <td>0141-4662-67 (for Junior High School students)</td>                                    
                    </tr> 
                    <tr>
                        <th className="is-narrow">Metrobank</th>
                        <td>094-3-01147805-0</td>                                    
                    </tr> 
                    <tr>
                        <th className="is-narrow">Unionbank</th>
                        <td>0005-7001-2910</td>                                    
                    </tr> 
                    <tr>
                        <th colSpan="2">
                            Over-the-counter payment to the School, once community quarantine protocols are lifted. <br />
                        </th>                                
                    </tr> 
                    <tr>
                        <td colSpan="2">
                            
                        </td>                                
                    </tr> 
                    <tr>
                        <th colSpan="2">BILLS PAYMENT GUIDELINES</th>                                
                    </tr>
                    <tr>
                        <th className="is-narrow">Cebuana Lhuillier</th>
                        <td>Over the counter -  Specify UCLM as biller. Account No: ID number, Account Name: Name of Student</td>                                    
                    </tr>
                    <tr>
                        <th className="is-narrow">Metrobank</th>
                        <td>
                            Over the counter -  Fill up the Payment Slip (Green Form). Specify UC-LM as biller. Subscriber No: ID number, Subscriber Name: Name of Student.<br />
                            Mobile App/Website – Go to My bills. Enrolled Billers click add or + sign. Specify UC-LM as biller. Subscriber Number: ID number
                        </td>                                    
                    </tr> 
                    <tr>
                        <th className="is-narrow">Banco de Oro</th>
                        <td>
                            Over the counter -  Fill up Cash Transaction Slip. Check Bills Payment. Company Name: UNIVERSITY OF CEBU – LAPULAPU AND MANDAUE INC. Institution Code: 1071. Subscriber No: ID number, Subscriber Name: Name of Student. <br />
                            Mobile App/Website - Go to Enrollment Services. Enrolled Company/Biller. Search for UNIVERSITY OF CEBU – LAPULAPU AND MANDAUE INC Specify UC-LM as biller. Subscriber Number: ID number. Subscriber Name: Name of Student. Preferred Nickname: Provide your own desired nickname. Go to Pay Bills then Pay this Company/Biller.
                        </td>                                    
                    </tr> 
                    <tr>
                        <th className="is-narrow">ASPAC Bank</th>
                        <td>
                            Over the counter – Fill up the payment slip. Specify UCLM as biller. Account No: ID number, Account Name: Name of Student
                        </td>                                    
                    </tr>
                    <tr>
                        <th className="is-narrow">Bank of Commerce</th>
                        <td>
                            Over the counter – Fill up the payment slip. Specify UCLM as biller. Account No: ID number, Account Name: Name of Student 
                        </td>                                   
                    </tr>  
                    <tr>
                        <td colSpan="2">
                            <strong>We highly discouraged Depositing your tuition payment thru Palawan Pawnshop since bank details were not provided in their receipt.</strong>
                        </td>                                
                    </tr>
                                                                                                            
                </tbody>
            </table>
        );
        let loadPayChannel = "";
        if(currentCampus === "Banilad") {
            if(courseCode === "PD") loadPayChannel = loadBaniladSOM;
            else loadPayChannel = loadBaniladCL;
        }
        else loadPayChannel = loadUCLM;
        return(
            <Fragment>
            {loadPayChannel}
        </Fragment>
        )
    }
}