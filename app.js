var express = require("express");
var http = require("http");

var indexRouter = require("./routes/index.js");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.use('/', indexRouter);
app.use('/play', indexRouter);

http.createServer(app).listen(port);