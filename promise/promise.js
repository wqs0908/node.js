var Promise =  require('bluebird');


function step1(){
	console.log('a');
	return this;
}


function step2(){
	console.log('b');
	return this;
}


function step3(){
	console.log('c');
	return this;
}

function step4(){
	console.log('d');
	return this;
}


Promise.then(step1).then(step2).then(step3).then(step4);