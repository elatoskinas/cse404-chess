(function(exports)
{
    // Player A or Player B to Server: Click Tile
    exports.O_TILE_CLICK_BY =
    {
        type: "TILE-CLICKED-BY",
        data: null // "A" or "B"
    };

    // Server to Player A or B: Select Piece Highlight/Blink
    exports.O_SELECT_PIECE_BY =
    {
        type: "SELECT-PIECE-BY",
        data: null // "A" or "B"
    };

    // Server to Client: Aborted Game
    exports.O_GAME_ABORTED =
    {
        type: "GAME-ABROTED"
    };

    // Server to Client: White's Turn
    exports.O_PLAYER_TURN = {
        type: "PLAYER-TURN",
        data: null
    };
    // Server to Player A or B: Check
    exports.O_CHECK = {
        type: "CHECK",
        data: null // A or B
    };
    // Server to Player A & B: GameOver With Win/Stalemate/Loss result
    exports.O_CHECKMATE = {
        type: "CHECKMATE",
        data: null // Win/Stalemate/Loss
    };

    // Server to client: Player controls White pieces 
    exports.O_PLAYER_WHITE =
    {
        type: "PLAYER-TYPE", 
        data: true
    };
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    // Server to client: Player controls Black pieces
    exports.O_PLAYER_BLACK = 
    {
        type: "PLAYER-TYPE",
        data: false
    };
    exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);
    
}(typeof exports === "undefined" ? this.messages = {} : exports));
// If exports is undefined, we are on the client; else the server