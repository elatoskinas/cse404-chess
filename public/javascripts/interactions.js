var statusMessages = ["Waiting for players...", "Your Turn", "Opponent's Turn", "Your fellow gamer aborted the game.", "You won!", "You lost!", "Stalemate!!","Check!"];

// Initializes the game and gets socket connection
(function setup()
{
    // start WebSocket connection
    var socket = new WebSocket("ws://localhost:3000");

    // State for current client. Keep this in separate Object later.
    var isWhite = true;
    var selectedPiece = "";
    var validMoves = [];

    // States:
    // 0 - WAITING FOR PLAYER
    // 1 - ONGOING GAME
    var state = 0;

    // Message received from Server
    socket.onmessage = function(event)
    {
        // Parse event data from JSON
        let incomingMSG = JSON.parse(event.data);

        // Convert message to functionality
        if (incomingMSG.type === "UPDATE-TILE")
        {
            updateTile(incomingMSG.tile, incomingMSG.image); // Update specified tile with specified image
        }
        else if (incomingMSG.type === "PLAYER-TYPE")
        {
            // Set Player type (true case is not handled here, since we already assume true)
            if (incomingMSG.data == false)
            {
                isWhite = false;

                // Flip the board
                rotateBoard();

                $("#User1").text("Opponent");
                $("#User2").text("You");
            }
            else
            {
                $("#User1").text("You");
                $("#User2").text("Opponent");
            }
        }
        else if (incomingMSG.type === "SELECT-PIECE")
        {
            // Clear selected piece & valid move highlights
            highlightValidMoves(validMoves, "");

            if (selectedPiece != "")
                changeTileState(selectedPiece, "");
            
            // Set selected piece & valid moves
            selectedPiece = incomingMSG.tile;
            validMoves = incomingMSG.validMoves;

            // Highlight new selected piece & valid moves
            highlightValidMoves(validMoves, "valid");
        
            if (selectedPiece != "")
                changeTileState(selectedPiece, "selected");
        }
        else if (incomingMSG.type === "MOVE-PIECE")
        {
            // Update source & destination tiles with required images
            updateTile(incomingMSG.tileFrom, "empty"); // empty because piece was moved from source tile
            updateTile(incomingMSG.tileTo, incomingMSG.imageFrom);

            // Add movement entry to side panel
            addToSidePanel(incomingMSG.tileFrom, incomingMSG.tileTo, incomingMSG.imageFrom, incomingMSG.imageTo, incomingMSG.player);

            if (incomingMSG.player == isWhite)
                changeStatusText(statusMessages[2]);
            else
                changeStatusText(statusMessages[1]);
        }
        else if (incomingMSG.type === "STATE")
        {
            // Change state & update text
            state = incomingMSG.status;

            if (state == 0)
                changeStatusText(statusMessages[0]);
            else if (state == 1)
            {
                if (isWhite)
                    changeStatusText(statusMessages[1]);
                else
                    changeStatusText(statusMessages[2]);
            } else if (state == 2)
            {
                changeStatusText(statusMessages[3]);
            }
            else if (state == 3)
            {
                if(incomingMSG.data==1)
                changeStatusText(statusMessages[5]);
                else if(incomingMSG.data==2)
                changeStatusText(statusMessages[4]);
                else if (incomingMSG.data==0)
                changeStatusText(statusMessages[6]);
            } else if (state == 4){
                changeStatusText(statusMessages[7]);
            }

        }
    }

    // Set onClick Listeners to chess tile image DOM objects
	$(".chess-tile img").on("click", function(event)
	{
        // Click not processed due to:
        // 1.Waiting for Player
        // 2.Game Aborted
        // 3.Game Over
        if (state == 0||state==2||state==3)
            return;

        // Construct click message
        var clickMSG = messages.cloneMessage(messages.O_TILE_CLICK_BY);

        clickMSG.player = isWhite;
        clickMSG.tile = this.parentElement.id;
        clickMSG.selected = selectedPiece;
        clickMSG = JSON.stringify(clickMSG);

        // Send message to server
        socket.send(clickMSG);
	});
})(); // execute immediately

/** Updates image in specified cell */
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
var addToSidePanel = function(source, dest, imageFrom, imageTo, player)
{
	// Instantiate piece images
	var $image1 = $("<img>");
	var $image2 = $("<img>");

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
    var $panel1 = $("#MovesUser1");
    var $panel2 = $("#MovesUser2");
    
    // add to only a single panel! Bug here!
    if (player)
        $panel1.append($tableEntry);
    else
    	$panel2.append($tableEntry);
}

/** Set state to all tiles in validMoves array. This is used for highlighting/unhighlighting
 * current/previous valid moves.
 */
var highlightValidMoves = function(validMoves, state)
{
    for (var i = 0; i < validMoves.length; ++i)
    {
        changeTileState(validMoves[i], state); // change tile state for specified tile
    }

    if (state == "") // if state is "", then validMoves must be cleared
        validMoves = [];
}

/** Change tile's state (in order for CSS to apply the correct styling) */
var changeTileState = function(tile, state)
{
    $("#" + tile)[0].dataset.state = state; // override state
}

/** Change Game Status text */
var changeStatusText = function(text)
{
    var statusText = $("#" + "status_text");
    statusText[0].textContent = text;
}

/** Rotates the board for black piece */
var rotateBoard = function()
{
    // Detach all tiles from the Chess Board
    var tiles = $(".chess-tile").detach();

    // Remove all br from the Chess Board
    $("#chess-board br").remove();

    // Append tiles in reverse order (effectively flipping the board)
    for (var i = tiles.length; i--; i >= 0)
    {
        $("#chess-board")[0].append(tiles[i]);

        // Add back br elements every 8 tiles
        if (i % 8 == 0)
        {
            // Create br element
            var br = document.createElement('br');

            // Append br
            $("#chess-board")[0].append(br);
        }
    }
}