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

// Material-UI
import Select from 'material-ui/Select';

// common
import {
	Driver, Constructor, Time, Timings, httpBaseUrl, FastestLap, 
	pitlaneApiBaseurl, ExtensibleDataComponent,
}	from '../common-objects';
import { 
	laptimeInSeconds, laptimeAsBullshitDate, liWrap,
	getElementHeight, getElementWidth, 
} from '../common-functions';




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
				<div  className="flex-container flex-space-around component">
					<div className="flex-1-3 navigator-box">
						<Link to="/">
							<img src={imgRace} alt="home" className="navigator-img"></img>
							<h3>Home</h3>
						</Link>
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
	chartContainerID = "fastest-lap-by-driver-chart-container";

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

	getFastestLapsAsDate () {
		return this.state.race.Results.map ( result =>
			{ return laptimeAsBullshitDate (result.FastestLap.Time.time); }
		);
	}

	getFastestLapsSeconds () {
		return this.state.race.Results.map ( result =>
			{ return laptimeInSeconds(result.FastestLap.Time.time); }
		);
	}

	getFastestLaps () {
		return this.state.race.Results.map ( result =>
			{ return result.FastestLap.Time; }
		);
	}

	render(){
		return(
			<div id="fastest-lap-by-driver" className="flex-container-column full-height">
				<h2>Fastest Lap of Each Driver</h2>


				<div id={this.chartContainerID} className="flex-grow-3">
					<Plot
						data={[
							{
								type: 'bar',
								orientation: 'h',
								x: this.getFastestLapsSeconds(),
								y: this.getDriverCodeArray(),
							}
						]}

						layout={{
							autosize: true,
							width: getElementWidth(this.chartContainerID),
							height: getElementHeight(this.chartContainerID),
							title: 'Fastest Lap Time of Each Driver',
							xaxis: { title: "Lap time (seconds)" },
							yaxis: { title: "Driver (code)" }
						}}
					/>
				</div>

			</div>
		);
	}

	componentDidMount () {
		var url = httpBaseUrl + this.raceReqpath + this.resultReqPath;
		axios.get ( url ).then(
			res => {
				const results = res.data.MRData.RaceTable.Races["0"];
				this.setState ( {race: results} );
				console.log ( getElementHeight(this.chartContainerID) + ' ' + getElementWidth(this.chartContainerID) );
			}
		).catch(
			err => { console.error(err); }
		);
	}
}


class DriverProgression extends ExtensibleDataComponent {

}


export default DriverWrapper;