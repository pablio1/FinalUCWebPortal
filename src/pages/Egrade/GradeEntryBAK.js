import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import * as XLSX from 'xlsx';

import { getLoggedUserDetails, sortArrayObjectsByProp, buildSubmitGradeRequest, getParsedExcelGrade, isNumeric } from '../../helpers/helper';
import { getTeachersLoad, getClassList, uploadGrades, viewGrades } from '../../helpers/apiCalls';

import SchedulesTable from '../../components/elements/SchedulesTable';
import EgradeTable from '../../components/elements/EgradeTable';

class GradeEntry extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        teachersLoad: null, accSelectedSubjectsExpand: true, edpCode: '', subjectName: '', schedule: '', units: 0, 
        studentList: null, department: '', exam1: null, exam2: null, exam3: null, exam4: null,
        isSubmitBtnClicked: false, filename: '', isLoadingFile: false, parsedExcelData: null, isEgrade: false
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        if(getLoggedUserDetails("hasload")) {
            getTeachersLoad(getLoggedUserDetails("idnumber"), cookies.get("selterm"))       
            .then(response => {
                if(response.data && response.data.schedules.length > 0) {
                    this.setState({
                        teachersLoad: response.data.schedules
                    });                    
                }
            });            
        }
    }
    handleGradeEntry = (type, edpCode) => {
        if(type === "enter") {
            this.getClassListData(edpCode, "enter");
        }
        if(type === "download") {
            this.getClassListData(edpCode, "download");
        }
    }
    getClassListData = (edpCode, type) => {
        const { cookies } = this.props;
        const currentCampus = process.env.REACT_APP_CAMPUS;
        getClassList(edpCode, cookies.get("selterm"))
        .then(response => {
            if(response.data) {
                const data = response.data;  
                let exam1 = null; 
                let exam2 = null; 
                let exam3 = null; 
                let exam4 = null; 

                let exam1IdNumbers = {};
                let exam2IdNumbers = {};
                let exam3IdNumbers = {};
                let exam4IdNumbers = {};
                
                if(type === "upload") { //Upload from Grade Sheet 
                    const { parsedExcelData, isEgrade } = this.state;
                    let classList = [];
                    if(parseInt(data.official_enrolled_size, 10) > 0) {
                        classList = data.official_enrolled;
                        if(currentCampus !== "Banilad" && parseInt(data.pending_enrolled_size, 10) > 0) {
                            classList = [ ...classList, ...data.pending_enrolled ];
                        }
                        classList.forEach(student => {
                            exam1IdNumbers[student.id_number] = getParsedExcelGrade (parsedExcelData, student.id_number, 1, data.department, isEgrade);
                            exam2IdNumbers[student.id_number] = getParsedExcelGrade (parsedExcelData, student.id_number, 2, data.department, isEgrade);
                            if(data.department === "JH" || data.department === "BE") {
                                exam3IdNumbers[student.id_number] = getParsedExcelGrade (parsedExcelData, student.id_number, 3, data.department, isEgrade);
                                exam4IdNumbers[student.id_number] = getParsedExcelGrade (parsedExcelData, student.id_number, 4, data.department, isEgrade);
                            }
                        });
                        exam1 = exam1IdNumbers;
                        exam2 = exam2IdNumbers;
                        if(data.department === "JH" || data.department === "BE") exam3 = exam3IdNumbers;
                        if(data.department === "JH" || data.department === "BE") exam4 = exam4IdNumbers;
                    }
                    
                    this.setState({
                        edpCode: data.edp_code, 
                        subjectName: data.subject_name, 
                        schedule: data.time_info, 
                        units: data.units, 
                        department: data.department,
                        studentList: classList.length > 0 ? classList : null, 
                        exam1: exam1,
                        exam2: exam2,
                        exam3: exam3,
                        exam4: exam4
                    }, () => {
                        if(type === "download") {
                            document.getElementById('egradeExportBtn').click();                     
                        }
                    });      
                    
                }
                else { // Enter grades
                    if(parseInt(data.official_enrolled_size, 10) > 0) {
                        let classList = data.official_enrolled;
                        if(currentCampus !== "Banilad" && parseInt(data.pending_enrolled_size, 10) > 0) {
                            classList = [ ...classList, ...data.pending_enrolled ];
                        }
                        viewGrades(edpCode, cookies.get("selterm"))
                        .then(response => {
                            if(response.data && response.data.student_grades.length > 0) {                                
                                const gradeData = response.data.student_grades;                                
                                classList.forEach(student => {
                                    const  studentGrade = gradeData.filter(stud => stud.id_number === student.id_number)[0];
                                    let { grade1, grade2, grade3, grade4 } = "";
                                    if(data.department === "CL") {
                                        grade1 = isNumeric(studentGrade.grade1) && studentGrade.grade1.length === 2 ? studentGrade.grade1.charAt(0) + "." +  studentGrade.grade1.charAt(1) : studentGrade.grade1; // add .
                                        grade2 = isNumeric(studentGrade.grade2) && studentGrade.grade2.length === 2 ? studentGrade.grade2.charAt(0) + "." +  studentGrade.grade2.charAt(1) : studentGrade.grade2; // add .
                                    }  
                                    else {
                                        grade1 = studentGrade.grade1;
                                        grade2 = studentGrade.grade2;
                                    }                                 
                                    exam1IdNumbers[student.id_number] = grade1;
                                    exam2IdNumbers[student.id_number] = grade2;
                                    if(data.department === "JH" || data.department === "BE") {
                                        exam3IdNumbers[student.id_number] = grade3;
                                        exam4IdNumbers[student.id_number] = grade4; 
                                    }
                                });
                                exam1 = exam1IdNumbers;
                                exam2 = exam2IdNumbers;
                                if(data.department === "JH" || data.department === "BE") exam3 = exam3IdNumbers;
                                if(data.department === "JH" || data.department === "BE") exam4 = exam4IdNumbers;

                            }
                            else {
                                let examIdNumbers = {};
                                classList.forEach(student => {
                                    examIdNumbers[student.id_number] = "";
                                });
                                exam1 = examIdNumbers;
                                exam2 = examIdNumbers;
                                if(data.department === "JH" || data.department === "BE") exam3 = examIdNumbers;
                                if(data.department === "JH" || data.department === "BE") exam4 = examIdNumbers;
                            }

                            this.setState({
                                edpCode: data.edp_code, 
                                subjectName: data.subject_name, 
                                schedule: data.time_info, 
                                units: data.units, 
                                department: data.department,
                                studentList: classList.length > 0 ? classList : null, 
                                exam1: exam1,
                                exam2: exam2,
                                exam3: exam3,
                                exam4: exam4
                            }, () => {
                                if(type === "download") {
                                    document.getElementById('egradeExportBtn').click();                     
                                }
                            });                          
                        });
                        
                    }     
                }           
                
            }
            else {
                alert("No records found. Please try again.");
            }
            this.setState({ isEgrade: false });
        });
    }
    onClickAccordion = e => {
        const { accSelectedSubjectsExpand } = this.state;
        this.setState({
            accSelectedSubjectsExpand: !accSelectedSubjectsExpand,
        });
    }
    handleOnChangeInput = e => {
        const value = e.target.value;
        const arrE = e.target.name.split('.');
        const newState = Object.assign({}, this.state[arrE[0]]);
        newState[arrE[1]] = value;
        this.setState({ [arrE[0]] : newState});
    }
    handleSubmitGrades = () => {
        const { cookies } = this.props;
        const { department, edpCode, exam1, exam2, exam3, exam4 } = this.state;
        //Check if table is empty
        const isEmptyE1 = !Object.values(exam1).some(x => (x !== null && x !== ''));
        const isEmptyE2 = !Object.values(exam2).some(x => (x !== null && x !== ''));
        let emptySheet = false;
        if(department === "JH" || department === "BE") {            
            const isEmptyE3 = !Object.values(exam3).some(x => (x !== null && x !== ''));
            const isEmptyE4 = !Object.values(exam4).some(x => (x !== null && x !== ''));
            if(isEmptyE1 && isEmptyE2 && isEmptyE3 && isEmptyE4) {
                emptySheet = true;
            }
        }
        else {
            if(isEmptyE1 && isEmptyE2) {
                emptySheet = true;
            }
        }
        if(emptySheet) {
            alert("No grades entered in the table!");
        }
        else {
            this.setState({
                isSubmitBtnClicked: true
            });
            uploadGrades(buildSubmitGradeRequest(exam1, edpCode, 1, department, cookies.get("selterm")))
            .then(response => {
                if(response.data.success) {
                    uploadGrades(buildSubmitGradeRequest(exam2, edpCode, 2, department, cookies.get("selterm")))
                    .then(response => {
                        if(response.data.success) {
                            if(department === "JH" || department === "BE") {
                                uploadGrades(buildSubmitGradeRequest(exam3, edpCode, 3, department, cookies.get("selterm")))
                                .then(response => {
                                    if(response.data.success) {
                                        uploadGrades(buildSubmitGradeRequest(exam4, edpCode, 4, department, cookies.get("selterm")))
                                        .then(response => {
                                            if(response.data.success) {
                                                alert("Grades successfully submitted!");
                                            }
                                            else alert("Error in grade submission, Please try again. [EX4]");
                                            this.setState({ isSubmitBtnClicked: false });
                                            this.clearState();
                                        });
                                    }
                                    else alert("Error in grade submission, Please try again. [EX3]");
                                    this.setState({ isSubmitBtnClicked: false });
                                    this.clearState();
                                });
                            }
                            else {
                                this.setState({ isSubmitBtnClicked: false });
                                this.clearState();
                                alert("Grades successfully submitted!");
                            }   
                        }
                        else {
                            alert("Error in grade submission, Please try again. [EX2]");
                            this.setState({ isSubmitBtnClicked: false });
                            this.clearState();
                        }
                    });
                }
                else {
                    alert("Error in grade submission, Please try again. [EX1]");
                    this.setState({ isSubmitBtnClicked: false });
                    this.clearState();
                }
            });            
        }
        
    }
    handleParseExcel = e => {
        e.preventDefault();
        let files = e.target.files, f = files[0];
        let name = f.name;
        this.setState({
            isLoadingFile: true
        }, () => {
            const { teachersLoad, department } = this.state;
            const reader = new FileReader();
            reader.onload = (evt) => { // evt = on_file_select event
                /* Parse data */
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, {type:'binary'});
                /* Get first worksheet */
                let wsname = wb.SheetNames[0];
                let ws = wb.Sheets[wsname];
                let parsedData = XLSX.utils.sheet_to_json(ws, {header:1});
                let edpCode = "";
                if(parsedData[0][0] === "E-Grade Sheet") {
                    edpCode = parsedData[1][1].substring(1);
                    this.setState({ isEgrade: true });
                }
                else {
                    let sheet5Data = ""; //For JH & BE, Get Edp Code 
                    let educLevel = "";
                    if(wb.SheetNames.length === 6 && wb.SheetNames[0] === "TRANSMUTATION") educLevel = "JH";
                    if(wb.SheetNames.length === 4 && wb.SheetNames[0] === "New Transmutation") educLevel = "SH";
                    if(wb.SheetNames.length === 1) educLevel = "CL";
                    if(educLevel === "CL") wsname = wb.SheetNames[0]; //Sheet with final grade CL
                    if(educLevel === "SH") wsname = wb.SheetNames[3]; //Sheet with final grade SH
                    if(educLevel === "JH") { //Sheet with final grade JH & BE
                        wsname = wb.SheetNames[5]; 
                        sheet5Data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[4]], {header:1}); //Just to get the EDP Code which is not in the Final Sheet
                    }
                    ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    //const parsedData = XLSX.utils.sheet_to_csv(ws, {header:1});
                    parsedData = XLSX.utils.sheet_to_json(ws, {header:1});
                    /* Update state */              
                    if(educLevel === "CL") edpCode = parsedData[0][0]; //Get EDP Code CL
                    if(educLevel === "SH") edpCode = parsedData[0][0].replace(/ /g,'').split(':').pop(); //Get EDP Code SH
                    if(educLevel === "JH") edpCode = sheet5Data[0][0].replace(/ /g,'').split(':').pop(); //Get EDP Code JH or BE  
                }
                
                const hasSchedule = teachersLoad.filter(schedule => schedule.edpcode === edpCode.toString());
                if(!hasSchedule || hasSchedule.length === 0) alert("Subject's EDP code (" + edpCode + ") to be uploaded is not found in your teaching loads.");
                //if(!hasSchedule) alert("Subject's EDP code (" + edpCode + ") to be uploaded is not found in your teaching loads.");
                else {
                    this.setState({
                        filename: name,
                        parsedExcelData: parsedData
                    }, () => this.getClassListData(edpCode, "upload") );                    
                }
                this.setState({
                    isLoadingFile: false
                });
            };
            reader.readAsBinaryString(f);
        })
        
    }
    handleCancelSubmit = () => {
        if(window.confirm("Are you sure you want to cancel? All your entered grades will be cleared. Click Ok to proceed, otherwise Cancel.")) {  
            this.clearState();
        }
    }
    clearState = () => {
        this.setState({
            edpCode: '', 
            subjectName: '', 
            schedule: '', 
            units: 0, 
            studentList: null, 
            department: '', 
            exam1: null, 
            exam2: null, 
            exam3: null, 
            exam4: null,
            filename: '', 
            isLoadingFile: false
        });
    }
    render() {
        const { 
            teachersLoad, accSelectedSubjectsExpand, edpCode, subjectName, schedule, units, studentList, department, 
            exam1, exam2, exam3, exam4, isSubmitBtnClicked, filename, isLoadingFile 
        } = this.state;
        const teacherID = getLoggedUserDetails("idnumber");
        const teacherName = getLoggedUserDetails("fullname");
        const loadSpinner = (
            <span className="icon">
                <i className="fas fa-spinner fa-pulse"></i>
            </span>
        );
        const loadMyLoad = teachersLoad ? (
            <Fragment>
                <div className="columns">
                    <div className="column">
                        <SchedulesTable 
                            subjects={sortArrayObjectsByProp(teachersLoad, "edpcode")}
                            module="GradeEntry"
                            accSelectedSubjectsExpand={accSelectedSubjectsExpand}
                            selExamGradeEntry=""
                            optionExamsSetting={""}
                            onClickAccordion={this.onClickAccordion}
                            handleGradeEntry={this.handleGradeEntry}
                        />
                    </div>
                </div>            
                <div className="columns">
                    <div className="column is-narrow pt-4">
                        <h4 className="has-text-weight-semibold is-size-6">Upload E-Grade File</h4>
                    </div>
                    <div className="column">                   
                        <div className="file has-name is-small">
                            <label className="file-label"> 
                                <input className="file-input" type="file" accept=".xlsx, .xls"  onChange={this.handleParseExcel} />
                                <span className="file-cta">
                                    <span className="file-icon">
                                        { isLoadingFile ? loadSpinner : <i className="fas fa-upload"></i> }
                                    </span>
                                    <span className="file-label">Click to Select File</span>
                                </span>
                                <span className="file-name">{filename}</span>
                            </label>
                        </div>
                    </div>
                </div> 
            </Fragment>
         ) : (
            <div className="columns is-vcentered">
                <div className="column is-center">
                    <div className="notification is-danger">
                        <strong>You currently do not have any Teaching Loads.</strong>                           
                    </div>
                </div>
            </div> 
        );
        const sortBy = department === "CL" ? "last_name" : "gender";
        const loadstudentList = studentList && studentList.length > 0 ? sortArrayObjectsByProp(studentList, sortBy).map((student, index) => {
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-left">{student.last_name}</td>
                    <td className="has-text-left">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td> 
                    <td className="has-text-centered"><input className="input is-small" style={{ width: "50px" }} name={"exam1." + student.id_number} type="text" value={exam1[student.id_number]} onChange={this.handleOnChangeInput}/></td>
                    <td className="has-text-centered"><input className="input is-small" style={{ width: "50px" }} name={"exam2." + student.id_number} type="text" value={exam2[student.id_number]} onChange={this.handleOnChangeInput}/></td>    
                    <td className="has-text-centered">{ department === "JH" || department === "BE" ? <input className="input is-small" style={{ width: "50px" }} name={"exam3." + student.id_number} type="text" value={exam3[student.id_number]} onChange={this.handleOnChangeInput}/> : "" }</td>
                    <td className="has-text-centered">{ department === "JH" || department === "BE" ? <input className="input is-small" style={{ width: "50px" }} name={"exam4." + student.id_number} type="text" value={exam4[student.id_number]} onChange={this.handleOnChangeInput}/> : "" }</td>                
                </tr>
            );
        }) : "";
        let exam1Label = "Midterm";
        let exam2Label = "Final";
        let exam3Label = "3rd Grading";
        let exam4Label = "4th Grading";
        if(department === "SH") {
            exam1Label = "1st QTR";
            exam2Label = "2nd QTR";
        }
        if(department === "JH" || department === "BE") {
            exam1Label = "1st Grading";
            exam2Label = "2nd Grading";
        }
        const loadInputGradeForm = loadstudentList ? (
            <article className="message is-link m-0 pt-0">                
                <div className="message-body p-0">
                    <div className="table-container p-0">
                        <table className="table is-striped is-fullwidth is-size-7 is-hoverable mb-2">
                            <tbody>
                                <tr>
                                    <th colSpan="2">EDP Code</th>
                                    <td colSpan="8" className="has-text-left">{edpCode}</td>                                                                 
                                </tr>  
                                <tr>
                                    <th colSpan="2">Subject</th>
                                    <td colSpan="8" className="has-text-left">{subjectName}</td>                                 
                                </tr>
                                <tr>
                                    <th colSpan="2">Schedule</th>
                                    <td colSpan="4" className="has-text-left">{schedule}</td>  
                                    <td colSpan="4">
                                        <div className="buttons">
                                            <button className="button is-primary is-small" onClick={this.handleCancelSubmit} >                                                        
                                                <span>Cancel</span>         
                                            </button>
                                            <button className={"button is-info is-small " + (isSubmitBtnClicked ? "is-loading" : "")} onClick={this.handleSubmitGrades} >                                                        
                                                <span>Submit</span>         
                                            </button>
                                        </div>
                                    </td>                                
                                </tr>                           
                                <tr>
                                    <th className="has-text-centered is-narrow">No.</th>
                                    <th className="has-text-centered is-narrow">ID number</th>
                                    <th className="has-text-left">Last Name</th>
                                    <th className="has-text-left">First Name</th>
                                    <th className="has-text-centered is-narrow">Course / Year</th>
                                    <th className="has-text-centered is-narrow">Gender</th>                                    
                                    <th className="has-text-centered is-narrow">{exam1Label}</th>
                                    <th className="has-text-centered is-narrow">{exam2Label}</th>
                                    <th className="has-text-centered is-narrow">{ department === "JH" || department === "BE" ? exam3Label : ""}</th>     
                                    <th className="has-text-centered is-narrow">{ department === "JH" || department === "BE" ? exam4Label : ""}</th> 
                                </tr>
                                { loadstudentList ? loadstudentList : (    
                                        <tr>
                                            <th colSpan="2">Grade Entry</th>
                                            <td colSpan="8">&nbsp;</td>                                 
                                        </tr>
                                    )
                                }                                                                                                                            
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="6">&nbsp;</th>
                                    <td colSpan="4">
                                        <div className="buttons">
                                            <button className="button is-primary is-small" onClick={this.handleCancelSubmit} >                                                        
                                                <span>Cancel</span>         
                                            </button>
                                            <button className={"button is-info is-small " + (isSubmitBtnClicked ? "is-loading" : "")} onClick={this.handleSubmitGrades} >                                                        
                                                <span>Submit</span>         
                                            </button>
                                        </div>
                                    </td>                                 
                                </tr>
                            </tfoot>
                        </table>             
                    </div>                                  
                </div>
            </article> 
        ) : "";
        return(
            <Fragment>
            <div className="columns">
                <div className="column is-two-thirds-desktop">
                    {loadMyLoad}
                </div>
            </div>            
            <div className="columns">
                <div className="column is-two-thirds-desktop">
                    {
                        loadstudentList ? (
                            <EgradeTable
                                edpCode={edpCode}
                                subjectName={subjectName}
                                units={units}
                                studentList={studentList}
                                department={department}
                                teacherID={teacherID}
                                teacherName={teacherName}
                            />
                        ) : ""
                    }
                    {loadInputGradeForm}
                </div>
            </div> 
            </Fragment>
        );
    }
}

export default withCookies(GradeEntry);