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
const kajiankategoriRouter = require('./routes/kajiankategoriRoutes')
const kelasRouter = require('./routes/kelasRoutes')
const penggunaRouter = require('./routes/penggunaRoutes')
const programdonasiRouter = require('./routes/programdonasiRoutes')
const pertemuanKelasRouter = require('./routes/pertemuanKelasRoutes')

app.use('/', indexRouter);
app.use('/donasi', programdonasiRouter);
app.use('/user', usersRouter);
app.use('/kajian', kajianRouter);
app.use('/kajian/kategori', kajiankategoriRouter)
app.use('/kelas', kelasRouter);
app.use('/pengguna', penggunaRouter)
app.use('/kelas/pertemuan', pertemuanKelasRouter)

const apiRouter = express.Router();

apiRouter.use('/', indexRouter);
apiRouter.use('/donasi', programdonasiRouter);
apiRouter.use('/user', usersRouter);
apiRouter.use('/kajian', kajianRouter);
apiRouter.use('/kajian/kategori', kajiankategoriRouter);
apiRouter.use('/kelas', kelasRouter);
apiRouter.use('/pengguna', penggunaRouter);
apiRouter.use('/kelas/pertemuan', pertemuanKelasRouter);

app.use('/api', apiRouter);

module.exports = app;
