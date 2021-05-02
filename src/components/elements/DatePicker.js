import React, { Component } from 'react';
import bulmaCalendar from 'bulma-calendar';


export default class DatePicker extends Component {
    handleChangeDate = date => {
        this.props.handleOnChangeDate(date);       
    }
    render() {
        const { id, options } = this.props;
        // Initialize all input of date type.
        const calendars = bulmaCalendar.attach('[type="date"]', options);
        
        // Loop on each calendar initialized
        //calendars.forEach((calendar) => {
            // Add listener to date:selected event
        //    calendar.on('date:selected', (date) => {
                //this.handleChangeDate(date);  
        //        console.log(date);
        //    });
        //});

        
        // To access to bulmaCalendar instance of an element
        // eslint-disable-next-line no-undef
        const element = document.querySelector('#' + id);
        if (element) {
        // bulmaCalendar instance is available as element.bulmaCalendar
            element.bulmaCalendar.on('select', (datepicker) => {
                //console.log(datepicker.data.value());
                this.handleChangeDate(datepicker.data.value());
            });
        }
    

    return (
        <input id={id} type="date" />
    );
    }
}
