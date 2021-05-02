import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';

export default class EDP extends Component {
    render() {
        if (getLoggedUserDetails("usertype") !== "EDP") {
            return <Redirect to="/login" />;
        }
        return (
            <div className="box is-content is-full-height ml-1" id="">
            EDP
            </div>       
        );
    }
}