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
	this.checkStatus = [false, false];
	this.kingCells = ["E8", "E1"];

	// A boolean to indicate which player is active, true = player one (white).
	this.activePlayer = true;

	// The cell of the selected piece (if nothing is selected, this is simply an empty string)
	this.selectedPiece = "";

	this.availableMoves = []; 
  
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

		// Initialize board graphics
		for(var i = 0; i<=1; i++)
			for(j=0;j<8;j++){
				this.updateTile(coordinatesToCell(j,i));
				this.updateTile(coordinatesToCell(j,7-i));
			}

		this.setValidMovesAll([], this.kingCells[1]); // set valid moves for all pieces
	}
	
	/* Move piece from x1 to x2 and from y1 to y2, knowing that the move is valid */
	this.movePiece = function(cell1, cell2)
	{	
		// Parsing the input cell into a string of 2 coordinates for each cell
		var c1 = cellToCoordinates(cell1);
		var x1 = c1[0];
		var y1 = c1[1];

		var c2 = cellToCoordinates(cell2);
		var x2 = c2[0];
		var y2 = c2[1];

		// Adding the move to the side panel
		this.addToSidePanel(cell1, cell2, this.board[x1][y1], this.board[x2][y2]);

		if (this.board[x1][y1] instanceof Pawn)
		{
			// Pawn first move negation (so it can no longer move two steps)
			if (this.board[x1][y1].firstMove)
				this.board[x1][y1].firstMove = false;
			else if (y2 == 7 || y2 == 0) // End reached (this check is enough, since white pawn can't reach y2 == 0 and so on)
			{
				// Get user selection and convert Pawn to Queen/Bishop/Rook/Knight (according to choice)

				// Temporarily auto-converrt to Queen:
				this.board[x1][y1] = new Queen(this.activePlayer);
			}
		}
		else if (this.board[x1][y1] instanceof King)
		{
			var index = this.activePlayer ? 1 : 0;
			this.kingCells[index] = cell2;
		}

		// Moving the piece from the source to the destination and clearing the destination
		this.board[x2][y2]=	this.board[x1][y1];
		this.board[x1][y1] = null;

		// Clearing selected piece
		this.selectPiece("", null);

		// Update graphics
		this.updateTile(cell1);
		this.updateTile(cell2);

		this.newTurn();
	}

	/* Add history entry to side panel */
	this.addToSidePanel = function(source, dest, piece, conquered)
	{
		// Instantiate piece images
		var $image1 = $("<img>");
		var $image2 = $("<img>");
		var $tableEntry = $("<p>");
		var translateText = source + "->" + dest;

		// Instantiate move text (src -> dst)
		var $text = $("<p>").text(source + "->" + dest);

		// Update Images
		$image1[0].src = "images/pieces/" + piece.getImageName() + ".png";

		if (conquered != null)
			$image2[0].src = "images/pieces/" + conquered.getImageName() + ".png";

		// Initialize new table entry div
		var $tableEntry = $("<div class=\"table-entry\">");

		// Append images & text to table entry
		$tableEntry.append($image1);
		$tableEntry.append($text);
		$tableEntry.append($image2);

		// Append the table entry to the right pannel
		var $panel1 = $("#MovesUser1");
		var $panel2 = $("#MovesUser2");

		if(this.activePlayer)
			$panel1.append($tableEntry);
		else $panel2.append($tableEntry);
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
			if (this.selectedPiece == "")
			{	
				// Check if a piece is already in the tile
				if (piece != null)
				{
					if (this.activePlayer == piece.isWhite) // Piece color matches Player
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
					if (this.activePlayer == piece.isWhite) // Piece color matches Player
					{
						// Reselect piece
						this.selectPiece(cell, piece);
					}
					else // Enemy's piece selected
					{
						// Move piece (if move is valid)
						if(this.availableMoves.includes(cell)){
								this.movePiece(this.selectedPiece, cell);
						}
						// Blink in red if move is not valid
					}
				}
				else
				{
					// Move piece (if move is valid)
					if(this.availableMoves.includes(cell)){
						this.movePiece(this.selectedPiece, cell);
					}
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
			this.availableMoves="";
			// Unhighlight last piece & stop displaying valid moves
		}
	
		this.selectedPiece = cell;
	
		if (cell != "")
		{
			// Highlight new piece & display valid moves
			// var movePair = cellToCoordinates(cell);
			// piece.setValidMoves(this.board, movePair[0], movePair[1]);
			this.availableMoves = piece.validMoves;
		}
	}

	/** Update image in tile with coressponding chess piece */
	this.updateTile = function(cell)
	{
		// Convert cell to coordinates
		var xy = cellToCoordinates(cell);
		// Get piece at coordinates
		var piece = this.board[xy[0]][xy[1]];
		// If piece is null, then use empty image, else get piece's image
		var imageName = (piece != null) ? piece.getImageName() : "empty";

		// Update image
		// 1.JQuery img with specified cell as ID
		// 2.Get first element (index 0) [which is the image]
		// 3.Access and change src image
		// [images reside in images/pieces/]
		$("#" + cell + " img")[0].src = "images/pieces/" + imageName + ".png";
	}

	/** Checks if activePlayer's King would be threatened in specified cell */
	this.checkKingThreat = function(cell)
	{
<<<<<<< HEAD
		// TBD: make this function mark king guard pieces which could only be moved in one direction.
=======
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
		var threats = [];
		var xy = cellToCoordinates(cell);
		var x = xy[0];
		var y = xy[1];
<<<<<<< HEAD
	
		// TBD: move diagonal & vert/horizontal traversion to that one loop

		// Diagonal (Unfortunately copying my code here from pieces.js, kind of hard to generalize this)
=======

>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
		// Instantiate traversal pairs with initial possibility of traversal
		var traversePairs =
		[
			{ "possible":true, "x":-1,  "y":-1, "checkGuard": false },
			{ "possible":true, "x":-1,  "y": 1, "checkGuard": false },
			{ "possible":true, "x": 1,  "y":-1, "checkGuard": false },
			{ "possible":true, "x": 1,  "y": 1, "checkGuard": false },
			{ "possible":true, "x": 0, 	"y":-1, "checkGuard": false },
			{ "possible":true, "x": 0, 	"y": 1, "checkGuard": false },
			{ "possible":true, "x":-1, 	"y": 0, "checkGuard": false },
			{ "possible":true, "x": 1, 	"y": 0, "checkGuard": false },
		]
		
		// Initialize offset
		var offset = 0;

<<<<<<< HEAD
		while (traversePairs[0].possible || traversePairs[1].possible || traversePairs[2].possible || traversePairs[3].possible
			|| traversePairs[4].possible || traversePairs[5].possible || traversePairs[6].possible || traversePairs[7].possible) 
=======
		// Keep checking for various scenarios while possible (so traverse all 8 directions, keep checking for guard pieces)
		// This should cover every possible scenario for the King's threat (except from Knight, which is covered afterwards).
		while (traversePairs[0].possible || traversePairs[1].possible || traversePairs[2].possible || traversePairs[3].possible
			|| traversePairs[4].possible || traversePairs[5].possible || traversePairs[6].possible || traversePairs[7].possible
			|| traversePairs[0].checkGuard || traversePairs[1].checkGuard || traversePairs[2].checkGuard || traversePairs[3].checkGuard
			|| traversePairs[4].checkGuard || traversePairs[5].checkGuard || traversePairs[6].checkGuard || traversePairs[7].checkGuard)
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
		{
			// Increase offset
			offset++;

			// Iterate through all traversal pairs
			for (var i = 0; i < traversePairs.length; ++i)
			{
				if (traversePairs[i].possible || traversePairs[i].checkGuard)
				{
					// Calculate new x and new y
					var new_x = x + traversePairs[i].x*offset;
					var new_y = y + traversePairs[i].y*offset;

					// Check if in bounds, if not, then traversal with this combination is invalid from now on
					if (new_x < 0 || new_x >= 8 || new_y < 0 || new_y >= 8)
					{
						traversePairs[i].possible = false;
<<<<<<< HEAD
=======
						traversePairs[i].checkGuard = false;
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
						continue;
					}
					else
					{
						if (this.board[new_x][new_y] == null)
							continue;
						else if (traversePairs[i].possible)
						{
<<<<<<< HEAD
=======
							if (this.board[new_x][new_y] instanceof King && this.board[new_x][new_y].isWhite == this.activePlayer) // ignore own color King (premature tile movement checks)
								continue;

>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
							// No longer traverse through this pair
							traversePairs[i].possible = false;

							// Check if piece is of opposite color
							if (this.board[new_x][new_y].isWhite != this.activePlayer)
							{
<<<<<<< HEAD
								// For diagonal: Check if piece is Queen
								if ((this.board[new_x][new_y] instanceof Queen) || (this.board[new_x][new_y] instanceof Bishop)&&i<4)
								{
									threats.push(coordinatesToCell(new_x, new_y));
								}
								// For vertical and Horizontal: check if piece is a Queen or a Rook
								if(((this.board[new_x][new_y] instanceof Queen) || (this.board[new_x][new_y] instanceof Rook))&&i>3)
=======
								// Check if piece is Queen
								if (((this.board[new_x][new_y] instanceof Queen) || (this.board[new_x][new_y] instanceof Bishop))&&i<4)
								{
									threats.push(coordinatesToCell(new_x, new_y));
								}
								if((this.board[new_x][new_y] instanceof Queen || this.board[new_x][new_y] instanceof Rook)&&i>3)
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
								{
									threats.push(coordinatesToCell(new_x, new_y));
								}
								else if (offset == 1) // Else check if offset is 1 (Pawn & King situation)
								{
									if (this.board[new_x][new_y] instanceof King) // Check for King
										threats.push(coordinatesToCell(new_x, new_y));
									// Check if Pawn by only taking into account odd pairs for White & even pairs for Black (odd pairs are y = -1 [forward], the only
									// place where an opposite colored Pawn can attack White from)
									else if (((this.activePlayer && i % 2 != 0) || (!this.activePlayer && i % 2 == 0)) && (this.board[new_x][new_y] instanceof Pawn)&&i<4)
										threats.push(coordinatesToCell(new_x, new_y));
								}
							}
<<<<<<< HEAD
						}
						else if (traversePairs[i].checkGuard)
						{
							// checkGuard will only be toggled if white piece found upon traversePairs[i].possible
							
=======
							else if (cell == this.kingCells[this.activePlayer ? 1 : 0]) // Only checkGuard in this method if it's King's Cell being considered
							{
								traversePairs[i].checkGuard = true; // start checking if this piece is guarding the King
							}
						}
						else if (traversePairs[i].checkGuard)
						{
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
							if (this.board[new_x][new_y] == null)
								continue;
							else
							{
								traversePairs[i].checkGuard = false;

								if (this.board[new_x][new_y].isWhite != this.activePlayer)
								{
<<<<<<< HEAD
									// if black piece, check if it it's the appropriate type
=======
									// if opposite color piece, check if it's the appropriate type
									if (this.board[new_x][new_y] instanceof Queen // Queen can traverse diagonally/vertically/horizontally. Potential Queen threat
										|| ((i <= 3) && this.board[new_x][new_y] instanceof Bishop) // Bishop can traverse diagonally. Potential Bishop threat
										|| ((i > 3) && this.board[new_x][new_y] instanceof Rook)) // Rook can traverse horizontally/vertically. Potential Rook threat
									{
										// --- BACKWARDS TRAVERSAL ---

										// Start from threat piece
										var x1 = new_x;
										var y1 = new_y;

										// Keep array of cells that are valid moves
										var necessaryMoves = [];

										// Iterate while guard piece not found
										while (this.board[x1][y1] == null || this.board[x1][y1].isWhite != this.activePlayer)
										{
											// Push valid move into array
											necessaryMoves.push(coordinatesToCell(x1, y1));

											// Traverse back
											x1 -= traversePairs[i].x;
											y1 -= traversePairs[i].y;
										}

										// Set necessary moves array of piece
										this.board[x1][y1].necessaryMoves = necessaryMoves;
									}
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
								}
							}
						}
					}
				}
			}
		}
		
<<<<<<< HEAD
		// Horse
=======
		// Knight
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
		var horseCoords = [-2, -1, 1, 2];

		for (var xi = 0; xi < 4; ++xi)
		{
			for (var yi = 0; yi < 4; ++yi)
			{
				if (xi != yi && -horseCoords[xi] != horseCoords[yi]) // Do not take into account pairs (-2, -2), (-2, 2), (2, -2) ...
				{
					var xh = x + horseCoords[xi];
					var yh = y + horseCoords[yi];
	
					if (xh >= 0 && xh < 8 && yh >= 0 && yh < 8
						&& this.board[xh][yh] != null && this.board[xh][yh].isWhite != this.activePlayer
						&& this.board[xh][yh] instanceof Knight)
					{
						threats.push(coordinatesToCell(xh, yh));
					}
				}
			}
		}

		// Check protection state (TBD later)

		return threats;
	}

<<<<<<< HEAD
=======
	/* Returns valid moves (for other pieces) when King is checked */
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
	this.blockOrCapture = function (a, b){
		a1 = cellToCoordinates(a)[0];
		a2 = cellToCoordinates(a)[1];

		if (this.board[a1][a2] instanceof Knight || this.board[a1][a2] instanceof Pawn)
			return [a];

		b1 = cellToCoordinates(b)[0];
		b2 = cellToCoordinates(b)[1];
		var necessaryMoves= [];
		var i;
		var j;
		// Diagonal threats
		if((b1-a1)*(b2-a2)!=0){
			if(a1>b1){
				i=1;
				if(a2>b2) j=1;
				else j=-1;
			} else {
				i=-1;
				if(a2>b2) j=1;
				else j =-1;
			}
		
		while(coordinatesToCell(a1,a2)!=b){
			necessaryMoves.push(coordinatesToCell(a1,a2));	
			a1-=i;
			a2-=j;		
			}
		// Vertical and horizontal threats
		} else {
			// Vertical
			if(a1==b1){
				if(a2>b2) i=1;
				else i=-1;

				while(a2!=b2){
					necessaryMoves.push(coordinatesToCell(a1,a2));
					a2-=i;
				}
				// Horizontal
			} else if(a2==b2){
				if(a1>b1) i=1;
				else i=-1;

				while(a1!=b1){
					necessaryMoves.push(coordinatesToCell(a1,a2));
					a1-=i;
				}
			}
		} 

		return necessaryMoves;	
	}

<<<<<<< HEAD
=======
	/** Returns the intersection of validMoves and necessaryMoves (necessaryMoves being the actual validMoves,
	 *  and validMoves being the valid moves of the piece) */
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
	this.verify = function(validMoves, necessaryMoves){
		var i = 0;

		while(i<necessaryMoves.length){
			if(!validMoves.includes(necessaryMoves[i])){
				necessaryMoves.splice(i,1);
				i--;
			}
				i++;
		}
		return necessaryMoves;

	}
  
<<<<<<< HEAD
=======
	/** Sets the King's valid moves in accordance to potential threat of Check in every cell */
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
	this.setValidMovesKing = function(kingCell)
	{
		// Decode cell to coordinates
		var xy = cellToCoordinates(kingCell);
		var x = xy[0];
		var y = xy[1];

		// Set valid moves (initial) for King
		this.board[x][y].setValidMoves(this.board, x, y);
		
		// Reference to valid moves
		var moves = this.board[x][y].validMoves;

		// Filter out tiles that are possibly threatened
		var i = 0;
			while(i < moves.length)
			{
				if(this.checkKingThreat(moves[i])[0]!=null)
				{
					moves.splice(i,1);
					i--;
				}
				i++;
			}
	}

	/** Ends turn of current active Player and starts a new turn */
	this.newTurn = function()
	{
		// Reset check status [because valid move was made if new turn has been made]
		var prevPlayerIndex = this.activePlayer ? 1 : 0;
		this.checkStatus[prevPlayerIndex] = false;

		// Updating the active player
		this.activePlayer = !this.activePlayer;

		// Check for check
		var newPlayerIndex = this.activePlayer ? 1 : 0;
		var threats = this.checkKingThreat(this.kingCells[newPlayerIndex]);

		if (threats.length != 0) // King is threatened by at least 1 piece. Check occurs
		{
			this.checkStatus[newPlayerIndex] = true;
			console.log("Check");
		}

		// Check if valid moves exist
		var hasValid = this.setValidMovesAll(threats, this.kingCells[newPlayerIndex]);

		if (!hasValid) // No valid moves exist
		{
			if (threats.length > 0) // Checkmate
			{
				console.log("Checkmate");
			}
			else // Stalemate
			{
				console.log("Stalemate");
			}
		}
	}

	/** Sets valid moves for all the current player's pieces (currently a bit inefficient) */
	this.setValidMovesAll = function(threats, kingCell)
	{
		var hasValid = false;

		// Get & validate King's moves
		var xy = cellToCoordinates(kingCell);
		this.setValidMovesKing(kingCell);
		
		if (this.board[xy[0]][xy[1]].validMoves.length > 0)
			hasValid = true;

		for (var i = 0; i < 8; ++i)
		{
			for (var j = 0; j < 8; ++j)
			{
				if (this.board[i][j] != null && this.board[i][j].isWhite == this.activePlayer && !(this.board[i][j] instanceof King))
				{
					if (threats == null || threats.length <= 1)
					{
						this.board[i][j].setValidMoves(this.board, i, j);

<<<<<<< HEAD
						if (threats.length == 0)
						{
							// Guard piece validation
						}
						else if (threats.length == 1)
=======
						if (this.board[i][j].necessaryMoves.length != 0)
						{
							// Guard piece validation
							this.board[i][j].validMoves = this.verify(this.board[i][j].validMoves, this.board[i][j].necessaryMoves);
						}
						
						if (threats.length == 1)
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
						{
							// Check removal validation
							var necessaryMoves = this.blockOrCapture(threats[0], kingCell);
							this.board[i][j].validMoves = this.verify(this.board[i][j].validMoves, necessaryMoves);
						}
					}
					else // Only the King has valid moves (> 1 threat)
						this.board[i][j].validMoves = [];


					if (!hasValid && this.board[i][j].validMoves.length > 0) // valid moves found
						hasValid = true;
				}
<<<<<<< HEAD
=======
				else if (this.board[i][j] != null && this.board[i][j].isWhite != this.activePlayer)
				{
					this.board[i][j].necessaryMoves = [];
				}
>>>>>>> 3f1f5efcb01fa54bf1bd2cbc8beaf10d5f597374
			}
		}
		return hasValid;
	}
}