import React, { Component } from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';

export default class ReportChartsMain extends Component {

render() {
    const { values } = this.props;
    const data1 = {
        labels: ['Registrar', 'Subject Select', 'Payment', 'Dean', 'Accounting', 'Cashier'],
        datasets: [
            {
                label: 'Pending',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [
                    values.pending_registered, 
                    values.subject_selection, 
                    values.pending_payment,
                    values.pending_dean, 
                    values.pending_accounting, 
                    values.pending_cashier
                ]
            }
        ]
    }
    
    const data2 = {
        labels: ['Total Pending Student', 'Total Pending Approval', 'Total Enrolled'],
        datasets: [
          {
            label: 'Pending',
            backgroundColor: [
                'RebeccaPurple',
                'tomato',
                'springgreen',
            ],
            hoverBackgroundColor: [
                'Purple',
                'OrangeRed',
                'LimeGreen',
            ],
            data: [values.pending_registered + values.subject_selection + values.pending_payment,values.pending_total, values.official_total]
          }
        ]
    }
    return(
        <div className="columns">            
            <div className="column">
                <Doughnut
                    data={data2}
                    options={{
                        title:{
                            display:true,
                            text:'',
                            fontSize:20
                        },
                        legend:{
                            display:true,
                            position:'bottom'
                        }
                    }}
                />
            </div>
            <div className="column">
                <Bar
                    data={data1}
                    options={{
                        title:{
                            display:true,
                            text:'Progress Pending Data',
                            fontSize:20
                        },
                        legend:{
                            display:false,
                            position:'bottom'
                        }
                    }}
                />
            </div>
            <div className="column is-hidden-mobile is-1"></div>
        </div>
    );
};

}