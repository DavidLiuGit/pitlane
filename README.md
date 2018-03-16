# Pitlane
Visualize race statistics for all you Formula 1 nerds out there

## What stats?

Statistics by race:
* average lap times for each race in season
* average speed for each race in season
* fastest lap times for each race

Statistics by driver:
* fastest lap time for each race
* lap times for each race as box-and-whiskers plot
* average lap times for each race in season
* points earned for each race in season
* pit stop times for each race in season 

Statistics by team
* all of the same statistics that can be found by driver, but aggregated by team
* points earned per season


## 3rd party dependencies

Frontend
```bash
# react
npm install react

# Material-UI (for React)
npm install --save material-ui@next

# Axios - Asynchronous HTTP requests
npm install --save axios

# plotly.js & plotly for React
npm install --save react-plotly.js plotly.js
```

Backend
```bash
# Flask
pip install flask

# Flask CORS (cross origin)
pip install flask-cors --user

# database converter - convert SQL dump to be Postgres-compatible 
```