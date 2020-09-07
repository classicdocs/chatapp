import React, { Component } from 'react'
import { Button } from "@material-ui/core";
import { deleteFriend, addFriend } from '../services/friendService';
import FriendsType from "../constants/FriendsType";

export default class Friend extends Component {

  constructor(props) {
    super(props);

    this.state = {
      friend: this.props.friend ? this.props.friend : null,
      type: this.props.type
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

  addFriend() {
    addFriend(this.state.friend.id)
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
        {this.state.type === FriendsType.ADD &&
          <Button onClick={() => this.addFriend()}>Add</Button>
        }
        {this.state.type === FriendsType.REMOVE &&
          <Button onClick={() => this.removeFriend()}>Remove</Button>
        }
      </div>
    )
  }
}
