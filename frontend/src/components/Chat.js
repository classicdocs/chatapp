import React, { Component } from 'react'
import { getMessages, sendMessage } from "../services/messageService";
import Message from "../components/Message";
import { TextField, Button, Avatar } from '@material-ui/core';
import connect from "react-redux/es/connect/connect";

class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: props.firstName ? props.firstName : "",
      lastName: props.lastName ? props.lastName : "",
      friendId: props.friendId ? props.friendId : null,
      profileImageUrl: props.profileImageUrl ? props.profileImageUrl : "",
      messages: [],
      enterMessageField: ""
    }
  }

  componentDidMount() {
    this.fetchMessages();
  }

  componentWillReceiveProps(props) {

    if (!props.newMessage) {
      return;
    }

    this.setState({messages: [...this.state.messages, props.newMessage]});

  }

  fetchMessages() {

    if (!this.state.friendId) {
      return;
    }

    getMessages(this.state.friendId)
      .then(res => {
        this.setState({ messages: res.data });

      })
      .catch(err => {
        console.log(err);
      })
  }

  sendMessage() {

    if (this.state.enterMessageField === "") {
      return;
    }
    // send message

    sendMessage(this.state.friendId, this.state.enterMessageField)
      .then(res => {
        this.setState({ enterMessageField: "" })

        // this.fetchMessages();
      })
      .catch(err => {
        console.log(err);
      })
  }

  onEnterMessageFieldChange(event) {
    this.setState({ enterMessageField: event.target.value });
  }

  onKeyDown(e) {
    // enter pressed
    if (e.keyCode == 13) {
      this.sendMessage();
    }
  }

  renderMessages() {

    return this.state.messages.map(msg => {
      return <Message msg={msg} key={msg._id}></Message>
    }).reverse()
  }

  render() {
    return (
      <div id="chat-container">
        <div id="chat-content">
          <div id="chat-messages"> {this.renderMessages()}</div>
          <div id="chat-bottom">

            <TextField
              id="friends-search-field"
              fullWidth
              value={this.state.enterMessageField}
              onChange={(e) => this.onEnterMessageFieldChange(e)}
              onKeyDown={(e) => this.onKeyDown(e)}
              variant="outlined"
              placeholder="Enter a message"
            ></TextField>

            <Button id="send-button" size="large" onClick={() => this.sendMessage()}>Send</Button>

          </div>
        </div>

        <div id="chat-profile-info">
          <Avatar id="chat-profile-image" src={this.state.profileImageUrl}></Avatar>
          <h4>{`${this.state.firstName} ${this.state.lastName}`}</h4>
        </div>


      </div>
    )
  }
}


function mapStateToProps({socketReducers }) {
  return { newMessage: socketReducers.newMessage };
}


export default connect(mapStateToProps, {})(Chat);