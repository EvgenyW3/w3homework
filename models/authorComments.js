//This is for finding all author comments magic
//Constructor for creating an author's comments object
function authorComments(movie, rating, comment, commentId, author) {

  this.movie = movie;  
  this.rating = rating;  
  this.comment = comment;
  this.commentId = commentId;
  //We going to need this when we delete a comment from author's view
  this.author = author;

}

// export the class
module.exports = authorComments;