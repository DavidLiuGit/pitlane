// core
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

// Material UI
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
//import {yellow600} from 'material-ui/styles/colors';

// stylesheets
import './css/App.css';
import './css/responsive.css';
import './css/animation.css';

// components
import Driver from './component/driver';
import Navbar from './component/navbar';

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

				<Switch>
					<Route path="/driver" component={Navbar}/>
					<Route path="/" component={Splash}/>
				</Switch>

				<Switch>
					<Route path="/driver" component={Driver}/>
					<Route path="/" component={Body}/>
				</Switch>

      </div>
    );
  }
}



class Splash extends Component {
	render(){
		var h2Gray = { color: '#ddd' };
		return(
			<div className="App-header">
				<div className="">
					<h1>Pitlane</h1>
					<h2 style={h2Gray}>Formula 1 data visualizer</h2>
					<a href="#APP-BODY">
						<Button color="primary" variant="raised">Start</Button>
					</a>
				</div>
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
			<div >
				<h2>View stats by</h2>
				<div  className="flex-container flex-space-between component">
					<div className="flex-1-3 navigator-box">
						<Link to="/#last-race">
							<img src={imgRace} alt="race" className="navigator-img"></img>
							<h3>Race</h3>
						</Link>
					</div>
					<div className="flex-1-3 navigator-box">
						<Link to="/driver">
							<img src={imgVettel} alt="race" className="navigator-img animated fadeIn delay-06s"></img>
							<h3>Driver</h3>
						</Link>
					</div>
					<div className="flex-1-3 navigator-box">
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

		var Driver = {				// driver data template
			"code": "",
			"givenName": "",
			"familyName": "",			
		}
		var Constructor = {		// constructor as in racing team, not that javascript shit
			"name": "",
		}
		var Time = {					// time object (given as a delta for positions 2+)
			"time": ""
		}

		this.state = { 			// these variables will be used in rendering; initial values listed below
			"race":{
				"raceName": "Loading...",
				"Circuit" : { "circuitName": "" },
				"date": 		"",
				"Results": [
					{Driver,Constructor,Time},			// reserve 3 data slots for drivers
					{Driver,Constructor,Time},
					{Driver,Constructor,Time},
				]
			}
		};

	}

	render() {
		//console.log ( this.state );
		return (
			<div id="last-race">
				<h2>Last Race</h2>
				<div className="flex-container flex-space-between component">

					<div className="race-description">
						<h3>{this.state.race.raceName}</h3>
						<h4>{this.state.race.Circuit.circuitName}</h4>
						<span>{this.state.race.date}</span>
					</div>

					<div className="flex-grow-3">
						<h3>Results</h3>
						<div className="flex-container-row flex-space-between">

							<div className="flex-grow-3 flex-container-row">
								<div>
									<Avatar>
										{this.state.race.Results[0].number}
									</Avatar>
									<h3>1st</h3>
								</div>
								<span className="flex-grow-3 driver-info-card">
									<h4>
										{/*note that the trailing (breaking) space is added so that we can get line breaks properly*/}
										{this.state.race.Results[0].Driver.givenName + " "}
										{this.state.race.Results[0].Driver.familyName} 
									</h4>
									<h5>{this.state.race.Results[0].Constructor.name}</h5>
									<p>{this.state.race.Results[0].Time.time}</p>
								</span>
							</div>

							<div className="flex-grow-3 flex-container-row">
								<div>
									<Avatar>
										{this.state.race.Results[1].number}
									</Avatar>
									<h3>2nd</h3>
								</div>
								<span className="flex-grow-3 driver-info-card">
									<h4>
										{this.state.race.Results[1].Driver.givenName + " "}
										{this.state.race.Results[1].Driver.familyName} 
									</h4>
									<h5>{this.state.race.Results[1].Constructor.name}</h5>
									<p>{this.state.race.Results[1].Time.time}</p>
								</span>
							</div>

							<div className="flex-grow-3 flex-container-row">
								<div>
									<Avatar>
										{this.state.race.Results[2].number}
									</Avatar>
									<h3>3rd</h3>
								</div>
								<span className="flex-grow-3 driver-info-card">
									<h4>
										{this.state.race.Results[2].Driver.givenName + " "}
										{this.state.race.Results[2].Driver.familyName} 
									</h4>
									<h5>{this.state.race.Results[2].Constructor.name}</h5>
									<p>{this.state.race.Results[2].Time.time}</p>
								</span>
							</div>

						</div>
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
