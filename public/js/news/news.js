$(document).ready(function(){
    return GetResult();
});

function GetResult(){
    $.ajax({
        url: 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=4bc08b3de3a54b23893c97e4ff7e3b26',
        type: 'GET',
        dataType: 'json',
        data: {
          data: data
        },
        success: function(data){

            // var results = '';
            //
            // $.each(data.articles, function(i){
            //
            //     results += '<div class="col-md-12 news-post">';
            //     results += '<div class="row">';
            //
            //     results += '<a href='+data.articles[i].url+' target="_blank" style="color:#4aa1f3; text-decoration:none;">';
            //
            //     results += '<div class="col-md-10">';
            //     results += '<h4 class="news-date">'+new Date(Date.parse(data.articles[i].publishedAt)).toDateString()+'</h4>';
            //     results += '<p class="news-text">'+data.articles[i].title+'</p>';
            //     results += '</div>';
            //
            //
            //     results += '</a>';
            //     results += '</div>';
            //     results += '</div>';
            // });
            //
            // $('#newsResults').html(results);
        }
    })
}
