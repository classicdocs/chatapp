import React, { Component } from 'react'
import RequestTypes from "../constants/RequestTypes";
import { Button, Avatar } from "@material-ui/core";
import {acceptRequest, declineRequst, cencelRequest} from "../services/friendService";
import connect from 'react-redux/es/connect/connect';

class Request extends Component {

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

  cencelRequest() {
    cencelRequest(this.state.request.id)
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
        <div className="friend-container-info">
        <Avatar src={this.state.request.profileImageUrl}></Avatar>
        <p>{`${this.state.request.firstName} ${this.state.request.lastName}`}</p>
        </div>
        <div>
          {this.state.type == RequestTypes.PENDING && <Button onClick={() => this.acceptRequest()}>Accept</Button>
          }
          {this.state.type == RequestTypes.PENDING && <Button onClick={() => this.declineRequst()}>Decline</Button>
          }
           {this.state.type == RequestTypes.SENT && <Button onClick={() => this.cencelRequest()}>Cancel</Button>
          }
        </div>
      </div>
    )
  }
}

export default connect(null, {})(Request);