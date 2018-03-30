// stats by race homepage

// React core
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Plot from 'react-plotly.js';

// img
import svgLaptime from '../img/laptime.svg';
import svgFastLap from '../img/fast-lap.svg';

// Material-UI


// common
import {
	ExtensiblePageWrapperComponent, ExtensibleDataComponent, ExtensibleNavigatorComponent,
} from '../common-objects';



class RaceWrapper extends ExtensiblePageWrapperComponent {
	render () {
		return (
			<div id="APP-BODY">
				<div><h1 className="page-title">Races</h1></div>

				<RaceNavigator />

				<hr />

				<Switch>
					<Route path="/race/quali_laptimes" component={() => <QualifyingLaptimeByRound seasons={this.state.seasons} rounds={this.state.rounds} /> } />
					<Redirect to="/race/quali_laptimes" />
				</Switch>
			</div>
		)
	}
}

class RaceNavigator extends ExtensibleNavigatorComponent {
	render() {
		return (
			<div>
				<h2>View stats</h2>
				<div className="flex-container flex-space-around component">
					{ this.getNavCard ('/race/qualifying-laptime-by-round', "Qualifying Laptime By Round", svgLaptime) }
				</div>
			</div>
		);
	}
}


class QualifyingLaptimeByRound extends ExtensibleDataComponent {
	reqpath 					= "race/quali_laptimes";
	chartContainerId	= "qualifying-lap-time-by-round-chart-container";

	constructor () {
		super();
		this.state = {
			containerHeight: 100, containerWidth: 100,													// initial values of plot container dimensions
			seasonSelected: "current", roundSelected: "last", rounds: {},
			//chartType= "box",
		}

		const hullo = ( <h2>Hello World</h2> );
	}

	
	render () {
		return (
			<div id="qualifying-lap-time-by-round" className="flex-container-column full-height"> 
				<h2>Yeet</h2>
				{ this.hullo }
			</div>
		);
	}
}


export default RaceWrapper;