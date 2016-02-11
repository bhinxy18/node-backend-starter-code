var express = require('express');
var app = express();
var fs = require('fs');
var hbs = require('hbs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// set the view engine to use handlebars
app.set('views', __dirname + '/views');
app.set('view engine', '.hbs');

//display the landing page (search form)
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
});

//save the movie title when they click the favorite button
app.get('/save-favorites', function (req, res) {
    //read stored data
    var data = fs.readFileSync('./data.json');
    var dataJSON = JSON.parse(data);
    //append new favorite
    dataJSON.favorites.push(req.query.title);

    // Prepare output in JSON format
    response = {
       favorites:dataJSON.favorites,
    };
    //saves data to data.json file
    fs.writeFile('data.json', JSON.stringify(response), function (err,data) {
        if (err) {
            return console.log(err);
        }
    });
    //redirect to favorites page
    res.redirect("/favorites");
});

//lists all the favorites
app.get('/favorites', function(req, res) {
    var data = fs.readFileSync('./data.json');
    res.setHeader('Content-Type', 'application/json');

    res.render('favorites', JSON.parse(data));  
});


app.listen(3000, function() {
    console.log("Listening on port 3000");
});

