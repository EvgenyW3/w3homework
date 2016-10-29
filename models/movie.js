var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments = new Schema({
    author: {type: String, required: true},
    rating: {type: Number, min: 0, max: 5},
    comment: {type: String, required: true}
});

var movie = new Schema({
	link: {type: String},
    title: {type: String, required: true},
    genre: {type: String, required: true},
    description: {type: String, required: true},
    comments: [comments],
    //This one we will not be saved into db, but we will need it to populate and print rating
    rating: {type: Number}
});


module.exports = mongoose.model('Movie', movie);