// common objects that are used in multiple components
import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
	getElementHeight, getElementWidth,
} from './common-functions';


/******************************************************************************
 * DATA OBJECT TEMPLATES
*******************************************************************************/

// driver data template
var Driver = {				
	"code": "",             // e.g. BOT (Bottas), HAM (Hamilton)
	"givenName": "",        // first name
	"familyName": "",		// last name
	"driverId": "",			// e.g. "bottas", usually lower case of last name
}

// constructor as in racing team, not that javascript shit
var Constructor = {		
	"name": "",
}

// time object (given as a delta for positions 2+)
var Time = {					
	"time": "",
	"millis": ""
}

// lap timings
var Timings = {
	"driverId" : "",
	"position" : "",
	"time" : "",
}

// fastest lap
var FastestLap = {
	"rank": "",
	"lap": "",
	Time: {
		"time": "",
	},
	"AverageSpeed": {
		"units": "",
		"speed": "",
	}
}



/******************************************************************************
 * PREDEFINED VARS
*******************************************************************************/

// beginning of the URL where we will make our API calls
var httpBaseUrl = "http://ergast.com/api/f1/";
var pitlaneApiBaseurl = "http://localhost:6969/";



/******************************************************************************
 * ABSTRACT (EXTENSIBLE) COMPONENTS
*******************************************************************************/

// extensible charting component - this is an abstract class and should not be rendered
class ExtensibleDataComponent extends Component {
	chartContainerId = ""
	pushStateChartContainerSize () {
		this.setState({
			containerWidth: getElementWidth( this.chartContainerId ),
			containerHeight:getElementHeight( this.chartContainerId ),
		})
	}

	componentDidMount () {
		this.do_request();
		this.pushStateChartContainerSize();
	}

	getSeasonsOptionsArray () {
		if ( !this.props.seasons ) return null;
		return this.props.seasons.map ( (year,i) => {
			return ( <option key={i} value={year}>{year}</option> );
		});
	}

	elementSeasonSelect ( label="Select season:" ) {
		return (
			<span> {label} &nbsp;
				<select value={this.state.seasonSelected} className="pill" 
					onChange={event => { this.setState({ seasonSelected: event.target.value })} }>
					{ this.getSeasonsOptionsArray () }
				</select>
			</span>
		);
	}

	do_request () { return; }
}

// another extensible chart - this one adds support for fetching year_round_lut lookups
class ExtensibleDataComponentWithRoundFetch extends ExtensibleDataComponent {
	fetchRacesInYear ( year ) {
		console.log ( "fetching rnds for " + year );
		var url = pitlaneApiBaseurl + `year_round_lut/${year}`;
		axios.get ( url ).then ( res => {
			this.setState ( { rounds : { [year]: res.data} } );
		}).catch (
			err => console.error ( err )
		)
	}

	getRoundOptionsArray ( year ) {
		// if year is "current", look for it in props
		if ( year == "current" ) {
			if ( this.props.rounds && "current" in this.props.rounds ){
				return Object.keys(this.props.rounds[year]).reverse().map ( (rnd,i) => {
					return ( <option key={rnd} value={rnd}>{this.props.rounds[year][rnd]['race_name']}</option> );
				});
			} else return null;
		}
			
		// if year is NOT current, look for it in state.rounds; if it isn't there, fetch it from server
		if ( this.state.rounds && year in this.state.rounds ) {
			return Object.keys ( this.state.rounds[year] ).reverse().map ( (rnd,i) => {
				return ( <option key={rnd} value={rnd}>{this.state.rounds[year][rnd]['race_name']}</option> );
			});
		} else {
			this.fetchRacesInYear ( year );		// this will trigger setState; which will trigger this function again
			return ( <option value="" disabled>Loading...</option> );		// return a loading "message"
		}

		return null;							// when nothing else works
	}

	

	elementRoundSelect ( label="Select race:" ) {
		return (
			<span> { label } &nbsp;
				<select value={this.state.roundSelected} className="pill"
					onChange={event => { this.setState({ roundSelected: event.target.value })} }>
					{ this.getRoundOptionsArray(this.state.seasonSelected ) }
				</select>
			</span>
		);
	}
}

// note that the "Extensible" prefix implies that the class is a "template" or meant to be abstract
class ExtensibleNavigatorComponent extends Component {
	getNavCard ( link, title, img ) {
		return (
			<div className="flex-1-3 navigator-box">
				<Link to={link}>
					<img src={img} alt={title} className="navigator-img transition-0-25"></img>
					<h3>{title}</h3>
				</Link>
			</div>
		)
	}
}

// page wrappers - will determine what children components need to be rendered
class ExtensiblePageWrapperComponent extends Component {
	constructor () {
		super()
		this.state = {
			seasons: ["current"]
		}
	}

	componentDidMount () {
		this.fetchSeasonsArray();
		this.fetchRacesInYear ("current");
	}

	fetchSeasonsArray () {
		var url = pitlaneApiBaseurl + "seasons";
		axios.get ( url ).then ( res => {
			res.data.year.unshift("current");
			const data = res.data.year;
			this.setState ( {seasons: data} );
		}).catch (
			err => console.error ( err )
		)
	}

	fetchRacesInYear ( year ) {
		var url = pitlaneApiBaseurl + `year_round_lut/${year}`;
		axios.get ( url ).then ( res => {
			this.setState ( { "rounds": { [year]: res.data } } );
		}).catch (
			err => console.error ( err )
		)
	}
}




export { 
	Driver, 
	Constructor, 
	Time, 
	Timings, 
	FastestLap,
	httpBaseUrl,
	pitlaneApiBaseurl,
	ExtensibleDataComponent,
	ExtensibleNavigatorComponent,
	ExtensiblePageWrapperComponent,
	ExtensibleDataComponentWithRoundFetch,
};