import React, { Component,Fragment } from 'react';

export default class ClassListModal extends Component {
  render() {
      const {studentInfo} = this.props;
      var loadClassList = studentInfo? studentInfo.map((student, index)=>{
          return (
              <tr key={index}>
                <td>{student.id_number}</td>
                <td>{student.firstname}</td>
                <td>{student.lastname}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>{student.contact}</td>
                <td>{student.email}</td>
              </tr>
          )
        }):"";
    return (
      <Fragment>
            <article className="message mb-0 pb-0 is-small">
                <div className="message-header">
                    <p className="has-text-weight-bold">Class List</p>    
                            
                </div>
                <div className="message-body p-0">
                    <div className="table-container">
                        <table className="table is-striped is-fullwidth is-hoverable">
                            <thead>
                                <tr>
                                    <th className="is-narrow">ID Number</th>
                                    <th>First Name</th>
                                    <th className="has-text-centered">Last Name</th>
                                    <th>Course</th>
                                    <th>Year</th>
                                    <th className="has-text-centered">Contact</th>
                                    <th className="has-text-centered">Email</th>
                                    {/* <th className="has-text-centered">Grade</th> */}
                                    {/* <th className="has-text-centered">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                    {loadClassList}                                                                                
                            </tbody>

                        </table>
                    </div>
                </div>
            </article>
      </Fragment>
    );
  }
}
