import React, { Component } from 'react'
import { getUserFromLocalStorage } from '../base/Auth';
import { isIdFromUser } from "../util/helper";
import {Tooltip} from "@material-ui/core";
import {dateTimeToString} from "../util/datetime";


export default class Message extends Component {

  constructor(props) {
    super(props);

    this.state = {
      msg: props.msg ? props.msg : null
    }
  }

  isMyMsg() {


    if (isIdFromUser(this.state.msg.from)) {
      return "my-msg";
    }

    return "";
  }

  render() {
    if (!this.state.msg) {
      return;
    }

    return (
      <Tooltip title={dateTimeToString(this.state.msg.createdAt)}>
        <div className={`message-container ${this.isMyMsg()}`}>
          <p>{this.state.msg.value}</p>
        </div>
      </Tooltip>
    )
  }
}
