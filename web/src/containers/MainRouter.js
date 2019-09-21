import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/home";

export default function MainRouter() {
  return (
    <Router>
      <Layout className="sans-serif">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Layout>
    </Router>
  );
}
