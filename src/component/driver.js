// drivers homepage

// React core
import React, { Component } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

// img
import imgRace from '../img/race.jpg';
import imgVettel from '../img/vettel.jpg';
import imgRedBull from '../img/redbull.jpg';


var httpBaseUrl = "http://localhost";

class Driver extends Component {
	render() {
		return (
			<div id="APP-BODY">
				<div>
					<h1 className="page-title">Drivers</h1>
				</div>
				
				<DriverNavigator />

			</div>
		);
	}
}


class DriverNavigator extends Component {
	render() {
		return (
			<div>
				<h2>View stats</h2>
				<div  className="flex-container flex-space-between component">
					<div className="flex-1-3 navigator-box">
						<Link to="/#last-race">
							<img src={imgRace} alt="race" className="navigator-img"></img>
							<h3>Race</h3>
						</Link>
					</div>
					<div className="flex-1-3 navigator-box">
						<Link to="/driver">
							<img src={imgVettel} alt="race" className="navigator-img"></img>
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

export default Driver;