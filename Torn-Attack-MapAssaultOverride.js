// ==UserScript==
// @name         War: Map Assault Override
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Miz
// @match        https://www.torn.com/city.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

jQuery.noConflict(true);

waitForKeyElements(".territory-dialogue-wrap", enableButton);

function enableButton() {
  jQuery(".territory-dialogue-wrap").off("DOMSubtreeModified");
  jQuery(".territory-dialogue-wrap")
    .find("span.submit-take, span.submit-claim")
    .removeClass("disable-d")
    .removeClass("disable");
  jQuery(".territory-dialogue-wrap").on("DOMSubtreeModified", function () {
    removeClasses();
  });
}
