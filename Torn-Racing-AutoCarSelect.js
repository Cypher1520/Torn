// ==UserScript==
// @name         Racing: Auto Select Car
// @namespace    https://greasyfork.org/en/scripts/398078-auto-select-car
// @version      1.4
// @description  Keeps a record of which car you want to use for each racetrack and removes every other car from the selection menu.
// @author       Cryosis7 [926640]
// @match        https://www.torn.com/loader.php?sid=racing
// ==/UserScript==

/**
 * Car stats are used to distinguish between the different cars.
 * Only requires the name field, which can be a substring (NSX, LFA etc.)
 * The qualifiers like 'top speed' are used to differeniate between different versions of the same model car (Dirt NSX vs Tarmac NSX)
 */
const cars = {
  /*Examples
    'Ferrari458_TarmacLong3': { 'name': 'Ferrari 458' },
    'ReliantRobin': { 'name': 'Reliant Robin' },
    */
  /*Cars*/
  Lexus: { name: "LFA", "Top Speed": "260" },
  Cosworth: { name: "Sierra Cosworth" },
  Audi: { name: "Audi R8" },
  Lambo: { name: "Lamborghini Gallardo" },
  GT40: { name: "GT40" },
  SLR: { name: "Mercedes SLR" },
  DirtNSX: { name: "NSX (Class A) - DSR" },
  TrackNSX: { name: "NSX (Class A) - TSR" },
  Aston: { name: "Aston", "Top Speed": "260" },
};

/**
 * Used for mapping the race-track to the car you want to race.
 * To have multiple cars show, wrap them in an array like so: (Don't forget the commas)
 * 'Docks': [cars.LexusLFA, cars.ReliantRobin],
 */
const car_track_mappings = {
  /*'Docks': [cars.LexusLFA, cars.ReliantRobin],
    'Uptown': cars.LexusLFA,*/
  Docks: [cars.GT40],
  Uptown: [cars.Lambo, cars.Lexus, cars.Aston],
  Withdrawal: [cars.Lexus],
  Speedway: [cars.Lexus],
  Convict: [cars.Lexus, cars.Aston, cars.SLR],
  Meltdown: [cars.TrackNSX],
  Industrial: [cars.TrackNSX],
  Vector: [cars.TrackNSX],
  Underdog: [cars.TrackNSX],
  Commerce: [cars.TrackNSX],
  Sewage: [cars.TrackNSX],
  Mudpit: cars.Cosworth,
  "Two Islands": cars.DirtNSX,
  "Stone Park": cars.Audi,
  Parkland: cars.DirtNSX,
  Hammerhead: cars.DirtNSX,
};

/**
 * This can be used to help configure when you want the auto-selector to run.
 */
const CONFIG = {
  ENABLED_ON_OFFICIAL: true,
  ENABLED_ON_CUSTOM: true,
};

// Creates the observer when the page loads.
$(() => createObserver());

/**
 * Creates an observer that watches to see when the player tries to change their car.
 */
function createObserver() {
  const raceContainer = $("#racingAdditionalContainer")[0];
  var observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if ($(mutation.addedNodes).find("ul.enlist-list") && checkEnabled())
        filterCars($(mutation.addedNodes).find("ul.enlist-list").children());
    }
  });

  observer.observe(raceContainer, { childList: true });
}

/**
 * Goes through the list of cars, checking them against the criteria.
 * If the car does not meet the criteria, the car is hidden.
 * @param {The selector for the list of cars.} carList
 */
function filterCars(carList) {
  var racetrack = $(
    'div.enlist-wrap:contains("Current race") div.enlisted-btn-wrap:contains(" - ")'
  )
    .text()
    .trim()
    .split(" - ")[0];
  var desiredCarArray = Array.isArray(car_track_mappings[racetrack])
    ? car_track_mappings[racetrack]
    : [car_track_mappings[racetrack]];

  $(carList).each((index, element) => {
    let carIsPermitted = false; // Whether this car(element on page) matches any cars in the list of permitted cars.

    for (let validCar of desiredCarArray) {
      // loops through every car that is permitted.
      let carMatchesValidCar = false; // For testing if the car element matches the permitted car

      for (let stat in validCar) {
        if (stat === "name")
          carMatchesValidCar = scrubText(
            $(element).find(".remove-info")[0].innerText
          ).includes(scrubText(validCar.name));
        else {
          let carStats = scrubText(
            $(element).find(".enlisted-stat")[0].innerText
          );
          if (carStats.includes(scrubText(stat))) {
            if (
              !carStats
                .split(scrubText(stat))[1]
                .startsWith(scrubText(validCar[stat]))
            )
              carMatchesValidCar = false;
          }
        }

        if (!carMatchesValidCar) break;
      }

      carIsPermitted = carIsPermitted || carMatchesValidCar;
    }
    if (!carIsPermitted) $(element).hide();
  });
}

/**
 * Generic method to clean up text for comparisons.
 * @param {Text to be scrubbed} text
 */
function scrubText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]*/g, "");
}

/**
 * Helper function that checks the config to see if the script is enabled for the current race
 */
function checkEnabled() {
  if (
    $('div.enlisted-btn-wrap:contains("Official race")').length &&
    CONFIG.ENABLED_ON_OFFICIAL
  )
    return true;
  else if (
    $('div.enlisted-btn-wrap:contains(" - "):not(:contains("Official race"))')
      .length &&
    CONFIG.ENABLED_ON_CUSTOM
  )
    return true;

  return false;
}
