// common functions/methods
import React from 'react';
import axios from 'axios';
import { pitlaneApiBaseurl } from './common-objects';


// convert time in M:SS:mmm format to seconds (e.g. 1:24:831)
/**
 * Given a time in M:SS:mmm format, convert it to a value in seconds
 * @param {string} input 
 * @returns {number} time, in seconds
 */
export function laptimeInSeconds ( input ) {
	var inputArr = input.toString().split (':');				// split on colon
	return Number(inputArr[0] * 60) + Number(inputArr[1]);
}

// convert lap times to Date, lap time in M:SS.mmmm (e.g. 1:24:831)
export function laptimeAsBullshitDate ( input, date = null ){
	var prefix = date ? date : "1970-01-01T00:0";
	return new Date(prefix+input);
}

/**
 * Get the height of an element, given its ID
 * @param {string} elementID 
 */
export function getElementHeight ( elementID ) {
	try {
		return document.getElementById ( elementID ).offsetHeight;
	} catch (e) {
		return 0;
	}
}

/**
 * Get the width of an element, given its ID
 * @param {string} elementID 
 */
export function getElementWidth ( elementID ) {
	try {
		return document.getElementById ( elementID ).offsetWidth;
	} catch (e) {
		return 0;
	}
}


/**
 * Process responses in the form of a Postgres JSON pivot table; output an array of plottable objects
 * in each object, x=array of attrs, y=array of scores in corresponding attrs, name=dataset name, mode="lines+markers" 
 * @param {string} group key of the array containing labels of groups
 * @param {string} data_col key of array containing the data
 * @param {string} _mode chart mode; defaults to "line+markers"
 * @param {object} custom_attrs object containing any custom attributes that should be 
 */
export function process_object_to_array ( group, data_col, _mode="lines+markers", custom_attrs=null ) {
	var ret = [];
	for ( var i = 0; i < group.length; i++ ){

		switch ( _mode ) {
			case "lines+markers" : {
				var obj = { mode: _mode, name:group[i], x: [], y: [] };
				if ( custom_attrs ) obj = Object.assign ( obj, custom_attrs );
				for ( var attr in data_col[i] ){
					obj.x.push ( attr );				
					obj.y.push ( data_col[i][attr] );	
				}
				break;
			} case "box-horizontal" : {
				var obj = { type: "box", name:group[i], x: [] };
				if ( custom_attrs ) obj = Object.assign ( obj, custom_attrs );
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



/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function mergeDeep (...objects) {
	let t0 = performance.now();
	const isObject = obj => obj && typeof obj === 'object';
	
	let res = objects.reduce((prev, obj) => {
		Object.keys(obj).forEach(key => {
			const pVal = prev[key];
			const oVal = obj[key];
			
			if (Array.isArray(pVal) && Array.isArray(oVal)) {	// if both properties are arrays,
				prev[key] = pVal.concat(...oVal);					// then merge (concat) them
			}
			else if (isObject(pVal) && isObject(oVal)) {		// else if both properties are objects,
				prev[key] = this.mergeDeep(pVal, oVal);				// call mergeDeep recursively
			}
			else {
				prev[key] = oVal;								// if neither of the above, then overwrite
			}
		});
	
		return prev;
	}, {});

	let t1 = performance.now();
	// console.log ( 'mergeDeep took', t1 - t0, 'ms to complete' );
	return res;
}


