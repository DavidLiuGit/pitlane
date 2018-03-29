// drivers homepage

// React core
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Plot from 'react-plotly.js';

// img
import svgLaptime from '../img/laptime.svg';
import svgFastLap from '../img/fast-lap.svg';
import svgDriverTrophy from '../img/driver-trophy.svg';

// Material-UI
import Select from 'material-ui/Select';

// common
import {
	Driver, Constructor, Time, Timings, httpBaseUrl, FastestLap, 
	pitlaneApiBaseurl, ExtensibleDataComponent, ExtensibleNavigatorComponent,
	ExtensiblePageWrapperComponent
}	from '../common-objects';
import { 
	laptimeInSeconds, laptimeAsBullshitDate, liWrap,
	getElementHeight, getElementWidth, 
	process_object_to_array
} from '../common-functions';




class DriverWrapper extends ExtensiblePageWrapperComponent {
	render() {
		return (
			<div id="APP-BODY">
				<div>
					<h1 className="page-title">Drivers</h1>
				</div>
				
				<DriverNavigator />

				<hr />

				<Switch>
					<Route path="/driver/fastest-lap" component={() => <FastestLapByDriver seasons={this.state.seasons} /> } />
					<Route path="/driver/progression" component={() => <DriverProgression seasons={this.state.seasons} /> } />
					<Route path="/driver/laptimes" 		component={() => <DriverLaptimes seasons={this.state.seasons} /> } />
					<Redirect to="/driver/fastest-lap" />
				</Switch>
			</div>
		);
	}
}



// provide navigation (using router Links)
class DriverNavigator extends ExtensibleNavigatorComponent {
	render() {
		return (
			<div>
				<h2>View stats</h2>
				<div  className="flex-container flex-space-around component">
					{ this.getNavCard('/driver/fastest-lap', 'Fastest Lap', svgFastLap) }
					{ this.getNavCard('/driver/progression', 'Points Progression', svgDriverTrophy) }
					{ this.getNavCard('/driver/laptimes', 'Laptimes', svgLaptime) }
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
	reqpath						= "driver/standings_progression/";
	chartContainerId	= "driver-progression-chart-container";

	constructor () {
		super();

		this.state = {
			containerHeight: 100, containerWidth: 100,			// set initial values of plot container dimensions
			plotData : [{ mode: "", name: "", x: [], y:[] }],
			seasonSelected: "current",
		}
	}

	render () {
		return (
			<div id="driver-progression-component" className="flex-container-column full-height">	
				<h2>Driver Standings Progression</h2>

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot
						data={ this.state.plotData }
						layout={{
							autosize:true, width: this.state.containerWidth, height: this.state.containerHeight,
							title: "Driver Points Progression: " + this.state.season,
							xaxis: { title: "Round number" }, yaxis: { title: "Points"}
						}}
					/>
				</div>
			</div>
		);
	}

	do_request () {
		var url = pitlaneApiBaseurl + this.reqpath + this.state.seasonSelected;
		axios.get ( url ).then ( res => {
			var processed_data = this.process_object_to_array ( res.data.fullname, res.data.points_after_round );
			console.log ( processed_data );
			this.setState ( {plotData: processed_data, season: res.data.year } );
		}).catch ( err => { 
			console.error(err); 
		} );
	}

	// take in json object and arrays, spit out a nice array of objects
	// in each object, x=array of rounds, y=array of scores in corresponding rounds, name=dataset name, mode="lines+markers"
	process_object_to_array ( driver_arr, obj_arr, _mode="lines+markers" ) {
		var ret = [];
		for ( var i = 0; i < driver_arr.length; i++ ){
			var obj = { mode: _mode, name:driver_arr[i], x: [], y: [] };
			for ( var round in obj_arr[i] ){
				obj.x.push ( round );									// push round number
				obj.y.push ( obj_arr[i][round] );			// push score
			}
			ret.push ( obj );
		}
		return ret;
	}
}



class DriverLaptimes extends ExtensibleDataComponent {
	reqpath 				= "driver/laptimes/";
	chartContainerId= "driver-race-laptime-chart-container";

	constructor () {
		super ()
		this.state = {
			chartType: "box",
			containerHeight: 100, containerWidth: 100,			// set initial values of plot container dimensions
			seasonSelected: "current", roundSelected: "last",
		};
	}

	getPlot () {
		switch ( this.state.chartType ){
			case "box":

		}
	}

	getRoundOptionsArray ( season ) {
		return null;
	}

	render () {
		return (
			<div id="driver-race-laptime-component" className="flex-container-column full-height">
				<h2>Driver Lap Times </h2>
				<span className="align-left options-bar">
					<span> Select season: &nbsp;
						<select value={this.state.seasonSelected} className="pill" 
							onChange={event => { this.setState({ seasonSelected: event.target.value })} }>
							{ this.getSeasonsOptionsArray() }
						</select>
					</span>
					<span> Select race: &nbsp;
						<select value={this.state.roundSelected} className="pill"
							onChange={event => { this.setState({ roundSelected: event.target.value })} }>
							{ this.getRoundOptionsArray() }
						</select>
					</span>
					<span>
						<button className="btn pill primary transition-0-15" onClick={this.do_request.bind(this)} >Change Race</button>
					</span>
				</span>

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot
						data={ this.state.plotData }
						layout={{
							autosize:true, width: this.state.containerWidth, height: this.state.containerHeight,
							title: "Driver Lap Times: " + this.state.season,
							xaxis: { title: "Lap Time (s)" }, 
						}}
					/>
				</div>
			</div>
		);
	}

	do_request () {
		var url = pitlaneApiBaseurl + this.reqpath + `${this.state.seasonSelected}/${this.state.roundSelected}`;
		axios.get ( url ).then ( res => {
			var processed_data = process_object_to_array ( res.data.code, res.data.laptimes, "box-horizontal" );
			this.setState ( {plotData: processed_data, season: res.data.year } );
		}).catch ( err => { 
			console.error(err); 
		});
	}
}


export default DriverWrapper;