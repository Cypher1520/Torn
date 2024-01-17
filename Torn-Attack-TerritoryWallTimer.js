// ==UserScript==
// @name         War: TerritoryWallTimer
// @namespace    territory.war
// @version      0.3.9.2
// @description  try to take over the world!
// @author       Afwas [1337627], Edits by Cypher [2641265]
// @match        *://*.torn.com/factions.php*
// @require      https://raw.githubusercontent.com/naugtur/insertionQuery/master/insQ.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/humanize-duration/3.17.0/humanize-duration.min.js
// @updateURL    https://eu.relentless.pw/userscripts/TerritoryWarTimer.user.js
// @grant        none
// ==/UserScript==

/* jshint -W097 */
/*global
	$, insertionQ, moment, humanizeDuration
*/
/* jshint ignore:end */

(function () {
  "use strict";
  insertionQ.config({
    strictlyNew: false,
    timeout: 0,
  });
  const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
      shortEn: {
        w: () => "wk",
        d: () => "days",
        h: () => "hrs",
        m: () => "mins",
        s: () => "secs",
      },
    },
  });
  function setup() {
    insertionQ("ul.f-war-list").every(function (element) {
      $("body").on("DOMSubtreeModified", ".count", function () {
        // console.log("$(.counter).text():", $('.counter').text());
        // console.log("$('#war-timer').length:", $('#war-timer').length);
        $(element)
          .children("li")
          .each(function () {
            if (
              !$(this).hasClass("chain-box") &&
              ($(this).hasClass("green") || $(this).hasClass("red"))
            ) {
              let name = $(this).find("div.name").text().split(" ");
              let action = "None";
              if (name.length > 1) {
                // Assaulting or defending
                action = name[0];
              }
              if (action == "None") {
                // Continue in .each() loop
                return true;
              }
              let _ourCount = $(this)
                .find("div.member-count.your-count > div.count")
                .text();
              let _theirCount = $(this)
                .find("div.member-count.enemy-count > div.count")
                .text();
              // console.log("ourCount: "+_ourCount+" theirCount: "+_theirCount);
              // Gather data from screen
              let _score = $(this).find(".score").text().replace(/,/g, "");
              let _match = _score.match(/(\d+) ?\/ ?(\d+)/);
              let _timer = $(this).find(".timer").text().replace(/:/, ".");

              // Set defaults
              let scoreCurrent = 0;
              let slotsMax = 1;

              // Calculate derived values
              if (_match.length > 1) {
                scoreCurrent = _match[2] - _match[1];
                slotsMax = (_match[2] * 2) / 100000;
              }
              let durationCurrent = moment.duration(_timer).as("seconds") || 1;
              let membersMin =
                Math.floor((scoreCurrent / durationCurrent) * 10) / 10;
              let durationMin = Math.ceil(scoreCurrent / slotsMax);
              let successMoment = shortEnglishHumanizer(
                moment.duration(durationMin, "seconds"),
                {
                  round: true,
                  largest: 2,
                }
              );
              let successCurrent = 0;
              let diffCount = Math.abs(_ourCount - _theirCount);
              successCurrent = '<span style="font-size: 1.5em;">&infin;</span>';
              if (diffCount != 0) {
                successCurrent = Math.ceil(scoreCurrent / diffCount);
              }
              // console.log("successCurrent:", successCurrent);
              // Output
              if (typeof successCurrent == "number") {
                successCurrent = shortEnglishHumanizer(
                  moment.duration(successCurrent, "seconds"),
                  {
                    round: true,
                    largest: 2,
                  }
                );
              }
              let textMembers =
                "AVG " +
                membersMin +
                " member" +
                (parseInt(membersMin) != 1 ? "s" : "");
              let textSuccess = " | UNKNOWN ";
              let textCurrent =
                (parseInt(_ourCount) >= parseInt(_theirCount)
                  ? "Win in "
                  : "Loss in ") + successCurrent;
              if (durationMin < 0) {
                textSuccess = "<br/>FAILED " + successMoment;
              } else if (durationMin >= 0) {
                textSuccess = "<br/>MIN " + successMoment;
              }
              let html =
                '<div id="war-timer">' +
                /* textMembers + textSuccess +*/ textCurrent +
                "</div>";
              if ($(this).find("#war-timer").length == 0) {
                $(this).find(".timer").after(html);
              } else {
                $(this)
                  .find("#war-timer")
                  .html(/*textMembers + textSuccess +*/ textCurrent);
              }
            }
          });
      });
    });
  }
  setup();
  setTimeout(function () {
    if (!$("#war-timer").length) {
      setup();
    }
    insertionQ(".count").every(function (el) {
      // Trigger after page load
      $(el).trigger("DOMSubtreeModified");
    });

    setInterval(function () {
      $(".count").trigger("DOMSubtreeModified");
    }, 60000);
  }, 500);
})();
