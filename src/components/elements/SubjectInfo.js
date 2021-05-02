import React, { Component,Fragment } from 'react';
import {hasSubjectLab} from '../../helpers/helper';
import {getSubjectInfo ,searchSubjects,savePrerequisite,removePrerequisite,getEquivalence,getAllCurriculum,
        addEquivalence, removeEquivalence,getCourseList,getSubjectEquivalence} from '../../helpers/apiCalls';

export default class SubjectInfo extends Component {
    state = {subjects: null, requisites: null, year: null, semester:null, success: null,requisite_type: null,
         switchEquivalance: null, equivalence: null,selectedCourse: null, selectedYear: null, selectedDepartment:null,
        curriculumYear: null, departments:null, courseList: null, courses: null, searchedSubject: null,search: null, equivalence:null,
        subjectEquivalence: null}
    componentDidMount = () => {
       //console.log(this.props);
        this.handleLoadSubjectInfo();
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
    handleKeyDown = e => {
        if (e.key === 'Enter') {
            this.handleSearchResults();
            //console.log(this.state.search);
        }
    }
    handleSearchResults = () => {
         var data = {
            subject_name:this.state.search
        }
        searchSubjects(data)
        .then(response => {
            if(response.data){
                this.setState({
                    searchedSubject: response.data.subjects
                });
                console.log(response.data);
            }
        });
    }
    handleAddEquivalence = (internal_code, equival_code) =>{

        var data = {
            internal_code: internal_code,
            equivalence_code: equival_code    
        }

        addEquivalence(data)
        .then(response => {
            if(response.data){
                this.setState({
                    success: response.data.success
                });
                this.loadEquivalence(internal_code);
                console.log("success add", response.data);
            }
        });
    }

    loadEquivalence = (internal_code) =>{
        var data = {
            internal_code: internal_code
        }
        getSubjectEquivalence(data)
        .then(response => {
            if(response.data){
                this.setState({
                    subjectEquivalence: response.data.subjects
                });
                console.log("subjectEquivalence", response.data);
            }
        });
    }
    handleRemoveEquivalence = (internal_code, equival_code) => {
        var data = {
            internal_code: internal_code,
            equivalence_code: equival_code    
        }

        removeEquivalence(data)
        .then(response => {
            if(response.data){
                this.setState({
                    success: response.data.success
                });
                this.loadEquivalence(internal_code);
            }
        });
    }
    handleSearchInput = input => e => {
        this.setState({
            [input]: e.target.value
        });
       
        //console.log(e.target.value);
    }
    handleFilteredInput = input => e => {
		
        this.setState({
            [input]: e.target.value
        });
		//console.log("data", input);

		if(input == 'selectedYear'){
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
							courses: response.data.courses
						});
						//console.log("test", response.data);
					}
				});
			}
		}
		if(input == 'selectedDepartment'){
			const {selectedYear} = this.state;
			var data={
				curr_year: selectedYear,
				department: e.target.value
			}
			console.log("data",data);
			getCourseList(data)
			.then(response => {
				if(response.data){
					this.setState({
						courses: response.data.courses,
					});
					//console.log("test", response.data);
				}
			});
		}
    }
    handleLoadSubjectInfo = () =>{
        const {schoolYear, course_code} = this.props;
        //var loadSubjectInfo = subject.filter(filt => filt.internal_code == selectedSubject);
        //console.log("test", this.props);
        var data = {
            curr_year: schoolYear,
            course_code, course_code
        }
        if(schoolYear != null)
        {
            getSubjectInfo(data)
            .then(response => {  
                if(response.data) {
                    this.setState({
                        subjects: response.data.subjects,
                        requisites: response.data.requisites,
                        requisite_type: response.data.requisite_type
                    });
                    console.log("requisite", response.data);
                }
                const {subjects} = this.state;
                const year = [...new Set(subjects.map(item => item.year_level))]
                this.setState({
                    year: year
                });
                const semester = [...new Set(subjects.map(item => item.semester))]
                this.setState({
                    semester: semester
                });
            });
        }
    }
    handleAddRequisite = (internal_code,type) => {
        const{selectedSubject} = this.props;
        var data = {
            internal_code: selectedSubject,
            requisite: internal_code,
            requisite_type: type
        }
        console.log("testdata",data);
        savePrerequisite(data)
        .then(response => {
            if(response.data){
                this.setState({
                    success: response.data.success
                });
                this.handleLoadSubjectInfo();
                
            }
        });
    }
    handleDeSelectButton = () => {
        this.props.handleDeSelectButton();
        this.setState({
            subjectEquivalence: null
        });
    }
    handleSelectButton = (internal_code) => {
        this.props.handleSelectButton(internal_code);
        this.loadEquivalence(internal_code);
    }
    handleRemoveRequisite = (internal_code, type) => {
        const {selectedSubject} = this.props;
        var data = {
            internal_code: selectedSubject,
            requisite: internal_code,
            requisite_type: type

        }
        //console.log("Data",data);
        removePrerequisite(data)
        .then(response => {
            if(response.data){
                this.setState({
                    success: response.data.success
                })
                this.handleLoadSubjectInfo();
            }
        });
        
    }
    handleCheckEquivalence = (subjects,internal_code) =>{
        var found = false
        var subject = subjects.map((sub, index)=>{
            if(sub.internal_code == internal_code)
                found= true;
        });
        console.log("subjects", subjects);
        console.log("found", found);
        return found;
    }
    handleSwitchButton = (descr, course_code) =>{
        const {switchEquivalence} = this.state;
        if(!switchEquivalence){
            this.setState({
                switchEquivalence: "checked"
            })
            var data = {
                description: descr,
                units: 0,
                course_code: course_code,
                curr_year: this.props.schoolYear
            }
            getEquivalence(data)
            .then(response => {
                if(response.data){
                    this.setState({
                        equivalence: response.data.equivalences
                    })
                    this.handleLoadSubjectInfo();
                
                    console.log("data equi",response.data);
                    console.log("data",data);
                }
            });
        }else{
            this.setState({
                switchEquivalence: null
            })
        }
        console.log("test",switchEquivalence);
        
    }
  render() {
    const {subject,selectedSubject,handleBackButton, inputChange,schoolYear} = this.props;
    const {subjects, requisites,year,semester,requisite_type, switchEquivalence,equivalence,
            curriculumYear,departments,courseList,selectedYear,searchedSubject,subjectEquivalence} = this.state;
    const yearLevel = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
    const sem  = ['', 'First', 'Second', 'Summer'];
    var countPre = 0;
    var countCo = 0;
    var getYear = 0;
    var getSubject = null;
    var getSubjectDescription= null;
    var getSemester = 0;
    var getCourseCode = null;
    var loadCurriculumYear = curriculumYear ? curriculumYear.map((year, index)=>{
        return (
            <Fragment key={index}>
                <option value={year.year}>{year.year} - {parseInt(year.year) + 1}</option>
            </Fragment>
        )
    }) :"";

    var loadDepartments = departments ? departments.map((course, index)=>{
        return (
            <Fragment key={index}>
                <option value={course.course_department_abbr}>{course.course_department_abbr}</option>
            </Fragment>
        )
    }):"";
    var loadSubjectInfo = subject?subject.filter(filt => filt.internal_code == selectedSubject).map((sub, index)=>{
        getYear = sub.year_level;
        getSemester = sub.semester;
        getSubject = sub.subject_name;
        getSubjectDescription = sub.descr_1;
        getCourseCode = sub.course_code;
        return (
            <Fragment key={index}>
                <tr>
                    <th className="is-narrow">Department</th>
                    <td>College of Computer Studies</td>
                    <th>School Year</th>
                    <td colSpan="5" className="has-text-left">{schoolYear} - {parseInt(schoolYear) + 1}</td>
                </tr>
                <tr>
                    <th className="is-narrow">Course</th>
                    <td colSpan="">Bachelor of Science in Information Technology (BSIT)</td>
                    <th>Year</th>
                    <td colSpan="2">3</td>
                    <th className="is-narrow">Semester</th>
                    <td colSpan="2">1</td>
                </tr>
                <tr>
                    <th className="is-narrow">Subject</th>
                    <td>{sub.subject_name}</td>
                    <th colSpan="6" className="has-text-centered">Units</th>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>{sub.descr_1}</td>
                    <th>Lecture</th>
                    <td>{sub.units}</td>
                    <th>Lab</th>
                    <td>{hasSubjectLab(subject, sub.internal_code)}</td>
                    <th>Total</th>
                    <td>{hasSubjectLab(subject, sub.internal_code) + parseInt(sub.units)}</td>
                </tr>
            </Fragment>
        )
    }):"";
    var loadSelectSubject = subject?subject.filter(filt => filt.subject_type != 'C').map((subject,index)=>{
        return(
            <Fragment key={index}>
                <option value={subject.internal_code}>{subject.subject_name}</option>
            </Fragment>
        )
    }):"";
    var loadPrerequisites = requisites ? requisites.filter(filt => filt.internal_code == selectedSubject && filt.requisite_type == "P").map((pre, index)=>{
        var loadSubject = subject.filter(fil => fil.internal_code == pre.requisites).map((sub, i)=>{
            return(
                <Fragment>
                    <tr key={i}>
                        <td>{sub.subject_name}</td>
                        <td>{sub.descr_1}</td>
                        <td className="has-text-centered">{hasSubjectLab(subject, sub.internal_code) + parseInt(sub.units)}</td>
                        <td className="has-text-centered"><button className="is-small is-danger button" onClick={() => this.handleRemoveRequisite(sub.internal_code,"P")}>Remove</button></td>
                    </tr>
                </Fragment>
            )
        })
        return loadSubject
    }):""; 
    var loadCorequisites = requisites ? requisites.filter(filt => filt.internal_code == selectedSubject && filt.requisite_type == "C").map((pre, index)=>{
        var loadSubject = subject.filter(fil => fil.internal_code == pre.requisites).map((sub, i)=>{
            return(
                <Fragment>
                    <tr key={i}>
                        <td>{sub.subject_name}</td>
                        <td>{sub.descr_1}</td>
                        <td className="has-text-centered">{hasSubjectLab(subject, sub.internal_code) + parseInt(sub.units)}</td>
                        <td className="has-text-centered"><button className="is-small is-danger button" onClick={() => this.handleRemoveRequisite(sub.internal_code,"C")}>Remove</button></td>
                    </tr>
                </Fragment>
            )
        })
        return loadSubject
    }):""; 

    var loadHeader = year? year.map((year, index)=>{
        var loadSemester = semester ? semester.map((semester, index)=>{
            var totalUnits = 0;
            var countSummer = 0;
            var countRegular = 0;
            var loadSubjects = subjects? subjects.filter(fil => fil.year_level == year && fil.semester == semester && fil.subject_type != 'L').map((sub, i)=>{
                let labUnit = hasSubjectLab(subjects, sub.internal_code);
                totalUnits = labUnit + parseInt(sub.units)+ totalUnits;
                var countPrerequisite = 0;
                var countCorequisite = 0;
                var countCore = 0;
                var temp = null;
                var loadSummerSubjects = subjects.filter(f => f.semester != 3 && f.year_level == year).map((summer, i)=>{
                    countRegular++;
                });
                var loadSummerSubjects = subjects.filter(f => f.semester == 3 && f.year_level == year).map((summer, i)=>{
                    countSummer++;
                });
                var coloredPrerequisites = requisites.filter(f => f.internal_code == selectedSubject && f.requisites == sub.internal_code).map((color, a)=>{
                    if(color.requisite_type == "P")
                        countPrerequisite++;
                    if(color.requisite_type == "C")
                        countCorequisite++;
                });
                var getCorequisites = requisites ? requisites.filter(remark => remark.internal_code === sub.internal_code && remark.requisite_type == "C").map((rem, i) => {
                    countCore++;
                    return rem.subject_code;
               }) :"";
                var getPrerequisites = requisites ? requisites.filter(remark => remark.internal_code === sub.internal_code && remark.requisite_type == "P").map((rem, i) => {
                    return ( 
                        <span key={i} className="ml-1 tag">{rem.subject_code}</span>
                    )
               }) :"";
                return (
                    <Fragment>
                        <tr key={i} className={sub.internal_code == selectedSubject? "is-selected":(countPrerequisite > 0?"has-background-link-light":(countCorequisite > 0 ?"has-background-primary-light" : ""))}>
                            <td>{sub.subject_name}</td>
                            <td>{sub.descr_1}</td>
                            <td className="has-text-centered">{sub.units}</td>
                            <td className="has-text-centered">{labUnit}</td>
                            <td className="has-text-centered">{labUnit + parseInt(sub.units)}</td>
                            <td className="has-text-centered">{(countCore>0)?"Taken together with "+getCorequisites:getPrerequisites}</td>
                            <td className="has-text-centered">
                                {sub.internal_code == selectedSubject?(
                                    <button className="button is-small is-danger" onClick={this.handleDeSelectButton}>Deselect</button>
                                )
                                :( 
                                    selectedSubject?(
                                        countPrerequisite>0?(
                                            <button className="button is-small is-danger" onClick={() => this.handleRemoveRequisite(sub.internal_code,"P")}>Cancel</button>
                                        ):(
                                            countCorequisite > 0 ?(
                                                <button className="button is-small is-danger" onClick={() => this.handleRemoveRequisite(sub.internal_code,"C")}>Cancel</button>
                                            ):(
                                                
                                                <Fragment>
                                                        {
                                                            (getYear >= year && getYear!=year) ?(
                                                                <button className="button is-info is-small" onClick={() => this.handleAddRequisite(sub.internal_code,"P")}>Pre-requisite</button>
                                                            ): ""
                                                        }
                                                        {
                                                            (getYear == year && 1 ==semester && getSemester != semester) ?(
                                                                <button className="button is-info is-small" onClick={() => this.handleAddRequisite(sub.internal_code,"P")}>Pre-requisite</button>
                                                            ): ""
                                                        }
                                                        {(getYear == year && getSemester == semester)?(
                                                            <button className="button is-primary is-small" onClick={() => this.handleAddRequisite(sub.internal_code, "C")}>Co-requisite</button>
                                                        ):""}
                                                </Fragment>
                                            )
                                        )
                                    ):(
                                        <button className="button is-small is-info" onClick={() => this.handleSelectButton(sub.internal_code)}>Select</button>
                                    )
                                )}
                            </td>
                        </tr>
                    </Fragment>
                )
            }):"";

            
            /* var loadSummerSubjects = subjects.filter(f => f.semester == 3 && f.year == year ).map((summer, in)=>{}):""; */
            return (
                
                <Fragment>
                    {   (semester == 3 && countSummer != 0) &&
                        <div>
                            <div className="message-header">
                                <p className="has-text-weight-bold">{sem[semester]} {semester != 3?"Semester":""}</p>    
                            </div>
                            <div className="message-body p-0">
                                <div className="table-container">
                                    <table className="table is-striped is-fullwidth is-hoverable">
                                        <thead>
                                            <tr>
                                                <th className="is-narrow">Subject Code</th>
                                                <th>Descriptive Title</th>
                                                <th className="has-text-centered">Lec</th>
                                                <th className="has-text-ceFntered">Lab</th>
                                                <th className="has-text-centered">Total Units</th>
                                                <th className="has-text-centered">Pre-requisites</th>
                                                <th className="has-text-centered">{selectedSubject ? "Add To": "Action"}</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                                <td className="has-text-centered has-text-weight-bold ">{totalUnits}</td>                                  
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                        <tbody>   
                                            {loadSubjects}                                                                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
                    {   (semester != 3) &&
                        <div>
                            <div className="message-header">
                                <p className="has-text-weight-bold">{sem[semester]} {semester != 3?"Semester":""}</p>    
                            </div>
                            <div className="message-body p-0">
                                <div className="table-container">
                                    <table className="table is-striped is-fullwidth is-hoverable">
                                        <thead>
                                            <tr>
                                                <th className="is-narrow">Subject Code</th>
                                                <th>Descriptive Title</th>
                                                <th className="has-text-centered">Lec</th>
                                                <th className="has-text-ceFntered">Lab</th>
                                                <th className="has-text-centered">Total Units</th>
                                                <th className="has-text-centered">Pre-requisites</th>
                                                <th className="has-text-centered">{selectedSubject ? "Add To": "Action"}</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td colSpan="2" className="has-text-right has-text-weight-bold"> Total</td>
                                                <td className="has-text-centered has-text-weight-bold ">{totalUnits}</td>                                  
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                        <tbody>   
                                            {loadSubjects}                                                                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    }
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
    var loadSubjectList = subjects? subjects.filter(fil => fil.subject_type != "C" ).map((sub,index)=>{
        return (
            <Fragment>
                <tr key={index}>
                    <td>{sub.subject_name}</td>
                    <td>{sub.descr_1}</td>
                    <td>{sub.units}</td>
                    <td>{hasSubjectLab(subjects, sub.internal_code)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </Fragment>
        )
    }):"";
    var loadRequisitePanel = (
        <Fragment>
            <div className="column is-one-fifth">
                <h5 className="has-text-weight-bold mb-2 is-size-7">Search Subject</h5>                        
                <div className="field">
                    <div className="control">
                        <span className="is-fullwidth is-small">
                            <input className="input is-info is-small" type="text" placeholder="Year" onKeyDown={this.handleKeyDown}  onChange={this.handleSearchInput('search')}/>
                        </span>
                    </div>
                </div> 
            </div>  
        </Fragment>
    );
    var loadSubjectInfoPanel = selectedSubject?(
        <Fragment>
            <div className="columns">
                <div className="column is-one-fifth">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Switch to Equivalence</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <div className="field">
                                <input id="switchRoundedInfo" type="checkbox" name="switchRoundedInfo" className="switch is-rounded is-info" checked={switchEquivalence} name="switch" onChange={()=> this.handleSwitchButton(getSubjectDescription, getCourseCode)} />
                                <label for="switchRoundedInfo"></label>
                            </div>
                        </div>
                    </div> 
                </div>
                {switchEquivalence ? "" : loadRequisitePanel}
            </div>
        </Fragment>
    ):"";
    var loadSubjectInformation = selectedSubject?(
        <Fragment>
            <article className="message is-link m-0 pt-0">
                <div className="message-header pt-2 pb-2">
                    <p>Subject Information</p>                                                  
                </div>
                <div className="message-body p-0">
                    <div className="table-container mb-0">
                        <table className="table is-striped is-bordered is-hoverable is-fullwidth"> 
                            <tbody>
                                {loadSubjectInfo}
                            </tbody>
                        </table>
                    </div>
                </div>
            </article>
        </Fragment>
    ) :"";
    var loadSubjectEquivalence = subjectEquivalence? subjectEquivalence.filter(f => f.split_type == "S").map((subEquival, indx)=>{
        return(
            <Fragment>
                <tr key={indx}>
                    <td>{subEquival.subject_name}</td>
                    <td>{subEquival.descr_1}</td>
                    <td></td>
                    <td>{subEquival.curr_year}</td>
                    <td><button className="button is-small is-danger" onClick={()=>this.handleRemoveEquivalence(selectedSubject, subEquival.internal_code)}>Remove</button></td>                  
                </tr>
            </Fragment>
        )
    }):"";
    var loadRequisite = selectedSubject ? (
        <Fragment>
            <div className="columns">
                <div className="column is-small">
                    <div className="table-container is-size-7">
                        <div className="message-header">
                            <p className="has-text-weight-bold">Pre-requisite</p>    
                        </div>
                        <div className="message-body p-0">
                            <div className="table-container">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th className="has-text-centered is-narrow">Total Units</th>
                                            <th className="has-text-centered">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>    
                                        {loadPrerequisites? loadPrerequisites:(
                                            <tr><td colSpan="5" className="has-text-centered">No Data Found!</td></tr>
                                        )}                                                                                     
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="table-container is-size-7">
                        <div className="message-header">
                            <p className="has-text-weight-bold">Co-requisite</p>    
                        </div>
                        <div className="message-body p-0">
                            <div className="table-container">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                        <th>Subject</th>
                                            <th>Description</th>
                                            <th className="has-text-centered is-narrow">Total Units</th>
                                            <th className="has-text-centered">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        {loadCorequisites?loadCorequisites:""}                                                                                    
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
               <div className="column">
                    <div className="table-container is-size-7">
                        <div className="message-header">
                            <p className="has-text-weight-bold">Equivalence</p>    
                        </div>
                        <div className="message-body p-0">
                            <div className="table-container">
                                <table className="table is-striped is-fullwidth is-hoverable">
                                    <thead>
                                        <tr>
                                            <th className="is-narrow">Subject</th>
                                            <th className="has-text-centered">Description</th>
                                            <th className="has-text-centered">Course</th>
                                            <th className="has-text-centered">Year</th>
                                            <th className="has-text-centered">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        {loadSubjectEquivalence}                                                                             
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
            <hr></hr>
        </Fragment>
    ):"";

    // equivalence ? equivalence.filter(filter=> filter.split_type == "S").map((equival, index)
    // subjects.filter(f => f.internal_code != equival.internal_code).map((subEq, a)
    var loadEquivalence = equivalence ? equivalence.filter(filter=> filter.split_type == "S").map((equival, index)=>{
        var loadSubject = subjectEquivalence.filter(filt => filt.internal_code == equival.internal_code), countEquivalence = loadSubject.length;

        return (
            <Fragment>
                <tr key={index} className={this.handleCheckEquivalence(subjects,equival.internal_code)? 'is-hidden': ''}>
                    <td>{equival.subject}</td>
                    <td className="has-text-left">{equival.descr_1}</td>
                    <td className="has-text-centered">{equival.units}</td>
                    <td className="has-text-centered">{hasSubjectLab(equivalence, equival.internal_code)}</td>
                    <td className="has-text-centered">{hasSubjectLab(equivalence, equival.internal_code)+equival.units}</td>
                    <td className="has-text-centered">{equival.course}</td>
                    <td className="has-text-centered">{equival.curr_year}</td>
                    <td className="has-text-centered">
                    {countEquivalence > 0 ? 
                        <button className="button is-small is-danger" onClick={()=>this.handleRemoveEquivalence(selectedSubject, equival.internal_code)}>Cancel</button>
                        :<button className="button is-small is-info" onClick={()=>this.handleAddEquivalence(selectedSubject, equival.internal_code)}>Equivalence</button>
                    }
                        
                    </td>
                </tr>
            </Fragment>
        )
    }):"";
    var loadStudentCurriculum = (
        <Fragment>
            <div className="message-header">
                <p className="has-text-weight-bold">Bachelor of Science in Information Technology (BSIT)</p> 
                <p className="has-text-weight-bold has-text-right">{schoolYear} - {parseInt(schoolYear) + 1}</p>   
            </div>
            <div className="message-body p-0 mt-3">
                <div className="table-container">
                    {loadHeader}
                </div>
            </div>
        </Fragment>
    );
    var loadSearchedResults = searchedSubject ? searchedSubject.filter(filter=> filter.split_type == "S").map((search, index)=>{
        var found = false;
        var getRequisites = requisites ? requisites.filter(fil => fil.internal_code == selectedSubject && fil.requisites == search.internal_code).map((grequisite,i)=>{
            if( grequisite.requisite_type == "P"){
                found = true;
            }
        }):"";
        return (
            <Fragment>
                <tr key={index}>
                    <td>{search.subject}</td>
                    <td className="has-text-centered">{search.descr_1}</td>
                    <td className="has-text-centered">{hasSubjectLab(searchedSubject, search.internal_code)+search.units}</td>
                    <td className="has-text-centered">{search.course}</td>
                    <td className="has-text-centered">{search.curr_year}</td>
                    <td className="has-text-centered">{
                        (found? <button className="button is-small is-danger" onClick={() => this.handleRemoveRequisite(search.internal_code,"P")}>Cancel</button>: <button onClick={() => this.handleAddRequisite(search.internal_code,"P")} className="button is-small is-info">Pre-requisite</button>)
                    }</td>
                </tr>
            </Fragment>
        )
    }):"";
    var loadOtherCurriculum = (
        <Fragment>
            <div className="table-container is-size-7">
                <div className="message-header">
                    <p className="has-text-weight-bold">Search</p>    
                </div>
                <div className="message-body p-0">
                    <div className="table-container">
                        <table className="table is-striped is-fullwidth is-hoverable">
                            <thead>
                                <tr>
                                    <th className="">Subject</th>
                                    <th className="has-text-centered">Description</th>
                                    <th className="has-text-centered">Total Units</th>
                                    <th className="has-text-centered">Course</th>
                                    <th className="has-text-centered">Curriculum</th>
                                    <th className="has-text-centered">Add To</th>
                                </tr>
                            </thead>
                            <tbody> 
                             
                                    {loadSearchedResults}
                                                                                                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>
    ); 
    return (
      <Fragment>
          <div className="columns">
                <div className="column is-one-fifth">
                    <h5 className="has-text-weight-bold mb-2 is-size-7">Select Subject</h5>                        
                    <div className="field">
                        <div className="control has-icons-left">
                            <span className="select is-fullwidth is-small">
                                <select name="searchFilterCollege" onChange={inputChange('selectedSubject')}>
                                    <option value="">Select Subject</option>
                                    {loadSelectSubject}
                                </select>
                            </span>
                            <span className="icon is-small is-left">
                                
                            </span>
                        </div>
                    </div> 
                </div>
                
                <div className="column is-one-fifth">                    
                    <div className="field">
                        <div className="control has-icons-left mt-5">
                            <button className="button is-danger is-small" onClick={handleBackButton}>Back</button>
                        </div>
                    </div> 
                </div>
            </div>
            <hr></hr>
            <div className="columns">
                <div className="column is-fullwidth">
                    {loadSubjectInformation}
                </div>
            </div>
            {loadRequisite}
            {loadSubjectInfoPanel}
            <div className="columns">
                <div className="column is-fullwidth">
                    <div className="table-container is-size-7">
                        <div className="message">
                            {switchEquivalence != "checked"?
                            (searchedSubject == null ? loadStudentCurriculum:loadOtherCurriculum)
                            :(
                                <Fragment>
                                    <div className="table-container is-size-7">
                                        <div className="message-header">
                                            <p className="has-text-weight-bold">Equivalence</p>    
                                        </div>
                                        <div className="message-body p-0">
                                            <div className="table-container">
                                                <table className="table is-striped is-fullwidth is-hoverable">
                                                    <thead>
                                                        <tr>
                                                            <th className="s">Subject</th>
                                                            <th className="has-text-left">Description</th>
                                                            <th className="has-text-centered">Lec</th>
                                                            <th className="has-text-centered">Lec</th>
                                                            <th className="has-text-centered">Total Units</th>
                                                            <th className="has-text-centered">Course</th>
                                                            <th className="has-text-centered">Year</th>
                                                            <th className="has-text-centered">Add To</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody> 
                                                        {loadEquivalence}                                                                          
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
      </Fragment>
    );
  }
}
