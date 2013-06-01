(

function main() {
    var express = require('express'),
        app = express();

    var redis = require('redis'),
        client = redis.createClient();

    app.post('/:token', function(request, response) {
        //Put data in a temporary store

        console.log(request.body);
        console.log("Token::" + request.params.token);
    });

    app.get('/:token', function(request, response) {
        var token = request.params.token,
            newId = client.incr(token + ":id");
        console.log(newId);
        client.set(newId, "...data...");
        response.writeHead(302, {
            'Location': '/'
        });
        client.end();
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
