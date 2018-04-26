var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    name: String,
    place: String,
    createdAt: { type: Date, default: Date.now },
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    },
    viewer: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }],
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
    ],
    ratings: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Rating"
      }
    ],
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model("Article", articleSchema);
