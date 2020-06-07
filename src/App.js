import React, { Component } from "react";
import "./App.css";
import "./components/booking";
import Booking from "./components/booking";
import Info from "./components/info";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
      // <div className="App">
      //   <Booking client={this.props.client} />
      // </div>

      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Create appointment</Link>
              </li>
              <li>
                <Link to="/info">Appointment info</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/info">
              <Info client={this.props.client} />
            </Route>
            <Route path="/">
              <Booking client={this.props.client} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
