function Game(id)
{
	this.id = id;
	this.p1 = null;
	this.p2 = null;
	
	this.getID = function() { return this.id; }

	this.addPlayer = function(p)
	{
		if (p1 == null)
		{
			p1 = p;
			return true; // white
		}
		
		if (p2 == null)
		{
			p2 = p;
			return false; // black
		}
    }
}
	