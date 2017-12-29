// なにがともあれ、素のnodejsでhello worldしてみる
// node hello.js したあとに http://192.168.33.10:3000 へアクセスすると出力される。
var http = require('http');
var server = http.createServer();
server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.write('hello world');
    res.end();
}).listen(3000);
console.log("起動してるよ");