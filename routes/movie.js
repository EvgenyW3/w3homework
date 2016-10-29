var express = require('express');
var router = express.Router();
var Movie = require('../models/movie.js')
var mongoose = require('mongoose');

//Going to movie's page to see/add some comments
router.get('/:id', function(req, res, next) { 
  Movie.findById(req.params.id, function(err, movie) {
      if (err) throw err;
      //Magic for movie rating starts here
      //Creating a variable that will hold our rating
        var rating = 0;
        //Looping through particular movie's all comments
          for(i in movie.comments){
            //Making sure that we got only numbers
            //And at the same time fixing problem with async
            if(isNaN(movie.comments[i].rating) == false){
              rating += (parseInt(movie.comments[i].rating)) / movie.comments.length;
            }
          }
            //Adding rating to a movie
            movie.rating = rating.toFixed(1);
            res.render('movie', { movie: movie });
      });
});
//Finding a movie by id
//Adding a comment to a parent doc(movie)
//Saving movie with new comment
router.post('/comment/add', function(req, res, next) {
  Movie.findById(req.body.id, function(err, movie) {
  if (err) throw err;
    movie.comments.push({author: req.body.author, rating: req.body.rating, comment: req.body.comment});
      movie.save(function(err, result){
        if(err) throw err;
            res.redirect('/movie/'+req.body.id);
      });
  });
});
//Finding a parent doc(movie) by id of a child(comment id)
//Removing child doc by id
//Saving parent doc with new amount of comments
router.get('/comment/delete/:id', function(req, res, next) { 
    Movie.findOne({'comments' :{$elemMatch: {'_id' : req.params.id }}}, function(err, movie) {
    if (err) throw err;
    var comment = movie.comments.id(req.params.id).remove();
    movie.save(function(err){
      if(err) throw err
            res.redirect('/movie/'+movie._id);
      });
  });    
});


module.exports = router;