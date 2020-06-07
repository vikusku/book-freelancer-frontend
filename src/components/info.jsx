import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import { gql } from "apollo-boost";

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentId: '',
            appointmentInfo: undefined,
            error: undefined
        }

        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    onChange = (event) => {
        this.setState({appointmentId: event.target.value});
    }

    onClick(){
        this.setState({appointmentInfo: undefined});
        this.setState({error: undefined})

        const id = this.state.appointmentId
        this.props.client
            .query({
                query: FIND_APPOINTMENT,
                variables: {
                id
                },
            })
            .then(result => {
                this.setState({appointmentInfo: result.data.appointment});
            })
            .catch(error => {
                this.setState({error: error})
            })
    }

    render() {
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
            <div>
                <div>
                    <input
                        type='text'
                        onChange={this.onChange}
                    />
                </div>
                <div>
                    <Button variant="primary" onClick={this.onClick}>Find</Button>
                </div>
                <div style={{display: this.state.appointmentInfo ? 'block' : 'none'}}>
                    <hr />
                    <p>Hello {firstName} {lastName}! You appointment info.</p>
                    <p>Appointment number {appointmentId}</p>
                    <p>Appointment description {description}</p>
                    <p>Appointment date {date} start: {start} end: {end}</p>
                </div>
                <div style={{display: this.state.error ? 'block' : 'none'}}>
                    <hr />
                    <p>Appointment info not found</p>
                </div>
            </div>
        )
    }
}

export default Info;

const FIND_APPOINTMENT = gql`
    query Appointment($id: ID!) {
        appointment(
            id: $id
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