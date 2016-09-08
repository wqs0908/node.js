/文件操作*/


var fs  = require('fs');
var path = require('path');

/*小文件拷贝*/
function copy(src, dst) {
	// writeFileSync 写文件   readFileSync 读文件
    fs.writeFileSync(dst, fs.readFileSync(src));
}


/*大文件拷贝*/
function copyForBigFile(src, dst) {
	// createReadStream 创建源文件只读数据流    
	// createWriteStream  创建目标文件的只写数据流
	// pipe   将两个数据流连接起来
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}


/*大文件拷贝*/
function copyForBigFileWihoutPipe(src,dst){
	// 创建只读数据流
	var rs = fs.createReadStream(src);

	// 创建只写数据流
	var ws = fs.fs.createWriteStream(dst);

	rs.on('data', function (chunk) {
    if (ws.write(chunk) === false) {
    		// 暂停
        	rs.pause();
    	}
	});

	rs.on('end', function () {
    	ws.end();
	});	

	// drain事件，判断什么时候只写数据流已经将缓存中的数据写入目标
	ws.on('drain', function () {
    	rs.resume();
	});	




}

/*同步遍历目录*/
function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}




/*=====================二进制===================*/


/*buffer JS语言自身只有字符串数据类型，没有二进制数据类型，因此NodeJS提供了一个与String对等的全局构造函数Buffer来提供对二进制数据的操作*/

// 直接构造Buffer
var bin = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);

// 转换成字符串
var str  = bin.toString('utf-8');

// 字符串转换成二进制
var bin2 = new Buffer('hello', 'utf-8');

console.log(bin[2]);

console.log(str);

// Buffer与字符串有一个重要区别。字符串是只读的，并且对字符串的任何修改得到的都是一个新字符串，原字符串保持不变。至于Buffer，更像是可以做指针操作的C语言数组。例如，可以用[index]方式直接修改某个位置的字节。

// 如果想要拷贝一份Buffer，得首先创建一个新的Buffer，并通过.copy方法把原Buffer中的数据复制过去。这个类似于申请一块新的内存，并把已有内存中的数据复制过去
var bin3 = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]);
var dup = new Buffer(bin3.length);

bin3.copy(dup);

dup[0] = 0x48;

console.log(bin3); // => <Buffer 68 65 6c 6c 6f>

console.log(dup); // => <Buffer 48 65 65 6c 6f>







/*==================== 数据流 ==================*/
// 当内存中无法一次装下需要处理的数据时，或者一边读取一边处理更加高效时，我们就需要用到数据流。NodeJS中通过各种Stream来提供对数据流的操作。


/*==================== 文件系统 ================*/
/*
	NodeJS通过fs内置模块提供对文件的操作。fs模块提供的API基本上可以分为以下三类：
	文件属性读写 - 其中常用的有fs.stat、fs.chmod、fs.chown
	文件内容读写 - 其中常用的有fs.readFile、fs.readdir、fs.writeFile、fs.mkdir
	底层文件操作 - 其中常用的有fs.open、fs.read、fs.write、fs.close	


*/



/*===================== 路径 Path =====================*/
/*
	操作文件时难免不与文件路径打交道。NodeJS提供了path内置模块来简化路径相关操作，并提升代码可读性。以下分别介绍几个常用的API
	path.normalize 将传入的路径转换为标准路径，具体讲的话，除了解析路径中的.与..外，还能去掉多余的斜杠
	path.join      将传入的多个路径拼接为标准路径
	path.extname   当我们需要根据不同文件扩展名做不同操作时，该方法就显得很好用 


*/

 var cache = {};

  function store(key, value) {
      cache[path.normalize(key)] = value;
  }

  store('foo/bar', 1);
  store('foo//baz//../bar', 2);
  console.log(cache);  // => { "foo/bar": 2 }

   path.extname('foo/bar.js'); // => ".js"

   path.join('foo/', 'baz/', '../bar'); // => "foo/bar"








// 测试
function main(argv) {
    copy(argv[0], argv[1]);
}


// console.log(process.argv);


/*process是一个全局变量，可通过process.argv获得命令行参数。由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]这个位置开始。*/
// main(process.argv.slice(2));




travel('D:/node.js', function (pathname) {
    console.log(pathname);
});