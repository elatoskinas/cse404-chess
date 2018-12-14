var express = require("express");
var http = require("http");
var websocket = require("ws");
var ejs = require("ejs");
var cookieParser = require('cookie-parser');

var Game = require("./game");
var gameStats = require("./stats");
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();
app.use(cookieParser());

// route path
var indexRouter = require("./routes/index.js")(app, gameStats);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// routes
//app.use('/', indexRouter);
//app.use('/play', indexRouter);

var gamesInitialized = 0;
// -------------------------------

// --- WebSockets ---
var websockets = []; // array keeping track of websockets
var connectionID = 0; // keep track of next unique WebSocket Connection ID
var currentGame = new Game(gamesInitialized++); // keep track of current game

// Server Creation
var server = http.createServer(app).listen(port); // create server on port
const wss = new websocket.Server( {server} ); // create WebSocket server

// Listen for incoming WebSocket connections
wss.on("connection", function connection(ws) {
    let connection = ws; // reference connection to ws
    connection.id = connectionID++; // assign unique ID, increment it for use for next connections   

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

        // Start next new Game to put Players in
        currentGame = new Game(gameStats.gamesInitialized++);
        gameStats.ongoingGames++;
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
            gameStats.gamesInitialized--;
        }
        else if (code == "1001")
        {
            if (socketGame.p1.readyState != 3 || socketGame.p2.readyState != 3) // there exists one player that is still connected
            {
                // Decrement Ongoig Games count
                gameStats.ongoingGames--;

                // Check if socket has been closed, and if not, send them the Game Aborted message
                if(socketGame.p1.readyState != 3)
                {
                    socketGame.p1.send(JSON.stringify(messages.O_GAME_ABORTED));
                }                
                else if (socketGame.p2.readyState != 3)
                {
                    socketGame.p2.send(JSON.stringify(messages.O_GAME_ABORTED));
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
<<<<<<< HEAD
                    var checkInfo = socketGame.gameState.newTurn();
                    var checkStatus = checkInfo[1];
                    var checkmateStatus = checkInfo[0];
                    // If a piece is moved successfully, switch the turn     
                    socketGame.p1.send(JSON.stringify(clickResponse));
                    socketGame.p2.send(JSON.stringify(clickResponse));
=======
                    var checkmateStatus = socketGame.gameState.newTurn();

                    // If a piece is moved successfully, switch the turn
                    socketGame.p1.send(JSON.stringify(clickResponse));
                    socketGame.p2.send(JSON.stringify(clickResponse));

                    var playerCheckStatus = socketGame.gameState.sendCheckStatus(); 

                    console.log(playerCheckStatus);
>>>>>>> 4eded70f730936375c638649b52a54e1996eb84d
                    
                    if(playerCheckStatus!=null){
                        console.log(playerCheckStatus);
                        if(playerCheckStatus.data==true)
                        socketGame.p1.send(JSON.stringify(playerCheckStatus));
                        else socketGame.p2.send(JSON.stringify(playerCheckStatus));
                    }

                    if(checkmateStatus.data!=null){
                        gameStats.ongoingGames--;
                        gameStats.gamesCompleted++;

                        if(checkmateStatus.data==1){
                            // If a checkmate is detected, send the corresponding messages to each player
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
