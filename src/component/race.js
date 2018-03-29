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
	
}


export default RaceWrapper;