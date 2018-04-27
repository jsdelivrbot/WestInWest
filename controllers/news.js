const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('');

module.exports = function(async){
  return {
    SetRouting: function(router){
      router.get('/latest-news', this.news);
    },

    news: function(req, res){
      newsapi.v2.topHeadlines({
        category: 'technology',
        language: 'en',
        country: 'us'
      }).then(response => {
        console.log(response);
        res.render('news/news', {title: 'DinBing - Profile', user:req.user, news: response});
      });
  }
  }
}
