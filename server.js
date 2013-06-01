/*global console, require */
//TODO:  Display a ui so user can get results
//TODO:  Provide a ui to generate tokens based on url
//TODO:  Provide a ui to generate the js for injection into pages


(
function main() {
    var express = require('express'),
        app = express();

    app.use(express.bodyParser());

    var redis = require('redis'),
        client = redis.createClient();

    app.all('/:token', function(request, response, next) {
        response.set({
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Headers": "origin,content-Type,x-requested-with"
        });
        next();
    });

    app.post('/:token', function(request, response) {
     // Handle the post for this route
        console.log(request.body);
        console.log(request.params.token);
        response.end();
    });

    //This is necessary or Firefox will 404 and fail
    app.options('/:token', function(request, response){
        response.end();
    });

    //If someone just puts in the token we want to redirect them to the homepage
    app.get('/:token', function(request, response) {
        response.writeHead(302, {
            'Location': '/'
        });
        response.end();
    });

    app.get('/', function(request, response, next) {
        response.send('Simple node.js app');
        response.end();
    });

    app.listen(8888);
    console.log("Listening....");
}

)();


//Have a batch function that takes the in memory store and then dump that into a MySQL db
