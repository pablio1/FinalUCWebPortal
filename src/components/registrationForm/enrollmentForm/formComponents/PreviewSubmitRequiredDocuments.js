import React, { Component, Fragment } from 'react';

export default class PreviewSubmitRequiredDocuments extends Component {  
    handleButtonClick = e => {

    }
    render() {
        const { 
            SelectedFilesDetails
        } = this.props;
        const filesRows = SelectedFilesDetails.length > 0 ? SelectedFilesDetails.map((file, index) =>
            <tbody key={index}>
                <tr>
                    <th className="is-narrow">Document</th><td>{": " + file.data.type}</td>                                                    
                </tr> 
                <tr>
                    <th className="is-narrow">Filename</th><td style={{ maxWidth: "100px", wordWrap: "break-word" }}>{": " + file.data.filename}</td>                                                    
                </tr>
                <tr>
                    <th className="is-narrow" colSpan="2"></th>                                                    
                </tr>     
            </tbody>
        ) : (
            <tbody>
                <tr>
                    <th className="is-narrow">No Document(s) Attached</th>                                                 
                </tr>                   
            </tbody>
        );
        return(
            <Fragment> 
                <div className="">
                    <div className="divider is-size-6">Required Documents Attached</div>
                </div>
                <div className="columns is-vcentered">
                    <div className="column is-1 is-hidden-mobile"></div>
                    <div className="column"> 
                        <table className="table is-fullwidth">                                           
                            {filesRows}                                
                        </table>                                                                                                                                                                                                                                                                                                               
                    </div>                                                                 
                    <div className="column is-1 is-hidden-mobile"></div>                                           
                </div>                
            </Fragment>
        );
    }

}