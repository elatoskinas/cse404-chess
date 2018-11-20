/* Game class used to keep track of a game of ID
   and keep all the variables for that specific game */
function Game(id, p1, p2)
{
	this.id = id;
	this.p1 = p1;
	this.p2 = p2;
	
	this.getID = function() { return this.id; }
	
	// Game State here
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
		this.board[0][0] = new Rook(0, 0, true); // A1
		this.board[1][0] = new Knight(1, 0, true); // B1
		this.board[2][0] = new Bishop(2, 0, true); // C1
		this.board[3][0] = new Queen(3, 0, true); // D1
		this.board[4][0] = new King(4, 0, true); // E1
		this.board[5][0] = new Bishop(5, 0, true); // F1
		this.board[6][0] = new Knight(6, 0, true); // G1
		this.board[7][0] = new Rook(7, 0, true); // H1

		// Black
		this.board[0][7] = new Rook(0, 7, false); // A8
		this.board[1][7] = new Knight(1, 7, false); // B8
		this.board[2][7] = new Bishop(2, 7, false); // C8
		this.board[3][7] = new Queen(3, 7, false); // D8
		this.board[4][7] = new King(4, 7, false); // E8
		this.board[5][7] = new Bishop(5, 7, false); // F8
		this.board[6][7] = new Knight(6, 7, false); // G8
		this.board[7][7] = new Rook(7, 7, false); // H8

		// White & Black Pawns
		for (var i = 0; i < 8; ++i)
		{
			this.board[i][1] = new Pawn(i, 1, true); // add White Pawn
			this.board[i][6] = new Pawn(i, 6, false); // add Black Pawn
		}
	}

	/* Starts a game */
	this.startGame = function()
	{
		this.constructBoard();
		this.populateBoard();

		console.log(this.board);
	}
}