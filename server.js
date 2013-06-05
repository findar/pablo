/*global console, require */

(
function main() {
    var express = require('express'),
        api = require('./routes/API'),
        routes = require('./routes'),
        app = module.exports = express();

    var redis = require('redis'),
        client = redis.createClient();


    app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(__dirname + '/public'));
        app.use(app.router);
    });

    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
        app.use(express.errorHandler());
    });

    app.all('/api/feed/:token', api.crossSiteSettings);
    app.post('/api/feed/:token', api.post);
    app.get('/api/eat/:token', api.get);
    app.get('/api/eat/:token/:startTime', api.get);
    app.get('/api/eat/:token/:startTime/:endTime', api.get);
    app.post('*', routes.deadEnd);
    app.options('*', routes.deadEnd);//This is necessary or Firefox will 404 and fail on post
    app.get('*', routes.home);

    var port = process.env.PORT || 8888;
    app.listen(port, function() {
        console.log("Listening on port: ", port);
    });
}

)();
