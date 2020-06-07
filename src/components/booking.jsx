import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { gql } from "apollo-boost";

import "react-datepicker/dist/react-datepicker.css";

var moment = require('moment');

class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            firstName: '',
            lastName: '',
            selectedDate: new Date(),
            selectedStart: moment('07:00', 'HH:mm').toDate(),
            selectedEnd: moment('07:00', 'HH:mm').add(1, 'hours').toDate(),
            appointmentInfo: undefined
        }

        this.handleReserve = this.handleReserve.bind(this)
        this.handleStartChange = this.handleStartChange.bind(this)
        this.handleEndChange = this.handleEndChange.bind(this)
        this.onTextAreaChange = this.onTextAreaChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.onFirstNameChange = this.onFirstNameChange.bind(this)
        this.onLastNameChange = this.onLastNameChange.bind(this)
    }

    onFirstNameChange = (event) => {
        this.setState({firstName: event.target.value});
    }

    onLastNameChange = (event) => {
        this.setState({lastName: event.target.value});
    }

    onTextAreaChange = (event) => {
        this.setState({description: event.target.value});
    }

    handleDateChange(date) {
        this.setState({selectedDate: date});
    }

    handleStartChange(start) {
        this.setState({selectedStart: start});
    }

    handleEndChange(end) {
        this.setState({selectedEnd: end});
    }

    handleReserve() {
        this.setState({appointmentInfo: undefined});

        const firstName = this.state.firstName
        const lastName = this.state.lastName
        const description = this.state.description
        const date = moment(this.state.selectedDate).format('YYYY-MM-DD')
        const start = moment(this.state.selectedStart).format('HH:mm')
        const end = moment(this.state.selectedEnd).format('HH:mm')

        this.props.client
            .mutate({
                mutation: CREATE_APPOINTMENT,
                variables: {
                description,
                date,
                start,
                end,
                firstName,
                lastName
                },
            })
            .then(result => {
                this.setState({appointmentInfo: result.data.createAppointment});
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const now = moment()
        const sevenAM = moment('07:00', 'HH:mm')
        const ninePM = moment('21:00', 'HH:mm')
        let appointmentId
        let description
        let date
        let start
        let end
        let firstName
        let lastName

        if (this.state.appointmentInfo) {
            appointmentId = this.state.appointmentInfo.id
            description = this.state.appointmentInfo.description
            date = this.state.appointmentInfo.time.date
            start = this.state.appointmentInfo.time.start
            end = this.state.appointmentInfo.time.end
            firstName = this.state.appointmentInfo.user.firstName
            lastName = this.state.appointmentInfo.user.lastName
        }

        return (
            <> 
                <div>
                    <h1>Select time for booking</h1>
                    <p>Enter your name:</p>
                    <input style={{margin: "15px"}}
                    type='text'
                    onChange={this.onFirstNameChange}
                    />
                    <input
                    type='text'
                    onChange={this.onLastNameChange}
                    />
                </div>
                <div>
                    <textarea
                    rows="4" cols="50"
                    onChange={this.onTextAreaChange}
                    />
                </div>
                <div>
                    <p>Select reservation time</p>
                    <DatePicker
                        minDate={now.toDate()}
                        selected={this.state.selectedDate}
                        onChange={this.handleDateChange}
                        dateFormat="MMMM d, yyyy"
                    />
                    <DatePicker
                        selected={this.state.selectedStart}
                        showTimeSelect
                        showTimeSelectOnly
                        minTime={sevenAM.toDate()}
                        maxTime={ninePM.toDate()}
                        timeIntervals={30}
                        timeCaption="Start"
                        dateFormat="h:mm aa"
                        onChange={this.handleStartChange}
                    />
                    <DatePicker
                        selected={this.state.selectedEnd}
                        showTimeSelect
                        showTimeSelectOnly
                        minTime={sevenAM.toDate()}
                        maxTime={ninePM.toDate()}
                        timeIntervals={30}
                        timeCaption="End"
                        dateFormat="h:mm aa"
                        onChange={this.handleEndChange}
                    />
                </div>
                <div>
                    <Button variant="primary" onClick={this.handleReserve}>Reserve</Button>
                </div>
                
                <div style={{display: this.state.appointmentInfo ? 'block' : 'none'}}>
                    <hr />
                    <p>Congratulations {firstName} {lastName}! You successfully reserved an appointment.</p>
                    <p>Appointment number {appointmentId}</p>
                    <p>Appointment description {description}</p>
                    <p>Appointment date {date} start: {start} end: {end}</p>
                </div>
            </>
        );
    }
}
 
export default Booking;

const CREATE_APPOINTMENT = gql`
    mutation CreateAppointment($description: String!, $date: String!, $start: String!, $end: String!, $firstName: String!, $lastName: String!) {
        createAppointment(
            input: {description: $description, time: {date: $date, start: $start, end: $end}, user: {firstName: $firstName, lastName: $lastName}}
        ){
            id
            description
            time {
                date
                start
                end
            }
            user {
                id
                firstName
                lastName
            }
        }
    }
`