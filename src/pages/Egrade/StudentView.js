import React, { Component, Fragment } from 'react';

import { getLoggedUserDetails, convertTermToReadable } from '../../helpers/helper';
import { getGradesEvaluation } from '../../helpers/apiCalls';

import GradesTable from '../../components/elements/GradesTable';

export default class StudentView extends Component {
    state = {
        studentGrades: null, selectedTerm: '', terms: []
    }
    componentDidMount = () => {
        //const dept = ["JHS","BED"].includes(getLoggedUserDetails("deptabbr")) ? getLoggedUserDetails("deptabbr").slice(0, -1) : "CL" ;
        const dept = "CL";
        getGradesEvaluation(getLoggedUserDetails("idnumber"), dept)
        .then(response => {
            if(response.data && response.data.studentGrades.length > 0) { 
                let terms = response.data.studentGrades.map(grade => {
                    return parseInt(grade.term, 10)
                });
                terms = [...new Set(terms)]
                terms = terms.sort((a, b) => b - a);
                this.setState({
                    studentGrades: response.data.studentGrades,
                    terms: terms,
                    selectedTerm: terms[0]
                });                             
            }
        });

        
    }
    handleOnChangeInput = e => {
        this.setState({
            [e.target.name]: e.target.value 
        })
    }
    render() {
        const { selectedTerm, terms, studentGrades } = this.state; 
        const filteredGrades = studentGrades ? studentGrades.filter(grade => grade.term === selectedTerm.toString()) : "";       
        const loadTermsOptions = terms.length > 0 ? terms.map((term,index) => {
            return <option key={index} value={term}>{convertTermToReadable(term.toString(), false)}</option>
        }) : "";
        return (           
            <div className="box ml-1">
                <div className="columns">
                    <div className="column is-vcenter is-narrow pl-3">
                        <h4 className="has-text-weight-semibold is-size-6">Select School Term</h4>
                    </div>
                    <div className="column is-narrow">
                        <div className="control">
                            <div className="select is-small">
                                <select name="selectedTerm" value={selectedTerm} onChange={this.handleOnChangeInput}>
                                    {loadTermsOptions}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                    <div className="column is-hidden-mobile"></div>
                </div>
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div>
                {
                    filteredGrades && filteredGrades.length > 0 ? (                    
                        <div className="columns">
                            <div className="column is-two-thirds-widescreen">
                                <GradesTable 
                                    studentGrades={filteredGrades} 
                                    college={""}
                                />
                            </div>
                        </div>   
                    ) : (
                        <div className="columns is-vcentered">
                            <div className="column is-center mt-2">
                                <h4 className="is-size-5 has-text-weight-bold">Grades not available.</h4>
                            </div>
                        </div> 
                    )
                }             
            </div>   
        );
    }
}