import React, { Component } from 'react'
import {Button} from "@material-ui/core";
import { deleteFriend } from '../services/friendService';

export default class Friend extends Component {

  constructor(props) {
    super(props);

    this.state = {
      friend: this.props.friend ? this.props.friend : null
    }

  }

  removeFriend() {
    deleteFriend(this.state.friend.id)
    .then(res => {
      if (!res.ok) {
        return;
      }

      this.props.fetchData();
    })
  }


  render() {

    if (!this.state.friend) {
      return;
    }

    return (
      <div className="friend-container">
        {`${this.state.friend.firstName} ${this.state.friend.lastName}`}
        <Button onClick={() => this.removeFriend()}>Remove</Button>
      </div>
    )
  }
}
