import React, { Component } from 'react';
import DefaultAvatar from "../../assets/sysimg/user.png";

export default class UserListPanel extends Component {
    handleClickButton = (idNum, Classification, courseCode) => {        
        const { values } = this.props;
        if(values.hasOwnProperty("promise_pay")) {
            const promissoryData = {
                message: values.message,
                date: values.date,
                status: values.status,
                promise_pay: values.promise_pay ? values.promise_pay : 0,
                needed_payment: values.needed_payment,
            }
            this.props.handleClickUser(idNum, Classification, courseCode, promissoryData);
        }
        else if(values.hasOwnProperty("pending_exam_promi")) {
            const promissoryData = {
                approved_promi_amount: values.approved_promi_amount,
                pending_exam_promi: values.pending_exam_promi
            }
            this.props.handleClickUser(idNum, Classification, courseCode, promissoryData);
        }
        else this.props.handleClickUser(idNum, Classification, courseCode, ""); 
    }
    render() {        
    const { values, selectedStudentID } = this.props;
    const classStyle = classificationStyle(values.classification);
    const idnumber = values.id_number + " | ";
    const fullname = values.lastname + ", " + values.firstname + (values.mi ? " " + values.mi + ". " : "") + (values.suffix ? " " + values.suffix + ". " : ""); 
    const isSelected = selectedStudentID === values.id_number ? "has-background-link-light" : "has-background-light";

    return (
        <article className={"media p-2 mt-1 is-clickable " + isSelected}
                 onClick={() => this.handleClickButton(values.id_number, values.classification, values.course_code)} >
            <figure className="media-left">
                <div className="image is-32x32">
                    <img className="is-rounded" src={values.profile ? process.env.REACT_APP_PATH_STORAGE_IDPICTURES + values.profile : DefaultAvatar} 
                         alt="" style={{ width:"32px", height: "32px"}}/>
                </div>
            </figure>
            <div className="media-content">
                <div className="content">
                    <p className="is-size-7 m-0">
                        <strong>{idnumber} {fullname}</strong>                                                                      
                    </p>
                    <p className="is-size-7 p-0 m-0">
                        <strong>{values.course_year}</strong> &nbsp;<span className={"tag pt-0 pb-0 " + classStyle}><small>{values.classification}</small></span>&nbsp;                         
                    </p>
                </div>                                           
            </div>
            <div className="media-right">
                <small><i className="far fa-calendar"></i> {values.date} &nbsp;</small>
            </div>
        </article>
    );
    }
}

function classificationStyle(classification) {

    let toReturn = "is-primary";
    if(classification === "OLD STUDENT") toReturn = "is-link";
    if(classification === "NEW STUDENT") toReturn = "is-success";
    if(classification === "SHIFTEE") toReturn = "is-info";
    return toReturn;
}