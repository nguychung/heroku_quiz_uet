var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var userRouter = require('./routes/user');
var questionRouter = require('./routes/question');
var testRouter = require('./routes/test');
var adminRouter = require('./routes/admin');

var app = express();
app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/guest'),
                  path.join(__dirname, 'views/user'),
                  path.join(__dirname, 'views/general')]);
app.set('view engine', 'ejs');
var con = mysql.createConnection({
  database: "db_a75bd6_duanuet",
  host: "MYSQL5047.site4now.net",
  //port: "3306",
  user: "a75bd6_duanuet",
  password: "Chidat@7299"
  // database: "yourtests",
  // host: "127.0.0.1",
  // port: "3306",
  // user: "root",
  // password: "root"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// con.on('error', function(err) {
//   console.log(err.PORT);
// })
global.db = con;
app.use(session({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: false,
  cookie:{maxAge:60000000}
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/logout', userRouter);
app.use('/login', userRouter);
app.use('/register', userRouter);
app.use('/profile', userRouter);
app.use('/questions', questionRouter);
app.use('/tests', testRouter);
app.use('/admin', adminRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
const port = process.env.PORT || 4000;

console.log('server listening at http://127.0.0.1 over port: ', port);

app.listen(port);
module.exports = app;
