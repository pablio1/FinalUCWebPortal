import React, { Component, Fragment } from 'react';

export default class ReportHeaderTiles extends Component {

render() {
    const { values } = this.props;
    return(
        <Fragment>
            <div className="columns">
                <div className="column is-hidden-mobile is-1"></div>
                <div className="column">
                    <div className="box has-background-danger-light" style={{ borderTop: "1px solid orangered" }}>
                        <h1 className="title is-5 is-hcenter">TOTAL PENDING STUDENT</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_registered + values.subject_selection + values.pending_payment}</h2>
                    </div> 
                </div>
                <div className="column">
                    <div className="box has-background-danger-light" style={{ borderTop: "1px solid orangered" }}>
                        <h1 className="title is-5 is-hcenter">TOTAL PENDING APPROVAL</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_total}</h2>
                    </div> 
                </div>
                <div className="column">
                    <div className="box has-background-primary-light" style={{ borderTop: "1px solid orangered" }}>
                        <h1 className="title is-5 is-hcenter">TOTAL ENROLLED</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.official_total}</h2>
                    </div> 
                </div>
                <div className="column is-hidden-mobile is-1"></div>
            </div>
            <div className="columns">
                <div className="column is-hidden-mobile is-1"></div>
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">PENDING REGISTRATION</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_registered}</h2>
                    </div>
                </div>
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">SUBJECT SELECTION</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.subject_selection}</h2>
                    </div>
                </div>
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">PENDING PAYMENT</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_payment}</h2>
                    </div>
                </div>
                <div className="column is-hidden-mobile is-1"></div>
            </div>
            <div className="columns">
                <div className="column is-hidden-mobile is-1"></div>  
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">PENDING DEAN</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_dean}</h2>
                    </div>
                </div>              
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">PENDING ACCOUNTING</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_accounting}</h2>
                    </div>
                </div>
                <div className="column">
                    <div className="box" style={{ borderTop: "1px solid tomato" }}>
                        <h1 className="title is-5 is-hcenter">PENDING CASHIER</h1>
                        <h2 className="subtitle is-4 is-hcenter">{values.pending_cashier}</h2>
                    </div>    
                </div>
                <div className="column is-hidden-mobile is-1"></div>
            </div>
        </Fragment>
    );
};

}