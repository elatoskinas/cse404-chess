// Initializes the game and gets socket connection
(function setup()
{
    // start WebSocket connection
    var socket = new WebSocket("ws://localhost:3000");
    var isWhite = true;
    var selectedPiece = "";

    socket.onmessage = function(event)
    {
        let incomingMSG = JSON.parse(event.data);

        if (incomingMSG.type === "UPDATE-TILE")
        {
            updateTile(incomingMSG.tile, incomingMSG.image);
        }
        else if (incomingMSG.type === "PLAYER-TYPE")
        {
            if (incomingMSG.data == false)
                isWhite = false;
        }
        else if (incomingMSG.type === "SELECT-PIECE")
        {
            selectedPiece = incomingMSG.tile;
        }
        else if (incomingMSG.type === "MOVE-PIECE")
        {
            updateTile(incomingMSG.tileFrom, "empty");
            updateTile(incomingMSG.tileTo, incomingMSG.image);
        }
    }

    // Set onClick Listeners to chess tile image DOM objects
	$(".chess-tile img").on("click", function(event)
	{
        var O_TILE_CLICK_BY =
        {
            type: "TILE-CLICKED-BY",
            player: false, // get player that the tile was clicked by (false for black, true for white)
            tile: "", // get tile that was clicked on
            selected: "" // get already selected tile, if exists
        };

        O_TILE_CLICK_BY.player = isWhite;
        O_TILE_CLICK_BY.tile = this.parentElement.id;
        O_TILE_CLICK_BY.selected = selectedPiece;

        socket.send(JSON.stringify(O_TILE_CLICK_BY));
	});
})(); // execute immediately

var updateTile = function(cell, imageName)
{
    // Update image
	// 1.JQuery img with specified cell as ID
	// 2.Get first element (index 0) [which is the image]
	// 3.Access and change src image
	// [images reside in images/pieces/]
	$("#" + cell + " img")[0].src = "images/pieces/" + imageName + ".png";
}

/* Add history entry to side panel */
/*this.addToSidePanel = function(source, dest, imageFrom, imageTo)
{
	// Instantiate piece images
	var $image1 = $("<img>");
	var $image2 = $("<img>");
	var $tableEntry = $("<p>");
	var translateText = source + "->" + dest;

	// Instantiate move text (src -> dst)
	var $text = $("<p>").text(source + "->" + dest);

	// Update Images
	$image1[0].src = "images/pieces/" + imageFrom + ".png";

	if (imageTo != "empty")
		$image2[0].src = "images/pieces/" + imageTo + ".png";

	// Initialize new table entry div
	var $tableEntry = $("<div class=\"table-entry\">");

	// Append images & text to table entry
	$tableEntry.append($image1);
	$tableEntry.append($text);
	$tableEntry.append($image2);

    // Append the table entry to the right pannel
    //	var $panel1 = $("#MovesUser1");
//	var $panel2 = $("#MovesUser2");

	if(this.activePlayer)
		$panel1.append($tableEntry);
	else $panel2.append($tableEntry);
}*/