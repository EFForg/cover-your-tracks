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
      if ($(this).html().includes('Browser Plugin')) {
        var filename = '/static/results-text/browser-plugin-details.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('AudioContext')) {
        var filename = '/static/results-text/audiocontext.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Cookies Enabled')) {
        var filename = '/static/results-text/cookies-enabled.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Device Memory')) {
        var filename = '/static/results-text/device-memory.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('DNT Header')) {
        var filename = '/static/results-text/dnt-header.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hardware Concurrency')) {
        var filename = '/static/results-text/hardware-concurrency.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hash of canvas fingerprint')) {
        var filename = '/static/results-text/hash-of-canvas.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hash of WebGL fingerprint')) {
        var filename = '/static/results-text/hash-of-webgl.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Limited supercookie ')) {
        var filename = '/static/results-text/limited-super-cookie.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Platform')) {
        var filename = '/static/results-text/platform.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Screen Size')) {
        var filename = '/static/results-text/screen-size.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('System Fonts')) {
        var filename = '/static/results-text/system-fonts.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Time Zone')) {
        var filename = '/static/results-text/time-zone.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Time Zone Offset')) {
        var filename = '/static/results-text/time-zone-offset.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('Touch Support')) {
        var filename = '/static/results-text/touch-support.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('User Agent')) {
        var filename = '/static/results-text/user-agent.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
      if ($(this).html().includes('WebGL Vendor')) {
        var filename = '/static/results-text/webgl-vendor.txt';
        var selfname = $(this);
        getText(filename, selfname);
      }
    });
    $('.detailed').hide();
    $('#default-button').addClass('active');
    $('#default-button').on( 'click', function(e) {
      $('#default-button').addClass('active');
      $('#detailed-button').removeClass('active');
      $('.detailed').hide();
    });
    $('#detailed-button').on( 'click', function(e) {
      $('#detailed-button').addClass('active');
      $('#default-button').removeClass('active');
      $('.detailed').show();
    });
    $('select').selectmenu();  // select which characteristic to go to
    $('#characteristic').on('selectmenuchange', function() {
      var char = $( "#characteristic option:selected" ).text();
      char = '#'+ char;
      window.location.href = '#'+ char;
    });
  }, 2000);

});
