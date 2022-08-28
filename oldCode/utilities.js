const http = require("http");
const fs = require("fs");
const path = require("path");



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

function formatFilePath(filePath) {
    if(filePath.startsWith("/")) {
        filePath = filePath.slice(1);
    }
    if(filePath.endsWith("/")) {
        filePath = filePath.slice(0, -1);
    }
    return filePath;
}

function getDirectoryContents(directoryPath) {
    // returns array of directories, files, other
    
    var items = fs.readdirSync(directoryPath);

    var directories = [];
    var files = [];
    var other = [];

    for(let i=0; i<items.length; i++) {
        var stat = fs.statSync(`${directoryPath}/${items[i]}`);
        if(stat.isDirectory()) {
            directories.push(items[i]);
        } else if(stat.isFile()) {
            files.push(items[i]);
        } else {
            other.push(items[i]);
        }
    }

    return [directories, files, other];
}

function serveDirectoryIndex(response, directoryPath) {
    directoryPath = formatFilePath(directoryPath);

    var content = "<!DOCTYPE html><html><head><title>Directory Index</title></head><body>";

    // header
    content += "<p><a href=/>Home</a></p>";

    // directory display
    var pathComponents = directoryPath.split("/");
    var currentPath = "";
    content += "<h1>";
    for(let i=0; i<pathComponents.length-1; i++) {
        currentPath += `/${pathComponents[i]}`;
        content += `<a href=${currentPath}>${pathComponents[i]}</a> / `;
    }
    content += `${pathComponents[pathComponents.length-1]} /`;
    content += "</h1>";
    
    // content display
    var [directories, files, other] = getDirectoryContents(directoryPath);
    for(let i=0; i<directories.length; i++) {
        content += `<p><a href=/${directoryPath}/${directories[i]}>${directories[i]}/</a></p>`;
    }
    for(let i=0; i<files.length; i++) {
        content += `<p><a href=/${directoryPath}/${files[i]}>${files[i]}</a></p>`;
    }
    for(let i=0; i<other.length; i++) {
        content += `<p>? <a href=/${directoryPath}/${other[i]}>${other[i]}</a></p>`;
    }

    content += "</body></html>";

    response.writeHead(200, {"Content-Type": "text/html"});
    response.end(content, "utf8");
}

function serveFile(response, filePath="", statusCode=200, serveDirectories=true) {
    filePath = formatFilePath(filePath);

    if(!fs.existsSync(filePath)) {
        filePath = "404.html";
        statusCode = 404;
    } else if(fs.lstatSync(filePath).isDirectory()) {
        if(serveDirectories) {
            serveDirectoryIndex(response, filePath);
            return;
        } else {
            filePath = "404.html";
            statusCode = 404;
        }
    }

    fs.readFile(filePath, function(error, content) {
        if(error) {
            response.writeHead(500);
            response.end(`Sorry, check with the site admin for error: ${error.code}`, "utf8");
        } else {
            response.writeHead(statusCode, {"Content-Type": getFileContentType(filePath)});
            response.end(content, "utf8");
        }
    });
}



module.exports = {
    getFileContentType,
    formatFilePath,
    getDirectoryContents,
    serveDirectoryIndex,
    serveFile
};
