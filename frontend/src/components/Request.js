import React, { Component } from 'react'
import RequestTypes from "../constants/RequestTypes";
import { Button } from "@material-ui/core";
import {acceptRequest, declineRequst} from "../services/friendService";


export default class Request extends Component {

  constructor(props) {
    super(props);

    this.state = {
      request: this.props.request ? this.props.request : null,
      type: this.props.type
    }
  }

  acceptRequest() {
    acceptRequest(this.state.request.id)
    .then(res => {
      if (!res.ok) {
        return;
      }

      this.props.fetchData();
    })

  }

  declineRequst() {
    declineRequst(this.state.request.id)
    .then(res => {
      if (!res.ok) {
        return;
      }

      this.props.fetchData();
    })
  }

  render() {

    if (!this.state.request) {
      return;
    }

    return (
      <div className="request-container">
        <p>{`${this.state.request.firstName} ${this.state.request.lastName}`}</p>
        <div>
          {this.state.type == RequestTypes.PENDING && <Button onClick={() => this.acceptRequest()}>Accept</Button>
          }
          {this.state.type == RequestTypes.PENDING && <Button onClick={() => this.declineRequst()}>Decline</Button>
          }
        </div>
      </div>
    )
  }
}
