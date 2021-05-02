import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { getLoggedUserDetails } from '../../helpers/helper';
import ClassListBySection from './ClassListBySection';


class ClassList extends Component {
    state = {
        selectedTab: "bySchedule"
    }
    handleOnClickTab = e => {
        this.setState({
            selectedTab: e,
        });
    }
    handleOnChangeInput = e => {
        if(e.target.name === "searchEdpCodes") {
            if(/^[0-9 _ ,]*$/.test(e.target.value)) {
                this.props.handleOnchangeInput(e.target.name, e.target.value);
            } 
        }
        else this.props.handleOnchangeInput(e.target.name, e.target.value);        
    }
    handleKeyDown = e => {     
        if (e.key === 'Enter') {            
            this.props.handleOnSearchEvent(e);
        }
    }
    render() {
        if (!["ADMIN", "EDP", "DEAN", "CHAIRPERSON", "COOR", "ACAD", "LINKAGE"].includes(getLoggedUserDetails("usertype") )) {
            return <Redirect to="/login" />;
        }
        const { selectedTab } = this.state;
        const loadClassListBySection = (
            <ClassListBySection />
        );
        return (
            <div className="box ml-1"> 
                <div className="buttons has-addons is-centered">                
                    <button name="bySchedule" className={"button " + (selectedTab === "bySchedule" ? "is-info is-selected" : "")} 
                            onClick={() => this.handleOnClickTab("bySchedule")}>
                        <span className="icon is-small">
                            <i className="far fa-calendar-alt"></i>
                        </span>
                        <span>By Schedule</span>
                    </button>
                    <button name="bySection" className={"button " + (selectedTab === "bySection" ? "is-info is-selected" : "")}
                            onClick={() => this.handleOnClickTab("bySection")}>
                        <span className="icon is-small">
                            <i className="far fa-list-alt"></i>
                        </span>
                        <span>By Section</span>
                    </button>                       
                </div> 
                <div className="">
                    <div className="divider is-size-6 mt-0 pt-0"></div>
                </div> 
                {selectedTab === "bySection" ? loadClassListBySection : ""}                          
            </div>       
        );
    }
}

export default withRouter(ClassList)

export class ClassListHeader extends Component {
    render() {
        return(
            <div className="title is-4 ml-1">
                <i className="fas fa-clipboard-list"></i> Class List
            </div> 
        )
    }
    
}