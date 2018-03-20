# Pitlane API server

# core flask modules
from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS

# utility modules
from json import dumps

# my modules
import users
from data_handler import query, dictify, postgres_pivot_json

# app config
app = Flask(__name__)		
CORS(app)					# allow cross-origin resource sharing




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
	q = """
	SELECT round, co.name, points 
	FROM races as r 
	LEFT JOIN "constructorStandings" as c 
	ON r."raceId"=c."raceId" 
	LEFT JOIN constructors as co 
	ON c."constructorId"=co."constructorId" 
	WHERE year={}
	""".format(year)
	q = postgres_pivot_json( q, "name", "round", "points", data_col_name="points_after_round" )	# group=team name, attr=round num, value=points
	res, cols = query ( q )
	return dumps ( dictify(res, cols) )


# launch server with: python server.py
if __name__ == "__main__":
    app.run( host='0.0.0.0', port=6969 )