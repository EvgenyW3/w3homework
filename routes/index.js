var express = require('express');
var router = express.Router();
var Movie = require('../models/movie.js')
var mongoose = require('mongoose');
//Module for uploading images
var multer = require('multer');
//This is for preventing multer from giving name without extention
var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'public/images/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});

// GET home page and all movies from db
router.get('/', function(req, res, next) {
  Movie.find(function(err, movies){
      if(err) throw err;
            //Rating magic
            //Looping through all movies
            for(var i in movies){
                //Creating a variable that takes a rating of each movie
                var rating = 0;
                //Looping throguh all movie's comments and getting ratings
                for(var j in movies[i].comments){
                    //Making sure that we got only numbers
                    //And at the same time fixing problem with async
                    if(isNaN(movies[i].comments[j].rating) == false){
                    //Summarizing all ratings
                    rating += (parseInt(movies[i].comments[j].rating)) / movies[i].comments.length;
                    }
                }
            //adding each movie's rating in our array
            movies[i].rating = rating.toFixed(1);
            }
            res.render('index', { title: 'Movie', movies: movies });
  });
});
//Adding new movie to db
router.post('/add', upload.single('image'), function(req, res, next) {
  var movie = new Movie(req.body);
  movie.link = '/images/'+req.file.filename;
  movie.save(function(err, result){
      if(err) throw err;
            res.redirect('/');
  });
});
//Detele movie by id
router.get('/delete/:id', function(req, res, next) { 
  Movie.findById(req.params.id, function(err, movie) {
  if (err) throw err;
    movie.remove(function(err) {
      if (err) throw err;
            res.redirect('/');
      });
  });  
});


module.exports = router;
