import React, { Component,Fragment } from 'react';
import { getLoggedUserDetails,checkRequestedSubject } from "../../helpers/helper";

export default class SearchRequestSubject extends Component {
  render() {
    const{requestSubjects,requestedSubjects,handleAddSubjectButton} = this.props
    var count=0;
    var loadListRequestedSubject = requestSubjects ? requestSubjects.map((list, index) => {
        if(!checkRequestedSubject(requestedSubjects,list.internal_code))
        {
            count++;
            return (
                <tr key={index}>
                    <td className="has-text-centered">{list.subject_name}</td>
                    <td className="has-text-centered"></td>
                    <td className="has-text-centered">{list.days}</td>
                    <td className="has-text-centered">{list.time_start}-{list.time_end} {list.mdn}</td>
                    <th className="has-text-centered">{list.status}</th>
                    <td className="has-text-centered">
                        <button className="button is-info is-small" onClick={() => handleAddSubjectButton(list.internal_code)}>Add</button>
                    </td>
                </tr> 
            )  
        }
    }):"";
    return (
      <Fragment>
        <div className="columns mt-5">
            <div className="column pt-0 pull-right">
                <h5 className="has-text-weight-bold mb-2 is-size-7">Search by Subject</h5>
                <div className="field">
                    <div className="control has-icons-left has-icons-right">                                                    
                        <input name="searchBySubject" className="input is-small" type="text" placeholder="Search Subject" data-fieldname="Subject"/>
                        <span className="icon is-small is-left">
                            <i className="fas fa-barcode"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div className="column pt-0 is-hidden-mobile is-hidden-touch"></div> 
            <div className="column pt-0 is-hidden-mobile is-hidden-touch"></div>                
        </div>
        <article className="message mb-0 is-small">
            <div className="message-header">
                <p>Search Result</p>                                
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
                                <th>Subject</th>
                                <th className="has-text-centered">Type</th>
                                <th className="has-text-centered">Days</th>
                                <th className="has-text-centered">Time</th>
                                <th className="has-text-centered">Status</th>
                                <th className="has-text-centered">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {count > 0 ? loadListRequestedSubject:
                                <tr>
                                    <td colSpan="6" className="has-text-centered">No Request Found!</td>
                                </tr>
                            }                                  
                        </tbody>
                    </table>
                </div>
            </div>
        </article>
      </Fragment>
    );
  }
}
