import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

export default class Faculty extends Component {
    render() {
        if (getLoggedUserDetails("usertype") !== "FACULTY") {
            return <Redirect to="/login" />;
        }
        return (
            <div className="container is-fluid is-marginless is-paddingless">
                <div className="box is-content is-full-height ml-1" id="">
                Faculty
                </div>
            </div>        
        );
    }
}