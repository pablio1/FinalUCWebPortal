import React, { Component } from 'react';

export default class SubjectListPanel extends Component {
    handleClickButton = e => {

    }
    render() {
      /*"edpcode": "60485",
      "subject_name": "HIST 101",
      "subject_type": "LEC",
      "days": "MW  ",
      "begin_time": "9:00",
      "end_time": "10:30",
      "mdn": "AM",
      "m_begin_time": "0900",
      "m_end_time": "1030",
      "m_days": "x x",
      "units": "3",
      "room": "FLD",
      "size": "0",
      "max_size": "40"  */
        const { values } = this.props;     
        return (
            <div className="columns">
                <div className="column">
                    {values.edpcode}
                </div>
                <div className="column">
                    {values.subject_name}
                </div>
                <div className="column">
                    {values.subject_type}
                </div>
                <div className="column">
                    {values.days}
                </div>
                <div className="column">
                    {values.begin_time} - {values.end_time} {values.mdn}
                </div>
                <div className="column">
                    {values.units}
                </div>
                <div className="column">
                    {values.room}
                </div>
                <div className="column">
                    {values.size} / {values.max_size}
                </div>                            
            </div>
        );
    }
}
