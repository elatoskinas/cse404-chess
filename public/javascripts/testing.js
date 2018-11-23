/* Test method that fills an 8x8 array of Strings with
   'O' and 'X', where 'O' is the piece and 'X' are all the
   possible moves */
var testPiece = function(piece, board, x, y)
{
    var validMoves = piece.getValidMoves(board, x, y);

    var testBoard =
    [ ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""]];

      testBoard[x][y] = "O";

      for (var i = 0; i < validMoves.length; ++i)
      {
        var movePair = cellToCoordinates(validMoves[i]);

        var x1 = movePair[0];
        var y1 = movePair[1];
        
        testBoard[x1][y1] = "X";
      }

      return testBoard;
}

var main = function()
{
  /*var g = new Game();
  g.startGame();

  // Tests here
  console.log(testPiece(g.board[0][0], g.board, 2, 3));
  console.log(testPiece(g.board[1][0], g.board, 2, 4));
  console.log(testPiece(g.board[2][0], g.board, 2, 3));
  console.log(testPiece(g.board[3][0], g.board, 2, 3));
  console.log(testPiece(g.board[4][0], g.board, 2, 3));
  console.log(testPiece(g.board[4][1], g.board, 2, 3));
  */
}

$(document).ready(main);