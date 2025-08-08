// imports
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// mideweh
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// const usersRouter = require('./routes/usersRoutes'); doesn't work yet
const kajianRouter = require('./routes/kajianRoutes')
const kajiankategoriRouter = require('./routes/kajiankategoriRoutes')
const kelasRouter = require('./routes/kelasRoutes')
const pemateriRouter = require('./routes/pemateriRoutes')


// app.use('/users', usersRouter); doesn't work yet
app.use('/kajian', kajianRouter);
app.use('/kajian/kategori', kajiankategoriRouter)
app.use('/kelas', kelasRouter);
app.use('/pemateri', pemateriRouter)

module.exports = app;
