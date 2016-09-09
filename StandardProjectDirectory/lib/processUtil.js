
var child_process = require('child_process');
var util = require('util');

function copy(source, target, callback) {
    child_process.exec(
        util.format('cp -r %s/* %s', source, target), callback);
}

copy('a', 'b', function (err) {
    // ...
});


/*

	process - 任何一个进程都有启动进程时使用的命令行参数，有标准输入标准输出，有运行权限，有运行环境和运行状态。
			  在NodeJS中，可以通过process对象感知和控制NodeJS自身进程的方方面面。
			  另外需要注意的是，process不是内置模块，而是一个全局对象，因此在任何地方都可以直接使用。

	child_process - 可以创建和控制子进程。该模块提供的API中最核心的是.spawn，其余API都是针对特定使用场景对它的进一步封装，算是一种语法糖。
	cluster - cluster模块是对child_process模块的进一步封装，专用于解决单进程NodeJS Web服务器无法充分利用多核CPU的问题。

	应用场景

	如何获取命令行参数
		//在NodeJS中可以通过process.argv获取命令行参数。但是比较意外的是，node执行程序路径和主模块文件路径固定占据了argv[0]和argv[1]两个位置，而第一个命令行参数从argv[2]开始。为了让argv使用起来更加自然，可以按照以下方式处理。
		function main(argv) {
    		// ...
		}
		main(process.argv.slice(2));

	如何退出程序
		try {
    		// ...
		} catch (err) {
    		// ...
   			process.exit(1);
		}


	如何控制输入输出
		NodeJS程序的标准输入流（stdin）、一个标准输出流（stdout）、一个标准错误流（stderr）分别对应process.stdin、process.stdout和process.stderr，第一个是只读数据流，后边两个是只写数据流，对它们的操作按照对数据流的操作方式即可。	
		
		







*/