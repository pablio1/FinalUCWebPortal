import React, { Component,Fragment } from 'react';
import { convertTabToYear, getLoggedUserDetails } from '../../helpers/helper';
export default class ProspectusTabs extends Component {
    state = {
        selectedTab: null
    }
    componentDidMount = () => {
        this.setState({selectedTab: getLoggedUserDetails("yearlevel")});
    }
    handleOnClickTab = (tab, value) => {
        const{selectedTab} = this.state;
        this.setState({
            selectedTab : tab
        })
        this.props.handleOnClickTab(tab, value);
        console.log("checkTab",selectedTab);
    }
    getTotalBehind = (yearlevel) =>{
        const {subjects, grades} = this.props;
        var countSubject = 0;
        var countGrade = 0;
        //var loadTest = subjects ? subjects.filter(filt => filt.year_level == yearlevel && filt.subject_type != 'L'):"";
        var loadSubject = subjects ? subjects.filter(filt => filt.year_level == yearlevel && filt.subject_type != 'L').map((sub, index) =>{
            countSubject++;
             var loadGrade = grades? grades.filter(fil => fil.internal_code == sub.internal_code).map((grade, key)=>{
                if(grade.final_grade < 3)
                countGrade++;
            }) :""; 
        }) : "";
        //var getValue = countSubject - countGrade;
        //console.log("Load Test", loadTest);
        return Math.abs(countSubject-countGrade);
    }
  render() {
    const {first, second, third, fourth, all, totalBehind, years,semesters} = this.props;
    const {selectedTab} = this.state;
    const yearLevel = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];
    const sem  = ['', 'First', 'Second','Summer'];
    
    var loadTabs = years? years.map((year, index)=>{
        return(
            <Fragment key={index}>
                <button name="pending" className={"button " + (selectedTab == year ? "is-info is-selected" : "")} onClick={() => this.handleOnClickTab(year, first)}>
                    <span className="icon is-small">
                        <i className="fas fa-book is-success"></i>
                    </span>
                    <span>{yearLevel[year]} Year</span>
                    {
                        (this.getTotalBehind(year) > 0 && getLoggedUserDetails("yearlevel") > year) ? 
                        (<span className="tag is-danger ml-3">{this.getTotalBehind(year)}</span>) : ""
                    }
                </button>
            </Fragment>
        )
    }):"";
    return (
      <Fragment>
        
            <div className="buttons has-addons is-centered">                
                {loadTabs}
                <button name="approved" className={"button "+(selectedTab === "all"? "is-info is-selected":"")} onClick={() => this.handleOnClickTab("all", all)}>
                    <span className="icon is-small">
                        <i className="fas fa-book"></i>
                    </span>
                    <span>View All</span>
                </button>
                <button name="approved" className="button ml-5">
                    <span className="icon is-small">
                        <i className="fas fa-print"></i>
                    </span>
                    <span>Print</span>
                </button>
            </div>  
      </Fragment>
    );
  }
}
