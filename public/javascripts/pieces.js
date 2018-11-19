function Piece()
{
	// Piece position
	this.x = 0;
	this.y = 0;
	
	// Piece state
	this.isAlive = true;
	// we only have a boolean here because there's only 2 players
	this.isWhite = false;
	
	// Gets valid moves for the piece (placeholder)
	this.getValidMoves = function() { return []; }
}

function Pawn()
{
	Piece.call(this);
	
	// Keep track if it's the first move for the Pawn
	this.firstMove = false;
}

// Prototype redirecting
Pawn.prototype = Object.create(Piece.prototype);
Pawn.prototype.constructor = Pawn;