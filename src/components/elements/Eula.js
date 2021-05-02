
import React, {Component } from "react";

export default class Eula extends Component {  
    state = {
        isLoadingAcceptBtn: false
    }
    handleOnButtonClick = () => {
        this.setState({
            isLoadingAcceptBtn: true
        }, () => this.props.handleAcceptBtn());
        
    }
    handleOnclickPrint = () => {
        window.print();
    }
    render() {
        const currentCampus = process.env.REACT_APP_CAMPUS;
        const { term } = this.props;
        return (
            <article className="message">
                <div className="message-header">
                    <p>ONLINE ENROLLMENT TERMS AND CONDITIONS</p>
                </div>
                <div className="message-body">
                    <div className="content">
                        <h3 className="title is-5 mb-0">{term}</h3>
                        <h3 className="title is-6 mt-1">For new students, transferees, and cross-enrollees</h3>

                        <p>
                            These Terms and Conditions represent a binding agreement between the School and the online enrollment applicants. Please read them carefully, as it is your responsibility to fully read, understand, and agree to all the Terms and Conditions of the School’s online enrollment system, before proceeding to the actual online enrollment process. These Terms and Conditions, however, may be subject to change without further notice.
                        </p>

                        <h3 className="title is-5">I. General Policy</h3>
                        <p>Your online enrollment is for official reference use only. It is still subject to the following terms and conditions:</p>
                        <ol type="1">
                            <li>Approval by the dean/principal/registrar;</li>
                            <li>Submission and verification of actual academic credentials;</li>
                            <li>Payment of corresponding entrance fee, registration fee, and other School fees;</li>
                            <li>Satisfactory compliance of additional admission requirements;</li>
                            <li>Adherence to school rules and regulations; and</li>
                            <li>Confirmation of the Data Privacy Policy of the School.</li>
                        </ol>

                        <h3 className="title is-5">1.1 Dean/Principal/Registrar’s Approval</h3>
                        <p>Your online enrollment is still subject to approval by the dean/principal/registrar.</p>
                        <p>Should you wish to withdraw your enrollment or any course/subject after approval of your official enrollment, you shall be charged as follows:</p>
                        <ol type="A">
                            <li>Registration fees - If you withdraw during enrollment period</li>
                            <li>10% of total tuition plus registration fees - If you withdraw within first week of classes</li>
                            <li>20% of total tuition plus registration fees - If you withdraw within second week of classes</li>
                            <li>Full charges - If you withdraw after second week of classes</li>
                        </ol>

                        <h3 className="title is-5">1.2 Academic Credentials</h3>
                        <p>Your online enrollment is still subject to the submission, presentation, and verification of the following credentials, which may be accomplished once community quarantine protocols allow but not later than 30 days from start of classes:</p>
                        <ol type="1">
                            <li>Competent school identification (ID) card from the school last attended;</li>
                            <li>NSA / PSA Birth Certificate;</li>
                            <li>Form 138 (for new students) or transfer credentials (for transferees);</li>
                            <li>Certificate of Good Moral Character; and/or</li>
                            <li>Certification of Enrolment from last school attended (for kinder only).</li>
                        </ol>            
                        <p>Should you fail to submit any of the above documents within the prescribed period or should you submit fraudulent documents, the School reserves the right to cancel your enrollment, without prejudice to other criminal, civil, or administrative sanctions.</p>
                        
                        <h3 className="title is-5">1.3 Payment</h3>
                        <p>Should you wish to pay entrance fee, registration, and other school fees, you may do so through the following flexible payment methods:</p>
                        {
                            currentCampus === "Banilad" ? (
                                <ol type="1">
                                    <li>
                                        Bank transfer to payee “UNIVERSITY OF CEBU BANILAD, INC.” through:
                                        <ol>
                                            <li>Metrobank Account No. 246-3-24655536-3</li>
                                            <li>BDO Account No. 001858022960</li>
                                            <li>Aspac Bank Account No. 13-0201-0004-6</li>
                                        </ol>
                                    </li>
                                    <li>Money remittance via Cebuana Lhuillier; or</li>
                                    <li>Over-the-counter payment to the School, once community quarantine protocols are lifted.</li>
                                </ol>
                            ) : (
                                <ol type="1">
                                    <li>
                                        Bank transfer to payee “UNIVERSITY OF CEBU – LAPU-LAPU AND MANDAUE, INC.” through:
                                        <ol>
                                            <li>ASPAC Bank Account No. 01-0201-00011-4</li>
                                            <li>Bank of Commerce Account No. 34-000-016-103</li>
                                            <li>Landbank Account No. 0141-4806-18 (for Senior High School students)</li>
                                            <li>Landbank Account No. 0141-4662-67 (for Junior High School students)</li>
                                            <li>Metrobank Account No. 094-3-01147805-0</li>
                                            <li>Unionbank Account No. 0005-7001-2910</li>
                                        </ol>
                                    </li>
                                    <li>Money remittance via Cebuana Lhuillier, HLhuillier, and Western Union; or</li>
                                    <li>Over-the-counter payment to the School, once community quarantine protocols are lifted.</li>
                                </ol>
                            )
                        }
                        
                        <p>For payments through bank transfer or money remittance center, please present your transaction slip to the Cashier/Accounting Department by uploading through the online portal or in person once the community quarantine protocols permits you to travel.</p>
                        <p>For qualified DepEd PEAC JHS-ESC/SHS-Voucher recipients, please present your certificate by uploading through the online portal or emailing to the principal/registrar or submitting in person once the community quarantine protocols permits you to travel.</p>
                        
                        <h3 className="title is-5">1.4 Additional Admission Requirements</h3>
                        <p>As a rule, the School’s policy is open enrollment to all qualified applicants. However, there are departments/courses that require the conduct of entrance exam, physical/medical exam, and/or preliminary interview as prerequisites to the final approval of enrollment. Please contact your principal or dean for any additional admission requirements, if any, and for the schedule of taking or submitting the same once community quarantine protocols allow but not later than the end of the semester/academic term. This is without prejudice to the option of conducting the same through other flexible means, if feasible, while community quarantine protocols are in effect.</p>
                        <p>Should you fail to take or to pass the entrance exam, physical/medical exam, preliminary interview, and/or other additional prerequisite admission requirements as prescribed by your department, the School reserves the right to cancel your enrollment, without prejudice to other acceptable curricular options.</p>
                        
                        <h3 className="title is-5">II. Technical Requirements</h3>
                        <p>In case you have taken up online subjects or sections, you will need the following technical requirements to succeed:</p>
                        <ol type="2.1">
                            <li>
                                Access to Digital Devices <br />
                                You need access to a laptop, desktop computer, or digital phones with reliable internet connection to complete the work assigned in the online subjects or sections.
                            </li>
                            <li>
                                Access to Internet Connection <br />
                                This will be necessary to access email, Google Classroom, and other related online tools and applications, as well as to download resources, upload assignment files, watch videos, and more within your electronic learning courses.
                            </li>
                            <li>
                                Access to Productivity Softwares and Basic Online Tools <br />
                                You will need access to productivity softwares like Microsoft Office or Open Office applications for accomplishing certain assignments and exams. You can also compose assignments using the Google Docs available through Google Drive, which is a free cloud-based alternative that allows you to access and compose your documents from any device with an internet connection. Google Classroom and other applications including Zoom, Facebook Messenger, Quizlet, Mentimeter applications, and among others shall be used in the delivery of important announcements, email communication, discussion board postings, homework submissions, taking exams and quizzes, and other enhanced course activities. You are advised to explore and be familiar with the features of these productivity tools and online applications before the first day of class.
                            </li>
                        </ol>

                        <h3 className="title is-5">III. School Rules and Regulations</h3>
                        <p>By accepting these Online Enrolment Terms and Conditions, you also agree to fully abide by and comply with the School’s Student Manual, guiding principles, policies, rules, and regulations, which may be subject to change from time to time.</p>
                        <p>Furthermore, your online enrollment is also subject to the condition that you have not been previously penalized for expulsion, exclusion, or non-readmission by the School, Commission on Higher Education, or Department of Education, as the case may be.</p>

                        <h3 className="title is-5">IV. Data Privacy Policy</h3>
                        <p>By accepting this Online Enrolment Terms and Conditions, you are also giving your consent and approval to the Data Privacy Policy of the School. You are hereby authorizing the School to collect, record, organize, update, use, consolidate, or destruct your personal information for the following purposes:</p>
                        <ol type="1">
                            <li>evaluating applications for admission to the School;</li>
                            <li>establishing and maintaining student information systems;</li>
                            <li>recording, generating, and maintaining student records for academic, co-curricular, and extra-curricular monitoring;</li>
                            <li>sharing of grades between and among faculty members and others with legitimate official need for academic deliberations and evaluation of student performance;</li>
                            <li>processing scholarship applications, grants and other forms of financial assistance;</li>
                            <li>investigating incidents that relate to student discipline;</li>                    
                            <li>compiling and generating reports for statistical and research purposes;</li>
                            <li>providing student services;</li>
                            <li>communicating official School announcements; and</li>
                            <li>sharing marketing and promotional materials regarding School-related functions, events, projects, and activities.</li>
                        </ol>
                        <p>You also agree that any personal information may be entered and stored within the School’s authorized information and communications system equipped with security measures to protect your personal information. Your personal information will only be accessed and shared by the School, its authorized personnel, and other persons or institutions as may be required by law. You agree that there must be a free flow of personal information to and from the School to ensure the efficient delivery of student services and implementation of institutional mechanisms. You affirm your rights to be informed, to object to processing, to access and rectify, to suspend or withdraw your personal information, and to be indemnified for damages pursuant to Republic Act No. 10173 or the Data Privacy Act of 2012 and its Implementing Rules and Regulations.</p>

                        <h3 className="title is-5">V. Acceptance</h3>
                        <p>Your online enrollment requires a confirmation that you have first read and understood these Terms and Conditions before proceeding to the actual online enrollment process.</p>

                        <p>By clicking on the “I ACCEPT” button below, you hereby agree to, consent to, and accept in full the School’s Terms and Conditions, in lieu of your physical or actual signature.</p>
                        
                        <div className="buttons mb-3">
                        <button className={"button is-info is-fullwidth " + (this.state.isLoadingAcceptBtn ? "is-loading" : "")} 
                                onClick={this.handleOnButtonClick}>I ACCEPT</button>
                        {/*<button 
                                className="button is-link is-fullwidth"
                                onClick={this.handleOnclickPrint}                                                
                            >
                                <span className="icon">
                                    <i className="fas fa-print"></i>
                                </span>
                                <span>Print Page</span>
                        </button> */}
                        </div> 
                    </div>
                </div>
            </article> 
        );
    }
}

