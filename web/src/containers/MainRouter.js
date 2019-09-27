import React from "react";
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import ActivityChart from "../charts/ActivityChart";

export default function MainRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Redirect to="/activity" />} />
        <Route path="/activity" component={ActivityChart} />
      </Switch>
    </Router>
  );
}
