import React from 'react';
import {getRoutes} from "./route";
import { Router} from "react-router-dom";
import history from "./history";
import Header from './components/Header';
import { createStore } from "redux";
import appReducers from "./reducers/Reducers";
import { loadUser } from "./actions/AuthActions";
import Provider from "react-redux/es/components/Provider";

const store = createStore(appReducers);
store.dispatch(loadUser());

function App() {
  return (
    <div id="app">
       <Provider store={store}>
       <Router history={history}>
         <Header/>
         {getRoutes()}
       </Router>
       </Provider>
    </div>
  );
}

export default App;
