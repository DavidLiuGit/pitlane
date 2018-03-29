# data handler functions - transforms raw SQL responses to objects/dicts that apps can use

import psycopg2
from getpass import getpass
from traceback import print_exc
from pprint import pprint


#passwd = getpass ( "Enter database password: " )			# use if password needed
conn = psycopg2.connect("dbname=f1 user=allah")
cur = conn.cursor()



# use this function to do a query
def query ( q ) :
	try :
		cur.execute ( q )
		results = cur.fetchall()
		col_headers = [col[0] for col in cur.description]
		return results, col_headers
	except Exception as e:
		print_exc ( e )
		conn.rollback()
		return None



# result set validator
def result_validate ( results, col_headers, custom_attrs ):
	assert isinstance(results, list), "Error: results is NOT a list"			# make sure both are Lists (arrays)
	assert isinstance(col_headers, list), "Error: col_headers is NOT a list"
	assert isinstance(custom_attrs, dict), "Error: custom_attrs must be dict"
	return True



# create a dict from results and column headers
# the column headers are keys, whose values are arrays of the results
def dictify ( results, col_headers, custom_attrs={} ):
	if not result_validate(results, col_headers, custom_attrs) :	return False
	ret = {}
	for i in range ( len(col_headers) ):
		ret [ col_headers[i] ] = [ row[i] for row in results ] 
	return  { **ret, **custom_attrs }


# create a dict where the result is just one tuple
def dictify_oneline ( results, col_headers, custom_attrs={} ):
	results = results[0] if isinstance ( results, list ) else results		# if results is a list (not a tuple), take the 1st item in it
	ret = {}
	for i in range ( len(col_headers) ):
		ret [ col_headers[i] ] = results[i]
	return  { **ret, **custom_attrs }


# create an list of dicts, where the keys are col_headers whose values are a single result value
def dictify_rows ( results, col_headers, custom_attrs={} ):
	if not result_validate(results, col_headers, custom_attrs) :	return False
	ret = []
	for t in results:
		ret.append ( dictify_oneline( t , col_headers) )
	return ret



# transform the query into a query that will return a postgres pivot table - see ./data/db.md for more details
# in addition to the query, this function requires 3 more params:
#   group - the column whose values will be used to aggregate data
#   attribute - will be paired with values in the json object
#   value - will be paired with values in the json object
def postgres_pivot_json ( query, group, attribute, value, order_by="ASC", data_col_name="data" ):
    q = """
    SELECT subq.{grp}, json_object_agg ( subq.{attr}, subq.{val} ) as {c2}
    FROM (
        {subquery}
    ) subq
    GROUP BY subq.{grp}
    ORDER BY subq.{grp} {sort}
    """. format ( subquery=query, grp=group, attr=attribute, val=value, sort=order_by, c2=data_col_name )
    return q



# process year & round - return a pair of processed year & round values, according to the following rules:
#	year="current" or unspecified, round="last" or unspecified:		return curr_yr, last_race
#	year is specified, round="last" or unspecified:					return specified year, last race of that year
#	year="current" or unspecified, round is specified:				return curr_yr, info about specified round
#	year is specified, round is specified:							return data from query
def process_year_round ( year=None, rnd=None ):
	if (year=="current" or year==current_year or year==None) and (rnd=="last" or rnd==None):			# current year, last race
		return current_year, last_race
	elif year!=None and (rnd=="last" or rnd==None) :				# some specified year, last round; must get round info
		return year, dictify_oneline ( *query(""" SELECT * FROM races where races.year={} ORDER BY races."raceId" DESC LIMIT 1""".format(year)) )
	elif (year=="current" or year==current_year or year==None) and rnd!=None :			
		return current_year, dictify_oneline ( *query(""" SELECT * FROM races WHERE races.year={} AND races.round={} ORDER BY races."raceId" DESC LIMIT 1""".format(current_year,rnd)) )
	elif year!=None and rnd!=None:
		return year, dictify_oneline ( *query(""" SELECT * FROM races WHERE races.year={} AND races.round={} ORDER BY races."raceId" DESC LIMIT 1""".format(year,rnd)) )



# build a year + round lookup table
def create_year_round_lut ():
	q = """SELECT DISTINCT races."raceId", year, round, "circuitId", name as race_name, date, races.time FROM results 
		LEFT JOIN races ON results."raceId"=races."raceId" ORDER BY year DESC, round ASC"""
	arr = dictify_rows ( *query(q) )
	ret = {}
	for race in arr :
		yr = str ( race.pop ('year') )
		rnd = str ( race.pop ('round') )
		race['date'] = str ( race['date'] )
		race['time'] = str ( race['time'] )
		ret.setdefault ( yr, {} ).setdefault ( rnd, race )
	return ret


# do a sample query to make sure that things work
# on initialization of server, try doing a query and determine the following:
try :
	current_year_results, headers = query ( """SELECT DISTINCT year, races."raceId" FROM results 
		LEFT JOIN races ON results."raceId"=races."raceId" ORDER BY year DESC, races."raceId" DESC""" )
	current_year = current_year_results[0][0]		# set the default "current" year to be the year the last race happened
	last_race_id = current_year_results[0][1]		# set the default "last" raceId - again, the last race that happened
	last_race_results, headers = query ( """SELECT * FROM races WHERE "raceId"={} """.format(last_race_id) )
	last_race = dictify_oneline ( last_race_results, headers )
	YEAR_ROUND_LUT = create_year_round_lut()
except Exception as e:
	print_exc ( e )
	raise IOError ( 'Error: the server encountered an error when attempting the initial query.' )