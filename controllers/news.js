const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('4bc08b3de3a54b23893c97e4ff7e3b26');

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
