# Database structure

These tables/relations are available in the Database. Don't forget to use quotes for any tables that have capital letters... Postgresql CLI doesn't play well with camelCase (and capital letters in general). Postgres CLI will also only accept immediate strings with single quotes - double quotes are interpreted as column names.

**TOC**
- [Database structure](#database-structure)
	- [seasons](#seasons)
	- [circuits](#circuits)
	- [constructors](#constructors)
	- [constructorResults](#constructorresults)
	- [constructorStandings](#constructorstandings)
	- [driverStandings](#driverstandings)
	- [drivers](#drivers)
	- [laptimes](#laptimes)

---

## seasons

Just a list of seasons available in the db. Nothing too exciting

| year | url |
| --- | --- |
| range: 1950 - now | wikipedia URL |

--- 

## circuits

List of circuits, their locations, etc.

circuitId |   circuitRef   |  name   |   location   |  country   |   lat    |    lng    | alt | url     
--- |   ---   | --- |       ---        |   ---    |   ---    |   ---    | --- |  ---    
serial | string reference | proper name of circuit | city | country | lat | long | ?? | Wikipedia url
1 | albert_park    | Albert Park Grand Prix Circuit        | Melbourne             | Australia    | -37.8497 |   144.968 |  10 | http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit
2 | sepang         | Sepang International Circuit          | Kuala Lumpur          | Malaysia     |  2.76083 |   101.738 |     | http://en.wikipedia.org/wiki/Sepang_International_Circuit
3 | bahrain        | Bahrain International Circuit         | Sakhir                | Bahrain      |  26.0325 |   50.5106 |     | http://en.wikipedia.org/wiki/Bahrain_International_Circuit



---

## constructors

*constructorId* | constructorRef | name |  nationality  |   url 
--- | --- | --- | --- | ---
serial | string reference | proper name | obvious | Wikipedia url
1 | mclaren              | McLaren                   | British       | http://en.wikipedia.org/wiki/McLaren
2 | bmw_sauber           | BMW Sauber                | German        | http://en.wikipedia.org/wiki/BMW_Sauber
3 | williams             | Williams                  | British       | http://en.wikipedia.org/wiki/Williams_Grand_Prix_Engineering


---

## constructorResults

*constructorResultsId* | raceId | constructorId | points | status 
----------------------|--------|---------------|--------|--------
serial | foreign key | fkey: constructors.constructorID | pts scored | D or null ???
1 |     18 |             1 |     14 | 
2 |     18 |             2 |      8 | 
3 |     18 |             3 |      9 | 

---

## constructorStandings

*constructorStandingsId* | raceId | constructorId | points | position | positionText | wins 
-----------------------|--------|---------------|--------|----------|--------------|------
serial | fkey | fkey: constructors.constructorID | points earned | rank | rank as string | # wins
1 |     18 |             1 |     14 |        1 | 1            |    1
2 |     18 |             2 |      8 |        3 | 3            |    0
3 |     18 |             3 |      9 |        2 | 2            |    0

---

## driverStandings

 *driverStandingsId* | raceId | driverId | points | position | positionText | wins 
-------------------|--------|----------|--------|----------|--------------|------
serial | fkey | fkey | pts earned | rank | rank as string | # wins
1 |     18 |        1 |     10 |        1 | 1            |    1
2 |     18 |        2 |      8 |        2 | 2            |    0
3 |     18 |        3 |      6 |        3 | 3            |    0

---

## drivers

 driverId |     driverRef      | number | code |     forename      |         surname         |    dob     |    nationality    |                                url                                
----------|--------------------|--------|------|-------------------|-------------------------|------------|-------------------|-------------------------------------------------------------------
serial | string reference | driver number | 3 letter code | first name | last name | DOB | nat | wikipedia url
1 | hamilton           |     44 | HAM  | Lewis             | Hamilton                | 1985-01-07 | British           | http://en.wikipedia.org/wiki/Lewis_Hamilton
2 | heidfeld           |        | HEI  | Nick              | Heidfeld                | 1977-05-10 | German            | http://en.wikipedia.org/wiki/Nick_Heidfeld
3 | rosberg            |      6 | ROS  | Nico              | Rosberg                 | 1985-06-27 | German            | http://en.wikipedia.org/wiki/Nico_Rosberg


---

## laptimes

 raceId | driverId | lap | position |    time     | milliseconds 
--------|----------|-----|----------|-------------|--------------
fkey | fkey: drivers.driverId | lap # | position # | time in M:SS.sss | milliseconds equivalent
841 |       20 |   1 |        1 | 1:38.109    |        98109
841 |       20 |   2 |        1 | 1:33.006    |        93006
841 |       20 |   3 |        1 | 1:32.713    |        92713


---

## pitStops
 raceId | driverId | stop | lap |   time   | duration  | milliseconds 
--------|----------|------|-----|----------|-----------|--------------
fkey | fkey: drivers.driverId | stop # | lap # | how long into race | duration | duration in ms
841 |      153 |    1 |   1 | 17:05:23 | 26.898    |        26898
841 |       30 |    1 |   1 | 17:05:52 | 25.021    |        25021
841 |       17 |    1 |  11 | 17:20:48 | 23.426    |        23426

---

## qualifying

 qualifyId | raceId | driverId | constructorId | number | position |    q1     |    q2    |    q3    
-----------|--------|----------|---------------|--------|----------|-----------|----------|----------
serial | fkey | fkey: drivers.driverId | fkey: constructors.constructorId | driver number? | position | time | time | time 
1 |     18 |        1 |             1 |     22 |        1 | 1:26.572  | 1:25.187 | 1:26.714
2 |     18 |        9 |             2 |      4 |        2 | 1:26.103  | 1:25.315 | 1:26.869
3 |     18 |        5 |             1 |     23 |        3 | 1:25.664  | 1:25.452 | 1:27.079

---

## races

 raceId | year | round | circuitId |         name          |    date    |   time   |                           url                           
--------|------|-------|-----------|-----------------------|------------|----------|---------------------------------------------------------
serial | year | nth race of the year | fkey: circuits:circuitId | race name | race date | race time | Wiki  url
1 | 2009 |     1 |         1 | Australian Grand Prix | 2009-03-29 | 06:00:00 | http://en.wikipedia.org/wiki/2009_Australian_Grand_Prix
2 | 2009 |     2 |         2 | Malaysian Grand Prix  | 2009-04-05 | 09:00:00 | http://en.wikipedia.org/wiki/2009_Malaysian_Grand_Prix
3 | 2009 |     3 |        17 | Chinese Grand Prix    | 2009-04-19 | 07:00:00 | http://en.wikipedia.org/wiki/2009_Chinese_Grand_Prix

---

## results 

 resultId | raceId | driverId | constructorId | number | grid | position | positionText | positionOrder | points | laps |    time     | milliseconds | fastestLap | rank | fastestLapTime | fastestLapSpeed | statusId 
----------|--------|----------|---------------|--------|------|----------|--------------|---------------|--------|------|-------------|--------------|------------|------|----------------|-----------------|----------
serial | fkey: races.raceid | fkey: drivers.driverId | fkey: constructors.constructorId | driver number? | | | | | pts earned | | | | | lap time rank
1 |     18 |        1 |             1 |     22 |    1 |        1 | 1            |             1 |     10 |   58 | 1:34:50.616 |      5690616 |         39 |    2 | 1:27.452       | 218.300         |        1
2 |     18 |        2 |             2 |      3 |    5 |        2 | 2            |             2 |      8 |   58 | +5.478      |      5696094 |         41 |    3 | 1:27.739       | 217.586         |        1
3 |     18 |        3 |             3 |      7 |    7 |        3 | 3            |             3 |      6 |   58 | +8.163      |      5698779 |         41 |    5 | 1:28.090       | 216.719         |        1

---

## seasons

 year |                         url                          
------|------------------------------------------------------
 2009 | http://en.wikipedia.org/wiki/2009_Formula_One_season
 2008 | http://en.wikipedia.org/wiki/2008_Formula_One_season
 2007 | http://en.wikipedia.org/wiki/2007_Formula_One_season

## status

statusId |       status       
----------|--------------------
serial | described what happened to driver
1 | Finished
2 | Disqualified
3 | Accident
