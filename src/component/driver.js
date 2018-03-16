// drivers homepage

// React core
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Plot from 'react-plotly.js';

// img
import imgRace from '../img/race.jpg';
import imgVettel from '../img/vettel.jpg';
import imgRedBull from '../img/redbull.jpg';

// common
import {
	Driver, Constructor, Time, Timings, httpBaseUrl, FastestLap
}	from '../common-objects';


//var httpBaseUrl = "http://localhost";


class DriverWrapper extends Component {
	render() {
		return (
			<div id="APP-BODY">
				<div>
					<h1 className="page-title">Drivers</h1>
				</div>
				
				<DriverNavigator />

				<hr />

				<FastestLapByDriver />

			</div>
		);
	}
}

// provide navigation (using router Links)
class DriverNavigator extends Component {
	render() {
		return (
			<div>
				<h2>View stats</h2>
				<div  className="flex-container flex-space-between component">
					<div className="flex-1-3 navigator-box">
						<Link to="/">
							<img src={imgRace} alt="home" className="navigator-img"></img>
							<h3>Home</h3>
						</Link>
					</div>
					<div className="flex-1-3 navigator-box">
						<Link to="/driver">
							<img src={imgVettel} alt="race" className="navigator-img"></img>
							<h3>Driver</h3>
						</Link>
					</div>
					<div className="flex-1-3 navigator-box">
						<img src={imgRedBull} alt="team" className="navigator-img"></img>
						<h3>Team</h3> 
					</div>
				</div>
			</div>
		);
	}
}



// fastest lap by each driver, in a given race
class FastestLapByDriver extends Component {
	raceReqpath = "current/last/";				// by default, query for the last race that happened
	resultReqPath = "results.json";				// we want results back in json, using default limits

	constructor () {
		super();

		this.state = { 			// these variables will be used in rendering; initial values listed below
			"race":{
				"raceName": "",
				"Circuit" : { "circuitName": "" },
				"date": 		"",
				"Results": [
					{Driver,Constructor,Time,FastestLap},			// data slots
				]
			}
		};
	}

	getDriverCodeArray () {
		return this.state.race.Results.map ( result =>
			{ return result.Driver.code; }
		);
	}

	getFastestLaps () {
		return this.state.race.Results.map ( result =>
			{ return result.FastestLap.Time.time; }
		);
	}

	getFastestLapsMillis () {
		return this.state.race.Results.map ( result =>
			{ return result.FastestLap.Time.millis; }
		);
	}

	render(){
		return(
			<div id="fastest-lap-by-driver">
				<h2>Fastest Lap of Each Driver</h2>
				<div className="flex-container-row flex-space-between flex-wrap">
					{this.state.race.Results.map ( (result, i) => 
						<div key={'card'+i} className="driver-info-card">
							<span key={"c"+i}>{result.Driver.code}</span>
							<span key={'t'+i}>{result.FastestLap.Time.time}</span>
						</div>
					)}
				</div>

				<Plot
					data={[
						{
							type: 'bar',
							orientation: 'h',
							x: this.getFastestLaps(),
							y: this.getDriverCodeArray(),
						}
					]}

					layout={{
						width: 640,
						height: 480,
						title: 'Yolo'
					}}
				/>

			</div>
		);
	}

	componentDidMount () {
		var url = httpBaseUrl + this.raceReqpath + this.resultReqPath;
		axios.get ( url ).then(
			res => {
				const results = res.data.MRData.RaceTable.Races["0"];
				this.setState ( {race: results} );
				console.log ( this.getFastestLaps() );
				console.log ( this.state );
			}
		).catch(
			err => { console.error(err); }
		);
	}
}

export default DriverWrapper;