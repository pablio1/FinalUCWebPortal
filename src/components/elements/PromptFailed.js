import React from "react";

// CSS Style and Animation located in styles/_styles.scss
export default function PromptFailed() {

    return (
        <div className="failed-cross">
            <div className="cross-icon">
                <span className="icon-cross line-one"></span>
                <span className="icon-cross line-two"></span>
                <div className="icon-circle-cross"></div>
                <div className="icon-fix-cross"></div>
            </div>
        </div>
    );
}



