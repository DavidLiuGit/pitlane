import React, { Component } from 'react';
import Button from 'material-ui/Button';
import axios from 'axios';

// stylesheets
import './css/App.css';
import './css/responsive.css';

// components
//import { Navigator } from './main-body';


// img
import imgRace from './img/race.jpg';
import imgVettel from './img/vettel.jpg';
import imgRedBull from './img/redbull.jpg';


// global constants - fuck you I use constants if I want to
var httpBaseUrl = "http://ergast.com/api/f1/";

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

		var driver = {				// driver data template
			"number": "",
			"Driver": {
				"code": "",
				"givenName": "",
				"familyName": "",
			}
		}

		var constructor = {		// constructor as in racing team, not that javascript shit
			"name": "",
		}

		this.state = { 			// these variables will be used in rendering; initial values listed below
			"race":{
				"raceName": "Loading...",
				"Circuit" : { "circuitName": "" },
				"date": 		"",
				"results": [
					{driver,constructor},			// reserve 3 data slots for drivers
					{driver,constructor},
					{driver,constructor},
				]
			}
		};

	}

	render() {
		return (
			<div>
				<h2>Last Race</h2>
				<div id="last-race-container" className="flex-container flex-space-between">

					<div className="flex-1-2">
						<h3>{this.state.race.raceName}</h3>
						<h4>{this.state.race.Circuit.circuitName}</h4>
						<span>{this.state.race.date}</span>
					</div>

					<div className="flex-1-2">
						<h3>Standings</h3>

					</div>

				</div>
			</div>
		);
	}

	componentDidMount () {
		var url = httpBaseUrl + "current/last/results.json?limit=3";
		axios.get ( url ).then(
			res => {
				const results = res.data.MRData.RaceTable.Races["0"];
				this.setState ( {race: results} );
				console.log ( results );
			}
		).catch(
			err => { console.error(err); }
		);
	}
}

export default App;
