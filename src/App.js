import React, { Component } from 'react';
import Button from 'material-ui/Button';
//import logo from './logo.svg';
import './css/App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Pitlane</h1>
        </div>
        <a href ="#APP-BODY">
          <Button color="primary" variant="raised">Start</Button>
        </a>
      </div>
    );
  }
}

export default App;
