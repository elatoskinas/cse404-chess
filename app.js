var express = require("express");
var http = require("http");
var websocket = require("ws");

var Game = require("./game");
var gameStats = require("./stats");
var messages = require("./public/javascripts/messages");

// route path
var indexRouter = require("./routes/index.js");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

// routes
app.use('/', indexRouter);
app.use('/play', indexRouter);

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

    if(connection.id%2==res&&connection.id>1)
    {
        gamesInitialized+=1;
        currentGame = new Game(gamesInitialized);
    }

    let playerType = currentGame.addPlayer(connection); // true for White, false for Black
    websockets[connection.id] = currentGame; // assign game to connection ID in WebSockets array
    gameStats.activeGamers++;
    // debug
    console.log("Player %s placed in game %s as %s", connection.id, currentGame.id, (playerType ? "White" : "Black"));

    // inform the client about the pieces that will be controlled by the client (constructing the message accordingly beforehand)
    let playerTypeJSON = messages.cloneMessage(messages.O_PLAYER_TYPE);
    playerTypeJSON.data = playerType;
    connection.send(JSON.stringify(playerTypeJSON));

    if (!playerType) // Second Player joined
    {
        // Start Game & Send Message to both sockets
        var startMSG = JSON.stringify(messages.O_START_GAME);
        currentGame.p1.send(startMSG);
        connection.send(startMSG);
    }
    else // First Player joined
    {
        // Inform the client that we're waiting for another Player
        connection.send(JSON.stringify(messages.O_INITIALIZE_GAME));
    }

    
    var socketGame = websockets[connection.id];

    // Close WebSocket
    connection.on("close", function (code)
    {   gameStats.activeGamers--;
        console.log(connection.id + " disconnected");
        if(!socketGame.hasTwoPlayers){
            socketGame.p1=null;
            gamesInitialized--;
            if(res==0) res = 1;
            else res = 0;
        }
        else{    
        if (code == "1001"&&socketGame.p1&&socketGame.p2)
        {
                if(connection.id%2!=res){
                    socketGame.p1.send(JSON.stringify(messages.O_GAME_ABORTED));
                    socketGame.p2=null;
                }                
                else{
                    socketGame.p2.send(JSON.stringify(messages.O_GAME_ABORTED));
                    socketGame.p1=null;
                }                              
            }
        }
    });

    // Get incoming messages from WebSockets
    connection.on("message", function incoming(message)
    {
        // Parse message
        var incomingMSG = JSON.parse(message);

        // Receive Click Event from WebSocket
        if (incomingMSG.type === messages.O_TILE_CLICK_BY.type)
        {
            // Generate click response according to game state
            var clickResponse = socketGame.gameState.getClick(incomingMSG.tile, incomingMSG.player, incomingMSG.selected);

            // Click response is valid
            if (clickResponse != null)
            {
                if (clickResponse.type === messages.O_MOVE_PIECE.type) // Moved piece successfully
                {
                    // send standard blank O_SELECT_PIECE the message to the client that executed the move (effectively deselecting the piece)
                    connection.send(JSON.stringify(messages.O_SELECT_PIECE));
                    
                    // Update board for both players
                    var checkmateStatus = socketGame.gameState.newTurn();
                    // If a piece is moved successfully, switch the turn     
                    socketGame.p1.send(JSON.stringify(clickResponse));
                    socketGame.p2.send(JSON.stringify(clickResponse));

                    var playerCheckStatus = socketGame.gameState.sendCheckStatus(); 
                    
                    if(playerCheckStatus!=null){
                        if(playerCheckStatus.data==true)
                        socketGame.p1.send(JSON.stringify(playerCheckStatus));
                        else socketGame.p2.send(JSON.stringify(playerCheckStatus));
                    }

                    if(checkmateStatus.data!=null){
                        if(checkmateStatus.data==1){
                            // If a checkmate is detected, send the corresponding messages to each player
                            gameStats.gamesCompleted++;
                            if(checkmateStatus.player==true){
                                socketGame.p1.send(JSON.stringify(checkmateStatus));
                                checkmateStatus.data+=1;
                                socketGame.p2.send(JSON.stringify(checkmateStatus));
                            } else {
                                socketGame.p2.send(JSON.stringify(checkmateStatus));
                                checkmateStatus.data+=1;
                                socketGame.p1.send(JSON.stringify(checkmateStatus));
                            }
                        }
                        if(checkmateStatus.data==0){
                            // If a stalemate is detected, send the same message to both of the players
                            socketGame.p1.send(JSON.stringify(checkmateStatus));
                            socketGame.p2.send(JSON.stringify(checkmateStatus));
                        }
                    }
                }
                else // Select piece
                {
                    // Send response to client containing info required for piece selection
                    connection.send(JSON.stringify(clickResponse));
                }
            }
        } 
    });
});
