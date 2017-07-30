const express = require('express'),
      nunjucks = require('nunjucks'),
      path = require('path'),
      db = require('./db'),
      users = require('./routes/users');


var app = express();

nunjucks.configure('views', {
  autoescape: true,
  noCache: true,
  express: app
});

app.use('/vendors', express.static(path.join(__dirname, 'node_modules')));
app.use(require('body-parser').urlencoded({extended: false}));
app.use(require('method-override')('_method'));
app.use('/users', users);
app.use(function(req, res, next){
  db.getUsers()
    .then(function(results){
      res.locals.userCount = results.length;
      next();
    });
});
app.use(function(req, res, next){
  db.getUsers(true)
    .then(function(results){
      res.locals.managerCount = results.length;
      next();
    });
});


app.get('/', function(req, res, next){
  res.render('index.html', {
    nav: 'Home'
  });
});


app.post('/', function(req, res, next){
  db.createUser(req.body)
  .then(function(){
    res.redirect('/users');
  });
  // .catch(function(err){

  //   });
});

app.use(function(err, req, res, next){
  res.render('index.html', {error: err});
});
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log(`listening on port ${port}`);
  db.sync()
    .then(function(){
      return db.seed()
    })
    .then(function(){
      return db.getUsers();
    })
    .then(function(result){
      console.log(result);
    });
});
