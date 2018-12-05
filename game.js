function Game(id)
{
	this.id = id;
	this.p1 = null;
	this.p2 = null;

	this.getID = function() { return this.id; }

	this.addPlayer = function(p)
	{
		if (this.p1 == null)
		{
            this.p1 = p;
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