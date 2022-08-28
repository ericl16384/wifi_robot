// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes



const http = require("http");

const SERVER_HOST = "localhost";
const SERVER_PORT = 80;



function request_handler(req, res) {
    res.writeHead(200);    // status 200 = OK
    res.end("Hello from the web server ");
}



const server = http.createServer(request_handler);
server.listen(SERVER_PORT, SERVER_HOST, function() {
    console.log(`This is called when the server has started up and is ready.  Listening on: ${SERVER_HOST}:${SERVER_PORT}`);
})

console.log("This is printed after the server has been created.  However, the server might not be ready to run, yet.");