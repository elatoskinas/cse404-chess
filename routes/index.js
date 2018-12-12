module.exports = function(app, gameStats)
{
  app.get("/play", function(req, res)
  {
     res.sendFile("game.html", {root: "./public"});
  });
  
  app.get("/", function(req, res)
  {
    // Object for tracking User data
    var cookieContent =
    {
      visits: 1,
      lastVisited: new Date()
    }

    // Check if cookie already exists
    if (req.cookies["visits"])
    {
      // Parse cookie value, increment visit counts, reset Date
      cookieContent = JSON.parse(req.cookies["visits"]);
      cookieContent.visits++;
      cookieContent.lastVisited = new Date();
    }
    else
    {
      console.log("First visit from new gamer!!");
    }

    // Resend cookie to the browser
    res.cookie("visits", JSON.stringify(cookieContent), { httpOnly: false});
    
    // Render splash with required values
    res.render("splash.ejs", {activeGamers: gameStats.activeGamers, ongoingGames: gameStats.ongoingGames,
        gamesCompleted: gameStats.gamesCompleted, visits: cookieContent.visits, lastVisited: cookieContent.lastVisited});
  });
}