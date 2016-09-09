/*
	一个简单的静态文件合并服务器
	需求：文件合并；读取文件需要根目录；监听端口可配置；

	设计方案：request -->|  parse  |-->|  combine  |-->|  output  |--> response
	
*/

/*第一次迭代*/

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

/*合并文件*/
function combineFiles(pathnames, callback) {
    var output = [];

    (function next(i, len) {
        if (i < len) {
            fs.readFile(pathnames[i], function (err, data) {
                if (err) {
                    callback(err);
                } else {
                	console.log('文件中内容：'+data);
                    output.push(data);
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, Buffer.concat(output));
        }
    }(0, pathnames.length));
}

/*解析URL*/
function parseURL(root, url) {
    var base, pathnames, parts;
    // http://assets.example.com/foo/??bar.js,baz.js
    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');
    }

    parts = url.split('??');
    base = parts[0];  //http://assets.example.com/foo/
    pathnames = parts[1].split(',').map(function (value) {
        return path.join(root, base, value);
    });
    //pathnames = ['http://assets.example.com/foo/bar.js',''http://assets.example.com/foo/baz.js'']


    return {
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames: pathnames
    };
}



/*主入口*/
function main(argv) {
	// 读取配置文件 - JSON文件
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80;

    http.createServer(function (request, response) {
        var urlInfo = parseURL(root, request.url);

        console.log(urlInfo);

        combineFiles(urlInfo.pathnames, function (err, data) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
            	console.log('最后返回的数据：'+data);
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                response.end(data);
            }
        });
    }).listen(port);
}



main(process.argv.slice(2));





/*第二次迭代*/
/*
	第一次迭代主要问题：
	map方法换成for循环或许会更快一些
	最大的性能问题存在于从读取文件到输出响应的过程当中，可以看到，第一版代码依次把请求的文件读取到内存中之后，再合并数据和输出响应。这会导致以下两个问题：
	1.当请求的文件比较多比较大时，串行读取文件会比较耗时，从而拉长了服务端响应等待时间。	
	2.由于每次响应输出的数据都需要先完整地缓存在内存里，当服务器请求并发数较大时，会有较大的内存开销。

	对于第一个问题，很容易想到把读取文件的方式从串行改为并行。
	但是别这样做，因为对于机械磁盘而言，因为只有一个磁头，尝试并行读取文件只会造成磁头频繁抖动，反而降低IO效率。
	而对于固态硬盘，虽然的确存在多个并行IO通道，但是对于服务器并行处理的多个请求而言，硬盘已经在做并行IO了，对单个请求采用并行IO无异于拆东墙补西墙。
	因此，正确的做法不是改用并行IO，而是一边读取文件一边输出响应，把响应输出时机提前至读取第一个文件的时刻。这样调整后，整个请求处理过程变成下边这样。

*/


function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80;

    http.createServer(function (request, response) {
        var urlInfo = parseURL(root, request.url);

        validateFiles(urlInfo.pathnames, function (err, pathnames) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });
                outputFiles(pathnames, response);
            }
        });
    }).listen(port);
}

function outputFiles(pathnames, writer) {
    (function next(i, len) {
        if (i < len) {
            var reader = fs.createReadStream(pathnames[i]);

            reader.pipe(writer, { end: false });
            reader.on('end', function() {
                next(i + 1, len);
            });
        } else {
            writer.end();
        }
    }(0, pathnames.length));
}

function validateFiles(pathnames, callback) {
    (function next(i, len) {
        if (i < len) {
            fs.stat(pathnames[i], function (err, stats) {
                if (err) {
                    callback(err);
                } else if (!stats.isFile()) {
                    callback(new Error());
                } else {
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, pathnames);
        }
    }(0, pathnames.length));
}





/*第三次迭代*/
/*
	从工程角度上讲，没有绝对可靠的系统。即使第二次迭代的代码经过反复检查后能确保没有bug，也很难说是否会因为NodeJS本身，或者是操作系统本身，
	甚至是硬件本身导致我们的服务器程序在某一天挂掉。
	因此一般生产环境下的服务器程序都配有一个守护进程，在服务挂掉的时候立即重启服务。
	一般守护进程的代码会远比服务进程的代码简单，从概率上可以保证守护进程更难挂掉。
	如果再做得严谨一些，甚至守护进程自身可以在自己挂掉时重启自己，从而实现双保险。


	因此在本次迭代时，我们先利用NodeJS的进程管理机制，将守护进程作为父进程，将服务器程序作为子进程，并让父进程监控子进程的运行状态，在其异常退出时重启子进程。
	

	我们可以把守护进程的代码保存为daemon.js，之后我们可以通过node daemon.js config.json启动服务，而守护进程会进一步启动和监控服务器进程。
	此外，为了能够正常终止服务，我们让守护进程在接收到SIGTERM信号时终止服务器进程。而在服务器进程这一端，同样在收到SIGTERM信号时先停掉HTTP服务再正常退出。至此，我们的服务器程序就靠谱很多了。

*/


function main(argv) {
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80,
        server;

    server = http.createServer(function (request, response) {
        ...
    }).listen(port);

    process.on('SIGTERM', function () {
        server.close(function () {
            process.exit(0);
        });
    });
}