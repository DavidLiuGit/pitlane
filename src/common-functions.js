// common functions/methods
import React from 'react';

// wrap whatever you passed in with <li>; props options
export function liWrap ( input, props = null ) {
	return ( <li>input</li> );
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

//export { liWrap };