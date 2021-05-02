import React, { Component,Fragment } from 'react';
import ViewCurriculum from '../../components/elements/ViewCurriculum';
import CurriculumTabs from '../../components/elements/CurriculumTabs';
import AddCurriculum from '../../components/elements/AddCurriculum';
import SubjectListTable from '../../components/elements/SubjectListTable';
import { ExcelRenderer } from "react-excel-renderer";
import { getAllCurriculum,getCourseList, saveCurriculum} from '../../helpers/apiCalls';
import { EditableFormRow, EditableCell } from '../../helpers/editableTable';
import { Table, Button, Popconfirm, Row, Col, Icon, Upload } from 'antd';

export class Curriculum extends Component {

    state = {
        addStatus: false,schoolYear:null, addCourseStatus: false, selectedAddedCourse: null,cols: [],rows: [],filteredSchoolYear: null,subjects: null, courses: null, curriculumYear: null,departments:null,
		selectedTab: null,showModal: false,courseInfo: null,selectedCourse: null,selectedDepartment:null,viewSubject: false, courseList: null, success: null, importSubjects: null,
        columns: [{title: "Subject",dataIndex: "subject",editable: true},{title: "Description",dataIndex: "description",editable: true},
            {title: "Lec Units",dataIndex: "lec",editable: true},{title: "Lab Units",dataIndex: "lab",editable: true},{title: "Year",dataIndex: "year",editable: true},
            {title: "Semester",dataIndex: "semester",editable: true},
            {title: "Action",dataIndex: "action",
            render: (text, record) =>
                this.state.rows.length >= 1 ? (
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => this.handleDelete(record.subject)}
                  >
                    <Icon
                      type="delete"
                      theme="filled"
                      style={{ color: "red", fontSize: "20px" }}
                    />
                  </Popconfirm>
                ) : null
            }
          ]
    }
    componentDidMount = () => {
		this.loadCurriculum();
    }
	loadCurriculum = () =>{
		getAllCurriculum()
		.then(response => {  
			if(response.data) {          
				this.setState({
					curriculumYear: response.data.year,
					departments: response.data.departments,
					courseList: response.data.course,
				});
			}
		});
	}
    handleSave = row => {
        const newData = [...this.state.rows];
        const index = newData.findIndex(item => row.subject === item.subject);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ rows: newData });
      };
    
    checkFile(file) {
      let errorMessage = "";
      if (!file || !file[0]) {
        return;
      }
      const isExcel =
        file[0].type === "application/vnd.ms-excel" ||
        file[0].type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        errorMessage = "You can only upload Excel file!";
      }
      console.log("file", file[0].type);
      const isLt2M = file[0].size / 1024 / 1024 < 2;
      if (!isLt2M) {
        errorMessage = "File must be smaller than 2MB!";
      }
      console.log("errorMessage", errorMessage);
      return errorMessage;
    }
  
    fileHandler = fileList => {
      console.log("fileList", fileList);
      let fileObj = fileList;
      if (!fileObj) {
        this.setState({
        	errorMessage: "No file uploaded!"
        });
        return false;
      }
      console.log("fileObj.type:", fileObj.type);
      if (
        !(
			fileObj.type === "application/vnd.ms-excel" ||
			fileObj.type ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        this.setState({
			errorMessage: "Unknown file format. Only Excel files are uploaded!"
        });
        return false;
      }
      //just pass the fileObj as parameter
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          let newRows = [];
          resp.rows.slice(1).map((row, index) => {
            if (row && row !== "undefined") {
              newRows.push({
                subject: row[0],
                description: row[1],
                lec: row[2],
                lab: row[3],
                year: row[4],
                semester: row[5]
              });
            }
          });
          if (newRows.length === 0) {
            this.setState({
            	errorMessage: "No data found in file!"
            });
            return false;
          } else {
            this.setState({
				cols: resp.cols,
				rows: newRows,
				errorMessage: null
            });
          }
        }
      });
      return false;
    };
  
    handleSubmit = async () => {
		//console.log("submitting: ", this.state.rows);
		const {schoolYear, rows,selectedCourse} = this.state;
		var data = {
			curr_year: schoolYear,
			course: selectedCourse,
			subjects: this.state.rows
		}
		console.log("data", data);

		saveCurriculum(data)
		.then(response => {  
			if(response.data) {          
				this.setState({
					success: response.data.success
				});
				if(response.data.success == 1){
					this.setState({
						schoolYear: null,
						selectedCourse: null,
						rows: null
					});
				}
				this.loadCurriculum();
				console.log("response", response.data);
			}
		});
		

		//submit to API
		//if successful, banigate and clear the data
		//this.setState({ rows: [] })
    };
    handleDelete = key => {
      const rows = [...this.state.rows];
      this.setState({ rows: rows.filter(item => item.subject !== key) });
    };
    handleAdd = () => {
		const { count, rows } = this.state;
		const newData = {
			subject: "Subject",
			description: "Description",
			lec: "0",
			lab: "0",
			year: "0",
			semester: "0"
		};
		this.setState({
			rows: [newData, ...rows],
			count: count + 1
		});
    };
    inputChange = input => e => {
		
        this.setState({
            [input]: e.target.value
        });
		console.log("data", input);

		if(input == 'schoolYear'){
			if(e.target.value != 0)
			{
				var data={
					curr_year: e.target.value,
					department: null
				}
				getCourseList(data)
				.then(response => {
					if(response.data){
						this.setState({
							courses: response.data.courses,
							viewSubject: false
						});
						//console.log("test", response.data);
					}
				});
			}
		}
		if(input == 'selectedDepartment'){
			const {schoolYear} = this.state;
			if(schoolYear != null){
				var data={
					curr_year: schoolYear,
					department: e.target.value
				}
				console.log("data",data);
				getCourseList(data)
				.then(response => {
					if(response.data){
						this.setState({
							courses: response.data.courses,
							viewSubject: false
						});
						//console.log("test", response.data);
					}
				});
			}
			
		}
    }
    handAddCurriculumButton = () => {
        const{addStatus} = this.state;
        this.setState({
            addStatus: !addStatus
        });
        //console.log("button test");
    }
    handleAddCourse = () => {
        const{addCourseStatus} = this.state;
        this.setState({
            addCourseStatus: !addCourseStatus
        });
    }
	handleOnClickTab = (tab) =>{
		this.setState({
			selectedTab:tab,
			schoolYear: null,
			courses: null,
			viewSubject: false
		})

		console.log("tab",tab);	
	}
	handleViewSubjectButton = () =>{
		const {viewSubject} =this.state;
		this.setState({
			viewSubject: !viewSubject
		});
	}
	handleBackButton = () =>{
		const {viewSubject} = this.state;
		this.setState({
			viewSubject: !viewSubject
		});
	}
  	render() {
		const{addStatus,schoolYear,addCourseStatus, selectedAddedCourse,rows,cols,showModal,courseList,
		filteredSchoolYear,curriculumYear, subjects, courses,departments,selectedTab, viewSubject,success,importSubjects} = this.state;
		const components = {
			body: {
			row: EditableFormRow,
			cell: EditableCell
			}
		};
		const columns = this.state.columns.map(col => {
			if (!col.editable) {
			  return col;
			}
			return {
        		...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave: this.handleSave
				})
			};
		});
		var loadViewCurriculum = selectedTab == 1? (
			<ViewCurriculum 
				schoolYear = {schoolYear}
				curriculumYear={curriculumYear}
				courses={courses}
				viewSubject = {viewSubject}
				departments={departments}
				handleViewSubjectButton = {this.handleViewSubjectButton}
        		inputChange = {this.inputChange}
				handleBackButton = {this.handleBackButton}
			/>
		) : ""; 
		
		var loadAddCurriculum = selectedTab == 2 ?(
			<AddCurriculum 
				inputChange = {this.inputChange}
				schoolYear={schoolYear}
				courses = {courseList}
				fileHandler = {this.fileHandler}
				cols = {cols}
				rows = {rows}
				columns = {columns}
				components = {components}
				handleSubmit={this.handleSubmit}
				handleAdd={this.handleAdd}
				success = {success}
			/>
		) : ""; 
		return (
			<Fragment>
				<div className="box ml-1 mb-1">
					<CurriculumTabs
						selectedTab = {selectedTab}
						handleOnClickTab = {this.handleOnClickTab}
					/>
					<hr></hr>
					{loadViewCurriculum}{loadAddCurriculum}
				</div>
				{/* <button onClick={this.closeModal}></button> */}
			</Fragment>
		);
  	}
}

export const CurriculumHeader = () => (
    <div className="title is-4 ml-1">
        <i className="fas fa-file"></i> Curriculum
    </div> 
);
