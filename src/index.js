import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";

var graphqlEndpoint =
  "http://freebookbackend-439040221.eu-west-1.elb.amazonaws.com:7777/query";

const client = new ApolloClient({
  uri: graphqlEndpoint
});

ReactDOM.render(
  <React.StrictMode>
    <App client={client} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
