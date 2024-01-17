// ==UserScript==
// @name         Torn Fast Slots
// @namespace    https://github.com/SOLiNARY
// @version      0.2.1
// @description  Makes slots stop instantly. Works for every spin except first.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=slots
// @match        https://www.torn.com/page.php?sid=slots
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  const originalAjax = $.ajax;

  $.ajax = function (options) {
    if (
      options.data != null &&
      options.data.sid == "slotsData" &&
      options.data.step == "play"
    ) {
      const originalSuccess = options.success;
      options.success = function (data, textStatus, jqXHR) {
        data.barrelsAnimationSpeed = 0;
        if (originalSuccess) {
          originalSuccess(data, textStatus, jqXHR);
        }
      };
    }

    return originalAjax(options);
  };
})();
