// Initializes the game and gets socket connection
(function setup()
{
    // start WebSocket connection
    var socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = function(event)
    {
        let incomingMSG = JSON.parse(event.data);

        if (incomingMSG.type === "UPDATE-TILE")
        {
            updateImage(incomingMSG.tile, incomingMSG.image);
        }
    }

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