$(document).ready(function(){
  var trackerInput = document.getElementById('tracker-input');
  var trackerOutput  = document.getElementById('tracker-output');
  var jsInput = document.getElementById('js-input');
  var jsOutput  = document.getElementById('js-output');
  var defaultsInput = document.getElementById('defaults-input');
  var defaultsOutput  = document.getElementById('defaults-output');
  var resistantInput = document.getElementById('resistant-input');
  var resistantOutput  = document.getElementById('resistant-output');
  // hide all prints except "you" for 5 seconds
  $('.footprints').hide();
  $('.footprints[first-fox]').show();
  $('.footprints[x-img="fox"]').delay(5000).fadeIn(4000);
  // change "you" from red to gray
  // $('.footprints[x-img="fox"]:nth-child(1)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
  function redToGray() {
    setTimeout(function(){
      $('.footprints[x-img="fox"]:nth-child(1)  > .foot').css('background-image','url(/static/svg/fox-gray.svg)');
      $('.footprints[x-img="fox"]:nth-child(1)  > .you').fadeOut(1000);
    },4000);
  }
  redToGray();

  defaultsInput.onchange = function(){
   if (defaultsInput.value == '1') {
     defaultsOutput.value = "no"
     $('.footprints[x-img="fox"]:nth-child(2)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
     $('.footprints[x-img="fox"]:nth-child(8)' ).show();
   } else {
     defaultsOutput.value = "yes"
     $('.footprints[x-img="fox"]:nth-child(2)  > .foot' ).css('background-image','url(/static/svg/deer.svg)');
     $('.footprints[x-img="fox"]:nth-child(8)' ).hide();
   }
}
resistantInput.onchange = function(){
   if (resistantInput.value == '1') {
     resistantOutput.value = "no"
      $('.footprints[x-img="fox"]:nth-child(4)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
     $('.footprints[x-img="fox"]:nth-child(7)' ).show();
   } else {
     resistantOutput.value = "yes"
     $('.footprints[x-img="fox"]:nth-child(4)  > .foot' ).css('background-image','url(/static/svg/bird.svg)');
    $('.footprints[x-img="fox"]:nth-child(7)' ).hide();
   }
}
trackerInput.onchange = function(){
   if (trackerInput.value == '1') {
     trackerOutput.value = "not installed"
      $('.footprints[x-img="fox"]:nth-child(3)  > .foot' ).css('background-image','url(/static/svg/fox-gray.svg)');
     $('.footprints[x-img="fox"]:nth-child(6)' ).show();
   } else {
     trackerOutput.value = "installed"
     $('.footprints[x-img="fox"]:nth-child(3)  > .foot' ).css('background-image','url(/static/svg/hoof.svg)');
    $('.footprints[x-img="fox"]:nth-child(6)' ).hide();
   }
}
jsInput.onchange = function(){
   if (jsInput.value == '1') {
     jsOutput.value = "not enabled"
      $('.footprints[first-raccoon]').hide();
      $('.footprints[first-raccoonfoot]').hide();
      $('.footprints[x-img="fox"]:nth-child(2)' ).show();
     $('.footprints[x-img="fox"]:nth-child(5)' ).show();
   } else {
     jsOutput.value = "enabled"
     $('.footprints[first-raccoon]').show();
     $('.footprints[first-raccoonfoot]').show();
     $('.footprints[x-img="fox"]:nth-child(2)' ).hide();
    $('.footprints[x-img="fox"]:nth-child(5)' ).hide();
   }
}

});
