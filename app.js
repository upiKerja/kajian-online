require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/usersRoutes');
var kajianRouter = require('./routes/kajianRoutes')
var kajiankategoriRouter = require('./routes/kajiankategoriRoutes')
var kelasRouter = require('./routes/kelasRoutes')
var pemateriRouter = require('./routes/pemateriRoutes')
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/kajian', kajianRouter);
app.use('/kajian/kategori', kajiankategoriRouter)
app.use('/kelas', kelasRouter);
app.use('/pemateri', pemateriRouter)

module.exports = app;
