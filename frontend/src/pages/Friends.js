import React, { Component } from 'react'
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TabPanel from "../components/TabPanel";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {getFriends, getSentRequests, getPendingRequests, searchUsers} from "../services/friendService";
import Friend from '../components/Friend';
import Request from "../components/Request";
import RequestTypes from "../constants/RequestTypes";
import FriendsType from "../constants/FriendsType";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default class Friends extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchParam: "",
      value: 0,
      friends: [],
      sentRequests: [],
      pendingRequests: [],
      usersFromSearch: []
    }
  }

  componentDidMount() {

    this.getSentRequests();
    this.getPendingRequests();

    if (this.state.value == 0) {
      this.getFriendsList();

    } else if (this.state.value == 1) {
      this.search();
    }
  }
  

  onSearchChanged(event) {
    this.setState({ searchParam: event.target.value });
  }

  onKeyDown(e) {
    // enter pressed
    if (e.keyCode == 13) {
      this.search();
    }
  }

  search() {
    searchUsers(this.state.searchParam)
    .then(res => {
      if (!res.ok) {
        return;
      }
      
      this.setState({usersFromSearch: res.data});

    })
  }

  getFriendsList() {
    getFriends()
    .then(res => {

      if (!res.ok) {
        return;
      }

      this.setState({friends: res.data});
    })
  }

  getSentRequests() {
    getSentRequests()
    .then(res => {

      if (!res.ok) {
        return;
      }

      this.setState({sentRequests: res.data});
    })
  }

  getPendingRequests() {
    getPendingRequests()
    .then(res => {

      if (!res.ok) {
        return;
      }

      this.setState({pendingRequests: res.data});
    })
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue });

    if (newValue == 0) {
      // fetch friends
      this.getFriendsList();
    } else if (newValue == 1) {
      // search
      this.search();
    }
  };

  renderUsers() {
    return this.state.usersFromSearch.map(user => {
      return <Friend friend={user} key={user.id} type={FriendsType.ADD} fetchData={() => this.componentDidMount()}/>;
    });
  }

  renderFriends() {
    return this.state.friends.map(friend => {
      return <Friend friend={friend} key={friend.id} type={FriendsType.REMOVE} fetchData={() => this.componentDidMount()}/>;
    });
  }

  renderPendingRequests() {
    return this.state.pendingRequests.map(request => {
      return <Request key={request.id} request={request} type={RequestTypes.PENDING} fetchData={() => this.componentDidMount()}/>;
    });
  }

  renderSentRequests() {
    return this.state.sentRequests.map(request => {
      return <Request key={request.id} request={request} type={RequestTypes.SENT} fetchData={() => this.componentDidMount()}/>;
    });
  }

  render() {
    return (
      <div id="friends-page">
        <div id="friends-content">
          <div id="friends-left-container">
            <Tabs value={this.state.value} onChange={(e, v) => this.handleChange(e, v)} aria-label="simple tabs example">
              <Tab label="My friends" {...a11yProps(0)} />
              <Tab label="Search" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={this.state.value} index={0}>
              <div>
                {this.renderFriends()}
               </div>
            </TabPanel>
            <TabPanel value={this.state.value} index={1}>
              <TextField
                fullWidth
                value={this.state.searchParam}
                onChange={(e) => this.onSearchChanged(e)}
                onKeyDown={(e) => this.onKeyDown(e)}
                variant="outlined"
                placeholder="Search friends"
              ></TextField>
              {this.renderUsers()}
            </TabPanel>

          </div>
          <div id="friends-right-container">
            {this.state.sentRequests.length > 0 &&
              <h4>Sent requests: </h4>
            }
            {this.renderSentRequests()}
            {this.state.pendingRequests.length > 0 &&
              <h4>Pending requests: </h4>
            }
            {this.renderPendingRequests()}
          </div>
        </div>
      </div>
    )
  }
}
