// common functions/methods
// import axios from 'axios';
// import { pitlaneApiBaseurl } from './common-objects';


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
	let ret = [], obj = {};
	for ( let i = 0; i < group.length; i++ ){

		switch ( _mode ) {
			case "lines+markers" : {
				obj = { mode: _mode, name:group[i], x: [], y: [] };
				if ( custom_attrs ) obj = Object.assign ( obj, custom_attrs );
				for ( let attr in data_col[i] ){
					obj.x.push ( attr );				
					obj.y.push ( data_col[i][attr] );	
				}
				break;
			} case "box-horizontal" : {
				obj = { type: "box", name:group[i], x: [] };
				if ( custom_attrs ) obj = Object.assign ( obj, custom_attrs );
				for ( let attr in data_col[i] ) {
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
	// let t0 = performance.now();
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

	// let t1 = performance.now();
	// console.log ( 'mergeDeep took', t1 - t0, 'ms to complete' );
	return res;
}



/**
 * Determine the median of an array of numbers
 * @param {number[]} arr input array; does not need to be sorted
 */
export function computeMedian (arr) {
	let a = arr.sort();
	let len = a.length;
	let mIndex = Math.floor (len / 2);		// the median index is half the length of the array, rounded down

	if ( len % 2 )			// if the array has an odd-number of elements,
		return a[mIndex];		// then we can simply return the value at the median
	else					// but if the array has an even-number of elements,
		return ((a[mIndex-1] + a[mIndex]) / 2.0);	// return the mean of the 2 values in the middle
}


/**
 * Analyze an array of numbers that will be in a box plot
 * @param {number[]} arr input array; does not need to be sorted
 */
export function boxplotAnalysis (arr) {
	let ret = {
		median: NaN, q1: NaN, q3: NaN,	// initialize result obj, where median, Q1, Q3 are initially undefined
		sortedArr: arr.sort()			// sort array before processing it
	}

	// determine the indices where the median value is, and where the 
	let len = ret.sortedArr.length;				// get the length of the sorted array
	let medianFloor = Math.floor(len/2), medianCeil = Math.ceil(len/2);

	ret.median = computeMedian(ret.sortedArr);					// calculate the median value
	ret.q1 = computeMedian(ret.sortedArr.slice(0,medianFloor));	// calculate q1 (the median of the first half)
	ret.q3 = computeMedian(ret.sortedArr.slice(medianCeil));	// calculate q3 (the median of the latter half)
	return ret;
}


/**
 * Determine if a value should be considerd an outlier, given a Q1 and Q3
 * @param {number} value value to be evaluated
 * @param {number} q1 median value of the lower half
 * @param {number} q3 median value of the upper half
 * @param {boolean} inclusive if a value is found to be right on the edge, should it be included?
 * @param {number} c IQR multiplier value; default 1.5
 * @returns {boolean} true if the value is an outlier, false otherwise
 */
export function isOutlier (value, q1, q3, inclusive=true, c=1.5) {
	let iqr = q3 - q1;		// inter-quartile range is the difference between q3 and q1
	if ( inclusive ) {		// if inclusive
		if ( value < q1 - c * iqr || value > q3 + c * iqr ) 
			return true;	// then return true only if value is actually outside of the range
		else return false;
	} else {
		if ( value <= q1 - c * iqr || value >= q3 + c * iqr )
			return true;
		else return false;
	}
}