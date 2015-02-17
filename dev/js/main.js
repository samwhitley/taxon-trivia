var APP = (function() {
  var $info = $(".info"),
      $details = $(".details"),
      detailsVisible = false;

  function connectEvents() {
    $(".info").click(function() {
      if (!detailsVisible) {
        $details.addClass("showing");
        detailsVisible = true;
      }
      else {
        $details.removeClass("showing");
        detailsVisible = false;
      }
    });
  }

  function init() {
    connectEvents();
  }

  return {
    init: init
  }

}());

APP.init();