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
	this.gameState = 0;

	// Booleans to indicate the check status for each player
	this.playerOneCheck = false;
	this.playerTwoCheck = false;

	// A boolean to indicate which player is active, true = player one (white).
	this.activePlayer = true;

	// The cell of the selected piece (if nothing is selected, this is simply an empty string)
	this.selectedPiece = "";
  
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
		// Declaring the source and the destination for readibility
		var source = coordinatesToCell(x1, y1);
		var dest = coordinatesToCell(x2, y2);

		// Adding the move to the side panel
		this.addToSidePanel(source, dest, this.board[x1][y1], this.board[x2][y2]);
		
		// Moving the piece from the source to the destination and clearing the destination
		this.board[x2][y2]=	this.board[x1][y1];
		this.board[x1][y1] = null;
		
		// Updating the active player
		this.activePlayer=!this.activePlayer;
		console.log(this.activePlayer);
	}

	/* Add history entry to side panel */
	this.addToSidePanel = function(source, dest, piece, conquered)
	{

	}

	/* Starts a game */
	this.startGame = function()
	{
		// Construct & Populate Chess Board
		this.constructBoard();
		this.populateBoard();

		var that = this; // temporary reference to current Game objectc

		// Set onClick Listeners to chess tile image DOM objects
		$(".chess-tile img").on("click", function(event)
		{
			// We make use of both that and this here.
			// that refers to the Game Object, and this refers to the DOM element that was clicked on.
			// The parent of this has the ID that represents the cell
			that.getClick(this.parentElement.id);
		});

		// Print Board to console (debug)
		console.log(this.board);
	}
	
	/* Tile clicked event (this will have to come from an individual player
		and be sent over to the server)*/
	this.getClick = function(cell)
	{
		// Convert cell to actual coordinates
		var cellCoordinates = cellToCoordinates(cell);
		var x = cellCoordinates[0];
		var y = cellCoordinates[1];

		// Get piece in tile
		var piece = this.board[x][y];

		// --- FOR DEBUGGING PURPOSES ---
		var name = "none";

		if (piece != null)
			name = piece.constructor.name;

		console.log(cell + " (" + x + "," + y + ")" + " - " + name);
		// ------------------------------

		// First and foremost, check if it's the correct Player's turn (let's use this boolean as a temporary placeholder)
		var playerTurn = true;

		// Check if the player may make a turn
		if (playerTurn)
		{
			// Check if some piece is selected by the player
			if (this.selectedPiece.length == 0)
			{
				// Check if a piece is already in the tile
				if (piece != null)
				{
					if (playerTurn == piece.isWhite) // Piece color matches Player
					{
						// Highlight Player's piece
						this.selectPiece(cell, piece);
					}
					else
					{
						// Blink tile in red
					}
				}
				else
				{
					// Blink tile in red
				}
			}
			else // Piece is already selected by Player
			{
				// Check if a piece is already in the tile
				if (piece != null)
				{
					if (playerTurn == piece.isWhite) // Piece color matches Player
					{
						// Reselect piece
						this.selectPiece(cell, piece);
					}
					else // Enemy's piece selected
					{
						// Move piece (if move is valid)
						// Blink in red if move is not valid
					}
				}
				else
				{
					// Move piece (if move is valid)
					// Else blink in red if move is not valid
				}
			}
		}
	}

	/** Select piece, highlight the piece & it's valid moves */
	this.selectPiece = function(cell, piece)
	{
		if (cell == this.selectedPiece) // optimization step: do not reselect
			return;

		console.log(cell + " selected!");
	
		if (this.selectedPiece != "")
		{
			// Unhighlight last piece & stop displaying valid moves
		}
	
		this.selectedPiece = cell;
	
		if (cell != "")
		{
			// Highlight new piece & display valid moves
			// Store valid moves in array
		}
	}
}