import React, { Component,Fragment } from 'react';
import { Table, Button, Popconfirm, Row, Col, Icon, Upload } from 'antd';
import CurriculumTable from '../../components/elements/CurriculumTable';
import { ExcelRenderer } from "react-excel-renderer";

export default class AddCurriculum extends Component {
  render() {
      const{schoolYear, inputChange,courses,fileHandler,cols,rows,
        columns,components,handleSubmit,handleAdd,success} = this.props;


      var loadCourses = courses ? courses.map((course, index)=>{
        return (
            <Fragment key={index}>
                <option value={course.course_code}>{course.course_abbr}</option>
            </Fragment>
        )
    }):"";
    var loadNotification = success?(
        <div className={"notification "+(success>0 ? " is-info":" is-danger")}>
            <button class="delete"></button>
            {success > 0 ? "Success":"Failed"}
        </div>
    ):"";
    return (
      <Fragment>
          <div className="columns">
                <div className="column is-one-fifth">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Curriculum Year</h5>                        
                    <div className="field">
                        <div className="control">
                            <span className="is-fullwidth is-small">
                                <input className="input is-info is-small" type="text" placeholder="Year" onChange={inputChange('schoolYear')}/>
                            </span>
                        </div>
                    </div> 
                </div>  
            </div>
            
            <div className="columns">
                <div className="column">
                    {   schoolYear != null &&
                        <h2 className="has-text-weight-bold mb-2 is-size-4">School Year: {schoolYear} - {parseInt(schoolYear) + 1}</h2>
                    }
                </div>
            </div>
            <div className="columns">
                <div className="column is-fullwidth">
                    
                </div>
            </div>
            <div className="columns">
                <div className="column is-one-fifth">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Select Course</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="searchFilterCollege" onChange={inputChange('selectedCourse')}>
                                    <option value="">Select Course</option>
                                    {loadCourses}
                                </select>
                            </span>
                        </div>
                    </div> 
                </div>
                <div className="column is-one-fifth">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Import Data</h5>                        
                    <div className="field">
                        <div className="control">
                            <span className="is-fullwidth is-small">
                                <Upload
                                    class="is-fullwidth"
                                    name="file"
                                    beforeUpload={fileHandler}
                                    onRemove={() => this.setState({ rows: [] })}
                                    multiple={false}>
                                    <Button className="button is-small is-fullwidth">
                                        <Icon type="upload" /> Click to Upload Excel File
                                    </Button>
                                </Upload>
                            </span>
                        </div>
                    </div> 
                </div>
            </div>
            <div className="columns">
                <div className="column is-fullwidth">
                    {loadNotification}
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <CurriculumTable 
                        cols = {cols}
                        rows = {rows}
                        columns = {columns}
                        components = {components}
                        handleSubmit = {handleSubmit}
                        handleAdd = {handleAdd}
                    />
                </div>
            </div>
      </Fragment>
    );
  }
}
