import React, { Component } from 'react'
import {isIdFromUser} from "../util/helper";

export default class InboxElement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: props.firstName ? props.firstName : "",
      lastName: props.lastName ? props.lastName : "",
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
        <h4>{this.state.firstName} {this.state.lastName}</h4>
        {this.renderMessage()}
      </div>
    )
  }
}
