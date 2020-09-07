import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { isUserLoggedIn, clearUserData } from "../base/Auth";
import history from "../history";
import connect from "react-redux/es/connect/connect";
import {logout} from "../actions/AuthActions";

class Header extends Component {


  logout() {
    clearUserData();
    this.props.logout();
    history.push("/");
  }

  navigate(path) {
    history.push(path);
  }

  render() {

    return (
      <div id="header">
        <AppBar position="fixed">
          <Toolbar id="header-toolbar">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Chatapp
            </Typography>
            {this.props.user && <Button color="inherit" onClick={() => this.navigate("home")}>Inbox</Button>}
            {this.props.user && <Button color="inherit" onClick={() => this.navigate("friends")}>Friends</Button>}
            {this.props.user && <Button color="inherit" onClick={() => this.logout()}>Logout</Button>}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

function mapStateToProps({ authReducers }) {
  return { user: authReducers.user };
}

export default connect(mapStateToProps, {logout})(Header);
