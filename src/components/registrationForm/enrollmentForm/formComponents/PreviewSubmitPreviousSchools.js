import React, { Component, Fragment } from 'react';

export default class PreviewSubmitPreviousSchools extends Component {  
    handleButtonClick = e => {

    }
    render() {
        const { 
            educLevel, lastCourseCollege, schoolNameCollege, lastYearLevelCollege, schoolYearStartCollege, schoolYearEndCollege,lastStrandSecondary,selectedEntryStatusCollege,
            isSameCollege, isK12Secondary, schoolNameSecondary, lastYearLevelSecondary, schoolYearStartSecondary, schoolYearEndSecondary, schoolTypeSecondary, lrnNumberSecondary, escStudentNumSecondary, escSchoolNumSecondary,
            isSameSecondary, schoolNamePrimary, lastYearLevelPrimary, schoolYearStartPrimary, schoolYearEndPrimary, schoolTypePrimary, lrnNumberPrimary, escStudentNumPrimary, escSchoolNumPrimary
        } = this.props;
        const College = (
            <Fragment>
                <div className="columns mb-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">College / University</th></tr>
                            </thead>
                        </table>  
                    </div>
                    <div className="column is-1 is-hidden-mobile"></div>
                </div>
                <div className="columns mt-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">                                           
                            <tbody>
                                <tr>
                                    <th className="is-narrow">Last Course Attended</th><td>{lastCourseCollege.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">School Name</th><td>{schoolNameCollege.toUpperCase()}</td>                                                    
                                </tr>                                
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                            
                    </div>                
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>                                
                                <tr>
                                    <th className="is-narrow">Last Year Level</th><td>{lastYearLevelCollege}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">School Year</th><td>{schoolYearStartCollege + " - " + schoolYearEndCollege}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                            
                    </div>                                       
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
        const Secondary = (
            <Fragment>
                <div className="columns mb-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">Secondary School</th></tr>
                            </thead>
                        </table>  
                    </div>
                    <div className="column is-1 is-hidden-mobile"></div>
                </div>   
                <div className="columns">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column">                                                                                                                                                                                                                                                                                                                                                                                                        
                        <table className="table is-fullwidth">                                          
                            <tbody>
                                <tr>
                                    <th className="is-narrow">School Name</th><td>{schoolNameSecondary.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Last Year Level</th><td>{lastYearLevelSecondary}</td>                                                    
                                </tr>                                
                                <tr>
                                    <th className="is-narrow">Last Strand</th><td>{lastStrandSecondary.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">School Year</th><td>{schoolYearStartSecondary + " - " + schoolYearEndSecondary}</td>                                                    
                                </tr>  
                            </tbody>
                        </table>
                    </div>                 
                    <div className="column">                                                                                                                                                                                                                                                                                                                                                                                                        
                        <table className="table is-fullwidth">                                          
                            <tbody>                               
                                <tr>
                                    <th className="is-narrow">School Type</th><td>{schoolTypeSecondary.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">LRN</th><td>{lrnNumberSecondary}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">ESC Student #</th><td>{escStudentNumSecondary}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">ESC School #</th><td>{escSchoolNumSecondary}</td>                                                    
                                </tr>                                
                            </tbody>
                        </table>
                    </div>                                                        
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
        const Primary = (
            <Fragment>
                <div className="columns mb-0">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">    
                            <thead>
                                <tr><th colSpan="2" className="has-text-centered">Primary School</th></tr>
                            </thead>
                        </table>  
                    </div>
                    <div className="column is-1 is-hidden-mobile"></div>
                </div>   
                <div className="columns">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column">                                                                                                                                                                                                                                                                                                                                                                                                        
                        <table className="table is-fullwidth">                                          
                            <tbody>
                                <tr>
                                    <th className="is-narrow">School Name</th><td>{schoolNamePrimary.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Last Year Level</th><td>{lastYearLevelPrimary}</td>                                                    
                                </tr>                                
                                <tr>
                                    <th className="is-narrow">School Year</th><td>{schoolYearStartPrimary + " - " + schoolYearEndPrimary}</td>                                                    
                                </tr>  
                            </tbody>
                        </table>
                    </div>                 
                    <div className="column">                                                                                                                                                                                                                                                                                                                                                                                                        
                        <table className="table is-fullwidth">                                          
                            <tbody>                               
                                <tr>
                                    <th className="is-narrow">School Type</th><td>{schoolTypePrimary.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">LRN</th><td>{lrnNumberPrimary}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">ESC Student #</th><td>{escStudentNumPrimary}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">ESC School #</th><td>{escSchoolNumPrimary}</td>                                                    
                                </tr>                                
                            </tbody>
                        </table>
                    </div>                                                        
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
        let ShowPanels = "";
        if(educLevel === "col") {
            ShowPanels = (
                <Fragment>
                    {selectedEntryStatusCollege !== "freshman" ? College : ""}
                    {Secondary}
                    {Primary}
                </Fragment>
            );
        }
        if(educLevel === "shs") {
            ShowPanels = (
                <Fragment>
                    {Secondary}
                    {Primary}
                </Fragment>
            );
        }
        if(educLevel === "jhs" || educLevel === "bed") {
            ShowPanels = (
                <Fragment>
                    {educLevel === "jhs" && ["7","8", "9", "10"].includes(lastYearLevelSecondary) ? Secondary : "" }
                    {Primary}
                </Fragment>
            );
        }
        return(
            <Fragment> 
                <div>
                    <div className="divider is-size-6">Previous School Details</div>
                </div>
                {ShowPanels}               
            </Fragment>
        );
    }

}