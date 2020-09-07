import React from "react";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Friends from "./pages/Friends";
import {isUserLoggedIn} from "./base/Auth";
import { Route } from "react-router-dom";


let ROUTES = {
  Welcome: {
    path: "/",
    component: <Welcome/>,
    auth: false
  },
  Home: {
    path: "/home",
    component: <Home/>,
    auth: true
  },
  Friends: {
    path: "/friends",
    component: <Friends/>,
    auth: true
  }
}

export default ROUTES;

function getRoute(path) {
  for (const [key, value] of Object.entries(ROUTES)) {
    if (value.path === path) {
      return value;
    }
  }

  return null;
}

export function checkPath(path) {
  let pathObject = getRoute(path);

  if (!pathObject) {
    return true;
  }

  if (pathObject.auth) {
    return !isUserLoggedIn();
  }

  return false;
}

export function getRoutes() {
  let result = [];

  for (const [key, value] of Object.entries(ROUTES)) {
    result.push(
      <Route
        key={"route-" + result.length}
        exact
        path={value.path}
        render={() => value.component}
      />
    );
  }

  return result;
}
