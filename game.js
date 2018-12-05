var GameState = require("./public/javascripts/gamestate");

function Game(id)
{
	this.id = id;
	this.p1 = null;
	this.p2 = null;
	this.gameState = null;

	this.getID = function() { return this.id; }

	this.addPlayer = function(p)
	{
		if (this.p1 == null)
		{
			this.p1 = p;

			// Since Player 1 is the first person to join the game, initialize state at that point in time
			this.gameState = new GameState();
			this.gameState.initializeGame();
			
			return true; // white
		}
		
		if (this.p2 == null)
		{
			this.p2 = p;
			return false; // black
		}
	}
}

module.exports = Game;