var express = require('express');
var router = express.Router();
var fs = require()
var app = express();
/* GET home page. */

router.get("/play", function(req, res)
{
  res.sendFile("game.html", {root: "./public"});
});

router.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./public"});
});
module.exports = router;
