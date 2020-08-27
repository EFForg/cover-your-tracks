$(document).ready(function(){
  setTimeout(function(){
  $('.results-table h4').each(function(i){
      if ($(this).html().includes('User Agent')) {
        $.ajax({
          url : "/static/results-text/user-agent.txt",
          dataType: "text",
          success : function (data) {
            $(".text").html(data);
          }
        });
      }
      if ($(this).html().includes('HTTP_ACCEPT Headers')) {
        $.ajax({
          url : "/static/results-text/http-accept-headers.txt",
          dataType: "text",
          success : function (data) {
            $(".text").html(data);
          }
        });
      }
    });
    $('.detailed').hide();
    $('#default-button').on( 'click', function(e) {
      $('.detailed').hide();
    });
    $('#detailed-button').on( 'click', function(e) {
      $('.detailed').show();
    });
  }, 2000);
});
