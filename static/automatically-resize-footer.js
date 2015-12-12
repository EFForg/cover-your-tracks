// Automatically resize the footer
(function() {
  // Resize interval variables
  var resizeInterval;
  var resizeIntervalCount = 0;
  var savedFooterHeight = 0;

  // Listen for `resize` event
  $(window).on('resize', function () {
    // Create new resize interval
    clearInterval(resizeInterval);
    resizeInterval = setInterval(resizeFooter, 32);

    // Reset the interval count
    resizeIntervalCount = 10;

    // Resize
    resizeFooter();
  });

  function resizeFooter() {
    // If the counter reaches zero, Cancel and the clear interval
    // Otherwise, just reduce the counter by one
    if (resizeIntervalCount === 0) {
      clearInterval(resizeInterval);
      return;
    } else {
      resizeIntervalCount -= 1;
    }

    // Verify a change is needed
    var footerHeight = $(window).height() - $('#header').height() - $('#content').height() - 118;
    if (footerHeight === savedFooterHeight) {
      return;
    }

    // Resize
    $('#footer').height(footerHeight);
    savedFooterHeight = footerHeight;
  }

  // Resize after the page finishes loading
  $(function() {
    $(window).trigger('resize');
  });
})();
