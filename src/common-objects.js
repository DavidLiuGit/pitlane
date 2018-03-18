// common objects that are used in multiple components

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

// beginning of the URL where we will make our API calls
var httpBaseUrl = "http://ergast.com/api/f1/";
var pitlaneApiBaseurl = "http://ilike2teabag.ddns.net:6969/";


export { 
	Driver, 
	Constructor, 
	Time, 
	Timings, 
	FastestLap,
	httpBaseUrl,
	pitlaneApiBaseurl,
};