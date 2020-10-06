$(document).ready(function(){
  var trackerInput = document.getElementById('tracker-input');
  var trackerOutput  = document.getElementById('tracker-output');
  trackerInput.onchange = function(){
     if (trackerInput.value == '1') {
       trackerOutput.value = "installed"
     } else {
       trackerOutput.value = "not installed"
     }
  }

});
