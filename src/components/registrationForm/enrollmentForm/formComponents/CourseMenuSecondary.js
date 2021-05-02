import React, { Component } from 'react';
import SelectStrand from '../../../elements/SelectStrand';
import SelectGradeLevel from '../../../elements/SelectGradeLevel';

export default class CourseMenuSecondary extends Component { 
    state = {
        modalOpen: false
    }   
    handleOnChangeInput = e => {     
        this.props.handleOnChangeInput(e);
    }
    closeModal = () => {
        this.setState({ modalOpen: false });
    }
    openModal = () => {
        this.setState({ modalOpen: true });
    }
    render() { 
        const { values, isOldStudent } = this.props;  
        const { modalOpen } = this.state;
        const modalContentStatusHelp = (
            <article className="message">
                <div className="message-header">
                    <p>Entry Status Legend</p>
                    <button className="delete" aria-label="delete" onClick={this.closeModal}></button>
                </div>
                <div className="message-body">
                    <p><strong>New Student</strong> - New student whos starting his/her College or Basic Education schooling.</p>
                    <p><strong>Old Student</strong> - Continuing student who's enrolled in the previous semester (College/ Senior High) or previous school year (Junior High/ Elementary).</p>
                    <p><strong>Returnee</strong> - Students who stopped schooling for one or more semester/ school year and wish to return to school.</p>
                    <p><strong>Transferee</strong> - Student from other school and campus who wish to transfer to our campus.</p>
                    <p><strong>Cross Enrolee</strong> - Student from other UC campus who wish to take credits/subjects from our campus.</p>
                    <p><strong>Shiftee</strong> - Student who wish to shift into a different course/strand.</p>
                </div>
            </article>
        );   
        const yearLevels = (values.educLevel === "shs") ? (
                <div className="control is-expanded has-icons-left">
                    <span className="select is-fullwidth">
                        <select name="selectedYearLevelSecondary" value={values.selectedYearLevelSecondary} 
                                onChange={this.handleOnChangeInput} required data-fieldname="Year Level">
                            <option value="">Select Year</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </span>
                    <span className="icon is-small is-left">
                        <i className="fas fa-bars"></i>
                    </span>
                </div>
        ) : (
            <SelectGradeLevel 
                name="selectedYearLevelSecondary"
                value={values.selectedYearLevelSecondary}
                educLevel={values.educLevel}
                required={true}
                fieldname="Grade Level"
                term={values.term}
                handleOnChangeInput={this.handleOnChangeInput}
            />
        );
        const strands = (values.educLevel === "shs") ? (
            <div className="column"> 
                <h3 className="has-text-weight-bold mb-2">Open Strands</h3>
                <div className="field">
                    <SelectStrand 
                        name="selectedStrand"
                        value={values.selectedStrand}
                        educLevel={values.educLevel}
                        required={true}
                        fieldname="Strand"
                        term={values.term}
                        handleOnChangeInput={this.handleOnChangeInput}
                    />
                </div>                                                                                                                                                                                                                        
            </div>  
        ) : ""; 
        const loadSession = values.educLevel === "shs" ? (
            <div className="column"> 
                <h3 className="has-text-weight-bold mb-2">Session</h3>
                <div className="field">
                    <p className="control is-expanded has-icons-left">
                        <span className="select is-fullwidth">
                            <select name="selectedSessionSecondary" value={values.selectedSessionSecondary} 
                                    onChange={this.handleOnChangeInput} required data-fieldname="Session">
                                <option value="">Select Session</option>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </span>
                        <span className="icon is-small is-left">
                            <i className="fas fa-book"></i>
                        </span>
                    </p>
                </div>                                                                                                                                                                                                                        
            </div> 
        ) : "";
        
        return(
            <div className="" style={{ /*width: "94%"*/ }}>
                <div className={"modal " + (modalOpen ?  "is-active " : "")}>
                    <div className="modal-background" onClick={this.closeModal}></div>
                    <div className="modal-content">
                        {modalContentStatusHelp}    
                    </div>
                </div> 
                <div className="columns is-vcentered">     
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-3 pt-0">{(values.educLevel === "shs") ? "Year Level" : "Open Grade Level"}</h3>
                        <div className="field">
                        {yearLevels}
                        </div>                                                                                                                                                                                                                                                           
                    </div>                                       
                    {strands}
                    {loadSession}
                    <div className="column"> 
                        <h3 className="has-text-weight-bold mb-3 pt-0">Your Entry Status <span className="tag is-info is-clickable" onClick={this.openModal}>Help (?)</span></h3>
                        <div className="field">
                            <p className="control is-expanded has-icons-left">
                                <span className="select is-fullwidth">
                                    <select name="selectedEntryStatusSecondary" value={values.selectedEntryStatusSecondary} 
                                            onChange={this.handleOnChangeInput} required data-fieldname="Entry Status">
                                        <option value="">Select Status</option>
                                        {isOldStudent ? "" : <option value="H">New Student</option>}
                                        {isOldStudent ? <option value="O">Old Student</option> : ""}
                                        {isOldStudent ? <option value="R">Returnee</option> : ""}
                                        {isOldStudent ? "" : <option value="T">Transferee</option>}
                                        {isOldStudent ? "" : <option value="C">Cross Enrolee</option>}
                                        {isOldStudent ? <option value="S">Shiftee</option> : ""}                                        
                                    </select>
                                </span>
                                <span className="icon is-small is-left">
                                    <i className="fas fa-chalkboard-teacher"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                           
                    </div>                             
                </div>
            </div>
        );
    }

}