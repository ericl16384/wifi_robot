// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
// 200 = OK
// 404 = not found

// much from https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http



const http = require("http");
const util = require("./utilities");

const host = "localhost";
const port = 80;



function serverResponse(response, content, statusCode=200, headerOptions={}) {
    response.writeHead(statusCode, headerOptions);
    response.end(content, "utf8");
}

http.createServer(function(request, response) {
    var options = {
        host: "www.chiark.greenend.org.uk",
        port: 80,
        path: "/~sgtatham/puzzles/"
    };
    
    var content = "";   
    var req = http.request(options, function(res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            content += chunk;
        });
        res.on("end", function () {
            serverResponse(response, content);
        });
    });
    
    req.end();
    
}).listen(port, host, function() {
    console.log(`The server listening on ${host}:${port}`);
});
