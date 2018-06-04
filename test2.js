var http = require('http');
var parser = require('ua-parser-js');

http.createServer(function (req, res) {
    // get user-agent header
    var ua = parser("Mozilla/5.0 (Linux; Android 8.0; ONEPLUS A3010 Build/OPR1.170623.032; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044033 Mobile Safari/537.36 MicroMessenger/6.6.6.1300(0x26060637) NetType/WIFI Language/zh");
    // write the result as response
    res.end(JSON.stringify(ua, null, '  '));
})
    .listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');