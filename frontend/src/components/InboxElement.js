import React, { Component } from 'react'
import {isIdFromUser} from "../util/helper";
import {Avatar} from "@material-ui/core";
import connect from 'react-redux/es/connect/connect';
import { flash } from 'react-animations'
import Radium, {StyleRoot} from 'radium';
import {newMessage as newMessageAction} from "../actions/SocketActions";
import { getUserFromLocalStorage } from '../base/Auth';

const styles = {
  flash: {
    animation: 'x 1s',
    animationName: Radium.keyframes(flash, 'flash')
  }
}

class InboxElement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: props.firstName ? props.firstName : "",
      lastName: props.lastName ? props.lastName : "",
      profileImageUrl: props.profileImageUrl ? props.profileImageUrl : "",
      message: props.message ? props.message : null,
      animate: false
    };
  }

  componentWillReceiveProps(props) {


    console.log(this.props);

    let newMessage = props.newMessage;

    if (!this.state.message || !newMessage) {
      return;
    }


    if ((newMessage.from === this.state.message.from && newMessage.to === this.state.message.to) ||
    (newMessage.to === this.state.message.from && newMessage.from === this.state.message.to)) {


      let animate = newMessage.from === getUserFromLocalStorage()._id ? false : true;
      this.setState({message: newMessage, animate: animate}, () => {

        setTimeout(() => {
          this.setState({animate: false})
          this.props.newMessageAction(null);

        }, 1000)
      });
    }

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

    return <h4 style={this.state.animate ? styles.flash : {}}>{who}</h4>;

  }

  render() {

    return (
      <div className="inbox-element" onClick={() => this.props.onSelect()}>
        <Avatar src={this.state.profileImageUrl}></Avatar>
        <div>
        <h4>{this.state.firstName} {this.state.lastName}</h4>
        <StyleRoot>
          {this.renderMessage()}
        </StyleRoot>
        </div>
      </div>
    )
  }
}

function mapStateToProps({socketReducers}) {
  return {
    newMessage: socketReducers.newMessage
  }
}

export default connect(mapStateToProps, {newMessageAction})(InboxElement);