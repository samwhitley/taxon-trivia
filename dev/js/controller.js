var APP = APP || {};

APP.controller = (function(win, $, taxa, view) {
  var choiceCount,
      $body = $("body"),
      $info = $(".info"),
      $details = $(".details"),
      $detailOverlay = $(".detailOverlay"),
      detailsVisible = false;

  function connectEvents() {
    $(win).on("mainTaxonLoaded", setPlayScreen)
      .on("subTaxaImagesLoaded", setChoices)
      .on("correctGuess", correctGuess)
      .on("wrongGuess", wrongGuess);

    $info.click(function() {
      if (!detailsVisible) {
        $details.addClass("showDetails");
        $detailOverlay.addClass("showDetails");
        detailsVisible = true;

        $detailOverlay.velocity("stop").velocity(
          {
            opacity: 0.6
          },
          {
            duration: 600,
            display: "block"
          }
        );
      }
      else {
        $detailOverlay.velocity("stop").velocity(
          {
            opacity: 0
          },
          {
            duration: 600,
            display: "none"
          }
        );

        $details.removeClass("showDetails");
        $detailOverlay.removeClass("showDetails");
        detailsVisible = false;
      }
    });
  }

  function correctGuess() {
    var message = "That's right! Press here to play again.";
    setPlayAgainState(message);
  }

  function wrongGuess() {
    var message = "Sorry, wrong answer. Press here to play again.";
    setPlayAgainState(message);
  }

  function setPlayAgainState(message) {
    view.printPlayAgainMessage(message);
    setAnswerLabels();
    view.connectReplayEvent(taxa.setSubTaxa);
  }

  function setAnswerLabels() {
    for (var i = 0; i < choiceCount; i++) {
      view.printAnswer(i, taxa.getSubTaxonInfo(i).scientificName);
    }
  }

  function setPlayScreen() {
    var mainTaxon = taxa.getMainTaxonInfo();

    view.prepareChoices(mainTaxon.name, mainTaxon.desc, taxa.setSubTaxa);
  }

  function setChoices() {
    var currentInfo,
        answer = taxa.getAnswerName();

    choiceCount = taxa.getChoicesCount();

    for (var i = 0; i < choiceCount; i++) {
      currentInfo = taxa.getSubTaxonInfo(i);
      view.printActiveButton(i);
      view.printImage(currentInfo.picURL, i, taxa.checkAnswer);
    }

    view.printChallengeText(answer);
    view.printChoiceButtonArea();
  }

  function init() {
    connectEvents();
    view.connectTaxonChoiceEvents(taxa.setTaxonCategory, taxa.getCategoryName, taxa.setMainTaxon);
  }

  return {
    init: init
  };
}(window, jQuery, APP.taxa, APP.view));

APP.controller.init();