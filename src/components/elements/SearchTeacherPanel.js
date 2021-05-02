import React, { Component, Fragment } from 'react';
//import Select from 'react-select';
import SelectSearch from 'react-select-search';

import { isValidDate } from '../../helpers/helper';

export default class SearchTeacherPanel extends Component {
    handleOnchangeInput = e => {
        if(e.target.name === "id_number") {
            if(/^[0-9 _]*$/.test(e.target.value)) { 
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            }
        } 
        else {
            this.props.handleOnchangeInput(e.target.name, e.target.value);
        }   
    }
    handleOnchangeSelect = e => {
        this.props.handleOnchangeInput("id_number", e ? e : "");
    }
    handleKeyDown = e => {
        if (e.key === 'Enter') {
            if(e.target.name === "date" && e.target.value !== "") {
                if(isValidDate(e.target.value)) this.props.handleOnSearchEvent(e);
                else alert("Please enter a valid date.") 
            } 
            else this.props.handleOnSearchEvent(e);
        }
    }
    render() {        
        const { searcheables, teacherList } = this.props;
        const sanitizedTeachersList = teacherList ? teacherList.map((teacher, index) => {
            return { value: teacher.id_number, name: teacher.last_name + ", " + teacher.first_name }
        }) : [];
          
        return(  
            <Fragment>    
                <div className="columns is-vcentered">                             
                    <div className="column mb-2 mt-0 mb-0"> 
                        <h5 className="has-text-weight-bold is-size-6 mb-1 pb-0">Search by ID Number</h5>
                        <div className="field">
                            <p className="control has-icons-left">                                                    
                                <input name="id_number" className="input" type="text" placeholder="Enter ID Number" 
                                        value={searcheables.id_number} onChange={this.handleOnchangeInput} onKeyDown={this.handleKeyDown} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                            </p>
                        </div>                                                                                                                                                                                                                                                                    
                    </div> 
                    <div className="column mb-2 mt-0 mb-0"> 
                        <h5 className="has-text-weight-bold is-size-6 mb-1 pb-0">Search by Name</h5> 
                        <SelectSearch
                            className="select-search"
                            options={sanitizedTeachersList}
                            search
                            value={searcheables.id_number}
                            name="name"
                            placeholder="Select Teacher"
                            onChange={this.handleOnchangeSelect}
                        />   
                        {/*<div className="field">
                            <p className="control has-icons-left">                                                    
                                <input name="name" className="input" type="text" placeholder="Enter Name" 
                                        value={searcheables.name} onChange={this.handleOnchangeInput} onKeyDown={this.handleKeyDown} />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                            </p>
                        </div>  
                                    
                        <Select
                            onChange={this.handleOnchangeSelect}
                            options={sanitizedTeachersList}   
                            isDisabled={teacherList ? false : true}
                            isLoading={teacherList ? false : true}
                            isClearable={true}
                            isSearchable={true} 
                            name="name"     
                            defaultValue={searcheables.id_number}                    
                        /> */} 
                    </div>                                                                                              
                </div>     
            </Fragment> 
        )
    }
}