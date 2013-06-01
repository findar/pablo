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
     // Record servertime and use this as primary key
     // Do the math to convert values passed in to calculated values, ie totalLoadTime versus loadStart and loadEnd
     // ^ is this a good idea?  Can timing come in parallel?

    //Start [navigationStart/redirectStart]
    //Redirect [redirectEnd]
    //App Cache [fetchStart]
    //DNS [domainLookupStart, domainLookupEnd]
    //TCP [connectStart, connectEnd]
    //Request/Response [requestStart, responseStart, responseEnd]
    //Processing/Dom [domLoading, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete]
    //Load [loadEventStart, loadEventEnd]

    //Total = loadEventEnd - navigationStart
    //Redirect = redirectEnd - redirectStart
    //APPCache = domainLookupStart - fetchStart  !! Optional
    //DNS = domainLookupEnd - domainLookupStart
    //TCP = connectEnd - connectStart
    //Request = responseStart - requestStart
    //Response = responseEnd - responseStart
    //Processing = domComplete - domLoading
    //load = loadEventEnd - loadEventStart

    //PageName
    //IP From which it came (also add to set for batch lookup for regions)
    //Region (country code if possible)
    //System time POST was received

        var token = request.params.token,
            now = Date.now();

        client.incr(token + ":id", function(error, object){
            var id = object,
                hashKey = token + ":" + id + ":data",
                rBody = request.body;

            client.hmset(hashKey, {
                "time" :            now,
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

    app.get('/', function(request, response, next) {
        response.send('Simple node.js app');
        response.end();
    });

    app.listen(8888);
    console.log("Listening....");
}

)();


//Have a batch function that takes the in memory store and then dump that into a MySQL db
