$(document).ready(function(){
  setTimeout(function(){
  $('.results-table h4').each(function(i){
    function getText(file,self) {
      $.ajax({
        url : file,
        context: self,
        dataType: "text",
        success : function (data) {
          self.parent().find(".text").html(data);
        }
      })
    }
      if ($(this).html().includes('User Agent')) {
        var filename = '/static/results-text/user-agent.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('HTTP_ACCEPT Headers')) {
        var filename = '/static/results-text/http-accept-headers.txt';
        var selfname = $(this);
        getText(filename, selfname);
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
