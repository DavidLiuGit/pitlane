// stats by race homepage

// React core
import React /*, { Component }*/ from 'react';
import axios from 'axios';
// import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Plot from 'react-plotly.js';

// img
import svgLaptime from '../img/laptime.svg';
// import svgFastLap from '../img/fast-lap.svg';

// common
import {
	ExtensiblePageWrapperComponent, ExtensibleDataComponent, ExtensibleNavigatorComponent,
	ExtensibleDataComponentWithRoundFetch,
	pitlaneApiBaseurl,
} from '../common-objects';
import { process_object_to_array, laptimeInSeconds } from '../common-functions';



class RaceWrapper extends ExtensiblePageWrapperComponent {
	render () {
		return (
			<div id="APP-BODY">
				<div><h1 className="page-title">Races</h1></div>

				<RaceNavigator />

				<hr />

				<QualifyingLaptimeByRound seasons={this.state.seasons} rounds={this.state.rounds} /><hr />
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

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot
						data={ this.state.plotData }
						layout={{
							autosize:true, width: this.state.containerWidth, height: this.state.containerHeight,
							title: "Qualifying Lap Time Distribution: ", // + this.state.season + ' round ' + this.state.round,
							xaxis: { title: "Lap Time (s)" }, yaxis: { title: "Qualifying Round" },
						}}
					/>
				</div>
				
			</div>
		);
	}

	do_request () {
		var url = pitlaneApiBaseurl + `${this.reqpath}/${this.state.seasonSelected}/${this.state.roundSelected}`;
		axios.get ( url ).then ( res => {
			var processed_data = this.process_object_to_chart_array ( res.data, {boxpoints: 'all', pointpos: 0,} );
			this.setState ( { plotData: processed_data } );
			//console.log ( this.state.plotData );
		}).catch ( err => console.error(err) );
	}

	// process response, in the form { q1: [...], q2: [...], ... }, to the form 
	process_object_to_chart_array ( obj, custom_attrs=null ) {
		var ret = [];
		for ( var rnd in obj ){
			var timeInSecondsArr = obj[rnd].map ( time => laptimeInSeconds ( time ) );
			var chart_obj = { type: 'box', name: rnd, x: timeInSecondsArr };
			if (custom_attrs) chart_obj = Object.assign ( chart_obj, custom_attrs);
			ret.push ( chart_obj );
		}
		return ret;
	}
}


export default RaceWrapper;