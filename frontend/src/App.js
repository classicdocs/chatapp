import React from 'react';
import { getRoutes } from "./route";
import { Router } from "react-router-dom";
import history from "./history";
import Header from './components/Header';
import { createStore } from "redux";
import appReducers from "./reducers/Reducers";
import { loadUser } from "./actions/AuthActions";
import Provider from "react-redux/es/components/Provider";
import SocketWrapper from "./base/SocketWrapper";


const store = createStore(appReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.dispatch(loadUser());

function App() {
  return (
    <div id="app">
      <Provider store={store}>
        <SocketWrapper>
          <Router history={history}>
            <Header />
            {getRoutes()}
          </Router>
        </SocketWrapper>
      </Provider>
    </div>
  );
}

export default App;
