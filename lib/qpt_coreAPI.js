//node utils
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var url = require('url');
var events = require('events');
var util = require('util');
var path = require('path');

var bd = require('./boundary').boundary;

var QingyingptAPI = module.exports = function(option){
	events.EventEmitter.call(this);

	options = option || {};
	//this.proto = option.proto || 'http';
	this.addr = option.url || 'pt.hit.edu.cn';
	this.port = option.port || 80;
	this.passkey = option.passkey || '';
	if(option.cookie){
		this.cookieH = 'hitpt_uid=' + option.cookie.id + '; hitpt_secure_pass=' + option.cookie.pw;
	} else {
		this.passkey = option.passkey || '';
	}
}

util.inherits(QingyingptAPI, events.EventEmitter);

QingyingptAPI.prototype.parameters = {
	portal : {
		upload : '/take/takeupload.php',
		download : '/download.php'
	},
	other : {
		other : 'other'
	}
}

QingyingptAPI.prototype.doPostwithFile = function(path, fileName, fileContent, args, callback){
	var data = "";
	var boundary = bd();

	for(var key in args){
		data += '--' + boundary + '\r\n'
			+ 'Content-Disposition: form-data; '
			+ 'name="' + key + '"\r\n'
			+ '\r\n'
			+ new Buffer(args[key]).toString('utf8') + '\r\n';
			//+ args[key] + '\r\n';
	}
	
	data += '--' + boundary + '\r\n'
		+ 'Content-Disposition: form-data; name="file"; filename="' + fileName + '"\r\n'
		//+ 'Content-Type:application/x-bittorent\r\n'
		+ '\r\n'
		+ fileContent + '\r\n';

	data += '--' + boundary + '--';

	var options = {
		host : this.host,
		path : path,
		port : this.port,
		method : 'POST',
		headers : {
			'Time' : new Date(),
			'Host' : this.host + ':' + this.port,
			'X-Requested-With' : 'Node',
			'Content-Length' : data.length,
			'Content-Type' : 'multipart/form-data; boundary=' + boundary
		}
	};
	if(this.cookieH){
		options.headers['Cookie'] = this.cookieH;
	}

	function onResponse(res){
		var page = [];
		function onData(chunk){
			page.push(chunk);
		}
		
		function onEnd(){
			if(res.statusCode == 200){
				page = page.join('');
				try {
					var json = JSON.parse(page);
				} catch(err){
					return callback(err);
				}
				if(json.status === 'succ'){
					callback(null, json);
				} else {
					var error = new Error(json.title + json.text);
					error.result = page;
					callback(error);
				}
			} else {
				var error = new Error('Status code mismatched');
				error.result = page;
				callback(error);
			}
		}
		
		res.setEncoding('utf8');
		res.on('data', onData);
		res.on('end', onEnd);
	}

	var req = http.request(options, onResponse);
	req.on('error', callback).end(data, 'binary');
}

QingyingptAPI.prototype.upload = function(filePath, options, callback){
	var self = this;
	var args = [];
	if(typeof options === 'function'){
		callback = options;
	} else {
		if(typeof options === 'object'){
			var keys = Object.keys(options);
			for(var i = 0; i < keys.length; i++){
				args[keys[i]] = options[keys[i]];
			}
		} else {
			callback(new Error('Arguments mismatch for "upload"'));
		}
	}

	fs.readFile(filePath, function(err, data){
		if(err){
			throw err;
		}
		var fileContentBase64 = new Buffer(data).toString('binary');
		//var fileContentBase64 = data;
		self.doPostwithFile(self.parameters.portal['upload'], filePath.substring(filePath.lastIndexOf('/') + 1), fileContentBase64, args, callback);
	});
}



