(function(exports)
{
    // THESE MESSAGES ARE UTILIZED
    // Player A or Player B to Server: Click Tile
    exports.O_TILE_CLICK_BY =
    {
        type: "TILE-CLICKED-BY",
        player: false, // get player that the tile was clicked by (false for black, true for white)
        tile: "", // get tile that was clicked on
        selected: "" // get already selected tile, if exists
    };

    // Server to client: Player controls white/black pieces
    exports.O_PLAYER_TYPE = 
    {
        type: "PLAYER-TYPE",
        data: false
    };

    // Server to Client: Piece Movement
	exports.O_MOVE_PIECE =
	{
		type: "MOVE-PIECE",
		player: false, // the player that did the movement
		tileFrom: "",
		tileTo: "",
        imageFrom: "",
        imageTo: ""
    }
    
    // Server to Client: Piece Selection Result
	exports.O_SELECT_PIECE =
	{
		type: "SELECT-PIECE",
		tile: "",
		validMoves: []
    }

    // Server to Client: Initialize Game (Waiting for Players)
    exports.O_INITIALIZE_GAME =
    {
        type: "STATE",
        status: 0
    }

    // Server to Client: Start Game
    exports.O_START_GAME =
    {
        type: "STATE",
        status: 1
    }

    // // Client to Server: Tile Clicked
    // var O_TILE_CLICK_BY =
    // {
    //     type: "TILE-CLICKED-BY",
    //     player: false, // get player that the tile was clicked by (false for black, true for white)
    //     tile: "", // get tile that was clicked on
    //     selected: "" // get already selected tile, if exists
    // };

    // ------------------------------------------------------

    // Server to Client: Aborted Game
    exports.O_GAME_ABORTED =
    {
        type: "STATE",
        status: 2
    };

    // Server to Player A or B: Check
    exports.O_CHECK = {
        type: "CHECK",
        data: null // A or B
    };
    // Server to Player A & B: GameOver With Win/Stalemate/Loss result
    exports.O_CHECKMATE = {
        type: "STATE",
        status: 3,
        data: null, // Win/Stalemate/Loss
        player: null // A or B
    };

    exports.cloneMessage = function(message)
    {
        // Convert message to JSON and back, effectively cloning it
        return JSON.parse(JSON.stringify(message));
    }
}(typeof exports === "undefined" ? this.messages = {} : exports));
// If exports is undefined, we are on the client; else the server