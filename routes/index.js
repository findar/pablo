var fs = require('fs');

exports.deadEnd = function(request, response) {
	response.end();
};

exports.home = function(request, response) {
	response.render('index');
};

exports.public = function(request, response) {
	console.log(request.url);
	console.log(__dirname + request.url); //how do i get to public? hm
	fs.readFile(__dirname + request.url, function(error, file) {
		response.end(file, 'binary');
	});
};