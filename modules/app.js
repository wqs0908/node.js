// 加载模块
var circle = require('./circle.js');


// 直接调用模块中方法
console.log('面积:'+circle.area(4));

console.log('周长:'+circle.circumference(4));


console.log(__filename);

console.log(__dirname);


console.log(module.paths);