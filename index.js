var DATABASE_URL = process.env.DATABASE_URL || "postgres://iejemqeecyepud:BY9bljvPJySAl9DFUnNcXLryAW@ec2-107-20-224-236.compute-1.amazonaws.com:5432/d3h8uu99j81d85"+"?ssl=true"


var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM note', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
})

app.get('/allNotes', function(request, response) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM note', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { /*response.render('pages/db', {results: result.rows} );*/
          response.send(result.rows);
        }
    });
  });
});


app.get('/notes/:channel', function(request, response) {
  console.log("channel = "+request.params.channel);
  pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM note WHERE channel = $1', [request.params.channel], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { /*response.render('pages/db', {results: result.rows} );*/
          response.render('pages/notepad', {results: result.rows});
      }
    });
  });
});

app.post('/notes', function(request, response) {
  console.log("req.body = "+request.body);
  pg.connect(DATABASE_URL, function(err, client, done) {
    client.query('INSERT INTO note (channel, field) VALUES ($1, $2)', [request.body.channel, request.body.field], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { /*response.render('pages/db', {results: result.rows} );*/
          response.send({"status":"success"});
        }
    });
  });
});
