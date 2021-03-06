import React, { Component } from 'react';
import { Fragment } from 'react';
import { getLoggedUserDetails } from '../../helpers/helper';
import { getSubjectEquivalence } from '../../helpers/apiCalls';

export default class ViewSchedule extends Component {
    
    state ={
        showHide: false, equivalence: null
    }
    componentDidMount= () => {
        
        
    }
    handleAlternativeButton = () => {
        const{showHide} = this.state;
        this.setState({
            showHide: !showHide
        });
        var data = {
            internal_code : this.props.internal_code
        }
        getSubjectEquivalence(data)
        .then(response => {
            if(response.data){
                this.setState({
                    equivalence: response.data.subjects
                });
                console.log("equivalence", response.data);
                console.log("schedules",this.props.schedules);
            }
        })
    }

  render() {
      const {showHide,equivalence} = this.state;
      const{schedules, selectedSubject,subjectDescription,internal_code} = this.props;
        let count =0;
        let countAlternative = 0
      var viewSchedule = schedules ? schedules.filter(filt => filt.internal_code == internal_code).map((sched, index)=>{
        count++;
        const splitCodes = schedules.filter(splt => splt.edp_code == sched.split_code).map((split, isplit)=>{
            return(
                <>
                    <tr key={isplit} className="has-background-link-light">
                        <td className="valign pt-0 pb-0">{split.edp_code}</td>
                        <td className="valign pt-0 pb-0">{split.subject_type}</td>
                        <td className="valign pt-0 pb-0">{split.time_start}-{split.time_end} {split.mdn}</td>
                        <td className="valign pt-0 pb-0">{split.days}</td>
                        <td className="valign pt-0 pb-0">{split.room}</td>
                        <td className="valign pt-0 pb-0">{split.section}</td>
                    </tr>
                </>
            )
        });
        return (
            <Fragment>
                <tr key={index}>
                    <td className="valign pt-0 pb-0">{sched.edp_code}</td>
                    <td className="valign pt-0 pb-0">{sched.subject_type}</td>
                    <td className="valign pt-0 pb-0">{sched.time_start}-{sched.time_end} {sched.mdn}</td>
                    <td className="valign pt-0 pb-0">{sched.days}</td>
                    <td className="valign pt-0 pb-0">{sched.room}</td>
                    <td className="valign pt-0 pb-0">{sched.section}</td>
                </tr>
                {splitCodes}
            </Fragment>
        )
      }) : "";

      var loadAlternativeSubjects = equivalence ? equivalence.map((sched, index)=>{
        countAlternative++;
        const splitCodes = schedules.filter(splt => splt.internal_code == sched.split_code).map((split, isplit)=>{
            return(
                <tr key={isplit} className="has-background-link-light">
                    <td className="valign pt-0 pb-0">{split.edp_code}</td>
                    <td className="valign pt-0 pb-0">{split.subject_name}</td>
                    <td className="valign pt-0 pb-0">{split.subject_type}</td>
                    <td className="valign pt-0 pb-0">{split.time_start}-{split.time_end} {split.mdn}</td>
                    <td className="valign pt-0 pb-0">{split.days}</td>
                    <td className="valign pt-0 pb-0">{split.course}</td>
                </tr>
            )
        });
        const schedEquival = schedules? schedules.filter(fil => fil.internal_code == sched.internal_code).map((schedule, index)=>{
            return (
                <Fragment>
                    <tr key={index}>
                        <td>{schedule.edp_code}</td>
                        <td>{schedule.subject_code}</td>
                        <td>{schedule.subject_type}</td>
                        <td>{schedule.time_start}-{schedule.time_end} {schedule.mdn}</td>
                        <td>{schedule.days}</td>
                        <td>{schedule.room}</td>
                    </tr>
                    {splitCodes}
                </Fragment>
            )
        }):"";
        return schedEquival;
      }) : "";
    return (
        <Fragment>
            <table id="classList" className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                <tbody> 
                    <tr>
                        <th colSpan="2"className="is-narrow">Subject</th>
                        <td colSpan="6" className="has-text-left">{selectedSubject}</td>                                 
                    </tr>
                    <tr>
                        <th colSpan="2">Description</th>
                        <td colSpan="6" className="has-text-left">{subjectDescription}</td>                                 
                    </tr>                                                                             
                </tbody>
            </table>
            
            <table className="table is-striped is-fullwidth is-size-7 mt-5">
                <thead>
                    <tr>
                        <th>EDP Code</th>
                        <th>Type</th>
                        <th>Time</th>
                        <th>Days</th>
                        <th>Room</th>
                        <th>Section</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        count > 0 ? viewSchedule :
                        <tr>
                            <td colSpan="6" className="has-text-centered has-background-light">
                                No schedule found!
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <div className="has-text-centered">
                <label className="has-text-danger is-size-7">If there is no schedule found, click <a>here</a> to request</label>
            </div>
            <button className="button is-small" onClick={this.handleAlternativeButton}>{showHide? 'Hide': 'Equivalence'}</button>
            
            {
                showHide &&
                <table className="table is-striped is-fullwidth is-size-7 mt-5">
                    <thead>
                        <tr>
                            <th>EDP Code</th>
                            <th>Subject</th>
                            <th>Type</th>
                            <th>Time</th>
                            <th>Days</th>
                            <th>Room</th>
                            <th>Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            countAlternative > 0 ? loadAlternativeSubjects :
                            <tr>
                                <td colSpan="7" className="has-text-centered has-background-light">
                                    No schedule found!
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            }
        </Fragment>     
    );
  }
}
