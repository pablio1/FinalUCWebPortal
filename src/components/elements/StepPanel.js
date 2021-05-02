import React, { Component, Fragment } from 'react';

export default class StepPanel extends Component {
    state = {
        showSubPanel: false
    }
    toggleShowSubPanel = () => {
        const { showSubPanel } = this.state;
        this.setState({ showSubPanel : !showSubPanel });
    }
    handleClickButton = e => {
        this.props.handleStartButton(e);
    }
    render() {
        
    const { showSubPanel } = this.state;   
    const { stepMsgs, stepNumber, stepTitle, stepStatus, statusActionTitle } = this.props;
    const statusStyles = { done: "is-success", current: "is-link", process: "is-link",  denied: "is-danger", next: ""}
    const loadIcon = statusIcons(stepStatus);
    const loadMsgs = stepMsgs.length > 0 ? stepMsgs.map((msg, i) => {
        return (
            <h4 key={i} className="is-size-7 has-text-weight-bold mr-2 mt-1 is-italic">
                [ {msg.dte} ] : &nbsp;
                {msg.message}
            </h4>
        )
    }) : "";
    const loadStatusButton = stepStatus === "current" ?  (        
        <div className="is-size-7 has-text-weight-bold is-italic mr-2 is-clickable" onClick={() => this.handleClickButton(stepNumber)}>Start Now &nbsp;<i className="fas fa-angle-right"></i></div>
    ) : (
        <div className="is-size-7 has-text-weight-bold is-italic mr-2">{stepStatus.charAt(0).toUpperCase() + stepStatus.slice(1)}</div>
    );
    return (
        <Fragment>
            <div className={"notification p-1 mb-0 mt-2 has-text-weight-semibold " + statusStyles[stepStatus]} >
                <div className="level is-mobile">
                    <div className="level-left">                  
                        {loadIcon}
                        <span className="is-clickable" panelname="enrollStepRegistrationForm" onClick={this.toggleShowSubPanel}>
                            {stepNumber} {stepTitle}
                        </span>
                    </div>
                    <div className="level-right">    
                        {loadStatusButton}
                    </div>
                </div>               
            </div>
            <div className={"has-background-success-light p-3 mb-0 has-text-weight-semibold " + (showSubPanel ? "" : "is-hidden") }>  
                {stepStatus === "next" ? <h4 className="is-size-7 has-text-weight-bold mr-2 mt-1 is-italic">You have not yet accomplished the prerequisite of this step.</h4> : ""}
                {stepStatus === "current" ? <h4 className="is-size-7 has-text-weight-bold mr-2 mt-1 is-italic">You have not accomplished this step yet.</h4> : ""}
                {stepStatus === "process" ? <h4 className="is-size-7 has-text-weight-bold mr-2 mt-1 is-italic">Evaluation process is still ongoing.</h4> : ""}                      
                {stepStatus === "done" ? <h4 className="is-size-7 has-text-weight-bold mr-2 mt-1 is-italic">You have already accomplished this step</h4> : ""}
                {loadMsgs}  
            </div>
        </Fragment>
    );
    }
}

function statusIcons(status) {
    switch(status) {
        case "done":
            return (
                <span className="icon">
                    <i className="fas fa-check"></i>
                </span>
            )
        
        case "current":
            return (
                <span className="icon">
                    <i className="fas fa-exclamation"></i>
                </span> 
            )

        case "process":
            return (
                <span className="icon">
                    <i className="fas fa-hourglass-start fa-pulse"></i>
                </span> 
            )

        case "denied":
            return (
                <span className="icon">
                    <i className="fas fa-times"></i>
                </span>
            )

        case "next":
            return (
                <span className="icon">
                    <i className="fas fa-minus-square"></i>
                </span>
            )
        
            default:
                return <div></div>
    } 

} 