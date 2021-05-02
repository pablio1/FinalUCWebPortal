import React, { Component } from 'react';
import PromptSuccess from '../elements/PromptSuccess';
import PromptFailed from '../elements/PromptFailed';

export default class RegistrationSubmitted extends Component {
    handleButtonClick = (e) => {
        this.props.prevStep();
    }
    render() {
        const { formSubmitted } = this.props;
        const backBtn = !formSubmitted ? (
            <button className="button is-info is-fullwidth" onClick={this.handleButtonClick} >
                <span className="icon">
                    <i className="fas fa-chevron-left"></i>
                </span>
                <span>Back</span>
            </button>    
        ) : "";
        const successMsg = (
            <div>
                <h4 className="has-text-weight-semibold is-size-6">The Office of the Registrar will evaluate your application.</h4> 
                <p>
                    For the meantime please proceed to access your portal account. From there you can see the status of your application and the Enrollment Steps.
                </p>
                <p>
                    <strong>You have to continue the enrollment process through your portal account.</strong> Please login to your portal account from time to time for notifications and announcements.
                </p>
            </div>
        );
        const errorMsg = (
            <div>
                <h4 className="has-text-weight-semibold is-size-6">There was an error or lost of connectivity during the submission. Please try again.</h4> 
                {/*<h4 className="has-text-weight-semibold is-size-6">There was an error or lost of connectivity during the submission, please click the back button below and re-submit the application.</h4>
                <p>
                    If the issue persist please capture a screen shot of the Review Form Entries (the last page with the full form with all your details), 
                    reach us to our Facebook page or email us at {process.env.REACT_APP_EDP_EMAIL} and attached the form screen shot together with the other documents you submitted in the application.
                </p>
                <p>
                    <strong>Please indicate your full name and course selected.</strong> If you are using another email address to email the screen shot please indicate the email address you registered with us.
                </p>
                */}
                <p>
                    If the issue persist reach us at our Facebook page or email us at {process.env.REACT_APP_EDP_EMAIL}.
                </p>                
            </div>
        );
        return(      
            <div className="section mt-0 pt-0">
                <div className="columns">
                    <div className="column pt-0"> 
                        {formSubmitted ? <PromptSuccess /> : <PromptFailed />}
                        <h3 className="subtitle has-text-centered">
                            {formSubmitted ? "You have successfully submitted your application!!" : "An error occured during submission."}                            
                        </h3>
                        <div className="">
                            <div className="divider is-size-6"></div>
                        </div>
                        <div className="columns">
                            <div className="column is-3"></div>
                            <div className="column"> 
                                {formSubmitted ? successMsg : errorMsg }                                                                                                                                                                                                                                                                                                                                    
                            </div> 
                            <div className="column is-3"></div>                                           
                        </div> 
                        <nav className="level">
                            <div className="level-left mb-0 pb-0">
                                {/*backBtn*/}
                            </div>
                            <div className="level-right mt-1 pt-0">
                                {   
                                    formSubmitted ? (
                                        <a className="button is-success is-fullwidth" href="/">                                                
                                            <span>Login Now</span>
                                            <span className="icon">
                                                <i className="fas fa-chevron-right"></i>
                                            </span>
                                        </a>
                                    ) : ""
                                }
                            </div>  
                        </nav>                                                               
                    </div>
                </div> 
            </div>                                  
        )
    }
}
