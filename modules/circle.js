var PI = Math.PI;

// 导出模块
exports.area = function(r){
	return PI*r*r;
};

exports.circumference = function(r){
	return 2*PI*r;
};