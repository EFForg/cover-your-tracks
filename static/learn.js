$(document).ready(function(){
  var trackerInput = document.getElementById('tracker-input');
  var trackerOutput  = document.getElementById('tracker-output');
  var jsInput = document.getElementById('js-input');
  var jsOutput  = document.getElementById('js-output');
  var defaultsInput = document.getElementById('defaults-input');
  var defaultsOutput  = document.getElementById('defaults-output');
  var resistantInput = document.getElementById('resistant-input');
  var resistantOutput  = document.getElementById('resistant-output');
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
       defaultsOutput.value = "yes"
     } else {
       defaultsOutput.value = "no"
     }
  }
  resistantInput.onchange = function(){
     if (resistantInput.value == '1') {
       resistantOutput.value = "yes"
     } else {
       resistantOutput.value = "no"
     }
  }

});
