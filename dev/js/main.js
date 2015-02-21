var APP = (function() {
  var $body = $("body"),
      $info = $(".info"),
      $details = $(".details"),
      detailsVisible = false;

  function connectEvents() {
    $(".info").click(function() {
      if (!detailsVisible) {
        // $body.addClass("showDetails");
        $details.addClass("showDetails");
        detailsVisible = true;
      }
      else {
        // $body.removeClass("showDetails");
        $details.removeClass("showDetails");
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