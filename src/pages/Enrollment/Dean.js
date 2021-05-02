import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import DeanRegistration from '../../components/enrollment/DeanRegistration';

import { getLoggedUserDetails } from '../../helpers/helper';

export default class Dean extends Component {    
    render() {
        if (!["DEAN", "CHAIRPERSON", "COOR", "ACAD"].includes(getLoggedUserDetails("usertype"))) {
            return <Redirect to="/login" />;
        }       
        return (
            <DeanRegistration />
        );
    }
}

//export default withRouter(Registrar)