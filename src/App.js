import React, { Component } from 'react';
import Button from 'material-ui/Button';

// stylesheets
import './css/App.css';
import './css/responsive.css';

// components
//import { Navigator } from './main-body';


// img
import imgRace from './img/race.jpg';



class App extends Component {
  render() {			
    return (
      <div className="App">

        <div className="App-header">
          <h1>Pitlane</h1>
					<a href="#APP-BODY">
						<Button color="primary" variant="raised">Start</Button>
					</a>
        </div>

				<Body />

      </div>
    );
  }
}



class Body extends Component {
	render(){
		return (
			<div id="APP-BODY">
				<Navigator />
				<hr />

			</div>
		);
	}
}

// this gives the user options to check stats by race, driver, team, etc.
class Navigator extends Component {
	render() {
		return (
			<div>
				<h2>View stats by</h2>
				<div id="navigator-card-container" className="flex-container flex-space-between">
					<div className="flex-1-3">
						<img src={imgRace} alt="race" className="navigator-img"></img>
						<h3>Race</h3>
					</div>
					<div className="flex-1-3">
						<img src={imgRace} alt="race" className="navigator-img"></img>
						<h3>Driver</h3>
					</div>
					<div className="flex-1-3">
						<img src={imgRace} alt="race" className="navigator-img"></img>
						<h3>Team</h3>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
