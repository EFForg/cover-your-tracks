$(document).ready(function(){
  document.registrationForm.trackerInput.oninput = function(){
     document.registrationForm.trackerOurpur.value = document.registrationForm.trackerInput.value;
  }

});
