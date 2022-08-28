// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes



const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 80;

var fileLocation = "index.html";
var fileContents = null;
fs.readFile(fileLocation, "utf8", function(err, data) {
    if(err) {
        console.log(err)
    } else {
        fileContents = data;
    }
});

var views = 0;



function requestListener(request, result) {
    console.log("url:", request.url)

    if(request.url == "/") {
        views++;
//        var msg = `Hello from the web server!

//Views: ${views}`;
        msg = fileContents;

        result.setHeader("Content-Type", "text/html");
        result.writeHead(200);    // status 200 = OK
        result.end(msg);
    } else {
        result.writeHead(404);
        result.end("Not found");
    }
    
    //console.log(`${request.method} ${request.url}`);
    
    //result.setHeader("Content-Type", "application/json");
    //result.setHeader("Content-Type", "text/csv");
    //result.setHeader("Content-Type", "text/html");
}



const server = http.createServer(requestListener);
server.listen(port, host, function() {
    console.log(`This is called when the server has started up and is ready.  Listening on: ${host}:${port}`);
})

console.log("This is printed after the server has been created.  However, the server might not be ready to run, yet.");