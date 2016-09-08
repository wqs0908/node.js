var Q = require("q");
var fun1 = function (data) {
  var deferred = Q.defer();
  deferred.resolve(data+" fun1");
  return deferred.promise;
}

var fun2 = function (data) {
  var deferred = Q.defer();
  deferred.resolve(data+" fun2");
  return deferred.promise;
}

var fun3 = function (data) {
  var deferred = Q.defer();
  deferred.resolve(data+" fun3");
  return deferred.promise;
}

Q.all([
  fun2("test1"),fun3("test2"),fun4("test3")
  ]).spread(function(){
    console.log(arguments);//获得的参数为('test1 fun1', 'test2 fun2', 'test3 fun3' )
  });