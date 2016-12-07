// 加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 加载路由控制
var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');


// 创建项目实例
var app = express();

// 定义Ejs模板引擎和模板文件位置，也可以使用jade或其他模板引擎，系统默认是ejs引擎
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// 修改模板文件的后缀名为html
app.set('view engine','html');
//运行ejs模块，_express,ejs模块一个公共属性，表示要渲染的文件扩展名
app.engine('html', require('ejs').__express);

// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', index);
app.use('/users', users);
app.use('/movie',movies);

// 404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 生产环境，500错误处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 输出模型app
module.exports = app;
