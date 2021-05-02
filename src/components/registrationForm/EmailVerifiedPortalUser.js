import React, { Component } from 'react';
import PromptSuccess from '../elements/PromptSuccess';

export default class EmailVerified extends Component {

    render() {
        return(      
            <div className="section mt-0 pt-0">
                <div className="columns">
                    <div className="column pt-0"> 
                        <PromptSuccess />
                        <h3 className="subtitle has-text-centered">
                            Email Account Verified!
                        </h3>
                        <div className="">
                            <div className="divider is-size-6"></div>
                        </div>
                        <div className="" style={{ /*width: "94%"*/ }}>
                            <div className="columns">
                                <div className="column is-3"></div>
                                <div className="column has-text-centered"> 
                                    <h3 className="mb-4 has-text-centered">
                                        You can now proceed to access your portal account.                                                  
                                    </h3> 
                                    <a 
                                        className="button is-info"
                                        href="/"                            
                                    >
                                        <span>Sign In Now</span>
                                    </a>                                                                                                                                                                                                                                                                                                            
                                </div> 
                                <div className="column is-3"></div>                                           
                            </div>
                        </div>
                        <div>
                            <div className="divider is-size-6"></div>
                        </div>
                        <nav className="level">
                            <div className="level-left mb-0 pb-0">
                                
                            </div>
                            <div className="level-right mt-1 pt-0">
                                
                            </div>  
                        </nav>                                                                
                    </div>
                </div> 
            </div>                                  
        )
    }
}
