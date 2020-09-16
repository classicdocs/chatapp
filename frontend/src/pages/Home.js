import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getInbox } from '../services/messageService';
import InboxElement from '../components/InboxElement';
import Chat from '../components/Chat';
import history from "../history";
import { withRouter } from 'react-router-dom'
import { getFriend } from '../services/friendService';
import { Button } from "@material-ui/core";
import connect from "react-redux/es/connect/connect";
import {setSocket} from "../actions/SocketActions";

import io from 'socket.io-client';
import CONFIG from '../config';
import { getToken } from '../base/Auth';


class Home extends Component {

  state = {
    inbox: [],
    selectedInbox: null,
    friendIdPathParam: undefined,
  }

  componentDidMount() {

    this.setState({ friendIdPathParam: this.props.match.params.friendId });

    this.getInbox();
  }

  getInbox() {
    getInbox()
      .then(res => {
        this.setState({ inbox: res.data }, () => {

          if (this.state.friendIdPathParam == undefined) {
            return;
          }

          let userAlreadyExistInInbox = false;

          this.state.inbox.forEach(el => {
            if (el.friend.id == this.state.friendIdPathParam) {
              userAlreadyExistInInbox = true;
              this.onInboxElementSelect(el);
            }
          })

          if (!this.state.selectedInbox && !userAlreadyExistInInbox) {
            // get info of user
            getFriend(this.state.friendIdPathParam)
              .then(res => {
                if (!res.ok) {
                  return;
                }

                this.setState({ inbox: [...this.state.inbox, { friend: res.data }], selectedInbox: { friend: res.data } });
              })
          }

        });
      })
  }

  onInboxElementSelect(el) {


    this.setState({ selectedInbox: null }, () => {
      this.setState({ selectedInbox: el });
      history.push("/home/" + el.friend.id);

    });
  }

  renderInboxElements() {

    return this.state.inbox.map(el => {
      return (
        <ListItem button key={el.friend.id}
        >
          <InboxElement
            firstName={el.friend.firstName}
            lastName={el.friend.lastName}
            profileImageUrl={el.friend.profileImageUrl}
            message={el.msg}
            onSelect={() => this.onInboxElementSelect(el)}
          ></InboxElement>
        </ListItem>)
    })
  }

  render() {
    return (
      <div className="drawer-root">
        <CssBaseline />
        <Drawer
          id="drawer"
          variant="permanent"
        >
          <Toolbar />
          <div className="drawer-container">
            <List>
              {this.renderInboxElements()}
            </List>
          </div>
        </Drawer>
        <div className="main-content">
          {this.state.selectedInbox &&
            <Chat
              firstName={this.state.selectedInbox.friend.firstName}
              lastName={this.state.selectedInbox.friend.lastName}
              profileImageUrl={this.state.selectedInbox.friend.profileImageUrl}
              friendId={this.state.selectedInbox.friend.id}
            ></Chat>}
        </div>
      </div>
    );
  }

}


export default withRouter(Home);