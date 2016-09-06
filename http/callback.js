function learn(something){
	console.log(something);
}

function we (callback,something){
	something += 'is so cool';
	callback(something);
}


// 
we(learn,'Wang Qiusheng');


// 通过匿名函数调用
we(function(something){
	console.log(something);
},'Jack');