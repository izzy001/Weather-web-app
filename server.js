const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const dotenv = require('dotenv');

//path to .env file that holds the API keys
dotenv.load({path:'./public/.env.weatherkeys'});
 
//The url variable we are making request to
 const MY_API_KEY = process.env.MY_API_KEY;


//setting embedded javaScript template
app.set('view engine', 'ejs');

//for accessing all the static files in within the public folder
app.use(express.static('public'));

//making use of the middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//a get route
app.get('/', function(req, res) {
 res.render('index', {weather: null, error: null});
});

//a post route
app.post('/', function(req, res) { 
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${MY_API_KEY}`;

    request(url, function(err, response, body) {
        if (err) {
            res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            let weather  = JSON.parse(body);
            if (weather.main == undefined) {
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                res.render('index', {weather: weatherText, error: null});
            }
        }
    } )
   
});

app.listen(3000, function() {
    console.log(' Connected!\n listening on port 3000!')
})