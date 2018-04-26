// var Campground = require("../models/campground");
// var Rating = require("../models/rating");
// var Comment = require("../models/comment");


// all the middleare goes here
var middlewareObj = {};
//
// middlewareObj.checkCampgroundOwnership = function(req, res, next) {
//  if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//            if(err){
//                req.flash("error", "Campground not found");
//                res.redirect("back");
//            }  else {
//                // does user own the campground?
//             if(foundCampground.author.id.equals(req.user._id)) {
//                 next();
//             } else {
//                 req.flash("error", "You don't have permission to do that");
//                 res.redirect("back");
//             }
//            }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// }
//
// middlewareObj.checkCommentOwnership = function(req, res, next) {
//  if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//            if(err){
//                res.redirect("back");
//            }  else {
//                // does user own the comment?
//             if(foundComment.author.id.equals(req.user._id)) {
//                 next();
//             } else {
//                 req.flash("error", "You don't have permission to do that");
//                 res.redirect("back");
//             }
//            }
//         });
//     } else {
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
// }
//
// middlewareObj.checkRatingExists = function(req, res, next){
//   Campground.findById(req.params.id).populate("ratings").exec(function(err, campground){
//     if(err){
//       console.log(err);
//     }
//     for(var i = 0; i < campground.ratings.length; i++ ) {
//       if(campground.ratings[i].author.id.equals(req.user._id)) {
//         req.flash("success", "You already rated this!");
//         return res.redirect('/moments/' + campground._id);
//       }
//     }
//     next();
//   })
// }

// var sender = $('#name-user').html();
// if(req.user === sender ){
//   return next();
// }

middlewareObj.isLogged = function(req, res, next){
  if(req.isAuthenticated()){
    // console.log(req.user.username);

    var user = req.user.username;

    // console.log(req.body.username);
    // console.log(req.url);

    var paramOne = req.url;

    var newParam = paramOne.split('/')


    var fakeUsername = newParam[2];

    var newUserName = fakeUsername.split('.')


    var username = newUserName[1];

    if(username === user){
        return next();
    }
  }
  // req.flash("error", "You need to be logged in to do that");
  res.redirect("/");
}

middlewareObj.isLog = function(req, res, next){
  if(req.isAuthenticated()){
      var user = req.user.username;

      if(user === 'arghyaj'){
        return next();
      }
  }
  // req.flash("error", "You need to be logged in to do that");
  res.redirect("/home");
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/");
}

module.exports = middlewareObj;
