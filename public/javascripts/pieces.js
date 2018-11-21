function Piece(isWhite)
{	
	// we only have a boolean here because there's only 2 players
	this.isWhite = isWhite;
	
	// Gets valid moves for the piece (placeholder)
	this.getValidMoves = function(board, x, y) { return []; }
}

// Converts x and y coordinates to the appropriate cell
// (e.g. x = 0 and y = 5 yields A6)
var coordinatesToCell = function (x, y)
{
	return (String.fromCharCode(x+65)+""+(y+1));
}

// Converts cell string to x and y coordinate pair
var cellToCoordinates = function(cell)
{
	var x = cell.charCodeAt(0)-65; // Convert first cell character to ASCII code (int) and subtract 65 offset (A = 65, B = 66, ...)
	var y = parseInt(cell.charAt(1)) - 1; // convert second cell character to integer (0 based, hence the -1)
	return ([x, y]); // return x and y pair as array
}

function Pawn(isWhite)
{
	Piece.call(this, isWhite);
	
	// Keep track if it's the first move for the Pawn
	this.firstMove = true;
	
	this.getValidMoves = function(board, x, y) {
		// We igonre the base case here because if a pawn reaches
		// the end of the board, then it is no longer a pawn.
		var moves = [];

		// Offset: if piece is white, then the offset is 1.
		var offset = 1;

		// If the piece is black, then the offset is -1
		if (!this.isWhite)
			offset = -1;
	
		// check if no piece is in tile
		if (board[x][y+offset] == null)
		{
			// Valid move would be 1 forward
			moves.push(coordinatesToCell(x, y+offset));

			// If it's the first move for the pawn, then moving 2 forward
			// is also a valid move
			if (this.firstMove)
			{
				// check if no piece is in tile
				if (board[x][y+2*offset] == null)
					moves.push(coordinatesToCell(x, y+2*offset));
			}
		}

		// opponent's piece exists 1 to the left 1 forward
		if (x-1 >= 0 && board[x-1][y+offset] != null
			&& board[x-1][y+offset].isWhite != this.isWhite)
		{
			moves.push(coordinatesToCell(x-1, y+offset));
		}

		// opponent's piece exists 1 to the right 1 forward
		if (x+1 < 8 && board[x+1][y+offset] != null
			&& board[x+1][y+offset].isWhite != this.isWhite)
		{
			moves.push(coordinatesToCell(x+1, y+offset));
		}

		// Return valid moves array
		return moves;
	}
}

// Prototype redirecting
Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.constructor = Pawn;

function Bishop(isWhite)
{
	Piece.call(this, isWhite);

	this.getValidMoves = function(board, x, y)
	{
		var moves = [];

		// Instantiate traversal pairs with initial possibility of traversal
		var traversePairs =
		[
			{ "possible":true, "x":-1,  "y":-1  },
			{ "possible":true, "x":-1,  "y": 1  },
			{ "possible":true, "x": 1,  "y":-1  },
			{ "possible":true, "x": 1,  "y": 1  }
		]

		// Initialize offset
		var offset = 0;

		while (traversePairs[0].possible || traversePairs[1].possible || traversePairs[2].possible || traversePairs[3].possible)
		{
			// Increase offset
			offset++;

			// Iterate through all traversal pairs
			for (var i = 0; i < 4; ++i)
			{
				// Check if it's possible to traverse in possible combination
				if (traversePairs[i].possible)
				{
					// Calculate new x and new y
					var new_x = x + traversePairs[i].x*offset;
					var new_y = y + traversePairs[i].y*offset;

					// Check if in bounds, if not, then traversal with this combination is invalid from now on
					if (new_x < 0 || new_x >= 8 || new_y < 0 || new_y >= 8)
					{
						traversePairs[i].possible = false;
						continue;
					}
					else
					{
						// Keep track whether move should be added
						var addMove = true;

						// Check if something is in tile
						if (board[new_x][new_y] != null)
						{
							// If it is, then future traversals will no longer be possible, since this piece is blocking the "road"
							traversePairs[i].possible = false;

							// If the piece is of the same color, then taking the piece is impossible (move is invalid on that piece)
							if (board[new_x][new_y].isWhite == this.isWhite)
								addMove = false;
						}

						// Add move if it's not same color piece
						if (addMove)
							moves.push(coordinatesToCell(new_x, new_y));
					}
				}
			}
		}

		// Return valid moves array
		return moves;
	}
}

// Prototype redirecting
Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.constructor = Bishop;

function King(isWhite)
{
	Piece.call(this, isWhite);

	this.getValidMoves = function(board, x, y)
	{
		var moves = [];

		// Consider all possible movement pairs
		// (-1,-1), (-1, 0), (-1, 1), (0, -1), ...
		for (var i = -1; i <= 1; ++i)
		{
			for (var j = -1; j <= 1; ++j)
			{
				// Moving to the same place as current position is
				// not a valid move, so we do not consider it here
				if (i == 0 && j == 0)
					continue;
				
				// Initialize new x and new y values for movement
				var new_x = x + i;
				var new_y = y + j;

				// Check if they're not out of bounds
				if (new_x >= 0 && new_x != 8
					&& new_y >= 0 && new_y != 8)
				{
					// If tile is empty or contains opponent's piece, then this is a valid move
					if (board[new_x][new_y] == null || board[new_x][new_y].isWhite != this.isWhite)
						moves.push(coordinatesToCell(new_x, new_y));
				}
			}
		}

		// Return valid moves array
		return moves;
	}
}

// Prototype redirecting
King.prototype = Object.create(King.prototype);
King.prototype.constructor = King;

<<<<<<< HEAD
function Rook()
=======
// ----------------------------------------------------------------------

function Rook(x, y, isWhite)
>>>>>>> f9d5c1719dda05f2cc3b3593e3fbc5a6e458577f
{
	Piece.call(this, isWhite);

    getValidMoves = function(board, x, y){
        var moves=[];
        // Check for forward movement
        if(y<7){
            for(var i = y+1; i<8;i++)
                moves.push(coordinatesToCell(x,i)); 
        }
        // Check for backward movement
        if(y>0){
            for(var i = 0; i<y;i++)
                moves.push(coordinatesToCell(x,i)); 
        }
        // Check for left movement
        if(x>0){
            for(var i = 0; i<x; i++)
                moves.push(coordinatesToCell(i, y));
        }
        // Check for right movement
        if(x<7){
        for(var i = x+1; i<8; i++)
            moves.push(coordinatesToCell(i, y));
        }
        // Return the array of possible moves
        return moves;
    }
}

Rook.prototype = Object.create(Rook.prototype);
Rook.prototype.constructor = Rook;

function Knight(){
	Piece.call(this, isWhite);

    getValidMoves = function(board, x, y){

    	// too lazy to do this the smart way rn, so we'll just have all the possible scenarios for now xd
        var moves=[];
        if(x+2<=7&&y+1<=7)
        	moves.push(coordinatesToCell(x+2,y+1)); 
        if(x+1<=7&&y+2<=7)
        	moves.push(coordinatesToCell(x+1,y+2));
        if(x+2<=7&&y-1>=0)
        	moves.push(coordinatesToCell(x+2,y-1));
        if(x+1<=7&&y-2>=0)
        	moves.push(coordinatesToCell(x+1,y-2));
        if(x-2>=0&&y+1<=7)
        	moves.push(coordinatesToCell(x-2,y+1));
        if(x-1>=0&&y+2<=7)
        	moves.push(coordinatesToCell(x-1,y+2));
        if(x-1>=0&&y-2>=0)
        	moves.push(coordinatesToCell(x-1,y-2));
        if(x-2>=0&&y-1>=0)
        	moves.push(coordinatesToCell(x-2,y-1));


        return moves;
    }
    
}

Knight.prototype = Object.create(Knight.prototype);
Knight.prototype.constructor = Knight;

function Queen(){
	Piece.call(this, isWhite);

    getValidMoves = function(board, x, y){
        var moves=[];
        //Check for forward movement
        if(y<7){
            for(var i = y+1; i<8;i++)
                moves.push(coordinatesToCell(x,i)); 
        }
        // Check for backward movement
        if(y>0){
            for(var i = 0; i<y;i++)
                moves.push(coordinatesToCell(x,i)); 
        }
        // Check for left movement
        if(x>0){
            for(var i = 0; i<x; i++)
                moves.push(coordinatesToCell(i, y));
        }
        // Check for right movement
        if(x<7){
        for(var i = x+1; i<8; i++)
            moves.push(coordinatesToCell(i, y));
        }

		var y1 = y+x; // left-most maximal up-most tile y coordinate for first diagonal (take note that this will never be negative in this case)
		var y2 = y-x; // left-most maximal down-most tile y coordinate for second diagonal

		// Start from the left-most cell
		for (var x1 = 0; x1 < 8; ++x1)
		{
			// Check if y1 coordinate is in bounds & not equal to the piece's y coordinate
			if (y1 != y && y1 >= 0 && y1 < 8)
			{
				moves.push(coordinatesToCell(x1, y1));
			}

			// Check if y2 coordinate is in bounds & not equal to the piece's y coordinate
			if (y2 != y && y2 >= 0 && y2 < 8)
			{
				moves.push(coordinatesToCell(x1, y2));
			}

			// Move up on y1
			y1--;

			// Move down on y2
			y2++;
		}

		return moves;
    }
}

Queen.prototype = Object.create(Queen.prototype);
Queen.prototype.constructor = Queen; 
