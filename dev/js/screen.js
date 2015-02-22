var APP = APP || {};

APP.view = (function($, taxa, win) {
  var method = {};

  var $gameStatus = $(".gameStatus"),
      $statusText = $(".gameStatus .wrapper"),
      $choiceArea = $(".choiceArea"),
      $detailContent = $(".detailContent"),
      $choiceImgs = $(".choice img"),
      $choiceImgWraps = $(".imgWrap"),
      $ajaxOverlays = $(".ajaxOverlay"),
      $choiceButtons = $(".choice button"),
      $pageName = $(".pageName");

  method.prepareInfo = function(ajaxCall) {
    // TODO - add some kind of styling to the play button here
    $choiceButtons.each(function() {
      $(this).slideToggle("slow");
    });

    $ajaxOverlays.each(function() {
      $(this).velocity("stop").velocity(
        {
          opacity: 1
        },
        {
          duration: 1000,
          display: "block",
        }
      );
    });

    if (typeof ajaxCall === "function") {
      ajaxCall();
    }
  };

  method.prepareChoices = function(taxonName, taxonDesc, ajaxCall) {
    console.log("prepareChoices()");

    $pageName.text(taxonName);
    $detailContent.html("").append(taxonDesc);

    if (typeof ajaxCall === "function") {
      ajaxCall();
    }
  };

  method.connectReplayEvent = function(ajaxCall) {
    $gameStatus.one("click", function() {
      $choiceButtons.each(function() {
        $(this).slideToggle("slow");
      });

      $ajaxOverlays.each(function() {
        $(this).velocity("stop").velocity({opacity: 1}, {duration: 1000, display: "block"});
      });

      if (typeof ajaxCall === "function") {
        ajaxCall();
      }
    });
  };

  method.printImage = function(url, index, answerFunc) {
    var img = $choiceImgs[index],
        imgWrap = $choiceImgWraps[index],
        ajaxOverlay = $ajaxOverlays[index],
        choiceButton = $choiceButtons[index];

    $(imgWrap).css("background-image", "url('" + url + "')");

    $(img).attr("src", url).load(function() {
      $(ajaxOverlay).velocity("stop").velocity({opacity: 0}, {duration: 1000, display: "none"});
    });

    $(choiceButton).off("click");
    $(choiceButton).on("click", function() {
      var currentURL = url;

      if (typeof answerFunc === "function") {
        answerFunc(currentURL);
      }
    });
  };

  method.printChallengeText = function(answer) {

    // TODO - style the footer here

    $statusText.html("").append("Pick a member of <strong class='answer'>" + answer + ".</strong>");
  };

  method.printChoiceButtonArea = function() {
    $choiceButtons.each(function() {
      $(this).slideToggle("slow");
    });
  };

  method.printActiveButton = function(index) {
    var $current = $($choiceButtons[index]);

    $current.text("Choice" + (index + 1)).addClass("activeButton");
  };

  method.printAnswer = function(index, name) {
    var $current = $($choiceButtons[index]);

    $current.text(name).off("click").removeClass("activeButton");
  };

  method.printPlayAgainMessage = function(message) {
    $statusText.html(message).addClass("activeButton");
  };

  method.activatePlayButton = function(name, startGameFunc) {
    if (!$statusText.hasClass("activeButton")) {
      $statusText.one("click", function() {
        method.prepareInfo(startGameFunc);
      });
      $statusText.addClass("activeButton");
    }

    $statusText.html("<p>You\'ve chosen <strong>" + name + ".</strong> Click here to start!</p>");
  }

  method.connectTaxonChoiceEvents = function(setTaxonFunc, getNameFunc, startGameFunc) {
    for (var i = 0, len = $choiceButtons.length; i < len; i++) {
      (function(i) {
        var $choiceButton = $($choiceButtons[i]);
        var categoryName = getNameFunc(i);

        $choiceButton.on("click", function() {
          setTaxonFunc(i);
          method.activatePlayButton(categoryName, startGameFunc);
        });
      })(i);
    }
  };

  return method;
}(jQuery, APP.taxa, window));
