import React from 'react';

export default function RegistrationFormSteps(props) {
    const listItems = props.steps.map((step, index) =>
        <li className={"steps-segment"  + (step === props.steps[props.formStep] ? " is-active" : "") } key={index}>
            <span className="steps-marker">
                {index + 1}
            </span>
            <div className="steps-content">
                <p>{step}</p>
            </div>
        </li>
    );    

    return (
        <ul className={"steps " + props.styles}>
            {listItems}
        </ul>
    );
}
