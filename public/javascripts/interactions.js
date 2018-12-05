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
            updateImage(incomingMSG.tile, incomingMSG.image);
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
            updateImage(incomingMSG.tileFrom, "empty");
            updateImage(incomingMSG.tileTo, incomingMSG.image);
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

var updateImage = function(cell, imageName)
{
    // Update image
	// 1.JQuery img with specified cell as ID
	// 2.Get first element (index 0) [which is the image]
	// 3.Access and change src image
	// [images reside in images/pieces/]
	$("#" + cell + " img")[0].src = "images/pieces/" + imageName + ".png";
}