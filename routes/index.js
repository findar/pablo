exports.deadEnd = function(request, response) {
	response.end();
};

exports.home = function(request, response) {
	response.render('index');
};
