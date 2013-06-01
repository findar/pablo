/*global console, require */


(
function main() {
    var express = require('express'),
        app = express();

    var redis = require('redis'),
        client = redis.createClient();

    //We want to allow any origin to send cross site posts to record data
    app.options('/:token', function(request, response){
        response.header("Access-Control-Allow-Origin", "*");
        response.end('');
    });

    app.post('/:token', function(request, response) {
        //Put data in a temporary store
        console.log(request.body);
        console.log("Token::" + request.params.token);
        response.header("Access-Control-Allow-Origin", "*");
        response.end('');
    });

    //If someone just puts in the token we want to redirect them to the homepage
    app.get('/:token', function(request, response) {
        response.writeHead(302, {
            'Location': '/'
        });
        response.end();
    });

    app.get('/', function(request, response) {
        response.send('Simple node.js app');
    });

    app.listen(8888);
    console.log("Listening....");
}

)();


//Have a batch function that takes the in memory store and then dump that into a MySQL db
