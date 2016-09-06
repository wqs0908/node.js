var EventEmitter = require('events').EventEmitter;

var life = new EventEmitter();

// 设置最大响应事件数
life.setMaxListeners(20);


// 同样的一个事件getMsg 监听了11次

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg);
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'1111');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'2222');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'3333');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'4444');
});


life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'5555');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'6666');
});


life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'7777');
});


life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'8888');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'9999');
});

life.on('getMsg',function(msg){
	console.log('获取的信息:'+msg+'0000');
});



// 当同一个事件超过10个以上的响应事件（监听器）的时候，nodejs就会抛出异常
// life.on('getMsg', function (msg) {
//     console.log('获取的信息:'+msg+'9999')
// })
// 但是可以通过 setMaxListeners(n) 方法设置最大响应事件数
// 【注意】setMaxListeners 方法必须放在所有响应事件之前



// 事件触发
 var hasGetMsg = life.emit('getMsg','events模块');


 console.log(hasGetMsg); //true


 // // 移除事件监听器只能移除带有名字的函数，而不能移除回调函数（匿名函数）
// 【注意】需要在调用事件之前移除
//移除所有事件
//life.removeAllListeners()
life.removeAllListeners('getMsg')


// 还可以打印有多少个事件监听器（两种方法）
console.log(life.listeners('getMsg').length)
console.log(EventEmitter.listenerCount(life, 'getMsg'))


