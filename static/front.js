// Send browsers that support JavaScript to the AJAX version of the
// test

var aat_link = '/tracker?aat=1';
var no_aat_link = '/tracker';

$(document).ready(function(){
  $('#trackerlink').attr('href', aat_link);

  $('#acceptable_ads input').change(function(){
    if(this.checked){
      $('#trackerlink').attr('href', aat_link);
    } else {
      $('#trackerlink').attr('href', no_aat_link);
    }
  });


  new Tooltip(document.getElementById('whats_this'), {
      placement: 'left',
      title: "In order to test whether some tracking companies have been whitelisted (unblocked) by your blocking or privacy software, we need to have your browser try to connect to one of these companies. You can enable or disable this as you prefer."
  });

});
