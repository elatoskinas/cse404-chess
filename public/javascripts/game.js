/* Game class used to keep track of a game of ID
   and keep all the variables for that specific game */
function Game(id, p1, p2)
{
	this.id = id;
	this.p1 = p1;
	this.p2 = p2;
	
	this.getID = function() { return this.id; }
	
	// Game State here
	/* Game states:
		0 = ongoing
		1 = player 1 won
		2 = player 2 won
		3 = draw
		4 = one of the players disconnected
	*/
	var gameState = 0;

	// Booleans to indicate the check status for each player
	var playerOneCheck = false;
	var playerTwoCheck = false;

	// A boolean to indicate which player is active, true = player one (white).
	var activePlayer = true;
  
	this.board = []; // the board (a bidimensional array)

	// NOTE: when referencing pieces (such as board[1][3]),
	// 1 will represent the column (A, B, C, ...) and 3
	// will represent the row (1, 2, 3, 4, ...) of the actual
	// chess board.

	/* Constructs an 8x8 board with no pieces inside */
	this.constructBoard = function()
	{
		// 8 rows
		for (var i = 0; i < 8; ++i)
		{
			// Initialize empty array for one row
			var row = [];

			// 8 columns
			for (var j = 0; j < 8; ++j)
			{
				// set row element to null
				row[j] = null;
			}

			// push row into board array
			this.board.push(row);
		}
	}

	/* Populates the 8x8 board with required pieces */
	this.populateBoard = function()
	{
		// White
		this.board[0][0] = new Rook(true); // A1
		this.board[1][0] = new Knight(true); // B1
		this.board[2][0] = new Bishop(true); // C1
		this.board[3][0] = new Queen(true); // D1
		this.board[4][0] = new King(true); // E1
		this.board[5][0] = new Bishop(true); // F1
		this.board[6][0] = new Knight(true); // G1
		this.board[7][0] = new Rook(true); // H1

		// Black
		this.board[0][7] = new Rook(false); // A8
		this.board[1][7] = new Knight(false); // B8
		this.board[2][7] = new Bishop(false); // C8
		this.board[3][7] = new Queen(false); // D8
		this.board[4][7] = new King(false); // E8
		this.board[5][7] = new Bishop(false); // F8
		this.board[6][7] = new Knight(false); // G8
		this.board[7][7] = new Rook(false); // H8

		// White & Black Pawns
		for (var i = 0; i < 8; ++i)
		{
			this.board[i][1] = new Pawn(true); // add White Pawn
			this.board[i][6] = new Pawn(false); // add Black Pawn
		}
	}
	
	/* Move piece from x1 to x2 and from y1 to y2, knowing that the move is valid */
	this.movePiece = function(x1, y1, x2, y2)
	{
		// code here

		// update player turn accordingly after movement
		
		// detect if piece conquered
		// pass to side panel method
	}

	/* Add history entry to side panel */
	this.addToSidePanel = function(source, dest, piece, conquered)
	{

	}

	/* Starts a game */
	this.startGame = function()
	{
		this.constructBoard();
		this.populateBoard();

		console.log(this.board);
	}

	/* Tile clicked event */
	$(".chess-tile").on("click", function (event)
    {
		console.log("tile clicked");

		/* If no piece selected
			* Is something in tile?
				> YES:
					- Check if it's the current player's piece, then highlight valid movement tiles and highlight the tile/piece
				> NO:
					- Blink tile in red

			If piece selected
				* Is something in tile?
					> Player's piece: select new piece
					> Remove opponent's piece from game (if move is valid)
				* Move piece (if move is valid)
				* Else blink tile in red if move is not valid
		*/
    });
}