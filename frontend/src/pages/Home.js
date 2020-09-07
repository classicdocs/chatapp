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

class Home extends Component {

  state = {
    inbox: [],
    selectedInbox: null
  }

  componentDidMount() {
    this.getInbox();
  }

  getInbox() {
    getInbox()
      .then(res => {
        this.setState({ inbox: res.data });
      })
  }

  onInboxElementSelect(el) {
    console.log(el);
    console.log('el selected');
    this.setState({ selectedInbox: el });
  }

  renderInboxElements() {

    return this.state.inbox.map(el => {
      console.log(el);
      return (
        <ListItem button key={el.friend.id}
        >
          <InboxElement
            firstName={el.friend.firstName}
            lastName={el.friend.lastName}
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
            friendId={this.state.selectedInbox.friend.id}
          ></Chat>}
        </div>
      </div>
    );
  }

}


export default Home;