import React, { Component } from "react";

import UCLogo160x83 from "../../assets/sysimg/uc-logo-bg-160x83.png";

export default class ERR404Outside extends Component {

    render() {
        const { msg } = this.props.match.params;
        return (
            <section className="hero is-fullheight landing-page-body">
                <div className="hero-body">        
                    <div className="container has-text-centered">
                        <div className="column is-4 is-offset-4">                                                  
                            <div className="box">
                                <figure className="avatar my-1">
                                    <img src={UCLogo160x83} alt="" />
                                </figure>
                                <div>                                    
                                    <h1 class="title">ERROR 404</h1>
                                    <h2 class="subtitle">{msg}</h2>
                                </div>                      
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}