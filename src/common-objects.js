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
		this.getSeasonsArray();
	}

	getSeasonsArray () {
		var url = pitlaneApiBaseurl + "seasons";
		axios.get ( url ).then ( res => {
			res.data.year.unshift("current");
			const data = res.data.year;
			this.setState ( {seasons: data} );
			console.log ( "wrapper setstate done");
		}).catch (
			err => console.error ( err )
		)
		console.log ( "page wrapper mounted and done!");
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
};