var express = require("express");
var http = require("http");
var ws = require("ws");

// route path
var indexRouter = require("./routes/index.js");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

// routes
app.use('/', indexRouter);
app.use('/play', indexRouter);

// --- WebSockets ---
var websockets = []; // array keeping track of websockets
var connectionID = 0; // each websocket has a unique ID

var server = http.createServer(app).listen(port);
const wss = new ws.Server( {server} );

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
        console.log("X");
    });
});