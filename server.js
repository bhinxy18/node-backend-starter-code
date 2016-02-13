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
    
    var newFavorites = remove_duplicates_safe(dataJSON.favorites);

    // Prepare output in JSON format
    response = {
       favorites:newFavorites,
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
    res.render('favorites', JSON.parse(data));  
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port 3000");
});

//function to remove duplicates in an array
function remove_duplicates_safe(arr) {
    var obj = {};
    var arr2 = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in obj)) {
            arr2.push(arr[i]);
            obj[arr[i]] = true;
        }
    }
    return arr2;
}
