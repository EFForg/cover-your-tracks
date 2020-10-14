$(document).ready(function(){
  var trackerInput = document.getElementById('tracker-input');
  var trackerOutput  = document.getElementById('tracker-output');
  var jsInput = document.getElementById('js-input');
  var jsOutput  = document.getElementById('js-output');
  var defaultsInput = document.getElementById('defaults-input');
  var defaultsOutput  = document.getElementById('defaults-output');
  var resistantInput = document.getElementById('resistant-input');
  var resistantOutput  = document.getElementById('resistant-output');
  // hide racoon prints
  $('.footprints[first-raccoon]').hide();
  $('.footprints[first-raccoonfoot]').hide();
  trackerInput.onchange = function(){
     if (trackerInput.value == '1') {
       trackerOutput.value = "installed"
     } else {
       trackerOutput.value = "not installed"
     }
  }
  jsInput.onchange = function(){
     if (jsInput.value == '1') {
       jsOutput.value = "enabled"
     } else {
       jsOutput.value = "not enabled"
     }
  }
  defaultsInput.onchange = function(){
   if (defaultsInput.value == '1') {
     defaultsOutput.value = "no"
     alert('non');
     $('.footprints[x-img="fox"]:nth-child(2)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
     $('.footprints[x-img="fox"]:nth-child(3)' ).show();
   } else {
     defaultsOutput.value = "yes"
     alert('oui');
     $('.footprints[x-img="fox"]:nth-child(2)  > .foot' ).css('background-image','url(/static/svg/CYT_deer.svg)');
     $('.footprints[x-img="fox"]:nth-child(3)' ).hide();
   }
}
resistantInput.onchange = function(){
   if (resistantInput.value == '1') {
     resistantOutput.value = "no"
      $('.footprints[x-img="fox"]:nth-child(4)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
     $('.footprints[x-img="fox"]:nth-child(5)' ).show();
   } else {
     resistantOutput.value = "yes"
     $('.footprints[x-img="fox"]:nth-child(4)  > .foot' ).css('background-image','url(/static/svg/CYT_hoof.svg)');
    $('.footprints[x-img="fox"]:nth-child(5)' ).hide();
   }
}

});
