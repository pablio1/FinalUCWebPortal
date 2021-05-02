import React, { Component } from "react";

import UCLogo128x128 from "../../assets/sysimg/uc-logo-128x128.png"
import MainForm from "./MainForm";

export default class Wrapper extends Component {
    
    render() {
        const { regtype } = this.props.match.params;

        return (
            <section id="registration" className="hero is-fullheight landing-page-body">      
                <div className="hero-body p-4 m-0">
                    <div className="container">                 
                        <div className="box pt-0">                   
                            <div className="section mx-0 mt-0 mb-0 px-0 pt-0 pb-0" style={{ height:"110px" }}>
                                <div className="level" >
                                    <div className="image is-96x96 is-pulled-left">
                                        <img src={UCLogo128x128} alt="" />
                                    </div>                   
                                    <div className="is-pulled-right pt-5" style={{ height:"96px" }}>                                
                                        <h2 className="title">Admission</h2>
                                    </div>
                                </div>    
                            </div> 
                            <MainForm regtype={regtype} />
                        </div>
                    </div>
                </div> 
            </section>
        );
    }
}