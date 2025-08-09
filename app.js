var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("./middleware/cors").cors
var auth = require("./middleware/auth").auth

// imports
require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("./middleware/cors").cors
var auth = require("./middleware/auth").auth

var app = express();

// mideweh
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors)

// Routes
const indexRouter = require('./routes/indexRoutes');
const usersRouter = require('./routes/userRoutes');
const kajianRouter = require('./routes/kajianRoutes')
const usersRouter = require('./routes/userRoutes');
const kajianRouter = require('./routes/kajianRoutes')
const kajiankategoriRouter = require('./routes/kajiankategoriRoutes')
const kelasRouter = require('./routes/kelasRoutes')
const pemateriRouter = require('./routes/pemateriRoutes')

app.use('/', indexRouter);
app.use('/user', auth, usersRouter);
app.use('/user', usersRouter);
app.use('/kajian', kajianRouter);
app.use('/kajian/kategori', kajiankategoriRouter)
app.use('/kelas', kelasRouter);
app.use('/pemateri', pemateriRouter)

module.exports = app;