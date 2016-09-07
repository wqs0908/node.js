var https = require('https');

var fs =  require('fs');


var options = {
	key:fs.readFileSync('ssh_key.pem'),
	cert:readFileSync('ssh_cert.pem')
};

https.createServer(options,function(req,res){
	res.writeHead(200);
	res.end('Hello HTTPS');
}).listen(8090);

