import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './assets/js/layout.js'
import './styles/index.scss';
import './styles/style.css';
//import App from './App';
import UCWebPortal from './UCWebPortal'
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <CookiesProvider>
            <Router>
                <UCWebPortal />
            </Router>
        </CookiesProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

//Clear localStorage (and cookie selterm) if exist on page load except page reload 
window.onload = () => {
    var result;
    var p;
    if (window.performance.getEntriesByType("navigation")) {
        p=window.performance.getEntriesByType("navigation")[0].type;
        
        if (p==='navigate'){result=0}
        if (p==='reload'){result=1}
        if (p==='back_forward'){result=2}
        if (p==='prerender'){result=3} //3 is my invention!
    }
    if(result === 0) {
        if (localStorage.getItem("token") !== null || localStorage.getItem("loggeduser") !== null) {
            if(window.location.pathname.includes(process.env.REACT_APP_PATH_STORAGE_ATTACHMENTS)) window.location = "/err404outside/File not found!";
            else if(window.location.pathname.includes("/err404outside/")) ; //do nothing 
            else if(window.location.pathname.includes("/enrollment")) {
                window.location.reload();
            }
            else {
                localStorage.clear();
                document.cookie = 'selterm=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.reload();
            }            
        }
    }
};

