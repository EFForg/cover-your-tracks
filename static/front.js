// Send browsers that support JavaScript to the AJAX version of the
// test

var aat_link = '/kcarter?aat=1';
var no_aat_link = '/kcarter';

$(document).ready(function(){
  $('#kcarterlink').attr('href', aat_link);

  $('#acceptable_ads input').change(function(){
    if(this.checked){
      $('#kcarterlink').attr('href', aat_link);
    } else {
      $('#kcarterlink').attr('href', no_aat_link);
    }
  });


  tippy('#whats-this', {
      content: "In order to test whether some tracking companies have been whitelisted (unblocked) by your blocking or privacy software, we need to have your browser try to connect to one of these companies. You can enable or disable this as you prefer."
  });

  $('.stop').on( 'click', function(e) {
    $('.footprints').css('--animation-duration', '0s');
    $('.static-tracks').show();
    $(this).hide();
  });

});
