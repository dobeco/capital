const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index'); //引入api路由
const profileRouter = require('./routes/profile'); //引入api路由
const usersRouter = require('./routes/users');
const dbs = require('./config/db') // 引入数据库
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('secret', 'iuie4lk96ff0')

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 引入api
// require('./routes/profile')(app)

// 使用routers
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// 错误处理函数
app.use(async (err, req, res, next) => {
  // console.log(err)
  res.status(err.status || 500)
  res.send({ message: err.message })
})
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  res.send({ message: err.message })

});

module.exports = app;
