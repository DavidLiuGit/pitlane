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

// common
import {
	Driver, Constructor, Time, Timings, httpBaseUrl, FastestLap
}	from '../common-objects';
import {
	getElementHeight, getElementWidth, 
} from '../common-functions';



class TeamWrapper extends Component {
	render() {
		return (
			<div id="APP-BODY">
				<div>
					<h1 className="page-title">Teams</h1>
				</div>

				<TeamNavigator />

				<hr />

				<TeamStandings />

			</div>
		);
	}
}



// navigation
class TeamNavigator extends Component {
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
						<Link to="/team">
							<img src={imgRedBull} alt="team" className="navigator-img"></img>
							<h3>Team</h3> 
						</Link>
					</div>
				</div>
			</div>
		);
	}
}



// current points standings by team
class TeamStandings extends Component {
	raceReqpath 		= "current/";				// get current season standings - no need to specify round
	roundReqpath		= "";								// but just in case we need it in the future...
	resultReqpath		= "constructorStandings.json";
	chartContainerId= "team-standings-chart-container";

	constructor () {
		super();

		this.state = {
			"data": {
				"season": "",
				"round": "",
				"ConstructorStandings": [
					{
						"position": "",
						"points": "",
						"wins": "",
						Constructor,
					}
				]
			}
		}
	}

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


	render () {
		return (
			<div id="team-standings-component" className="flex-container-column full-height">
				<h2>Team Standings</h2>

				<div id={this.chartContainerId} className="flex-grow-3">
					<Plot
						data={[{
								type: 'bar',
								orientation: 'h',
								x: this.getPointsArray(),
								y: this.getConstructorArray(),
						}]}

						layout={{
							title: "Team standings",
							width: getElementWidth(this.chartContainerID),
							height: getElementHeight(this.chartContainerID),
							xaxis: { title: "Points earned" },
							//yaxis: { title: "Team name" }			// pretty self explanatory...
						}}
					/>
				</div>
			</div>
		);
	}


	componentDidMount () {
		var url = httpBaseUrl + this.raceReqpath + this.roundReqpath + this.resultReqpath;
		axios.get ( url ).then (
			res => {
				const results = res.data.MRData.StandingsTable.StandingsLists[0];
				this.setState ( { data: results } );
				console.log ( this.state );
			}
		).catch (
			err => { console.error(err); }
		)
	}

}


export default TeamWrapper;