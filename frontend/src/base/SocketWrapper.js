import React, { Component, Fragment } from 'react'
import connect from "react-redux/es/connect/connect";
import {setSocket, newMessage} from "../actions/SocketActions";
import io from 'socket.io-client';
import CONFIG from '../config';
import { getToken } from './Auth';

class SocketWrapper extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    this.setSocket(this.props);
  }


  componentWillReceiveProps(props) {
    this.setSocket(props);

    if (props.socket && !props.user) {
      props.socket.disconnect();
    }
  }

  setSocket(props) {

    if (!props.user) {
      return;
    }

    console.log("set socket");

    if (props.socket && props.socket.connected) {

      console.log("socket already exist and connected ")
      return;
    }

    const socket = io(CONFIG.socketURL, {
      query: {
        token: getToken()
      }
    });

    socket.on('connect', () => {
      console.log("connect");
      this.props.setSocket(socket); 

      socket.on('message', (data) => {
        this.props.newMessage(data);
      })
    });
    
   

    socket.on('disconnect', () => {
      console.log('disconnect');

      if(props.socket) {
        props.setSocket(null);
        socket.disconnect();
      }
    })

  }



  render() {

    const {children} = this.props;
    
    return (
      <div id="socket-wrapper">
        {children}
      </div>
    )
  }
}


function mapStateToProps({ socketReducers, authReducers }) {
  return { socket: socketReducers.socket, user: authReducers.user };
}

export default connect(mapStateToProps, {setSocket, newMessage})(SocketWrapper);