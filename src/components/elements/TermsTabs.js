import React, { Component } from 'react';
import store from 'store2';

import { convertTermToReadable } from '../../helpers/helper';

export default class TermsTab extends Component {
    handleOnSelectTerm = e => {
        this.props.handleOnSelectTerm(e);
    }
    render() {
        const { isSelected, activeTerms } = this.props;
        const arrTerms = activeTerms ? activeTerms.split(",") : "";
        const loadTabsItem = arrTerms ? arrTerms.map((term, index) => {
            return (
                <li key={index} className={isSelected === term ? "is-active" : ""} onClick={() => this.handleOnSelectTerm(term)}>
                    <a href={null}>{convertTermToReadable(term, false)}</a>
                </li>
            );
        }) : <li className="is-active"><a href={null}>No Terms Loaded</a></li>;
        return (
            <div className="tabs is-toggle is-fullwidth">
                <ul>
                    {loadTabsItem}
                </ul>
            </div>
        )
    }
}