import React, { Component, Fragment } from 'react';
import DefaultAvatar from '../../../../assets/sysimg/user.png';

export default class PreviewSubmitCourses extends Component {  

    componentDidMount = () => {
        
        
        
    }
    handleButtonClick = e => {
        
    }
    render() {
        const { values, SelectedFiles } = this.props;
        const loadClassification = { H: "NEW STUDENT", O: "OLD STUDENT", T: "TRANSFEREE", C: "CROSS ENROLLEE", R: "RETURNEE"  };      
        const idPicFile = SelectedFiles.filter(file => file.slug_id === "idpic");
        const imgSrc = idPicFile.length > 0 ? URL.createObjectURL(idPicFile[0].file) : DefaultAvatar;
        console.log(values)
        let {formTitle, tableBody} = "";    
        if(values.educLevel === "col") {
            formTitle = "Name, Course and Status";
            tableBody = (
                <tbody>
                    <tr><th className="is-narrow">College</th><td>{values.selectedCollege.toUpperCase()}</td></tr>
                    <tr><th className="is-narrow">Course</th><td>{values.selectedCourse}</td></tr>
                    <tr><th className="is-narrow">Entry Status</th><td>{loadClassification[values.selectedEntryStatusCollege]}</td></tr>
                    <tr><th className="is-narrow">Year Level</th><td>{values.selectedYearLevelCollege}</td></tr>
                </tbody>
            );
        }
        else if(values.educLevel === "shs") {
            formTitle = "Name, Strand and Status";   
            tableBody = (
                <tbody>
                    <tr><th className="is-narrow">Strand</th><td>{values.selectedStrand}</td></tr>
                    <tr><th className="is-narrow">Year Level</th><td>{values.selectedYearLevelSecondary}</td></tr>
                    <tr><th className="is-narrow">Session</th><td>{values.selectedSessionSecondary}</td></tr>
                    <tr><th className="is-narrow">Entry Status</th><td>{loadClassification[values.selectedEntryStatusSecondary]}</td></tr>
                </tbody>
            );         
        }
        else  {
            formTitle = "Name, Grade Level and Status"; 
            tableBody = (
                <tbody>
                    <tr><th className="is-narrow">Grade Level</th><td>{values.educLevel === "jhs" ? values.selectedYearLevelSecondary : values.selectedGradeLevel}</td></tr>
                    <tr><th className="is-narrow">Entry Status</th><td>{loadClassification[values.educLevel === "jhs" ? values.selectedEntryStatusSecondary : values.selectedEntryStatusPrimary]}</td></tr>
                </tbody>
            );             
        }
        return(
            <Fragment>
                <div className="">
                    <div className="divider is-size-6">{formTitle}</div>
                </div>
                <div className="columns">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column is-narrow is-hcenter"> 
                        <figure className="image is-128x128 has-background-light p-2">
                            <img id="idPic" className="" src={imgSrc} alt="" style={{ width:"128px", height: "auto"  }} />
                        </figure>                                                                                                                                                                                                                                                                                                                                                       
                    </div> 
                    <div className="column"> 
                        <table className="table is-fullwidth">                                            
                            <tbody>
                                <tr>
                                    <th className="is-narrow">First Name</th><td>{values.firstName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Middle Name</th><td>{values.middleName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Last Name</th><td>{values.lastName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Name Suffix</th><td>{values.suffixName.toUpperCase()}</td>                                                    
                                </tr>
                                <tr>
                                    <th className="is-narrow">Verified Email</th><td>{values.email}</td>                                                    
                                </tr>
                            </tbody>
                        </table>                                                                                                                                                                                                                                                                                                                                                      
                    </div>  
                    <div className="column">
                        <table className="table is-fullwidth">                                            
                            {tableBody}
                        </table>          
                        {/*
                        <a 
                            className="button is-primary is-fullwidth"
                            onClick={this.handleButtonClick}                                                
                        >                    
                            <span className="icon">
                                <i className="fas fa-edit"></i>
                            </span>                            
                            <span>Edit</span>                            
                        </a>
                        */}                                                                                                                                                                                                                                                                       
                    </div>                                          
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>
            </Fragment>
        );
    }

}