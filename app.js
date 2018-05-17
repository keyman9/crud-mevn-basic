var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var book = require('./routes/book');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);

//catch 404 and send to error handler
app.use(function(req,res,next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err,req,res,next){
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('view engine', 'html');

//set up mongoose and bluebird for use with mongodb
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mean-angular5', { useMongoClient: true, promiseLibrary: require('bluebird')})
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

module.exports = app;
