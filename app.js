//加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//加载路由控制
var routes = require('./routes/index');

var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var settings=require('./settings');

//创建项目实例
var app = express();
// 定义模板引擎和模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 定义icon图标
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//定义日志和输出级别
app.use(logger('dev'));
//定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//定义cookie解析器
app.use(cookieParser());
//定义mongo
app.use(session({
  secret:settings.cookieSecret,
  store:new MongoStore({
    url:'mongodb://'+settings.host+':'+settings.port+'/'+settings.db,
  }),
  resave:true,
  saveUninitialized:true
}));
//定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//定义动态视图
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  res.locals.success=req.session.success;
  res.locals.error=req.session.error;
  console.log('Session is user= ',req.session.user);
  console.log('Session is success= ',req.session.success);
  console.log('Session is error= ',req.session.error);
  next();
});

//匹配路径和路由
app.use('/', routes);
//app.use('/users', users);

//404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//生产环境，500错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
