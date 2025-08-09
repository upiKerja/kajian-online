var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("./middleware/cors").cors
var auth = require("./middleware/auth").auth

var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/userRoutes');
var kajianRouter = require('./routes/kajianRoutes')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors)

app.use('/', indexRouter);
app.use('/user', auth, usersRouter);
app.use('/kajian', auth, kajianRouter)

module.exports = app;
