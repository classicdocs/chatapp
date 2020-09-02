import React from 'react';
import {getRoutes} from "./route";
import { Router} from "react-router-dom";
import history from "./history";

function App() {
  return (
    <div id="app">
       <Router history={history}>
         {getRoutes()}
       </Router>
    </div>
  );
}

export default App;
