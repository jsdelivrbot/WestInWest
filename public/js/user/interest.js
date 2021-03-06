$(document).ready(function(){
  $('#favClubBtn').on('click', function(){
      var favClub = $('#favClub').val();

      var valid = true;

      if(favClub == ''){
          valid = false;
          $('#error').html('<div class="alert alert-danger">You cannot submit an empty field</div>');
      }else{
          $('#error').html('');
      }

      if(valid == true){
          $.ajax({
              url: '/settings/interest',
              type: 'POST',
              data: {
                  favClub: favClub
              },
              success: function(){
                  $('#favClub').val('');
                  setTimeout(function(){
                      window.location.reload();
                  }, 200);
              }
          })
      }else {
          return false;
      }
  });
});
