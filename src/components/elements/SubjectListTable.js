import React, { Component,Fragment } from 'react';
import {hasSubjectLab} from '../../helpers/helper';

export default class SubjectListTable extends Component {
    state = {year: null, semester: null}
    componentDidMount = () => {
        var years = this.props.subjects?[...new Set(this.props.subjects.map(item => item.year))]:"";
        var semesters = this.props.subjects?[...new Set(this.props.subjects.map(item => item.semester))]:"";
        this.setState({
            year: years,
            semester: semesters
        });
        const {year,semester} = this.state;
        console.log(year);
    }
  render() {
      
      var subjects = this.props.subjects;
      const {year,semester} = this.state;
      const yearLevel = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
      const sem  = ['', 'First', 'Second'];
      var loadHeader = year? year.map((year, index)=>{
        var loadSemester = semester ? semester.map((semester, index)=>{
            var totalUnits = 0;
            var loadSubjects = subjects? subjects.filter(fil => fil.semester == semester).map((sub, i)=>{
                /* var getPrerequisites = prerequisites ? prerequisites.filter(remark => remark.internal_code === sub.internal_code).map((rem, i) => {
                    return ( 
                        <span key={i} className="ml-1 tag">{rem.subject_code}</span>
                    )
               }) :""; */
                return (
                    <Fragment>
                        <tr key={i}>
                            <td>{sub.subject}</td>
                            <td>{sub.description}</td>
                            <td className="has-text-centered">{sub.lec}</td>
                            <td className="has-text-centered">{sub.lab}</td>
                            <td className="has-text-centered"></td>
                        </tr>
                    </Fragment>
                )
            }):"";
            return (
                <Fragment>
                    <div className="message-header">
                        <p className="has-text-weight-bold">{sem[semester]} Semester</p>    
                    </div>
                    <div className="message-body p-0">
                        <div className="table-container">
                            <table className="table is-striped is-fullwidth is-hoverable">
                                <thead>
                                    <tr>
                                        <th className="is-narrow">Subject Code</th>
                                        <th>Descriptive Title</th>
                                        <th className="has-text-centered">Lec</th>
                                        <th className="has-text-centered">Lab</th>
                                        <th className="has-text-centered">Total Units</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                        <td className="has-text-centered has-text-weight-bold ">{totalUnits}</td>   
                                    </tr>
                                </tfoot>
                                <tbody>   
                                    {loadSubjects}                                                                                            
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Fragment>
            )
        }):"";
        return(
            <Fragment>
                <h1 className="is-size-4">{yearLevel[year]} Year</h1>
                <article className="message mb-0 pb-0 is-small">
                    {loadSemester}
                </article>
            </Fragment>
        )
    }):""; 
    return (
      <Fragment>
            {loadHeader}
            test
      </Fragment>
    );
  }
}
