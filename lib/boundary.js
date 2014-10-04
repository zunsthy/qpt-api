
var exports = module.exports = {};

var D4 = function(){
	        return ((((1 + Math.random()) * 10000) | 0).toString().substring(1));
}

var boundary = module.exports.boundary = function(){
	return ('---------------------------' + D4() + D4() + D4() + D4() + D4() + D4() + D4());
}

