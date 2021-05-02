import React, { Component, Fragment } from 'react';
import { toStandardTime } from '../../helpers/helper';

export default class RequestedSujects extends Component {
    
  render() {
      const{showRequestForm,handleRequestButton,requestedSubjects,handleCancelSubjectButton} =this.props;
        let count = 0;
      var loadRequestedSubjects = requestedSubjects ? requestedSubjects.map((request, index) => {
          count++;
          return(
              <Fragment>
                    <tr key={index}>
                        <td className="has-text-centered">-------</td>
                        <td className="has-text-centered">{request.subject_name}</td>
                        <td className="has-text-centered">{request.rtype}</td>
                        <td className="has-text-centered">{request.days}</td>
                        <td className="has-text-centered">{request.time_start} - {request.time_end} {request.mdn}</td>
                        <th className="has-text-centered has-text-info">{request.status}</th>
                        <td className="has-text-centered">
                            <button className="button is-small is-danger" onClick={() => handleCancelSubjectButton(request.internal_code)}>Cancel</button>
                        </td>
                    </tr>        
              </Fragment>
          )
      }): "";
    return (
      <Fragment>
        <article className="message mb-0 is-small">
            <div className="message-header">
                <p>Requested Subjects</p>                                
                <button className="is-small p-0" aria-label="delete">
                    <span className="icon is-small">
                    <i className="fas fa-minus"></i>
                    </span>
                </button>
            </div>
            <div className="message-body p-0">
                <div className="table-container">
                    <table className="table is-striped is-fullwidth is-hoverable">
                        <thead>
                            <tr>
                                <th className="is-narrow">EDP Code</th>
                                <th className="has-text-centered">Subject</th>
                                <th className="has-text-centered">Type</th>
                                <th className="has-text-centered">Days</th>
                                <th className="has-text-centered">Time</th>
                                <th className="has-text-centered">Status</th>
                                <th className="has-text-centered">Actions</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>  
                                <td colSpan="7"><button className="button is-small is-info is-pulled-right" onClick={handleRequestButton}>{showRequestForm? 'Hide Request Form' :'Request Subject'}</button></td>
                                
                            </tr>
                        </tfoot>
                        <tbody>
                                  {count > 0 ?loadRequestedSubjects: (
                                      <tr>
                                          <td colSpan="7" className="has-text-centered">No Request Found!</td>
                                      </tr>
                                  )}                                                                                                                
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
      </Fragment>
    );
  }
}
