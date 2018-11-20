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
}