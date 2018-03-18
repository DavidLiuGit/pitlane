# Circadian API server

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


# launch server with: python server.py
if __name__ == "__main__":
    app.run()