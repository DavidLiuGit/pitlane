# Pitlane API server

# core flask modules
from flask import Flask, Response, redirect, url_for, request, session, abort
from flask_cors import CORS
import psycopg2

# utility modules
from json import dumps
from getpass import getpass

# my modules
import users

# app config
app = Flask(__name__)		
CORS(app)					# allow cross-origin resource sharing
#passwd = getpass ( "Enter database password: " )			# use if password needed
conn = psycopg2.connect("dbname=f1 user=allah")
cur = conn.cursor()

# do a sample query to make sure that things work
#cur.execute("""SELECT * from "constructorStandings" LIMIT 3""")
#contents = cur.fetchall()
#print ( [col[0] for col in cur.description] )
#print ( contents )

# use this function to do a query
def query ( q ) :
	try :
		cur.execute ( q )
		results = cur.fetchall()
		col_headers = [col[0] for col in cur.description]
		return results, col_headers
	except Exception as e:
		print ( e )
		conn.rollback()


# create a dict from results and column headers
def dictify ( results, col_headers ):
	assert isinstance(results, list), "Error: results is NOT a list"			# make sure both are Lists (arrays)
	assert isinstance(col_headers, list), "Error: col_headers is NOT a list"
	ret = {}
	for i in range ( len(col_headers) ):
		ret [ col_headers[i] ] = [ row[i] for row in results ] 
	return ret



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

@app.route ( '/seasons' )
def getSeasons () :
	res, cols = query ( """SELECT year FROM seasons ORDER BY year DESC"""  )
	return dumps ( dictify (res, cols) )


# launch server with: python server.py
if __name__ == "__main__":
    app.run( host='0.0.0.0', port=6969 )