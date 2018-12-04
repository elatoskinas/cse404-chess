var express = require('express');
var router = express.Router();
var fs = require()
var app = express();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/home', function(req, res){
  if(req.url === '/home'){
    res.writeHead(200, ('Content type': 'text/html'));

  }
    res.send("Yes!!");
});

app.listen(3000);
module.exports = router;
