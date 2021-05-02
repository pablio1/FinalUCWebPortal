import React, { Component, Fragment } from "react";
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import store from 'store2';
import isLoggedIn from '../../helpers/isLoggedIn';

import UCLogo160x83 from '../../assets/sysimg/uc-logo-bg-160x83.png';
import UCLogo160x83NoBg from '../../assets/sysimg/uc-logo-no-bg-160x83.png';
import SpinnerGif from '../../assets/sysimg/spinner.gif'
import DefaultAvatar from '../../assets/sysimg/user.png';
import NotificationBell from '../../components/elements/NotificationBell';

import { ERR404, ERR404Header } from '../ERR404';
import { Notifications, NotificationsHeader, Notification } from '../Notifications';
import { Dashboard, DashboardHeader } from '../Dashboard';
import { Enrollment, EnrollmentHeader, EnrollmentSubHeader } from '../Enrollment';
import DeanEvaluation from '../../components/enrollment/DeanEvaluation';
import DeanRegistration from '../../components/enrollment/DeanRegistration';
import DeanSubjects from '../../components/enrollment/DeanSubjects';
import DeanPromissory from '../../components/enrollment/DeanPromissory';
import DeanAdjustments from '../../components/enrollment/DeanAdjustments';
import StudentEnrollmentTracker from '../../components/enrollment/StudentEnrollmentTracker';
import RegistrarRegistration from '../../components/enrollment/RegistrarRegistration';
import PaymentCheckCashier from '../../components/enrollment/PaymentCheckCashier';
import PaymentSetAccounts from '../../components/enrollment/PaymentSetAccounts';
import Schedules, { SchedulesHeader } from '../Schedules';
import SchedulesView, {SchedulesViewHeader } from '../Schedules/SchedulesView';
import StudyLoadStudent, { StudyLoadHeader } from '../StudyLoad/Student';
import StudyLoadStaff from '../StudyLoad/Staff';
import TeachersLoad, { TeachersLoadHeader } from '../TeachersLoad';
import ClassList, { ClassListHeader } from '../ClassList';
import Reports, { ReportsHeader } from '../Reports';
import AdminTools, { AdminToolsHeader } from '../AdminTools';
import Assessment, { AssessmentHeader } from '../Assessment';
import Promissory, { PromissoryHeader } from '../Assessment/Promissory';
import Payment, { PaymentHeader } from '../Assessment/Payment';
import Egrade, { EgradeHeader } from '../Egrade';
import Profile, { ProfileHeader } from '../Profile';

import { Prospectus, ProspectusHeader } from '../Prospectus';
import { RequestSubjects, RequestSubjectHeader } from '../Requests';
import {BehindSubject, BehindSubjectHeader} from '../Prospectus/BehindSubject';
import {Suggestion,SuggestionHeader} from '../Prospectus/Suggestion';
import { Curriculum, CurriculumHeader } from '../Curriculum';

import { userModulesPermission } from '../../helpers/configObjects';
import { getLoggedUserDetails, convertTermToReadable } from '../../helpers/helper';


class Layout extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.state = {
            notifications: null, activateBurger: false, avatarPath: null, navItemsExpand: null, selectedTerm: '', isPageLoading: true
        }
    }
    componentDidMount() {
        if (isLoggedIn()) {
            const data = {
                id_number: getLoggedUserDetails("idnumber")
            };
            const headers = { 
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + store.get("token")
            };
            axios.post(process.env.REACT_APP_API_UC_NOTIFICATIONS, data, {headers})
            .then((result) => {
                const notifications = result.data.notifications;
                this.setState({ notifications: notifications });
            }); 
            if(getLoggedUserDetails("usertype") === "STUDENT") {
                this.setState({ 
                    avatarPath: getLoggedUserDetails("avatar") ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + getLoggedUserDetails("avatar") : ""
                });
            }
            let navItemsExpand = {};
            const navItems = userModulesPermission(getLoggedUserDetails("usertype")).modules;
            for(let i=0; i < navItems.length; i++) {
                navItemsExpand[navItems[i].slug] = false;
            }    
            this.setState({ 
                navItemsExpand: navItemsExpand,
                isPageLoading: false            
            }); 
        }
    }
    handleLogout = history => () => {
        const { cookies } = this.props;
        //Local Storage
        store.remove('token');
        //store.remove('loggedIn');
        store.remove('loggeduser');
        //Cookies not implemented, Local Storage is used instead
        cookies.remove('selterm', { path: '/' });
        /*cookies.remove('idnumber', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('usertype', { path: '/' });
        cookies.remove('fullname', { path: '/' });
        cookies.remove('courseyear', { path: '/' });
        cookies.remove('coursecode', { path: '/' });
        cookies.remove('courseabbr', { path: '/' });
        cookies.remove('yearlevel', { path: '/' });
        cookies.remove('studenttype', { path: '/' }); */
        //cookies.remove('loggedIn', { path: '/' });
        
        history.push('/login');
    }
    readAllNotifications = history => () => {
        const data = {
            id_number: getLoggedUserDetails("idnumber"),
            notif_id: 0
        };
        const headers = { 
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + store.get("token")
        };
        axios.post(process.env.REACT_APP_API_UC_READ_NOTIFICATION, data, {headers})
        .then(response => {
            if(response.data.success) {
                alert("All Notifications are marked as read!");
            } 
        }, history.go(0));  
    }
    toggleBurger = () => {
        const { activateBurger } = this.state;
        this.setState({ activateBurger : !activateBurger });
    }
    handleOnCollapseExpand = e => {
        if(e) {
            let prevNavItemsExpand = this.state.navItemsExpand;
            prevNavItemsExpand[e] = !prevNavItemsExpand[e]
            this.setState({
                navItemsExpand: prevNavItemsExpand
            });
        }
    }
    handleOnchangeInput = e => {
        if(e.target.name === "selectTerm") {
            this.setState({ 
                isPageLoading: true            
            }, () => {
                const { cookies, history } = this.props;
                cookies.set("selterm", e.target.value, { path: '/' });
                history.push("/enrollment");
                //window.location.reload();
                this.setState({ isPageLoading: false });
            });      
        }
    }
    handleOnClickTermNav = e => {
        this.setState({ 
            isPageLoading: true            
        }, () => {
            const { cookies } = this.props;
            cookies.set("selterm", e, { path: '/' });
            window.location.reload();
        });      
    }
    render(){
        if (!isLoggedIn()) {
            return <Redirect to="/login" />;
        }
        const { history, cookies } = this.props;
        const { notifications, activateBurger, avatarPath, navItemsExpand, isPageLoading } = this.state;
        const unreadNotifications = notifications ? notifications.filter(item => item.read === 0) : [];
        const currentUserType = getLoggedUserDetails("usertype");
        const selectedTerm = cookies.get("selterm");
        
       
        const currentTerm = getLoggedUserDetails("activeterms").substring(0,5);
        const currentActiveTerms = getLoggedUserDetails("hasactiveterm").length > 5 ? getLoggedUserDetails("hasactiveterm").split(",") : [getLoggedUserDetails("hasactiveterm")];
        let arrTerms = ""; 
        if(currentUserType === "STUDENT") {
            arrTerms = getLoggedUserDetails("activeterms").substring(6); //Remove first (current) term
            // REACT_APP_EARLY_ENROLLMENT values 1 - last advance term only, 2 - parallel two advance terms, 3 - first advance term only
            if(process.env.REACT_APP_EARLY_ENROLLMENT === "1") arrTerms = arrTerms.split(",").slice(1);
            if(process.env.REACT_APP_EARLY_ENROLLMENT === "2") arrTerms = arrTerms.split(",");
            if(process.env.REACT_APP_EARLY_ENROLLMENT === "3") arrTerms = arrTerms.split(",").slice(0, -1);
            //if(getLoggedUserDetails("classification") === "H") arrTerms = currentActiveTerms; //For new students; only current enrolled term
            //else arrTerms = [currentTerm].concat(arrTerms);
            arrTerms = [currentTerm].concat(arrTerms);
        }
        else arrTerms = getLoggedUserDetails("activeterms").split(",");


        const loadTermsOption = arrTerms ? arrTerms.map((term, index) => {
            return (
                <option key={index} value={term}>{convertTermToReadable(term, false)}</option>
            );
        }) : <option selected>No Terms Loaded</option>;
        const notificationBell = (notifications) ? (
            <NotificationBell 
                items={notifications}
                route="/notifications"
                allRead={this.readAllNotifications(history)}
            />  
        ) : "";   
        const notifBadge = unreadNotifications.length > 0 ? (
            <span className="has-background-danger has-text-weight-bold has-text-white"
                  style={{ fontSize: "10px", borderRadius: "25%", padding: "3px", width: "30px", height: "25px", marginTop: "-5px" }}>
                {unreadNotifications.length}
            </span>
        ) : "";    
        const modulesNav = userModulesPermission(currentUserType).modules.map((link, i) => {
            return (
                <div key={i}>
                    <Link to={link.route ? link.route : "#"} className="navbar-item is-hidden-tablet">  
                        <i className={link.icon}></i> {link.name}
                    </Link>
                    {
                        currentUserType === "STUDENT" && link.slug === "enrollment" && (arrTerms && arrTerms.length > 0) ? (
                            arrTerms ? arrTerms.map((term, index) => {
                                return (
                                    <Link to="#" key={index} className="navbar-item is-hidden-tablet" onClick={() => this.handleOnClickTermNav(term)}>                       
                                        &nbsp;&nbsp;&nbsp;<i className="fas fa-minus"></i> {convertTermToReadable(term, false, getLoggedUserDetails("deptabbr"))}
                                    </Link>                                                                
                                )
                            }) : ""    
                        ) : (
                            link.submodules ? link.submodules.map((sublink, index) => {
                                return (
                                    <Link to={sublink.route} key={index} className="navbar-item is-hidden-tablet">                       
                                        &nbsp;&nbsp;&nbsp;<i className={sublink.icon}></i> {sublink.name}
                                    </Link>                                                                
                                )
                            }) : "" 
                        )
                    }
                </div>
            );
        }); 
        
        const moduleSideNav = userModulesPermission(currentUserType).modules.map((link, i) => {
            return (
                <ul className="menu-list" key={i}>
                    <li>
                        <Link to={link.route ? link.route : "#"}>                        
                            <div className="is-sidebar-item" onClick={() => this.handleOnCollapseExpand(link.submodules || (currentUserType === "STUDENT" && link.slug === "enrollment" && (arrTerms && arrTerms.length > 0)) ? link.slug : "")}>    
                                <nav className="level"> 
                                    <div className="level-left">
                                        <div className="level-item">
                                            <span className="icon is-small"><i className={link.icon}></i> </span>
                                            <span className="is-sidebar-item-label" style={{ lineHeight: "20px" }}>{link.name}</span>
                                        </div>
                                    </div> 
                                    <div className="level-right">
                                        <span className="is-sidebar-item-label" style={{ lineHeight: "20px" }}>
                                            {link.name === "Notifications" ? notifBadge : ""}
                                            {
                                                link.submodules || (currentUserType === "STUDENT" && link.slug === "enrollment" && (arrTerms && arrTerms.length > 0)) ? (
                                                    <div onClick={() => this.handleOnCollapseExpand(link.slug)}>
                                                        <i className={"far " + (navItemsExpand && navItemsExpand[link.slug] ? "fa-minus-square" : "fa-plus-square")}></i> 
                                                    </div>
                                                ) : ""
                                            }                                            
                                        </span>
                                    </div>                     
                                </nav>
                            </div>
                        </Link>                                                               
                    </li>
                    {
                        currentUserType === "STUDENT" && link.slug === "enrollment" && (arrTerms && arrTerms.length > 0) && (navItemsExpand && navItemsExpand[link.slug]) ? (
                            arrTerms ? arrTerms.map((term, index) => { 
                                return (
                                    <li key={index}>
                                        <Link to="/enrollment" onClick={() => this.handleOnClickTermNav(term)}>  
                                            <div className="is-sidebar-subitem">                            
                                                <span className="icon is-small"><i className="fas fa-minus"></i> </span>
                                                <span className="is-sidebar-subitem-label">{convertTermToReadable(term, true, getLoggedUserDetails("deptabbr"))}</span>  
                                            </div>                    
                                        </Link>  
                                    </li>                                                              
                                )
                            }) : ""    
                        ) : (
                            link.submodules && (navItemsExpand && navItemsExpand[link.slug]) ? link.submodules.map((sublink, index) => {
                                return (
                                    <li key={index}>
                                        <Link to={sublink.route} >                        
                                            <div className="is-sidebar-subitem">                            
                                                <span className="icon is-small"><i className={sublink.icon}></i> </span>
                                                <span className="is-sidebar-subitem-label">{sublink.name}</span>  
                                            </div>
                                        </Link>                                                                
                                    </li>
                                )
                            }) : ""  
                        )                     
                    }
                </ul>
            );
        });
        
        return (
            <div className="is-fullheight default-page-body">
                {
                    isPageLoading ? (
                        <div className="modal is-active">               
                            <div className="modal-content">
                                <div className="column is-center">
                                    <span className="icon is-large">
                                        <i className="fas fa-spinner fa-pulse fa-lg"></i>
                                    </span>                                   
                                    <h4 className="has-text-weight-semibold is-size-6">Reloading Page</h4>
                                </div>
                            </div>                            
                        </div>                         
                    ) : (
                        <Fragment>
                        <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
                            <div className="navbar-brand">
                                <Link to="/dashboard" className="navbar-item">
                                    <img src={UCLogo160x83} alt="" />                        
                                </Link>
                                <Link to="/dashboard" className="navbar-item pl-0 pb-3 mt-0">
                                    <h5 className="is-size-6 has-text-weight-semibold pt-0 mt-0">UNIVERSITY OF CEBU WEB PORTAL</h5>
                                </Link>                                     
                                <div role="button" className={"navbar-burger burger " + (activateBurger ? "is-active" : "")} aria-label="menu" 
                                    aria-expanded="false"  data-target="navbarMenu" onClick={this.toggleBurger}>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span>
                                </div>
                            </div>
                            
                            <div id="navbarMenu" className={"navbar-menu "  + (activateBurger ? "is-active" : "")}>
                                <div className="navbar-start">
                                                    
                                </div>                    
                                <div className="navbar-end">                              
                                    <div className="is-hidden-tablet buttons">
                                        <Link to="/profile" className="m-2">   
                                            <figure className="image is-32x32">
                                                <img className="is-rounded" src={DefaultAvatar} alt="" style={{ width:"32px", height: "32px"}} />   
                                            </figure>
                                        </Link>
                                        <Link to="/profile" > 
                                            <div className="title is-6" >{getLoggedUserDetails("fullname")}</div>
                                            <p className="subtitle is-6 is-italic">{getLoggedUserDetails("idnumber").length >= 8 ? getLoggedUserDetails("idnumber") : ""} | {getLoggedUserDetails("courseyear")}</p>  
                                        </Link>
                                    </div>   

                                    {modulesNav}

                                    <div className="navbar-item is-hidden-tablet" onClick={this.handleLogout(history)}>
                                        <i className="fas fa-door-open"></i> Logout
                                    </div>                       
                                    <div className="navbar-item is-hidden-mobile">
                                        <div className="field is-grouped">
                                            <p className="control">
                                                <Link to="/profile" className="button is-info is-small">                                        
                                                    <span className="icon">
                                                        <i className="fas fa-user"></i>
                                                    </span>
                                                    <span>
                                                        My Profile
                                                    </span>
                                                </Link>
                                            </p>
                                            <p className="control">                                        
                                                <button className="button is-info is-small" onClick={this.handleLogout(history)}>
                                                    <span className="icon">
                                                        <i className="fas fa-door-open"></i>
                                                    </span>
                                                    Logout
                                                </button>
                                            </p>
                                        </div>
                                    </div>                                                    
                                </div>
                            </div>
                        </nav> 
                        <div className="is-inline-flex">
                            <section className="section is-paddingless is-sidebar is-hidden-mobile">
                                <div className="container is-marginless">                             
                                    <div className="columns is-vcentered is-marginless is-sidebar-user">                                
                                        <div className="column is-3 is-sidebar-user-avatar">
                                            <Link to="/profile" >   
                                                <figure className="image is-48x48">
                                                    <img className="is-rounded" src={avatarPath ? avatarPath : DefaultAvatar} alt="" style={{ width:"48px", height: "48px"}} />   
                                                </figure>
                                            </Link>
                                        </div>
                                        <div className="column is-sidebar-user-info is-clipped">
                                            <Link to="/profile" > 
                                                <div className="title is-7" >{getLoggedUserDetails("fullname")}</div>
                                                <p className="subtitle is-6 is-italic">{getLoggedUserDetails("idnumber").length >= 8 ? getLoggedUserDetails("idnumber") : ""} | {getLoggedUserDetails("courseyear")}</p>  
                                            </Link>                                                                   
                                        </div>                               
                                    </div>                                        
                        
                                    <nav className="menu sidebar is-hidden-mobile pt-3">    
                                        {moduleSideNav}                        
                                    </nav>                        
                                </div>
                            </section>
                            
                            <section className="section is-content p-0">
                                <div className="container is-fluid p-0 m-0">                        
                                    <div className="has-shadow m-0 p-2 has-background-white" style={{ boxShadow: "0 2px 2px -2px gray", width: "100vw" }}>
                                        <div className="columns">    
                                            <div className="column">
                                                <div className="field is-grouped">
                                                    <div className="control">
                                                        <h4 className="has-text-weight-semibold is-size-6 mt-1 ml-3">Select Term</h4>    
                                                    </div>
                                                    <div className="control has-icons-left">
                                                        <div className="select is-small">
                                                            <select name="selectTerm" value={selectedTerm} onChange={this.handleOnchangeInput}>
                                                                {loadTermsOption}
                                                            </select>
                                                        </div>
                                                        <span className="icon is-small is-left">
                                                            <i className="far fa-calendar-alt"></i>
                                                        </span>
                                                    </div>
                                                </div>                                         
                                            </div>
                                        </div>                                
                                    </div>

                                    <div className="columns m-0">    
                                        <div className="column"> 
                                            <div className="content-nav">
                                                <div className="is-pulled-left">
                                                    <Switch>
                                                        <Route path="/dashboard" component={DashboardHeader} />
                                                        <Route path="/notifications" component={NotificationsHeader} />
                                                        <Route path="/profile" component={ProfileHeader} />
                                                        <Route path="/enrollment/:usertype/:subhead" component={EnrollmentSubHeader} />  
                                                        <Route path="/enrollment" component={EnrollmentHeader} />
                                                        <Route path="/schedules/viewall" component={SchedulesViewHeader} /> 
                                                        <Route path="/schedules/department" component={SchedulesHeader} />
                                                        <Route path="/staffstudyload" component={StudyLoadHeader} /> 
                                                        <Route path="/studentstudyload" component={StudyLoadHeader} /> 
                                                        <Route path="/reports" component={ReportsHeader} />        
                                                        <Route path="/admintools" component={AdminToolsHeader} /> 
                                                        <Route path="/classlist" component={ClassListHeader} /> 
                                                        <Route path="/assessment/promissory" component={PromissoryHeader} />  
                                                        <Route path="/assessment/payment" component={PaymentHeader} /> 
                                                        <Route path="/assessment" component={AssessmentHeader} />          
                                                        <Route path="/teachersload" component={TeachersLoadHeader} /> 
                                                        <Route path="/egrade" component={EgradeHeader} />   
                                                        <Route path="/prospectus" component={ProspectusHeader} />
                                                        <Route path="/behind" component={BehindSubjectHeader} /> 
                                                        <Route path="/suggestion" component={SuggestionHeader} />
                                                        <Route path="/requestsubject" component={RequestSubjectHeader} />  
                                                        <Route path="/curriculum" component={CurriculumHeader} />                                
                                                        <Route component={ERR404Header} />
                                                    </Switch>                                   
                                                </div>
                                                <div className="is-pulled-right">
                                                    {notificationBell}                                                                             
                                                </div>  
                                            </div>                                        
                                            <div className="" >                                        
                                                <Switch>
                                                    <Route path="/dashboard" component={Dashboard} />
                                                    <Route path="/notifications/:notifID" component={Notification} />
                                                    <Route path="/notifications" component={Notifications} />
                                                    <Route path="/profile" component={Profile} />
                                                    <Route path="/enrollment/registrar/registration" component={RegistrarRegistration} />
                                                    <Route path="/enrollment/registrar/tracker" component={StudentEnrollmentTracker} />
                                                    <Route path="/enrollment/dean/registration" component={DeanRegistration} />
                                                    <Route path="/enrollment/dean/evaluation" component={DeanEvaluation}/> 
                                                    <Route path="/enrollment/dean/subjects" component={DeanSubjects} /> 
                                                    <Route path="/enrollment/dean/promissory" component={DeanPromissory} /> 
                                                    <Route path="/enrollment/dean/adjustments" component={DeanAdjustments} /> 
                                                    <Route path="/enrollment/dean/tracker" component={StudentEnrollmentTracker} />
                                                    <Route path="/enrollment/accounting/setbalance" component={PaymentSetAccounts} />
                                                    <Route path="/enrollment/accounting/tracker" component={StudentEnrollmentTracker} />
                                                    <Route path="/enrollment/cashier/payment" component={PaymentCheckCashier} />
                                                    <Route path="/enrollment/cashier/tracker" component={StudentEnrollmentTracker} />
                                                    <Route path="/enrollment/edp/tracker" component={StudentEnrollmentTracker} />
                                                    <Route path="/enrollment" component={Enrollment} />
                                                    <Route path="/schedules/department" component={Schedules} />
                                                    <Route path="/schedules/viewall" component={SchedulesView} />   
                                                    <Route path="/staffstudyload" component={StudyLoadStaff} /> 
                                                    <Route path="/studentstudyload" component={StudyLoadStudent} />  
                                                    <Route path="/admintools" component={AdminTools} />  
                                                    <Route path="/reports" component={Reports} />       
                                                    <Route path="/classlist" component={ClassList} />  
                                                    <Route path="/assessment/promissory" component={Promissory} /> 
                                                    <Route path="/assessment/payment" component={Payment} /> 
                                                    <Route path="/assessment" component={Assessment} /> 
                                                    <Route path="/teachersload" component={TeachersLoad} />
                                                    <Route path="/egrade" component={Egrade} /> 
                                                    <Route path="/prospectus" component={Prospectus} />   
                                                    <Route path="/behind" component={BehindSubject} />  
                                                    <Route path="/suggestion" component={Suggestion} /> 
                                                    <Route path="/requestsubject" component={RequestSubjects} />  
                                                    <Route path="/curriculum" component={Curriculum} />                                    
                                                    <Route component={ERR404} />
                                                </Switch>                
                                            </div>   
                                        </div>            
                                    </div>
                                </div>
                            </section>   
                        </div>
                        </Fragment>
                    )
                }
            </div>             
        );
    };
}

export default withCookies(withRouter(Layout));