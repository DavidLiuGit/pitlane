# Pitlane API server

# core flask modules
from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS

# utility modules
from json import dumps
from traceback import print_exc

# my modules
import users
from data_handler import query, dictify, postgres_pivot_json

# app config
app = Flask(__name__)		
CORS(app)					# allow cross-origin resource sharing


# on initialization of server, try doing a query and determine the following:
try :
	current_year_results, headers = query ( """SELECT DISTINCT year FROM results LEFT JOIN races ON results."raceId"=races."raceId" ORDER BY year DESC""" )
	current_year = current_year_results[0][0]		# set the default "current" year to be the year the last race happened
except Exception as e:
	print_exc ( e )
	raise IOError ( 'Error: the server encountered an error when attempting the initial query.' )


@app.route('/')
def hello_world():
	return 'Hello, World!'


@app.route( '/login', methods=['GET', 'POST'] )
def fake_login():
	if request.method == 'POST':
		pass
		

@app.route ( '/echoback/<msg>' )
def echoback( msg ):
	return dumps ( msg )


# return list of seasons in the database for which there are results
@app.route ( '/seasons' )
def get_seasons () :		# SELECT year FROM seasons ORDER BY year DESC - get ALL years in database
	res, cols = query ( """SELECT DISTINCT year FROM results LEFT JOIN races ON results."raceId"=races."raceId" ORDER BY year DESC""" )
	return dumps ( dictify (res, cols) )


# return 
@app.route ( '/team/standings_progression/<year>')
def team_standings_progression ( year ):
	year = year if year!="current" else current_year			# if year specified is "current", substitute it with current_year
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


# get driver points standings progression throughout a season
@app.route ( '/driver/standings_progression/<year>' )
def driver_standings_progression ( year ):
	year = year if year!="current" else current_year			# if year specified is "current", substitute it with current_year
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
	year = year if year!="current" else current_year			# if year specified is "current", substitute it with current_year
	rnd = rnd if rnd!="last" else 1
	q = """
	SELECT d.code, l.lap, l.milliseconds
	FROM "lapTimes" as l
	INNER JOIN "races" as r ON r."raceId"=l."raceId"
	INNER JOIN "drivers" as d ON d."driverId"=l."driverId"
	WHERE r.year={yr} AND r.round={rnd}
	""".format ( yr=year, rnd=rnd )
	q = postgres_pivot_json ( q, "code", "lap", "milliseconds", data_col_name="laptimes" )
	res, cols = query ( q )
	response = dictify ( res, cols, custom_attrs={'year':year} )
	return dumps ( response )


# launch server with: python server.py
if __name__ == "__main__":
    app.run( host='0.0.0.0', port=6969 )