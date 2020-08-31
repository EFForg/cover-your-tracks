$(document).ready(function(){
  setTimeout(function(){
  $('.results-table h4').each(function(i){
    //function getText() {
    //  $.ajax({
    //    url : "/static/results-text/user-agent.txt",
    //    dataType: "text",
    //    success : function (data) {
    //      $(".text").html(data);
    //    }
    //  });
    //}
      if ($(this).html().includes('User Agent')) {
        var self = $(this).html();
        $.ajax({
          url : "/static/results-text/user-agent.txt",
          context: this,
          dataType: "text",
          success : function (data) {
            $(this).parent().find(".text.detailed").html(data);
          }
        })
      }
      if ($(this).html().includes('HTTP_ACCEPT Headers')) {
        var self = $(this).html();
        $.ajax({
          url : "/static/results-text/http-accept-headers.txt",
          context: this,
          dataType: "text",
          success : function (data) {
              $(this).parent().find(".text.detailed").html(data);
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
