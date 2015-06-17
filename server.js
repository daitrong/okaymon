var express     = require('express'),
    path        = require('path'),
    app         = express(),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    favicon     = require('express-favicon'),
    compression = require('compression'),
    request     = require('request');
    
// Models
var Pokemon = require('./app/models/pokemon');

// Routes
var typeApiRouter       = require('./app/routes/type.js'),
    generationApiRouter = require('./app/routes/generation.js'),
    pokemonApiRouter    = require('./app/routes/pokemon.js');

// Config
var config = require('./config.json'),
    port   = process.env.PORT || 8080;

mongoose.connect(
  'mongodb://brianhan:' + config.sprites_db_pw + '@ds043942.mongolab.com:43942/sprites')

// // APP CONFIG --------------------------------------------
// // use body parser so we can grab info from POST requests

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
// this allows requests from other domains to prevent CORS errors.
// Any domain has access to our API

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(compression());
app.use(favicon('public/images/favicon.ico'));
app.use(express.static('public'));

// log all requests to the console

app.use(morgan('dev'));
app.use('/api', pokemonApiRouter);
app.use('/api', generationApiRouter);
app.use('/api', typeApiRouter);
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.listen(port);
console.log('http://localhost:' + port);
