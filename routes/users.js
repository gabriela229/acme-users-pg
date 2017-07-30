var app = require('express').Router(),
    db = require('../db');

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
  db.getUsers()
    .then(function(result){
      res.render('users.html', {
        nav: 'Users',
        users: result
      });
    });

});

app.get('/managers', function(req, res, next){
  db.getUsers(true)
    .then(function(result){
        res.render('managers.html', {
          nav: 'Managers',
          users: result
        });
    });
});

app.put('/:id', function(req, res, next){
  req.body.id = req.params.id;
  db.updateUser(req.body)
  .then(function(result){
    if (!result.rows[0].manager){
      res.redirect('/users/managers');
    } else {
      res.redirect('/users');
    }
  });
});

app.delete('/:id', function(req, res, next){
  req.body.id = req.params.id;
  db.deleteUser(req.body.id)
    .then(function(){
      res.redirect('/users');
    });
});

module.exports = app;
