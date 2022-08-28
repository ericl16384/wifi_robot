// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// 200 = OK
// 404 = not found

// much from https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http



const http = require("http");
const util = require("./utilities");

const host = "localhost";
const port = 80;



http.createServer(function(request, response) {
    console.log("url requested:", request.url);

    var url = request.url;
    if(!url.endsWith("/")) {
        url += "/";
    }

    if(url == "/") {
        util.serveFile(response, "index.html");
    } else if(url.startsWith("/files/")) {
        util.serveFile(response, url);
    } else {// if(!fs.existsSync(url)) {
        util.serveFile(response);
    }
}).listen(port, host, function() {
    console.log(`The server listening on ${host}:${port}`);
});