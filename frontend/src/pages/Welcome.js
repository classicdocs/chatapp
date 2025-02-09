import React, { Component } from 'react'
import Login from '../components/Login';
import Registration from '../components/Registration';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TabPanel from "../components/TabPanel";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Welcome() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div id="welcome-page" style={{ backgroundImage: "url(" + "images/background.png" + ")" }}>
      <div id="welcome-left-container">
        {/* <p className="welcome-title">Welcome</p>
        <p className="welcome-title">To</p>
        <p className="welcome-title">ChatApp</p> */}
      </div>
      <div id="welcome-right-container">
        <div id="login-and-registration">
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Login" {...a11yProps(0)} />
              <Tab label="Register" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <div>
              <Login></Login>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Registration></Registration>
          </TabPanel>
        </div>
      </div>
    </div>
  )
}
