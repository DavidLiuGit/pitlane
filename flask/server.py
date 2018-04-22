# Pitlane API server

# core flask modules
from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS

# utility modules
from json import dumps
from traceback import print_exc
from pprint import pprint

# my modules
import users
from data_handler import query, dictify, postgres_pivot_json, dictify_oneline, process_year_round, YEAR_ROUND_LUT, raceID_lookup

# app config
app = Flask(__name__)		
CORS(app)					# allow cross-origin resource sharing


curr_year, last_rnd = process_year_round ( year="current", rnd="last" )
print ( curr_year )
print ( last_rnd )



@app.route('/')
def hello_world():
	return 'Hello, World!'

		

@app.route ( '/echoback/<msg>' )
def echoback( msg ):
	return dumps ( msg )






###############################################################################
#	TEAM
###############################################################################

@app.route ( '/team/standings_progression/<year>')
def team_standings_progression ( year ):
	#year = year if year!="current" else current_year			# if year specified is "current", substitute it with current_year
	year, yolo = process_year_round ( year=year )
	q = """
	SELECT round, co.name, points 
	FROM races as r 
	LEFT JOIN "constructorStandings" as c ON r."raceId"=c."raceId" 
	LEFT JOIN constructors as co ON c."constructorId"=co."constructorId" 
	WHERE year={}
	""".format( year )
	q = postgres_pivot_json( q, "name", "round", "points", data_col_name="points_after_round" )	# group=team name, attr=round num, value=points
	res, cols = query ( q )
	response = dictify ( res, cols, custom_attrs={'year':year} )
	response['year'] = year				# add the year attribute to the result dict
	return dumps ( response )





###############################################################################
#	DRIVER
###############################################################################

# get driver points standings progression throughout a season
@app.route ( '/driver/standings_progression/<year>' )
def driver_standings_progression ( year ):
	#year = year if year!="current" else current_year			# if year specified is "current", substitute it with current_year
	year, yolo = process_year_round ( year=year )
	q = """
	select forename || ' ' || surname as fullname, r.round, ds.points
	FROM races as r
	LEFT JOIN "driverStandings" as ds ON ds."raceId"=r."raceId"
	LEFT JOIN drivers as d ON d."driverId"=ds."driverId"
	WHERE year={}
	""".format ( year )
	q = postgres_pivot_json ( q, "fullname", "round", "points", data_col_name="points_after_round" )
	res, cols = query ( q )
	response = dictify ( res, cols, custom_attrs={'year':year} )
	return dumps ( response )


# get every driver's laptimes for a given year and race #
@app.route ( '/driver/laptimes/<year>/<rnd>' )
def driver_race_laptimes ( year, rnd ):
	year, rnd = process_year_round ( year=year, rnd=rnd )
	q = """
	SELECT d.code, l.lap, round(l.milliseconds/1000.0, 3) as seconds
	FROM "lapTimes" as l
	INNER JOIN "races" as r ON r."raceId"=l."raceId"
	INNER JOIN "drivers" as d ON d."driverId"=l."driverId"
	WHERE r.year={yr} AND r.round={rnd}
	""".format ( yr=year, rnd=rnd )
	q = postgres_pivot_json ( q, "code", "lap", "seconds", data_col_name="laptimes" )
	res, cols = query ( q )
	response = dictify ( res, cols, custom_attrs={'year':year, 'round':rnd} )
	return dumps ( response )


# get every driver's laptimes for a given raceId
@app.route ( '/driver/laptimes/<raceId>' )
def driver_race_laptimes_from_raceId ( raceId ) :
	q = """
	SELECT d.code, l.lap, round(l.milliseconds/1000.0, 3) as seconds
	FROM "lapTimes" as l
	INNER JOIN "races" as r ON r."raceId"=l."raceId"
	INNER JOIN "drivers" as d ON d."driverId"=l."driverId"
	WHERE r."raceId"={}
	""".format ( raceId )
	q = postgres_pivot_json ( q, "code", "lap", "seconds", data_col_name="laptimes" )
	res, cols = query ( q )
	response = dictify ( res, cols )
	return dumps ( response )


# get every driver's grid position delta (grid-position) for every race in a given year
@app.route ( '/driver/grid_pos_delta/<year>' )
def driver_grid_pos_delta ( year ):			
	q = """
	SELECT r.round, d."code", (select row_to_json(_) from (select grid, position as pos, laps) as _) as json_data
	FROM results AS re
	LEFT JOIN races AS r ON re."raceId"=r."raceId"
	LEFT JOIN drivers AS d ON re."driverId"=d."driverId"
	WHERE r.year={yr}
	ORDER BY r."raceId" ASC, position ASC, laps DESC
	""".format ( yr=year )
	q = postgres_pivot_json ( q, "round", "code", "json_data", data_col_name="grid_pos_laps" )
	response = dictify ( *query(q) )
	return dumps ( response )




###############################################################################
#	RACE
###############################################################################

@app.route ( '/race/quali_laptimes/<year>/<rnd>' )
def quali_laptimes_by_round ( year, rnd ) :
	raceId = raceID_lookup ( *process_year_round(year, rnd) )
	q = """SELECT q1, q2, q3 FROM qualifying WHERE "raceId"={}""".format ( raceId )
	return dumps ( dictify ( *query(q) ) )




###############################################################################
#	COMMON / UTILITY
###############################################################################

@app.route ( '/year_round_lut' )
def return_year_round_lut () :
	return dumps ( YEAR_ROUND_LUT )

@app.route ( '/year_round_lut/<year>')
def return_year_rounds ( year ):
	year, rnd = process_year_round ( year=year )
	return dumps ( YEAR_ROUND_LUT[str(year)] )

# return list of seasons in the database for which there are results
@app.route ( '/seasons' )
def get_seasons () :		# SELECT year FROM seasons ORDER BY year DESC - get ALL years in database
	res, cols = query ( """SELECT DISTINCT year FROM results LEFT JOIN races ON results."raceId"=races."raceId" ORDER BY year DESC""" )
	return dumps ( dictify (res, cols) )



###############################################################################
#	MAIN / GLOBAL
###############################################################################

# launch server with: python server.py
if __name__ == "__main__":
    app.run( host='0.0.0.0', port=6969 )