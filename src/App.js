import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { axios } from 'axios';

// stylesheets
import './css/App.css';
import './css/responsive.css';

// components
//import { Navigator } from './main-body';


// img
import imgRace from './img/race.jpg';
import imgVettel from './img/vettel.jpg';
import imgRedBull from './img/redbull.jpg';



class App extends Component {
	 render() {			
		var h2Gray = { color: '#ddd' };
    return (
      <div className="App">

        <div className="App-header">
					<div className="">
						<h1>Pitlane</h1>
						<h2 style={h2Gray}>Formula 1 data visualizer</h2>
						<a href="#APP-BODY">
							<Button color="primary" variant="raised">Start</Button>
						</a>
					</div>
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
				<LastRace />
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
						<img src={imgVettel} alt="race" className="navigator-img"></img>
						<h3>Driver</h3>
					</div>
					<div className="flex-1-3">
						<img src={imgRedBull} alt="race" className="navigator-img"></img>
						<h3>Team</h3> 
					</div>
				</div>
			</div>
		);
	}
}


// the latest race
class LastRace extends Component {
	constructor () {
		super();
		this.state = { "race": {} };
	}

	render() {
		return (
			<div>
				<h2>Last Race</h2>
			</div>
		);
	}
}

export default App;
