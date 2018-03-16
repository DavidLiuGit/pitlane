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

