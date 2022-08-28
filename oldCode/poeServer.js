// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// 200 = OK
// 404 = not found

// much from https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http



const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "localhost";
const port = 80;



function getFileContentType(filePath) {
    switch(path.extname(filePath)) {
        case ".html": return "text/html";
        case ".js": return "text/javascript";
        case ".css": return "text/css";
        case ".json": return "application/json";
        case ".csv": return "text/csv";
        case ".png": return "image/png";
        case ".jpg": return "image/jpg";
        case ".wav": return "audio/wav";
        default: return "text/plain";
    }
}

function serveFile(response, filePath="") {
    if(filePath.startsWith("/")) {
        filePath = "." + filePath;
    }

    if(!fs.existsSync(filePath)) {
        filePath = "./404.html";
    }

    fs.readFile(filePath, function(error, content) {
        if(error) {
            response.writeHead(500);
            response.end(`Sorry, check with the site admin for error: ${error.code}`, "utf8");
        } else {
            response.writeHead(200, {"Content-Type": getFileContentType(filePath)});
            response.end(content, "utf8");
            console.log("file path served:", filePath);
        }
    });
}

function mainServer(request, response) {
    serveFile(response, request.url);
}



var server = http.createServer(mainServer);

server.listen(port, host, function() {
    console.log(`The server listening on ${host}:${port}`);
});

//console.log("This is printed after the server has been created.  However, the server might not be ready to run, yet.");
