var express = require("express");
var http = require("http");
var websocket = require("ws");

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
var connectionID = 0; // keep track of next unique WebSocket Connection ID

// TBD: Move these stats elsewhere
var gamesInitialized = 0;
// -------------------------------

var currentGame = new Game(gamesInitialized++); // keep track of current game

var server = http.createServer(app).listen(port); // create server on port
const wss = new websocket.Server( {server} ); // create WebSocket server

wss.on("connection", function connection(ws) {
    let connection = ws; // reference connection to ws
    connection.id = connectionID++; // assign unique ID, increment it for use for next connections
    let playerType = currentGame.addPlayer(connection); // true for White, false for Black
});