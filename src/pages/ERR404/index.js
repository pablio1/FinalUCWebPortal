import React from 'react';

export const ERR404 = () => (
    <div className="container is-fluid is-marginless is-paddingless" id="err404">
        <div className="box is-content is-full-height ml-1 is-center" id="">
            <div className="container has-text-centered">
                <h4 className="title">404 Page Not Found</h4>
                <h4 className="subtitle">Uh oh! We cant find the page you are looking for.</h4>
            </div>
        </div>
    </div>   
);

export const ERR404Header = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-exclamation-triangle"></i> Page Not Found
    </div>
);