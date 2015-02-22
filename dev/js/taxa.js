var APP = APP || {};

APP.taxa = (function(win, $) {
  var method = {};

  // Holds the page IDs for the taxa in the game. Primary contains those in secondary.
  var taxonPages = {
    "primary" : undefined,
    "secondary" : []
  };

  /*
    Holds the available categories. For now, these are hardcoded. Perhaps in the future
    there could be a method that traverses the primary pages and automatically populates the
    array with the subcategories.
  */

  var taxonCategories = [
    {
      "name" : "Mammalia",
      "primary" : 1642, // Mammalia
      "secondary" : [
        7662, // Carnivora
        7631, // Chiroptera
        42410182, // Primates
        7678, // Artiodactyla
        1686, // Lagomorpha
        8677, // Rodentia
        1665, // Pholidota
        8711 // Soricomorpha
      ]
    },
    {
      "name" : "Squamata",
      "primary" : 1704, //Squamata
      "secondary" : [
        1733, //Amphisbaenia
        2819161, //Gekkota
        2819271, //Iguania
        1708, //Lacertidae
        40084768, //Neoanguimorpha
        4518884, //Varanoidea
        8109, //Scincidae
        2816351, //Alethinophidia
        2815989 //Scolecophidia
      ]
    },
    {
      "name" : "Aves",
      "primary" : 695, //Aves
      "secondary" : [
        8662, //Struthioniformes
        8024, //Anseriformes
        7589, //Galliformes
        2917972, //Charadriiformes
        2922902, //Procellariiformes
        2918020, //Pelecaniformes
        2921382, //Sphenisciformes
        2922049, //Cathartidae
        2869903, //Falconiformes
        7976, //Columbiformes
        1590, //Psittaciformes
        696, //Strigiformes
        1596 //Passeriformes
      ]
    }
  ];

  var apiKey = "5ac0ff1169dc81058cec2b7bd9f47fe4d68b4788";

  // Holds the name and description of the main category.
  var mainTaxonInfo = {
    "name" : "",
    "desc" : ""
  };

  // Holds the choices in the current question
  var subTaxa = [];

  // Number of choices available
  var choiceCount = 3;

  // Number of choice images that have loaded
  var loadedCount = 0;

  // Information about the correct answer
  var answer = {
    picURL : "",
    scientificName : ""
  };

  // Resets the choices array to empty objects (as many as the current choiceCount)
  function _clearSubTaxa() {
    loadedCount = 0;
    subTaxa.length = 0;

    for (var i = 0; i < choiceCount; i++) {
      subTaxa.push({});
    }
  }

  // Sets the picture and description for a particular choice
  function _setSubTaxonInfo(subTaxonChoice) {
    $.ajax({
      url : "http://eol.org/api/pages/1.0/" + subTaxonChoice.page + ".json",
      cache : false,
      data: {
        key : apiKey,
        images : 50,
        text : 0,
        details: true,
      },
      dataType : "jsonp",
      error: function(jqXHR, textStatus, errorThrown) {
        // TODO - add actual error handling
        alert("Could not connect to the Encyclopedia of Life API. Refresh your browser window or try again later.");
      },
      success: function(data) {
        var objectCount,
            picIndex = undefined,
            scientificNameStr = "";

        // TODO - print an error if no data objects can be found for the image
        if (data.hasOwnProperty("dataObjects") && data.dataObjects.length > 0) {
          objectCount = data.dataObjects.length;

          // Pick a random data object until an image is found
          while (!picIndex || data.dataObjects[picIndex].dataType !== "http://purl.org/dc/dcmitype/StillImage") {
            picIndex = Math.floor(Math.random() * objectCount);
          }

          scientificNameStr = data.scientificName.split(" ")[0];

          // Set the current choice / subtaxa image
          subTaxonChoice.picURL = data.dataObjects[picIndex].eolMediaURL;
          subTaxonChoice.scientificName = scientificNameStr;

          // The correct answer was randomly chosen in a previous step
          if (subTaxonChoice.correct === true) {
            answer.picURL = subTaxonChoice.picURL;
            answer.scientificName = scientificNameStr;
          }

          loadedCount++;

          // If the last picture has been loaded
          if (loadedCount === choiceCount) {
            $(win).trigger("subTaxaImagesLoaded");
          }
        }
      }
    });
  }

  method.setTaxonCategory = function(index) {
    var taxonSet = taxonCategories[index];
    taxonPages.primary = taxonSet.primary;
    taxonPages.secondary = taxonSet.secondary;
  };

  method.checkAnswer = function(url) {
    if (answer.picURL === url) {
      $(win).trigger("correctGuess");
    }
    else {
      $(win).trigger("wrongGuess");
    }
  };

  method.setSubTaxa = function() {
    var taxonList = taxonPages["secondary"].slice(0);

    // Remove all properties from the subTaxa
    _clearSubTaxa();

    // Set one of them as the correct answer
    subTaxa[Math.floor(Math.random() * subTaxa.length)].correct = true;

    // For each of the choices
    for (var i = 0; i < subTaxa.length; i++) {
      // Pick a random page from the list of available taxa
      subTaxa[i].page = taxonList.splice((Math.floor(Math.random() * taxonList.length)), 1)[0];
      // Do the AJAX call to get the info
      _setSubTaxonInfo(subTaxa[i]);
    }
  };

  method.setMainTaxon = function() {
    $.ajax({
      url : "http://eol.org/api/pages/1.0/" + taxonPages.primary + ".json",
      cache : false,
      data: {
        key : apiKey,
        text : 1,
        images: 0,
        videos: 0,
        sounds: 0,
        maps: 0,
        details: true,
      },
      dataType : "jsonp",
      error: function(jqXHR, textStatus, errorThrown) {
        // TODO add proper error handling - perhaps print an error message to the main window?
        alert("Could not connect to the Encyclopedia of Life API. Refresh your browser window or try again later.");
      },
      success: function(data) {
        // Sometimes the scientific name has extraneous words, so just get the first one
        mainTaxonInfo.name = data.scientificName.split(" ")[0];

        for (var i = 0; i < data.dataObjects.length; i++) {
          if (data.dataObjects[i].dataType === "http://purl.org/dc/dcmitype/Text") {
            mainTaxonInfo.desc = data.dataObjects[i].description;
          }
        }

        $(win).trigger("mainTaxonLoaded");
      }
    });
  };

  method.getCategoryName = function (index) {
    return taxonCategories[index].name;
  };

  method.getChoicesCount = function () {
    return choiceCount;
  };

  method.getSubTaxonInfo = function (index) {
    return subTaxa[index];
  };

  method.getMainTaxonInfo = function() {
    return mainTaxonInfo;
  };

  method.getAnswerName = function() {
    return answer.scientificName;
  };

  return method;
}(window, jQuery));
