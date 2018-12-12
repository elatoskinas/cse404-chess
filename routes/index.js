var express = require('express');
var router = express.Router();
/* GET home page. */

router.get("/play", function(req, res)
{
  res.sendFile("game.html", {root: "./public"});
});

router.get("/", function(req, res){
  res.render("splash.ejs", {});
});
module.exports = router;