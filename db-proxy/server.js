var express = require('express');  
var request = require('request');
var colors = require('colors');

var app = express();  
var apiServerHost = 'http://showgrid.com'
app.use('/', function(req, res) { 

  var url = apiServerHost + req.url;
  console.log(("["+String(req.method)+"]").cyan,url.yellow)
  req.pipe(request({
  	url: url,
  	headers: {
  		Origin:  'showgrid.com',
  		//Host:  apiServerHost,
  		Referrer:  'showgrid.com',
  	}
  })).pipe(res);
});

app.listen(process.env.PORT || 8001);  
console.log(apiServerHost.cyan,":","8001".green)