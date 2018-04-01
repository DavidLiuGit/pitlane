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
	ExtensibleDataComponentWithRoundFetch,
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


class QualifyingLaptimeByRound extends ExtensibleDataComponentWithRoundFetch {
	reqpath 					= "race/quali_laptimes";
	chartContainerId	= "qualifying-lap-time-by-round-chart-container";

	constructor () {
		super();
		this.state = {
			containerHeight: 100, containerWidth: 100,													// initial values of plot container dimensions
			seasonSelected: "current", roundSelected: "last", rounds: {},
			//chartType= "box",
		}

	}

	
	render () {
		return (
			<div id="qualifying-lap-time-by-round" className="flex-container-column full-height"> 
				<h2>Qualifying Lap Time, by Round</h2>
				<span className="align-left options-bar flex-container">
					{ this.elementSeasonSelect () }
					{ this.elementRoundSelect () }
					<span>
						<button className="btn pill primary transition-0-15" onClick={this.do_request.bind(this)} >Change Race</button>
					</span>
				</span>

				
			</div>
		);
	}
}


export default RaceWrapper;