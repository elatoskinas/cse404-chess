(function(exports)
{
    // Player A or Player B to Server: Click Tile
    // Server to Player A or B: Select Piece Result
    // Server to Client: Aborted Game


    // Server to Client: Black's Turn
    exports.O_PLAYER_TURN = {
        type: "BLACK-TURN",
        data: null
    }
    // Server to Player A or B: Check
    exports.O_CHECK = {
        type: "CHECK",
        data: null
    }
    // Server to Player A & B: GameOver With Win/Stalemate/Loss result
    exports.O_CHECKMATE = {
        type: "CHECKMATE",
        data: null
    }
});