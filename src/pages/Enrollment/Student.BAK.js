import React, { Component } from 'react';
import SelectedSubjects from '../../components/enrollment/SelectedSubjects';
import SearchSubjects from '../../components/enrollment/SearchSubjects';
import EnrollmentSteps from '../../components/enrollment/EnrollmentSteps'

export default class Student extends Component {
    state = {
        

    }
    handleOnChangeInput = e => {

    }
    render() {

        
        return (
            <div className="tile is-ancestor">
                <div className="tile is-4 is-vertical is-parent">
                    <div className="tile is-child box pt-2">
                        <h4 className="is-size-4 has-text-weight-bold mb-2">Enrollment Steps</h4>
                        <EnrollmentSteps />
                    </div>                   
                </div>
                <div className="tile is-parent">
                    <div className="tile is-child box pt-2">
                        <h4 className="is-size-4 has-text-weight-bold mb-2">Subject Selection</h4>
                        
                        <div className="columns">
                            <div className="column">
                                <div className="notification">
                                    You belong in a blocked section. <strong>Section: 3A</strong>. <br />
                                    All subjects are fixed and if you wish to be de-blocked, you can send request to your dean to get de-blocked. <br />
                                    Click the button below to send de-blocking request or accept the subjects and proceed with the next step. <br />
                                    <div className="buttons">
                                        <button className="button is-small is-info mt-2 has-text-weight-semibold">Request de-block</button>
                                        <button className="button is-small is-primary mt-2 has-text-weight-semibold">Accept and Proceed</button>
                                    </div>                                    
                                </div>
                            </div>
                        </div>  

                        <div className="columns">
                            <div className="column">
                                <div className="notification is-danger">
                                    <span className="icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                    <strong>Overloaded Units Detected</strong> <br />
                                    Your total selected number of units is over the allowed maximum units. <br />
                                    Click the button below to send request to the dean to allow your overload subjects. <br />
                                    <div className="buttons">
                                        <button className="button is-small is-info mt-2 has-text-weight-semibold">Request Overloading</button>
                                    </div>                                    
                                </div>
                            </div>
                        </div>   

                        <div className="columns">
                            <div className="column">
                                <div className="notification is-danger">
                                    <span className="icon">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                    <strong>Schedule Conflicts Detected!</strong> <br />
                                    Please remove conflicted subjects. Choose another subject without conflicting schedules. <br />                                 
                                </div>
                            </div>
                        </div>               

                        <SelectedSubjects />
                        <SearchSubjects />
                        
                        
                        <div className="columns">   
                            <div className="column">
                                <div className="">
                                    <div className="divider is-size-6 mb-0 pb-0"></div>
                                </div>
                            </div>
                        </div>
                                               
                    </div>
                </div>
            </div>     
        );
    };
}

export const EnrollmentHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-edit"></i> Enrollment
    </div> 
);