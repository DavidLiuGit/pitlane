// stats by team

// React core
import React, { Component } from 'react';
import axios from 'axios';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import Plot from 'react-plotly.js';

// img
import imgRace from '../img/race.jpg';
import imgVettel from '../img/vettel.jpg';
import imgRedBull from '../img/redbull.jpg';

// material ui
import Button from 'material-ui/Button';

// common
import {
	Driver, Constructor, Time, Timings, httpBaseUrl, FastestLap, 
	pitlaneApiBaseurl, ExtensibleDataComponent, ExtensibleNavigatorComponent,
}	from '../common-objects';
import {
	getElementHeight, getElementWidth, 
} from '../common-functions';



class TeamWrapper extends ExtensibleNavigatorComponent {
	constructor () {
		super()
		this.state = {
			seasons: ["current"]
		}
	}

	render() {
		return (
			<div id="APP-BODY">
				<div>
					<h1 className="page-title">Teams</h1>
				</div>

				<TeamNavigator />

				<hr />
				{/*<TeamStandings seasons={this.state.seasons} />*/}
				
				<Switch>
					<Route path="/team/standings" component={() => <TeamStandings seasons={this.state.seasons} />} />
					<Route path="/team/progression" component={() => <TeamProgression seasons={this.state.seasons} />} />
					<Redirect to="/team/standings" />
					{/*<TeamStandings seasons={this.state.seasons} /> */}
				</Switch>

			</div>
		);
	}

	componentDidMount () {
		// get list of seasons
		if (this.unmounted) return;
		var url = pitlaneApiBaseurl + "seasons";
		axios.get ( url ).then ( res => {
			res.data.year.unshift("current");
			const data = res.data.year;
			this.setState ( {seasons: data} );
			console.log ( "wrapper setstate done");
		}).catch (
			err => console.error ( err )
		)
	}
}



// navigation
class TeamNavigator extends ExtensibleNavigatorComponent {
	render() {
		return (
			<div>
				<h2>View stats</h2>
				<div  className="flex-container flex-space-around component">
					{ this.getNavCard ( '/team/standings', 'Standings', imgRace ) }
					{ this.getNavCard ( '/team/progression', 'Points Progression', imgRedBull ) }
				</div>
			</div>
		);
	}
}






// display plot of team points progression throughout season
class TeamProgression extends ExtensibleDataComponent {
	// request path: /team/standings_progression/<year>
	reqpath						= "team/standings_progression/";
	chartContainerId 	= "team-progression-chart-container";

	constructor () {
		super();

		this.state = {
			containerHeight: 100, containerWidth: 100,
			plotData : [{ mode: "", name: "", x: [], y:[] }],
			seasonSelected: "current",
		}
	}

	getSeasonsOptionsArray () {
		return this.props.seasons.map ( (year,i) => {
			return ( <option key={i} value={year}>{year}</option> );
		});
	}

	render() {
		return (
			<div id="team-progression-component" className="flex-container-column full-height">
				<h2>Team Standings Progression</h2>
				<span className="align-left options-bar">
					<span>
						Select season: &nbsp;
						<select value={this.state.seasonSelected} className="pill" 
							onChange={event => { this.setState({ seasonSelected: event.target.value })} }>
							{ this.getSeasonsOptionsArray() }
						</select>
					</span>
					<span>
						<button className="btn pill primary transition-0-15" onClick={this.do_request.bind(this)} >Change Season</button>
					</span>
				</span>

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot  
						data={ this.state.plotData }
						layout={{
							autosize: true,
							width: this.state.containerWidth,
							height: this.state.containerHeight,
							title: "Team progression: " + this.state.season,
							xaxis: { title: "Round number" },
						}}
						useResizeHandler={true}
					/>
				</div>

			</div>
		);
	}


	do_request () {
		var url = pitlaneApiBaseurl + this.reqpath + this.state.seasonSelected;
		axios.get ( url ).then ( res => {
			var processed_data = this.process_object_to_array ( res.data.name, res.data.points_after_round );
			console.log ( processed_data );
			this.setState ( {plotData: processed_data, season: res.data.year } );
		}).catch ( err => { 
			console.error(err); 
		} );
	}

	// take in json object and arrays, spit out a nice array of objects
	// in each object, x=array of rounds, y=array of scores in corresponding rounds, name=dataset name, mode="lines+markers"
	process_object_to_array ( team_arr, obj_arr, _mode="lines+markers" ) {
		var ret = [];
		for ( var i = 0; i < team_arr.length; i++ ){
			var obj = { mode: _mode, name:team_arr[i], x: [], y: [] };
			for ( var round in obj_arr[i] ){
				obj.x.push ( round );									// push round number
				obj.y.push ( obj_arr[i][round] );			// push score
			}
			ret.push ( obj );
		}
		return ret;
	}

}



// current points standings by team
class TeamStandings extends ExtensibleDataComponent {
	
	//raceReqpath 		= "current/";				// get current season standings - no need to specify round
	roundReqpath		= "";								// but just in case we need it in the future...
	resultReqpath		= "constructorStandings.json";
	chartContainerId= "team-standings-chart-container";
	initialReqDone	= false;

	constructor () {
		super();

		this.state = {
			"data": {
				"season": null,
				"round": "",
				"ConstructorStandings": [
					{
						"position": "",
						"points": "",
						"wins": "",
						Constructor,
					}
				]
			},
			"seasonSelected" : "current"
		}
	}

	// array assemblers
	getConstructorArray () {
		return this.state.data.ConstructorStandings.map ( result =>
			{ return result.Constructor.name; }
		);
	}

	getPointsArray () {
		return this.state.data.ConstructorStandings.map ( result =>
			{ return result.points; }
		);
	}

	getWinsArray () {
		return this.state.data.ConstructorStandings.map ( result => 
			{ return result.wins; }
		);
	}

	getSeasonsOptionsArray () {
		return this.props.seasons.map ( (year,i) => {
			return ( <option key={i} value={year}>{year}</option> );
		});
	}

	render () {
		return (
			<div id="team-standings-component" className="flex-container-column full-height">
				<h2>Team Standings</h2>
				<span className="align-left options-bar">
					<span>
						Select season: &nbsp;
						<select value={this.state.seasonSelected} className="pill" 
							onChange={event => { this.setState({ seasonSelected: event.target.value })} }>
							{ this.getSeasonsOptionsArray() }
						</select>
					</span>
					<span>
						<button className="btn pill primary transition-0-15" onClick={this.do_request.bind(this)} >Change Season</button>
					</span>
				</span>

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot
						data={[{
								type: 'bar',
								orientation: 'h',
								x: this.getPointsArray(),
								y: this.getConstructorArray(),
						}]}

						layout={{
							autosize: true,
							width: this.state.containerWidth,
							height: this.state.containerHeight,
							title: "Team standings: " + this.state.data.season + ", round " + this.state.data.round,
							xaxis: { title: "Points earned" },
							//yaxis: { title: "Team name" }			// pretty self explanatory...
						}}
					/>
				</div>
			</div>
		);
	}


	// make request to server
	do_request () {
		console.log ( "doing request" );
		//console.trace();
		var url = httpBaseUrl + this.state.seasonSelected + '/' + this.roundReqpath + this.resultReqpath;
		axios.get ( url ).then (
			res => {
				const results = res.data.MRData.StandingsTable.StandingsLists[0];
				this.setState ( { data: results } );
				console.log ( "component setstate done");
			}
		).catch (
			err => { console.error(err); }
		)
	}

}




export default TeamWrapper;