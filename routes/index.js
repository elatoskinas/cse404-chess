module.exports = function(app, gameStats)
{
  app.get("/play", function(req, res)
  {
     res.sendFile("game.html", {root: "./public"});
  });
  
  app.get("/", function(req, res)
  {
    res.render("splash.ejs", {activeGamers: gameStats.activeGamers, ongoingGames: gameStats.ongoingGames, gamesCompleted: gameStats.gamesCompleted});
  });
}