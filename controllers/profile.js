module.exports = function(async, Message, Users, aws, formidable, FriendResult, Article){
  return {
    SetRouting: function(router){
      router.get('/settings/profile', this.getPofilePage);

      router.post('/settings/profile', this.postProfilePage);
      router.post('/userupload', aws.Upload.any(), this.userUpload);

      router.get('/:name/article', this.ArticleProfile);

      router.get('/profile/:name', this.overviewPage);
      router.post('/profile/:name', this.overviewPostPage);
      router.get('/user/:name', this.UserPage);
    },

    UserPage: function(req, res){
      async.parallel([
          function(callback){
              Users.findOne({'username': req.params.name})
                  .populate('request.userId')

                  .exec((err, result) => {
                      callback(err, result);
                  })
          },
          function(callback){
              const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
              Message.aggregate(
                  {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                  {$sort:{"createdAt":-1}},
                  {
                      $group:{"_id":{
                      "last_message_between":{
                          $cond:[
                              {
                                  $gt:[
                                  {$substr:["$senderName",0,1]},
                                  {$substr:["$receiverName",0,1]}]
                              },
                              {$concat:["$senderName"," and ","$receiverName"]},
                              {$concat:["$receiverName"," and ","$senderName"]}
                          ]
                      }
                      }, "body": {$first:"$$ROOT"}
                      }
                  }, function(err, newResult){
                    callback(err, newResult);
                  }
              )
          }
      ], (err, results) => {
          const result1 = results[0];
          const result2 = results[1];
          console.log(result1);

          res.render('user/user', {title: 'DinBing - Overview', user:req.user, data: result1, chat: result2});
      });
    },

    getPofilePage: function(req, res){
      async.parallel([
          function(callback){
              Users.findOne({'username': req.user.username})
                  .populate('request.userId')

                  .exec((err, result) => {
                      callback(err, result);
                  })
          },
          function(callback){
              const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
              Message.aggregate(
                  {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                  {$sort:{"createdAt":-1}},
                  {
                      $group:{"_id":{
                      "last_message_between":{
                          $cond:[
                              {
                                  $gt:[
                                  {$substr:["$senderName",0,1]},
                                  {$substr:["$receiverName",0,1]}]
                              },
                              {$concat:["$senderName"," and ","$receiverName"]},
                              {$concat:["$receiverName"," and ","$senderName"]}
                          ]
                      }
                      }, "body": {$first:"$$ROOT"}
                      }
                  }, function(err, newResult){
                    callback(err, newResult);
                  }
              )
          }
      ], (err, results) => {
          const result1 = results[0];
          const result2 = results[1];
          console.log(result2);

          res.render('user/profile', {title: 'DinBing - Profile', user:req.user, data: result1, chat: result2});
      });
  },

  ArticleProfile: function(req, res){
    FriendResult.PostRequest(req, res, '/:name/article');
    async.parallel([
        function(callback){
           Article.find({'author.username': req.params.name}, (err, result) => {
               callback(err, result);
            });
        }
    ], (err, results) => {
        const res1 = results[0];
        console.log(res1);


        res.render('user/article', {title: 'DinBing - Article', user: req.user, article: res1});
    })
  },

  postProfilePage: function(req, res){
    FriendResult.PostRequest(req, res, '/settings/profile');

    async.waterfall([
      function(callback){
        Users.findOne({'_id': req.user._id}, (err, result) => {
          callback(err, result);
        })
      },

      function(result, callback){
          if(req.body.upload === null || req.body.upload === ''){
              Users.update({
                  '_id':req.user._id
              },
              {
                  fullname: req.body.fullname,
                  mantra: req.body.mantra,
                  gender: req.body.gender,
                  country: req.body.country,
                  userImage: result.userImage
              },
              {
                  upsert: true
              }, (err, result) => {
                  res.redirect('/settings/profile');
              })
          } else if(req.body.upload !== null || req.body.upload !== ''){
              Users.update({
                  '_id':req.user._id
              },
              {
                  fullname: req.body.fullname,
                  mantra: req.body.mantra,
                  gender: req.body.gender,
                  country: req.body.country,
                  userImage: req.body.upload
              },
              {
                  upsert: true
              }, (err, result) => {
                  res.redirect('/settings/profile');
              })
          }
      }
    ])
  },

  userUpload: function(req, res) {
      const form = new formidable.IncomingForm();

      form.on('file', (field, file) => {

      });

      form.on('error', (err) => {
      });

      form.on('end', () => {

      });

      form.parse(req);
  },

  overviewPage: function(req, res){
    async.parallel([
        function(callback){
            Users.findOne({'username': req.user.username})
                .populate('request.userId')

                .exec((err, result) => {
                    callback(err, result);
                })
        },
        function(callback){
            const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
            Message.aggregate(
                {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                {$sort:{"createdAt":-1}},
                {
                    $group:{"_id":{
                    "last_message_between":{
                        $cond:[
                            {
                                $gt:[
                                {$substr:["$senderName",0,1]},
                                {$substr:["$receiverName",0,1]}]
                            },
                            {$concat:["$senderName"," and ","$receiverName"]},
                            {$concat:["$receiverName"," and ","$senderName"]}
                        ]
                    }
                    }, "body": {$first:"$$ROOT"}
                    }
                }, function(err, newResult){
                  callback(err, newResult);
                }
            )
        }
    ], (err, results) => {
        const result1 = results[0];
        const result2 = results[1];
        console.log(result1);

        res.render('user/overview', {title: 'DinBing - Overview', user:req.user, data: result1, chat: result2});
    });
  },

  overviewPostPage: function(req, res){
    FriendResult.PostRequest(req, res, '/profile/'+req.params.name);
  }
}
}
