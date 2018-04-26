var NodeGeocoder = require('node-geocoder');


module.exports = function(aws, Article, formidable, async, Message, Users, FriendResult){
  return {
            SetRouting: function(router) {
              router.get('/article', this.getArticle)
              router.get('/article/:article', this.getArticleDetails)
              router.get('/newArticle', this.getNewArticle);
              router.post('/uploadArticle', aws.Upload.any(), this.uploadFile);
              router.post('/newArticle', this.NewArticlePostPage);
              router.post('/article', this.searchArticle);
              // router.get("/article/:article/edit",  this.articleEdit);
              // router.put("/article/:article/edit",  this.articlePostEdit);
            },

            // articlePostEdit: function(req, res){
              // upload(req,res,function(err) {
              //     if(err) {
              //         return res.send("Error uploading file.");
              //     }
              //     if(req.body.removeImage) {
              //         req.body.campground.image = '/uploads/no-image.png';
              //     }
              //     else if(req.file) {
              //         req.body.campground.image = '/uploads/' + req.file.filename;
              //     }
              //     //find and update the correct campground
              //     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
              //         if(err){
              //             res.redirect("/moments");
              //         } else {
              //             res.redirect("/moments/" + req.params.id);
              //         }
              //     });
              // });
            // },
            //
            // articleEdit: function(req, res){
            //   Article.findById(req.params.article, function(err, foundArticle){
            //       res.render("article/edit", {user: req.user, article: foundArticle});
            //   });
            // },

            getArticle: function(req, res){
                FriendResult.PostRequest(req, res, '/article');
                async.parallel([
                    function(callback){
                       Article.find({}, (err, result) => {
                           callback(err, result);
                        });
                    }
                ], (err, results) => {
                    const res1 = results[0];

                    const dataChunk  = [];
                    const chunkSize = 4;
                    for (let i = 0; i < res1.length; i += chunkSize){
                        dataChunk.push(res1.slice(i, i+chunkSize));
                    }

                    res.render('article/article', {title: 'DinBing - Article', user: req.user, chunks: dataChunk});
                })
            },

            getArticleDetails: function(req, res){
              FriendResult.PostRequest(req, res, '/article/:article');
              async.parallel([
                  function(callback){
                     Article.findOne({'_id': req.params.article}, (err, result) => {
                         callback(err, result);
                      });
                  },
                  function(callback){
                    Article.update({
                      '_id': req.params.article,
                      'viewer.username': {$ne: req.user.username}
                    }, {
                      $push: {viewer: {
                        username: req.user.username,
                        email: req.user.email
                      }}
                    }, (err, count) => {
                      console.log(count);
                      callback(err, count);
                    })
                  }
              ], (err, results) => {
                  const res1 = results[0];
                  const res2 = results[1];
                  //
                  console.log(res2);


                  res.render('article/show', {title: 'DinBing - Article', user: req.user, article: res1});
              })
          },

          // NewArticlePostPage: function(req, res){
          //
          //   var options = {
          //     provider: 'google',
          //     httpAdapter: 'https',
          //     apiKey: 'AIzaSyBvB04sgZ0jz7rLuyygKumz4SnRXRgBPic',
          //     formatter: null
          //   };
          //
          //   var geocoder = NodeGeocoder(options);
          //
          //   // get data from form and add to campgrounds array
          //   var name = req.body.name;
          //   var description = req.body.description;
          //   var author = {
          //       id: req.user._id,
          //       username: req.user.username
          //   }
          //   var image = req.body.upload;
          //   geocoder.geocode(req.body.location, function (err, data) {
          //     if (err || !data.length) {
          //       console.log(err);
          //       req.flash('error', 'Invalid address');
          //       return res.redirect('back');
          //     }
          //     var lat = data[0].latitude;
          //     var lng = data[0].longitude;
          //     var location = data[0].formattedAddress;
          //     var newArticle = {name: name, image: image, description: description, author:author, location: location, lat: lat, lng: lng};
          //     // Create a new campground and save to DB
          //     Article.create(newArticle, function(err, newlyCreated){
          //         if(err){
          //             console.log(err);
          //         } else {
          //             //redirect back to campgrounds page
          //             console.log(newlyCreated);
          //             res.redirect("/article");
          //         }
          //     });
          //   });
          //   },


            NewArticlePostPage: function(req, res){
                const newArticle = new Article();
                newArticle.name = req.body.name;
                newArticle.description = req.body.description;
                newArticle.author = {
                    id: req.user._id,
                    username: req.user.username
                };
                newArticle.place = req.body.location;
                newArticle.image = req.body.upload;
                newArticle.save((err) => {
                  console.log(err);
                    res.redirect('/article');
                });
            },

            uploadFile: function(req, res) {
                const form = new formidable.IncomingForm();

                form.on('file', (field, file) => {

                });

                form.on('error', (err) => {
                });

                form.on('end', () => {

                });

                form.parse(req);
            },

            getNewArticle: function(req, res){
              res.render('article/newarticle', { title: 'DinBing - article' , user: req.user})
            },

            searchArticle: function(req, res){
              async.parallel([
                  function(callback){
                    const regex = new RegExp((req.body.name), 'gi');

                     Article.find({'name': regex}, (err, result) => {
                         callback(err, result);
                      });
                  }
              ], (err, results) => {
                  const res1 = results[0];

                  const dataChunk  = [];
                  const chunkSize = 4;
                  for (let i = 0; i < res1.length; i += chunkSize){
                      dataChunk.push(res1.slice(i, i+chunkSize));
                  }

                  res.render('article/article', {title: 'DinBing - Article', user: req.user, chunks: dataChunk});
              })
            }
}
}
