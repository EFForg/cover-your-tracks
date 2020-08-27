$(document).ready(function(){
  setTimeout(function(){
    $('#default-button').on( 'click', function(e) {
      $('.detailed').hide();
    });
    $('#detailed-button').on( 'click', function(e) {
      $('.detailed').show();
    });
  }, 2000);
});
