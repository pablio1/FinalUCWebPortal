import React, { Component } from 'react';

export default class Student extends Component {
    render() {        
        return (
            <div className="container is-fluid is-marginless is-paddingless" id="home">
                <div className="box is-content is-full-height ml-1" id="">
                   
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