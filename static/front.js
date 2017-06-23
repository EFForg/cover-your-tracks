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
});
