/*http模块*/

/*
	http模块提供两种使用方式：
	1.作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应 
	2.作为客户端使用时，发起一个HTTP客户端请求，获取服务器响应

	HTTP请求本质上是一个数据流，由请求头（header）和请求体(body)组成

*/


var http  = require('http');
var https = require('https');
var url   = require('url');


/*创建服务器*/
http.createServer(function(request,response){
	var body = [];

	console.log(request.method);
	console.log(request.headers);


	request.on('data',function(trunk){
		body.push(chunk);
	});

	request.on('end',function(){
		body = Buffer.concat(body);
        console.log(body.toString());
	});

	


}).listen(3180);



/*创建http客户端*/
var options = {
        hostname: 'www.example.com',
        port: 80,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();

// http客户端 get请求
http.get('http://www.example.com/', function (response) {
    var body = [];

    console.log(response.statusCode);
    console.log(response.headers);

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
});



/*============== HTTPS ================*/
/*
	https模块与http模块极为类似，区别在于https模块需要额外处理SSL证书。
*/

// 创建HTTPS服务器
var options = {
		// 服务器私钥
        key: fs.readFileSync('./ssl/default.key'),
        // 服务器公钥
        cert: fs.readFileSync('./ssl/default.cer')
    };


var server = https.createServer(options, function (request, response) {
        // ...
 });

// 另外，NodeJS支持SNI技术，可以根据HTTPS客户端请求使用的域名动态使用不同的证书，因此同一个HTTPS服务器可以使用多个域名提供服务。3
server.addContext('foo.com', {
    key: fs.readFileSync('./ssl/foo.com.key'),
    cert: fs.readFileSync('./ssl/foo.com.cer')
});

server.addContext('bar.com', {
    key: fs.readFileSync('./ssl/bar.com.key'),
    cert: fs.readFileSync('./ssl/bar.com.cer')
});


// HTTPS客户端
var options = {
        hostname: 'www.example.com',
        port: 443,
        path: '/',
        method: 'GET'
    };

var request = https.request(options, function (response) {});

request.end();


// 但如果目标服务器使用的SSL证书是自制的，不是从颁发机构购买的，默认情况下https模块会拒绝连接，提示说有证书安全问题。在options里加入rejectUnauthorized: false字段可以禁用对证书有效性的检查，从而允许https模块请求开发环境下使用自制证书的HTTPS服务器。




/*================= URL模块 ===================*/
// URL模块 该模块允许解析URL、生成URL，以及拼接URL
/*
	url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
	/* =>
	{ 	protocol: 'http:',
  		auth: 'user:pass',
  		host: 'host.com:8080',
  		port: '8080',
  		hostname: 'host.com',
  		hash: '#hash',
  		search: '?query=string',
  		query: 'query=string',
  		pathname: '/p/a/t/h',
  		path: '/p/a/t/h?query=string',
  		href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash' }



  	url.format({
    protocol: 'http:',
    host: 'www.example.com',
    pathname: '/p/a/t/h',
    search: 'query=string'
	});
	 =>
	'http://www.example.com/p/a/t/h?query=string'
		
*/

/*================= querystring模块 ===================*/
/*
	用于实现URL参数字符串与参数对象的互相转换

	querystring.parse('foo=bar&baz=qux&baz=quux&corge');
	 =>
	{ foo: 'bar', baz: ['qux', 'quux'], corge: '' }
	

	querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
	==>
   'foo=bar&baz=qux&baz=quux&corge='




*/
	
/*================= zlib模块 ===================*/
/*
	zlib模块提供了数据压缩和解压的功能


*/










*/
