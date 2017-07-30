const express = require('express'),
      nunjucks = require('nunjucks'),
      path = require('path');


var app = express();

nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express: app
});

app.use('/vendors', express.static(path.join(__dirname, 'node_modules')));
app.use(require('body-parser').urlencoded({extended: false}));

app.get('/', function(req, res, next){
  res.render('index.html');
});
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`listening on port ${port}`);
});
