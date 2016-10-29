var express = require('express');
var router = express.Router();
var Movie = require('../models/movie.js');
var authorComments = require('../models/authorComments');
var mongoose = require('mongoose');

// GET home page and all movies from db
router.get('/:author', function(req, res, next) {
//Creating list for storing all authorComments objects
var ac = [];
  //Finding a all movies that a particular author has commented
  Movie.find({'comments' :{$elemMatch: {'author' : req.params.author }}}, function(err, movies) {
      if(err) throw err;
      /*Checking through all movies and if an author a comment matches an author's name 
      that is passed with a link, then we create a new authorComments object with all parametres needed
      (such as movie title, rating, comment text and comment id(for deleting)) and adding them to an ac array. 
      WARNING! MAGIC IS GOING ON HERE!
      */
      for(var i in movies){
          for(var j in movies[i].comments){
            if(movies[i].comments[j].author === req.params.author){
                ac.push(new authorComments(movies[i].title, movies[i].comments[j].rating, movies[i].comments[j].comment, movies[i].comments[j]._id, req.params.author));
            };
          };
      };
      //Rendering list of all author's comments
      //Send author(name) separately to print it out outside #each contruction
      res.render('author', { ac: ac, author: req.params.author });
  });
});
//Duplicated from movie routes, bad practise, but it works
//Finding a parent doc(movie) by id of a child(comment id)
//Removing child doc by id
//Saving parent doc with new amount of comments
//reading a passed author name for redirecting to author's comments page after deleting
router.get('/comment/delete/:id/:author', function(req, res, next) { 
    Movie.findOne({'comments' :{$elemMatch: {'_id' : req.params.id }}}, function(err, movie) {
    if (err) throw err;
    var comment = movie.comments.id(req.params.id).remove();
    movie.save(function(err){
      if(err) throw err
            res.redirect('/author/'+req.params.author);
      });
  });    
});


module.exports = router;