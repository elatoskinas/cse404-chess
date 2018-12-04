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
    // Server to Client: Black's Turn
    // Server to Player A or B: Check
    // Server to Player A & B: GameOver With Win/Stalemate/Loss result
});