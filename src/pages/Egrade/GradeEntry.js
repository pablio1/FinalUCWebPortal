import React, { Component, Fragment } from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import * as XLSX from 'xlsx';

import { getLoggedUserDetails, sortArrayObjectsByProp, buildSubmitGradeRequest, getParsedExcelGrade, isNumeric } from '../../helpers/helper';
import { getTeachersLoad, getClassList, uploadGrades, teacherGradeReport } from '../../helpers/apiCalls';
import { optionExamsSetting } from '../../helpers/configObjects';

import SchedulesTable from '../../components/elements/SchedulesTable';
import EgradeTable from '../../components/elements/EgradeTable';

class GradeEntry extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    state = {
        teachersLoad: null, accSelectedSubjectsExpand: true, edpCode: '', subjectName: '', schedule: '', units: 0, 
        studentList: null, department: '', selectedExam: null, selectedFile: null, semester: 1, currentExamNumber: 1,
        isSubmitBtnClicked: false, filename: '', isLoadingFile: false, parsedExcelData: null, isEgrade: false,
        optionExamsSetting: null, submittedGrades: null, lateSubmittedGrades: null, submissionDeadline: null
    }
    componentDidMount = () => {
        const { cookies } = this.props;
        if(getLoggedUserDetails("hasload")) {
            getTeachersLoad(getLoggedUserDetails("idnumber"), cookies.get("selterm"))       
            .then(response => {
                if(response.data && response.data.schedules.length > 0) {
                    const TeachersLoadData = response.data.schedules;
                    let selectedExam = {};
                    let deptCountCL = 0, deptCountSH = 0, deptCountJH = 0, deptCountBE = 0;
                    TeachersLoadData.forEach(sched => {
                        selectedExam[sched.edpcode] = "";
                        //Highest count dept will be used as dept
                        if(sched.dept === "CL") deptCountCL++;  
                        if(sched.dept === "SH") deptCountSH++; 
                        if(sched.dept === "JH") deptCountJH++;
                        if(sched.dept === "BE") deptCountBE++;                       
                    });
                    let deptCountAll = [{a: "CL", b: deptCountCL},{a: "SH", b: deptCountSH},{a: "JH", b: deptCountJH},{a: "BE", b: deptCountBE}]; 
                    deptCountAll.sort((a, b) => parseFloat(b.b) - parseFloat(a.b)); //Sort Obj array decending
                    const department = deptCountAll[0].a;
                    const selectedTerm = cookies.get("selterm") ? cookies.get("selterm") : process.env.REACT_APP_CURRENT_SCHOOL_TERM;
                    const semester = selectedTerm.charAt(4);

                    let examNum = 1;
                    if(["CL","SH"].includes(department)) {
                        if(["M","S"].includes(getLoggedUserDetails("currentexam"))) examNum = 1;
                        else  examNum = 2;
                    }
                    else {
                        if(semester === "1") {
                            if(["M","S"].includes(getLoggedUserDetails("currentexam"))) examNum = 1;
                            else  examNum = 2;
                        }
                        else if (semester === "2") {
                            if(["M","S"].includes(getLoggedUserDetails("currentexam"))) examNum = 3;
                            else  examNum = 4;
                        }
                        else { }
                    }

                    const data = {
                        department: department,
                        id_number: getLoggedUserDetails("idnumber"),
                        exam: examNum,
                        active_term: cookies.get("selterm")
                    }
                    teacherGradeReport(data)        
                    .then(response => {
                        if(response.data && response.data.gradeR.length > 0) {
                            const gradeReportData = response.data.gradeR;
                            const submittedGrades = gradeReportData[0].submitted.subjs;
                            const lateSubmittedGrades = gradeReportData[0].late_submitted.subjs;
                            const submissionDeadline = gradeReportData[0].deadline;
                            const isOverdue = gradeReportData[0].is_overdue ? true : false;
                            let optionExams = optionExamsSetting();
                            if(semester === "1") { //If 1st Sem
                                optionExams.SH.grade1.label = "1st QTR";
                                optionExams.SH.grade2.label = "2nd QTR";  
                                optionExams.JH.grade3.enable = false;
                                optionExams.JH.grade4.enable = false;
                                optionExams.BE.grade3.enable = false;
                                optionExams.BE.grade4.enable = false;                    
                            }
                            else if(semester === "2") { //If 2nd Sem
                                optionExams.SH.grade1.label = "3rd QTR";
                                optionExams.SH.grade2.label = "4th QTR";
                                optionExams.JH.grade1.enable = false;
                                optionExams.JH.grade2.enable = false;
                                optionExams.BE.grade1.enable = false;
                                optionExams.BE.grade2.enable = false;
                            }
                            else { }

                            if(isOverdue) {
                                optionExams[department]["grade" + examNum].enable = false;  
                            }  

                            this.setState({
                                teachersLoad: TeachersLoadData,
                                selectedExam: selectedExam,
                                optionExamsSetting: optionExams,
                                department: department,
                                semester: semester,
                                submittedGrades: submittedGrades,
                                currentExamNumber: examNum,
                                submissionDeadline: submissionDeadline,
                                lateSubmittedGrades: lateSubmittedGrades
                            });  
                        }
                    });  
                }
            });            
        }
    }
    handleGradeEntry = (type, edpCode) => {
        const newState = Object.assign({}, this.state.selectedExam);
        if(type === "enter") {
            if(!newState[edpCode]) alert("You have to select the Exam to be graded first.");
            else this.getClassListData(edpCode, "enter");
        }
        if(type === "download") {
            this.getClassListData(edpCode, "download");
        }
        if(type.includes("selectedExam")) {
            const value = edpCode; //get Exam/Grade
            const arrE = type.split('.');
            newState[arrE[1]] = value;
            this.setState({ selectedExam : newState});
        }
    }
    getClassListData = (edpCode, type) => {
        const { cookies } = this.props;
        const currentCampus = process.env.REACT_APP_CAMPUS;
        getClassList(edpCode, cookies.get("selterm"))
        .then(response => {
            if(response.data) {
                const data = response.data;                  
                if(type === "upload") { //Upload from Grade Sheet 
                    const { parsedExcelData, isEgrade, selectedExam } = this.state;
                    let classList = [];
                    if(parseInt(data.official_enrolled_size, 10) > 0) {
                        classList = data.official_enrolled;
                        if(currentCampus !== "Banilad" && parseInt(data.pending_enrolled_size, 10) > 0) {
                            classList = [ ...classList, ...data.pending_enrolled ];
                        }
                        classList.forEach(student => {
                            student[selectedExam[edpCode]] = getParsedExcelGrade (parsedExcelData, student.id_number, parseInt(selectedExam[edpCode].charAt(5), 10), data.department, isEgrade);
                        });
                    }
                    
                    this.setState({
                        edpCode: data.edp_code, 
                        subjectName: data.subject_name, 
                        schedule: data.time_info, 
                        units: data.units, 
                        department: data.department,
                        studentList: classList.length > 0 ? classList : null, 
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

                        this.setState({
                            edpCode: data.edp_code, 
                            subjectName: data.subject_name, 
                            schedule: data.time_info, 
                            units: data.units, 
                            department: data.department,
                            studentList: classList.length > 0 ? classList : null, 
                            filename: '', 
                        }, () => {
                            if(type === "download") {
                                document.getElementById('egradeExportBtn').click();                     
                            }
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
        const newState = Object.assign({}, this.state.selectedExam);
        if(e.target.name.includes("selectedExamUpload")) {
            const value = e.target.value; //get Exam/Grade
            const arrE = e.target.name.split('.');
            newState[arrE[1]] = value;
            this.setState({ selectedExam : newState});
        }
        else {
            const value = e.target.value;
            const arrE = e.target.name.split('.'); // arrE[0] = grade1-4, arrE[1] = 1.. (studentList index)

            let students = [...this.state.studentList]; // Make a shallow copy of the studentList
            let student = {...students[arrE[1]]};
            student[arrE[0]] = value;
            students[arrE[1]] = student;

            this.setState({ studentList : students });
        }
    }
    handleSubmitGrades = () => {
        const { cookies } = this.props;
        const { department, edpCode, studentList, selectedExam, currentExamNumber } = this.state;
   
        if(studentList.some(student => (student[selectedExam[edpCode]] !== null && student[selectedExam[edpCode]] !== ''))) {
            this.setState({
                isSubmitBtnClicked: true 
            }, () => {
                uploadGrades(buildSubmitGradeRequest(studentList, edpCode, parseInt(selectedExam[edpCode].charAt(5), 10), department, cookies.get("selterm")))
                .then(response => {
                    if(response.data.success) {
                        alert("Grades successfully submitted!");
                    }
                    else {
                        alert("Grades submission failed! Please try again.");
                    }
                    const data = {
                        department: department,
                        id_number: getLoggedUserDetails("idnumber"),
                        exam: currentExamNumber,
                        active_term: cookies.get("selterm")
                    }
                    teacherGradeReport(data)        
                    .then(response => {
                        if(response.data && response.data.gradeR.length > 0) {
                            const gradeReportData = response.data.gradeR;
                            const submittedGrades = gradeReportData[0].submitted.subjs;
                            const lateSubmittedGrades = gradeReportData[0].late_submitted.subjs;
                            this.setState({
                                submittedGrades: submittedGrades,
                                lateSubmittedGrades: lateSubmittedGrades,
                                isSubmitBtnClicked: false
                            });  
                        }
                    });
                    this.clearState();
                });         
            }); 
        }
        else {
            alert("No grades entered in the table!");   
        }     
    }
    handleParseExcel = e => {
        e.preventDefault();
        let files = e.target.files, f = files[0];
        let name = f.name;
        this.setState({
            isLoadingFile: true
        }, () => {
            const { teachersLoad } = this.state;
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
                        parsedExcelData: parsedData,
                        edpCode: edpCode
                    });                    
                }
                this.setState({
                    isLoadingFile: false
                });
            };
            reader.readAsBinaryString(f);
        });        
    }
    handleOnLoadFile = edpCode => {
        const newState = Object.assign({}, this.state.selectedExam);
        if(!newState[edpCode]) alert("You have to select the Exam to be graded first.");
        else if(!this.state.parsedExcelData) alert("You have to select the Excel file to proceed.");
        else this.getClassListData(edpCode, "upload") 
    }
    handleCancelSubmit = () => {
        if(window.confirm("Are you sure you want to cancel? All your entered grades will be cleared. Click Ok to proceed, otherwise Cancel.")) {  
            this.clearState();
        }
    }
    clearState = () => {
        let selectExam = this.state.selectedExam;
        Object.keys(selectExam).forEach(function(key, value) {
            return selectExam[key] = "";
        })
        this.setState({
            edpCode: '', 
            subjectName: '', 
            schedule: '', 
            units: 0, 
            studentList: null, 
            department: '', 
            filename: '', 
            isLoadingFile: false,
            selectedExam: selectExam, 
            selectedFile: null,
        });
    }
    render() {
        const { 
            teachersLoad, accSelectedSubjectsExpand, edpCode, subjectName, schedule, units, studentList, department, lateSubmittedGrades,
            isSubmitBtnClicked, filename, isLoadingFile, selectedExam, optionExamsSetting, semester, submittedGrades, submissionDeadline
        } = this.state;
        const gradeEntryData = { selectedExam, optionExamsSetting, submittedGrades, submissionDeadline, lateSubmittedGrades }; 
        const teacherID = getLoggedUserDetails("idnumber");
        const teacherName = getLoggedUserDetails("fullname");
        const loadSpinner = (
            <span className="icon">
                <i className="fas fa-spinner fa-pulse"></i>
            </span>
        );

        let loadExamSelectOptions = [];
        if(optionExamsSetting) {                          
            const optionExamsObj = optionExamsSetting[department];
            for(let key in optionExamsObj) {
                if(optionExamsObj.hasOwnProperty(key)) {
                    if(process.env.REACT_APP_CAMPUS === "Banilad") {
                        if(optionExamsObj[key].enable) loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);
                    }
                    else loadExamSelectOptions.push(<option key={key} value={key}>{optionExamsObj[key].label}</option>);                  
                }
            }       
        }    
        const loadMyLoad = teachersLoad ? (
            <Fragment> 
                <div className="columns">
                    <div className="column">
                        <SchedulesTable 
                            subjects={sortArrayObjectsByProp(teachersLoad, "edpcode")}
                            module="GradeEntry"
                            accSelectedSubjectsExpand={accSelectedSubjectsExpand}
                            gradeEntryData={gradeEntryData}
                            onClickAccordion={this.onClickAccordion}
                            handleGradeEntry={this.handleGradeEntry}
                        />
                    </div>
                </div>    
                <div className="columns">
                    <div className="column is-narrow">
                        <h4 className="has-text-weight-semibold is-size-6 pt-1">Upload E-Grade File</h4>      
                    </div>
                    <div className="column is-narrow">                   
                        <div className="file has-name is-small">
                            <label className="file-label"> 
                                <input className="file-input" type="file" accept=".xlsx, .xls" name="fileUploadInput" onChange={this.handleParseExcel} />
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
                    <div className="column is-narrow">                   
                        <div className="control">
                            <span className="select is-small">                                
                                <select className="pt-0 pb-0" name={"selectedExamUpload." + edpCode} value={optionExamsSetting[edpCode]} onChange={this.handleOnChangeInput}>
                                    <option key={0} value="">Select Exam</option>
                                    {loadExamSelectOptions}
                                </select>
                            </span>
                        </div>    
                    </div>
                    <div className="column is-narrow">                   
                        <button className="button is-info is-small" onClick={() => this.handleOnLoadFile(edpCode)} >                                                        
                            <span>Load File</span>         
                        </button>  
                    </div> 
                    <div className="column is-hidden-mobile"></div>
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
            let { grade1, grade2 } = "";
            if(department === "CL") {
                grade1 = isNumeric(student.grade1) && student.grade1.length === 2 && !student.grade1.includes(".") ? student.grade1.charAt(0) + "." +  student.grade1.charAt(1) : student.grade1; // add .
                grade2 = isNumeric(student.grade2) && student.grade2.length === 2 && !student.grade2.includes(".") ? student.grade2.charAt(0) + "." +  student.grade2.charAt(1) : student.grade2; // add .
            }  
            else {
                grade1 = student.grade1;
                grade2 = student.grade2;
            } 
            return(
                <tr key={index}>
                    <td className="has-text-centered is-narrow">{index + 1}</td>
                    <td className="is-narrow">{student.id_number}</td>
                    <td className="has-text-left">{student.last_name}</td>
                    <td className="has-text-left">{student.firstname}</td>
                    <td className="has-text-centered is-narrow">{student.course_year}</td>
                    <td className="has-text-centered is-narrow">{student.gender}</td> 
                    <td className="has-text-centered">
                        <input className="input is-small" style={{ width: "50px" }} name={"grade1." + index} type="text" 
                                value={grade1} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade1" ? false : true} />
                    </td>
                    <td className="has-text-centered">
                        <input className="input is-small" style={{ width: "50px" }} name={"grade2." + index} type="text" 
                                value={grade2} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade2" ? false : true} />
                    </td>    
                    <td className="has-text-centered">
                        { 
                            department === "JH" || department === "BE" ? (
                                <input className="input is-small" style={{ width: "50px" }} name={"grade3." + index} type="text" 
                                        value={student.grade3} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade3" ? false : true} /> 
                            ) : "" 
                        }
                    </td>
                    <td className="has-text-centered">
                        { 
                            department === "JH" || department === "BE" ? (
                                <input className="input is-small" style={{ width: "50px" }} name={"grade4." + index} type="text" 
                                        value={student.grade4} onChange={this.handleOnChangeInput} disabled={selectedExam[edpCode] === "grade4" ? false : true} /> 
                            ) : "" 
                        }
                    </td>                
                </tr>
            );
        }) : "";
        let exam1Label = "Midterm";
        let exam2Label = "Final";
        let exam3Label = "3rd Grading";
        let exam4Label = "4th Grading";
        if(department === "SH") {
            if(semester === "1") {
                exam1Label = "1st QTR";
                exam2Label = "2nd QTR";
            }
            if(semester === "2") {
                exam1Label = "3rd QTR";
                exam2Label = "4th QTR";
            }
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
                <div className="column">
                    {loadMyLoad}
                </div>
                <div className="column is-hidden-mobile is-1"></div>
                <div className="column is-hidden-mobile is-1"></div>
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
                                semester={semester}
                                isHidden={true}
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