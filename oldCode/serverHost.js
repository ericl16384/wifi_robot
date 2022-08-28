// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// 200 = OK
// 404 = not found



const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 80;

const serverPath = "serverFiles";



function fileServer(request, response) {
    // largely from https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http

    var filePath = request.url;
    if(request.url == "/") {
        filePath = "/index.html";
    } else if(!fs.existsSync(serverPath + filePath)) {
        filePath = "/404.html";
    }

    var contentType;
    switch(path.extname(filePath)) {
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".csv":
            contentType = "text/csv";
            break;
        case ".png":
            contentType = "image/png";
            break;      
        case ".jpg":
            contentType = "image/jpg";
            break;
        case ".wav":
            contentType = "audio/wav";
            break;
        default:
            contentType = "text/plain";
            break;
    }

    fs.readFile(serverPath + filePath, function(error, content) {
        if(error) {
            //if(error.code == "ENOENT"){
            //    fs.readFile("./404.html", function(error, content) {
            //        response.writeHead(200, {"Content-Type": "text/html"});
            //        response.end(content, "utf8");
            //    });
            //} else {
            response.writeHead(500);
            response.end(`Sorry, check with the site admin for error: ${error.code}`, "utf8");
            //}
        } else {
            response.writeHead(200, {"Content-Type": contentType});
            response.end(content, "utf8");
        }
    });
    
    console.log("ip:", request.socket.remoteAddress); // don't know if this is accurate
    console.log("url:", request.url);
    console.log("path:", filePath);
}



server = http.createServer(fileServer);

server.listen(port, host, function() {
    console.log(`The server listening on ${host}:${port}`);
});

//console.log("This is printed after the server has been created.  However, the server might not be ready to run, yet.");
