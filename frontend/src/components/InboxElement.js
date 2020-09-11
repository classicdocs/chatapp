import React, { Component } from 'react'
import {isIdFromUser} from "../util/helper";
import {Avatar} from "@material-ui/core";

export default class InboxElement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: props.firstName ? props.firstName : "",
      lastName: props.lastName ? props.lastName : "",
      profileImageUrl: props.profileImageUrl ? props.profileImageUrl : "",
      message: props.message ? props.message : null,
      selected: false
    };
  }

  renderMessage() {

    if (!this.state.message) {
      return;
    }

    let who = `${this.state.firstName}: `

    if (isIdFromUser(this.state.message.from)) {
      who = "You: ";
    }

    who += this.state.message.value;

    return <h5>{who}</h5>;

  }

  render() {

    return (
      <div className="inbox-element" onClick={() => this.props.onSelect()}>
        <Avatar src={this.state.profileImageUrl}></Avatar>
        <div>
        <h4>{this.state.firstName} {this.state.lastName}</h4>
        {this.renderMessage()}
        </div>
      </div>
    )
  }
}
