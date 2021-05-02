import React from "react";

// CSS Style and Animation located in styles/_styles.scss
export default function PromptSuccess() {

    return (
        <div className="success-checkmark">
            <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
            </div>
        </div>
    );
}