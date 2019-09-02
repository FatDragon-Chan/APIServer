var  _ =  require('lodash')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');

var app = express();
// 判断origin是否在域名白名单列表中
function isOriginAllowed(origin, allowedOrigin) {
  if (_.isArray(allowedOrigin)) {
      for(let i = 0; i < allowedOrigin.length; i++) {
          if(isOriginAllowed(origin, allowedOrigin[i])) {
              return true;
          }
      }
      return false;
  } else if (_.isString(allowedOrigin)) {
      return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
  } else {
      return !!allowedOrigin;
  }
}
// 域名白名单
const ALLOW_ORIGIN = [  
  'http://localhost:6900',
  'https://www.chenzian.cn',
  'https://chenzian.cn',
  'https://m.chenzian.cn',
  'https://flsh.top',
  'http://192.168.99.13:6900',
  'http://localhost:9528',
  'http://192.168.99.13:9528'
];
// cros 
app.use('*',function (req, res, next) {
  let reqOrigin = req.headers.origin;  // request响应头的origin属性
  
  //  判断请求是否在域名白名单内
   if(!isOriginAllowed(reqOrigin, ALLOW_ORIGIN)) {
    reqOrigin = 'https://chenzian.cn'
  } 
  res.header('Access-Control-Allow-Origin', reqOrigin); //这个表示任意域名都可以访问，这样写不能携带cookie了。
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  }
  else {
    next();
  }
});

// post middleWare
app.use(bodyParser.urlencoded({
  extended:false
}));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(function(req,res,next) {
  if (req.headers['content-type'].indexOf('text/plain') !== -1) {
    req.body =JSON.parse(req.body)
  }
  next()
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 验证签名

// router
// app.use('/', indexRouter) ;
app.use('/users',usersRouter);
app.use('/blog',blogRouter) 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
