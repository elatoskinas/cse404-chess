function Piece(x, y, isWhite)
{
	// Piece position
	this.x = x;
	this.y = y;
	
	// Piece state
	this.isAlive = true;
	// we only have a boolean here because there's only 2 players
	this.isWhite = isWhite;
	
	// Gets valid moves for the piece (placeholder)
	this.getValidMoves = function() { return []; }
}

// Converts x and y coordinates to the appropriate cell
// (e.g. x = 0 and y = 5 yields A6)
var coordinatesToCell = function (x, y)
{
	return (String.fromCharCode(x+65)+""+(y+1));
}

function Pawn(x, y, isWhite)
{
	Piece.call(this, x, y, isWhite);
	
	// Keep track if it's the first move for the Pawn
	this.firstMove = true;
	
	this.getValidMoves = function() {
		// We igonre the base case here because if a pawn reaches
		// the end of the board, then it is no longer a pawn.
		var moves = [];

		// Offset: if piece is white, then the offset is 1.
		var offset = 1;

		// If the piece is black, then the offset is -1
		if (!this.isWhite)
			offset = -1;
	
		// Valid move would be 1 forward
		moves.push(coordinatesToCell(this.x, this.y+offset));

		// If it's the first move for the pawn, then moving 2 forward
		// is also a valid move
		if (this.firstMove)
		{
			moves.push(coordinatesToCell(this.x, this.y+2*offset));
		}

		// Return valid moves array
		return moves;
	}
}

// Prototype redirecting
Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.constructor = Pawn;

function Bishop(x, y, isWhite)
{
	Piece.call(this, x, y, isWhite);

	this.getValidMoves = function()
	{
		var moves = [];

		// The trick here to perform everything in one compact loop is to take a few things into account:
		// 1.When moving diagonally, it is possible to move up-left, up-right, down-left, down-right
		// 2.These two diagonal lines clash at one point = the current y and x coordinate
		// 3.Each movement adds/subtracts 1 from x and adds/subtracts 1 from y, ALWAYS! (so there are 4 possible combinations of movements)
		// 4.Maximum number of diagonal movements to the left is equal to the current x coordinate (0 based!), since after x movements to the left
		//   we arrive at x = 0.

		// Now, taking all this into consideration, we can start both diagonal movements from the left-most part of the board (at x = 0, or the A column)
		// Then, we iterate until the end, taking only the valid movements into account, and incrementing and decrementing the respective y values
		// Here, we will represent two y values y1 and y2, one is for one diagonal, the other is for the other. One diagonal climbs up as we go
		// left, the other climbs down as we go left.

		var y1 = this.y+this.x; // left-most maximal up-most tile y coordinate for first diagonal (take note that this will never be negative in this case)
		var y2 = this.y-this.x; // left-most maximal down-most tile y coordinate for second diagonal

		// Start from the left-most cell
		for (var x1 = 0; x1 < 8; ++x1)
		{
			// Check if y1 coordinate is in bounds & not equal to the piece's y coordinate
			if (y1 != this.y && y1 >= 0 && y1 < 8)
			{
				moves.push(coordinatesToCell(x1, y1));
			}

			// Check if y2 coordinate is in bounds & not equal to the piece's y coordinate
			if (y2 != this.y && y2 >= 0 && y2 < 8)
			{
				moves.push(coordinatesToCell(x1, y2));
			}

			// Move up on y1
			y1--;

			// Move down on y2
			y2++;
		}

		// Return valid moves array
		return moves;
	}
}

// Prototype redirecting
Bishop.prototype = Object.create(Piece.prototype);
Bishop.prototype.constructor = Bishop;

function King(x, y, isWhite)
{
	Piece.call(this, x, y, isWhite);

	this.getValidMoves = function()
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
				var new_x = this.x + i;
				var new_y = this.y + j;

				// Check if they're not out of bounds
				if (new_x >= 0 && new_x != 8
					&& new_y >= 0 && new_y != 8)
				{
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

function Rook(x, y, isWhite)
{
	Piece.call(this, x, y, isWhite);

    this.getValidMoves = function(){
        var moves=[];
        // Check for forward movement
        if(this.y<7){
            for(var i = this.y+1; i<8;i++)
                moves.push(coordinatesToCell(this.x,i)); 
        }
        // Check for backward movement
        if(this.y>0){
            for(var i = 0; i<this.y;i++)
                moves.push(coordinatesToCell(this.x,i)); 
        }
        // Check for left movement
        if(this.x>0){
            for(var i = 0; i<this.x; i++)
                moves.push(coordinatesToCell(i, this.y));
        }
        // Check for right movement
        if(this.x<7){
        for(var i = this.x+1; i<8; i++)
            moves.push(coordinatesToCell(i, this.y));
        }
        // Return the array of possible moves
        return moves;
    }
}

Rook.prototype = Object.create(Rook.prototype);
Rook.prototype.constructor = Rook;

function Knight(x, y, isWhite){
	Piece.call(this, x, y, isWhite);

    this.getValidMoves = function(){

    	// too lazy to do this the smart way rn, so we'll just have all the possible scenarios for now xd
        var moves=[];
        if(this.x+2<=7&&this.y+1<=7)
        	moves.push(coordinatesToCell(this.x+2,this.y+1)); 
        if(this.x+1<=7&&this.y+2<=7)
        	moves.push(coordinatesToCell(this.x+1,this.y+2));
        if(this.x+2<=7&&this.y-1>=0)
        	moves.push(coordinatesToCell(this.x+2,this.y-1));
        if(this.x+1<=7&&this.y-2>=0)
        	moves.push(coordinatesToCell(this.x+1,this.y-2));
        if(this.x-2>=0&&this.y+1<=7)
        	moves.push(coordinatesToCell(this.x-2,this.y+1));
        if(this.x-1>=0&&this.y+2<=7)
        	moves.push(coordinatesToCell(this.x-1,this.y+2));
        if(this.x-1>=0&&this.y-2>=0)
        	moves.push(coordinatesToCell(this.x-1,this.y-2));
        if(this.x-2>=0&&this.y-1>=0)
        	moves.push(coordinatesToCell(this.x-2,this.y-1));


        return moves;
    }
    
}

Knight.prototype = Object.create(Knight.prototype);
Knight.prototype.constructor = Knight;

function Queen(x, y, isWhite){
	Piece.call(this, x, y, isWhite);

    this.getValidMoves = function(){
        var moves=[];
        //Check for forward movement
        if(this.y<7){
            for(var i = this.y+1; i<8;i++)
                moves.push(coordinatesToCell(this.x,i)); 
        }
        // Check for backward movement
        if(this.y>0){
            for(var i = 0; i<this.y;i++)
                moves.push(coordinatesToCell(this.x,i)); 
        }
        // Check for left movement
        if(this.x>0){
            for(var i = 0; i<this.x; i++)
                moves.push(coordinatesToCell(i, this.y));
        }
        // Check for right movement
        if(this.x<7){
        for(var i = this.x+1; i<8; i++)
            moves.push(coordinatesToCell(i, this.y));
        }

		var y1 = this.y+this.x; // left-most maximal up-most tile y coordinate for first diagonal (take note that this will never be negative in this case)
		var y2 = this.y-this.x; // left-most maximal down-most tile y coordinate for second diagonal

		// Start from the left-most cell
		for (var x1 = 0; x1 < 8; ++x1)
		{
			// Check if y1 coordinate is in bounds & not equal to the piece's y coordinate
			if (y1 != this.y && y1 >= 0 && y1 < 8)
			{
				moves.push(coordinatesToCell(x1, y1));
			}

			// Check if y2 coordinate is in bounds & not equal to the piece's y coordinate
			if (y2 != this.y && y2 >= 0 && y2 < 8)
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