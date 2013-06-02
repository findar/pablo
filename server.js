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
        var token = request.params.token,
            now = Date.now();

        client.incr(token + ":id", function(error, newId){
            var id = newId,
                hashKey = token + ":" + id + ":data",
                rBody = request.body;
            //These values are based on the chart found here: https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/Overview.html#processing-model
            client.hmset(hashKey, {
                "time" :            now,
                "path" :            request.path,
                "host" :            request.host,
                "url"  :            request.url,
                "ip"   :            request.ip,
                "totalDuration" :   rBody.loadEventEnd - rBody.navigationStart,
                "redirect" :        rBody.redirectEnd - rBody.redirectStart,
                "appCache" :        rBody.domainLookupStart - rBody.fetchStart,
                "dns" :             rBody.domainLookupEnd - rBody.domainLookupStart,
                "tcp" :             rBody.connectEnd - rBody.connectStart,
                "request" :         rBody.responseStart - rBody.requestStart,
                "response" :        rBody.responseEnd - rBody.responseStart,
                "processing" :      rBody.domComplete - rBody.domLoading,
                "load" :            rBody.loadEventEnd - rBody.loadEventStart
            });

            client.zadd(token + ":sortedId", now, id);
        });
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

    app.get('/', function(request, response) {
        response.send('Simple node.js app');
        response.end();
    });

    app.listen(8888);
    console.log("Listening....");
}

)();
