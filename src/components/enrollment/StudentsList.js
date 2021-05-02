import React, { Component, Fragment } from 'react';
//import axios from 'axios';

import UserListPanel from '../elements/UserListPanel';
import PaginateRecords from '../../components/elements/PaginateRecords';
import SpinnerGif from '../../assets/sysimg/spinner.gif';


export default class StudentsEvaluationList extends Component {
    handleOnchangeInput = e => {
        this.props.handleOnchangeInput(e.target.name, e.target.value);
    }
    handleClickUser = (idNum, Classification, courseCode, promissoryData) => {
        this.props.handleClickUser(idNum, Classification, courseCode, promissoryData);
    }
    handleOnButtonClick = (e, idnum) => {
        this.props.handleOnButtonClick(e, idnum);
    }
    handlePageClick = e => {
        this.props.handlePageClick(e);
    }
    handleOnChangePage = e => {
        this.props.handleOnChangePage(e);
    }
    handleChangeRowsPerPage = e => {
        this.props.handleChangeRowsPerPage(e);   
    }
    render() {        
        const { studentList, selectedStudentID, totalRowsCount, rowsPerPage, pageNum, isLoading } = this.props;
        const studentsPanelList = studentList ? studentList.map((student, index) => {
            return <UserListPanel
                        key={index}         
                        values={student}
                        selectedStudentID={selectedStudentID}
                        handleClickUser={this.handleClickUser}
                   />
        }) : "";
        return(  
            <Fragment> 
                { 
                    isLoading ? (
                        <div className="columns is-vcentered">
                            <div className="column is-center">
                                <figure className="image is-128x128">
                                    <img src={SpinnerGif} alt="" />
                                </figure>
                            </div>
                        </div> 
                    ) : ""
                }    
                {studentsPanelList} 
                <div className="columns">
                    <div className="column mt-2">
                        <PaginateRecords
                            totalRowsCount={totalRowsCount}
                            rowsPerPage={rowsPerPage}
                            pageNum={pageNum}
                            handleOnClickPage={this.handleOnChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}
