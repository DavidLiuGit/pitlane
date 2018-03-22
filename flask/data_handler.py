# data handler functions - transforms raw SQL responses to objects/dicts that apps can use

import psycopg2
from getpass import getpass
from traceback import print_exc


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
		print_exc ( e )
		conn.rollback()


# create a dict from results and column headers
def dictify ( results, col_headers, custom_attrs={} ):
	assert isinstance(results, list), "Error: results is NOT a list"			# make sure both are Lists (arrays)
	assert isinstance(col_headers, list), "Error: col_headers is NOT a list"
	assert isinstance(custom_attrs, dict), "Error: custom_attrs must be  dict"
	ret = {}
	for i in range ( len(col_headers) ):
		ret [ col_headers[i] ] = [ row[i] for row in results ] 
	return  { **ret, **custom_attrs }



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