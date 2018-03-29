// common functions/methods
import React from 'react';
import axios from 'axios';
import { pitlaneApiBaseurl } from './common-objects';

// wrap whatever you passed in with <li>; props options
export function liWrap ( input, props = null ) {
	return ( <li> {input} </li> );									// not set up to handle props yet!
}

// convert time in M:SS:mmm format to seconds (e.g. 1:24:831)
export function laptimeInSeconds ( input ) {
	var inputArr = input.toString().split (':');				// split on colon
	return Number(inputArr[0] * 60) + Number(inputArr[1]);
}

// convert lap times to Date, lap time in M:SS.mmmm (e.g. 1:24:831)
export function laptimeAsBullshitDate ( input, date = null ){
	var prefix = date ? date : "1970-01-01T00:0";
	return new Date(prefix+input);
}

// get element height
export function getElementHeight ( elementID ) {
	try {
		return document.getElementById ( elementID ).offsetHeight;
	} catch (e) {
		return 0;
	}
}

// get elementWidth
export function getElementWidth ( elementID ) {
	try {
		return document.getElementById ( elementID ).offsetWidth;
	} catch (e) {
		return 0;
	}
}

// get information about the races in a year (for which race results are available)
export function getRacesInYear ( year ) {
	var url = pitlaneApiBaseurl + `year_round_lut/${year}`;//"year_round_lut";
	return axios.get ( url ).then ( res => {
		//res.data.year.unshift("current");
		const data = res.data;
		//this.setState ( {seasons: data} );
		console.log ( data );
		return data;
	}).catch (
		err => console.error ( err )
	)
}

// process responses in the form of a Postgres JSON pivot table; output an array of plottable objects
// in each object, x=array of attrs, y=array of scores in corresponding attrs, name=dataset name, mode="lines+markers"
export function process_object_to_array ( group, data_col, _mode="lines+markers" ) {
	var ret = [];
	for ( var i = 0; i < group.length; i++ ){

		switch ( _mode ) {
			case "lines+markers" : {
				var obj = { mode: _mode, name:group[i], x: [], y: [] };
				for ( var attr in data_col[i] ){
					obj.x.push ( attr );				
					obj.y.push ( data_col[i][attr] );	
				}
				break;
			} case "box-horizontal" : {
				var obj = { type: "box", name:group[i], x: [] };
				for ( var attr in data_col[i] ) {
					obj.x.push ( data_col[i][attr] );				// we can omit the y axis value for box charts
				}
				break;
			}
			default :
				console.error ( "What the fuck dude? This mode isn't accepted" );
		}

		ret.push ( obj );
	}
	return ret;
}
