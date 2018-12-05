var express = require("express");
var http = require("http");
var websocket = require("ws");

var Game = require("./game");
var messages = require("./public/javascripts/messages");

// route path
var indexRouter = require("./routes/index.js");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

// routes
app.use('/', indexRouter);
app.use('/play', indexRouter);


// TBD: Move this stat in GameStatus JS file
var gamesInitialized = 0;
// -------------------------------

// --- WebSockets ---
var websockets = []; // array keeping track of websockets
var connectionID = 0; // keep track of next unique WebSocket Connection ID
var currentGame = new Game(gamesInitialized); // keep track of current game

// Server Creation
var server = http.createServer(app).listen(port); // create server on port
const wss = new websocket.Server( {server} ); // create WebSocket server
var res = 0;
// Listen for incoming WebSocket connections
wss.on("connection", function connection(ws) {
    let connection = ws; // reference connection to ws
    connection.id = connectionID++; // assign unique ID, increment it for use for next connections   
    if(connection.id%2==res&&connection.id>1){
        gamesInitialized+=1;
        currentGame = new Game(gamesInitialized);
        }
    let playerType = currentGame.addPlayer(connection); // true for White, false for Black
    websockets[connection.id] = currentGame; // assign game to connection ID in WebSockets array

    // debug
    console.log("Player %s placed in game %s as %s", connection.id, currentGame.id, (playerType ? "White" : "Black"));

    // inform the client about the pieces that will be controlled by the client
    connection.send((playerType) ? messages.S_PLAYER_WHITE : messages.S_PLAYER_BLACK);
    connection.on("close", function (code) {
        if(!websockets[connection.id].hasTwoPlayers){
            websockets[connection.id].p1=null;
            //gamesInitialized--;
            if(res==0) res = 1;
            else res = 0;
            console.log(res);
        }
        else{
        /*
         * code 1001 means almost always closing initiated by the client;
         * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
         */
        console.log(connection.id + " disconnected ...");
    
        if (code == "1001") {
            /*
            * if possible, abort the game; if not, the game is already completed
            */
            let gameObj = websockets[connection.id];
    
                /*
                 * determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.p1.close();
                    gameObj.p1 = null;
                }
                catch(e){
                    console.log("Player A closing: "+ e);
                }
    
                try {
                    gameObj.p2.close(); 
                    gameObj.p2 = null;
                }
                catch(e){
                    console.log("Player B closing: " + e);
                }                
            }
        }
    });
});

