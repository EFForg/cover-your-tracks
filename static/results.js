$(document).ready(function(){
  function sortUsingNestedText(parent, childSelector, keySelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
      var vA = $(keySelector, a).text();
      var vB = $(keySelector, b).text();
      return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
  }
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
        var selfname = $(this).attr('data-group', '1header');
        getText(filename, selfname);
      }
      if ($(this).html().includes('HTTP_ACCEPT Headers')) {
        var filename = '/static/results-text/http-accept-headers.txt';
        var selfname = $(this).attr('data-group', '1header');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Browser Plugin')) {
        var filename = '/static/results-text/browser-plugin-details.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('AudioContext')) {
        var filename = '/static/results-text/audiocontext.txt';
        var selfname = $(this).attr('data-group', '3fingerprint');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Cookies Enabled')) {
        var filename = '/static/results-text/cookies-enabled.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Device Memory')) {
        var filename = '/static/results-text/device-memory.txt';
        var selfname = $(this).attr('data-group', '4hardware');
        getText(filename, selfname);
      }
      if ($(this).html().includes('DNT Header')) {
        var filename = '/static/results-text/dnt-header.txt';
        var selfname = $(this).attr('data-group', '1header');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hardware Concurrency')) {
        var filename = '/static/results-text/hardware-concurrency.txt';
        var selfname = $(this).attr('data-group', '4hardware');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hash of canvas fingerprint')) {
        var filename = '/static/results-text/hash-of-canvas.txt';
        var selfname = $(this).attr('data-group', '3fingerprint');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Hash of WebGL fingerprint')) {
        var filename = '/static/results-text/hash-of-webgl.txt';
        var selfname = $(this).attr('data-group', '3fingerprint');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Limited supercookie ')) {
        var filename = '/static/results-text/limited-super-cookie.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Platform')) {
        var filename = '/static/results-text/platform.txt';
        var selfname = $(this).attr('data-group', '4hardware');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Screen Size')) {
        var filename = '/static/results-text/screen-size.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('System Fonts')) {
        var filename = '/static/results-text/system-fonts.txt';
        var selfname = $(this).attr('data-group', '3fingerprint');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Time Zone')) {
        var filename = '/static/results-text/time-zone.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Time Zone Offset')) {
        var filename = '/static/results-text/time-zone-offset.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Touch Support')) {
        var filename = '/static/results-text/touch-support.txt';
        var selfname = $(this).attr('data-group', '4hardware');
        getText(filename, selfname);
      }
      if ($(this).html().includes('WebGL Vendor')) {
        var filename = '/static/results-text/webgl-vendor.txt';
        var selfname = $(this).attr('data-group', '3fingerprint');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Language')) {
        var filename = '/static/results-text/language.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('Ad Blocker Used')) {
        var filename = '/static/results-text/ad-blocker.txt';
        var selfname = $(this).attr('data-group', '2browser');
        getText(filename, selfname);
      }
      if ($(this).html().includes('CPU Class')) {
        var filename = '/static/results-text/cpu-class.txt';
        var selfname = $(this).attr('data-group', '4hardware');
        getText(filename, selfname);
      }
    });
    $('#default-button').on( 'click', function(e) {
      $('#default-button').addClass('active');
      $('#detailed-button').removeClass('active');
      $('.detailed').hide();
    });
    $('#detailed-button').addClass('active');
    $('#detailed-button').on( 'click', function(e) {
      $('#detailed-button').addClass('active');
      $('#default-button').removeClass('active');
      $('.detailed').show();
    });
    // smaller phone, make table of contents (see results template)
    $('#characteristic').selectmenu({
      'change': function () {
        var val = $( "#characteristic option:selected" ).val();
        window.location.href = val;
      }
    });
    // sort results by group
    sortUsingNestedText($('.detailed-results'), "div", "data-group");
    // add grouped results titles
    $( "<h3>Browser Characteristics</h3>" ).insertBefore('[id^=Browser]');
    $( "<h3>Fingerprint Metrics</h3>" ).insertBefore('[id^=System]');
    $( "<h3>Hardware Specs</h3>" ).insertBefore('[id^=Platform]');
    $( "<h3>Headers</h3>" ).insertBefore('[id^=User]');
  }, 2000);
});
