// ==UserScript==
// @name         War: Territory Script
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  Assault/claim terts quickly
// @author       olesien & pyrit
// @match        https://www.torn.com/city.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      BSD
// ==/UserScript==

(function () {
  "use strict";
  let disableWhenLoading = false; //FALSE = u can spam without waiting, TRUE is safer as that means you need to wait for torn to respond
  let includeAbandon = false; //WARNING DO NOT S7 YOURSELF

  let loading = false; //Don't touch this

  const startWar = async (db_id, buttonEl, diag) => {
    if (!disableWhenLoading || !loading) {
      console.log("Starting on " + db_id);
      loading = true;
      buttonEl.innerText = "Assaulting...";
      buttonEl.disabled = true;

      try {
        const resp = await fetch(
          "https://www.torn.com/city.php?rfcv=undefined",
          {
            credentials: "include",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            referrer: "https://www.torn.com/city.php",
            body: `type=take&id=${db_id}&exist=&exist_data=&is_old_collection=0&step=action`,
            method: "POST",
            mode: "cors",
          }
        );

        const body = await resp.json();

        if (body.success) {
          loading = false;
          buttonEl.innerText = "Success!";
          buttonEl.disabled = true;
          diag.innerText = body.message;
          diag.style.color = "green";
        } else {
          loading = false;
          buttonEl.innerText = "Retry Assault";
          buttonEl.disabled = false;
          diag.innerText = body.error;
          diag.style.color = "red";
        }
      } catch (err) {
        console.log(err);
        loading = false;
        buttonEl.innerText = "Retry Assault";
        buttonEl.disabled = false;
        diag.innerText = err.message;
        diag.style.color = "red";
      }
    }
  };

  const claim = async (db_id, buttonEl, diag) => {
    if (!disableWhenLoading || !loading) {
      console.log("Starting on " + db_id);
      loading = true;
      buttonEl.innerText = "Claiming...";
      buttonEl.disabled = true;

      try {
        const resp = await fetch(
          "https://www.torn.com/city.php?rfcv=undefined",
          {
            credentials: "include",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            referrer: "https://www.torn.com/city.php",
            body: `type=claim&id=${db_id}&exist=&exist_data=&is_old_collection=0&step=action`,
            method: "POST",
            mode: "cors",
          }
        );

        const body = await resp.json();

        if (body.success) {
          loading = false;
          buttonEl.innerText = "Success!";
          buttonEl.disabled = true;
          diag.innerText = body.message;
          diag.style.color = "green";
        } else {
          loading = false;
          buttonEl.innerText = "Retry Claim";
          buttonEl.disabled = false;
          diag.innerText = body.error;
          diag.style.color = "red";
        }
      } catch (err) {
        console.log(err);
        loading = false;
        buttonEl.innerText = "Retry Claim";
        buttonEl.disabled = false;
        diag.innerText = err.message;
        diag.style.color = "red";
      }
    }
  };

  const abandon = async (db_id, buttonEl, diag) => {
    if (!disableWhenLoading || !loading) {
      console.log("Unclaiming on " + db_id);
      loading = true;
      buttonEl.innerText = "Unclaiming...";
      buttonEl.disabled = true;

      try {
        const resp = await fetch(
          "https://www.torn.com/city.php?rfcv=undefined",
          {
            credentials: "include",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded; charset=UTF-8",
              "X-Requested-With": "XMLHttpRequest",
            },
            referrer: "https://www.torn.com/city.php",
            body: `type=abandon&id=${db_id}&exist=&exist_data=&is_old_collection=0&step=action`,
            method: "POST",
            mode: "cors",
          }
        );

        const body = await resp.json();

        if (body.success) {
          loading = false;
          buttonEl.innerText = "Success!";
          buttonEl.disabled = true;
          diag.innerText = body.message;
          diag.style.color = "green";
        } else {
          loading = false;
          buttonEl.innerText = "Retry Unclaim";
          buttonEl.disabled = false;
          diag.innerText = body.error;
          diag.style.color = "red";
        }
      } catch (err) {
        console.log(err);
        loading = false;
        buttonEl.innerText = "Retry Unclaim";
        buttonEl.disabled = false;
        diag.innerText = err.message;
        diag.style.color = "red";
      }
    }
  };

  const addButtons = (panel) => {
    let diag = document.getElementById("territory-script-diag");
    if (!diag) {
      diag = document.createElement("div");
      diag.id = "territory-script-diag";
      document.querySelector(".content-wrapper").prepend(diag);
    }

    const innerPanel = panel.querySelectorAll(".info-and-action-wrap");
    const selectedPanel = innerPanel.length > 1 ? innerPanel[1] : innerPanel[0];
    const buttonEl = document.createElement("button");
    const buttonEl2 = document.createElement("button");
    const buttonEl3 = document.createElement("button");

    if (selectedPanel && buttonEl) {
      if (!selectedPanel.querySelector(".assault-btn")) {
        //button styling
        buttonEl.innerText = "Try Assault";
        buttonEl.className = "assault-btn";
        buttonEl.style.backgroundColor = "#262626";
        buttonEl.style.color = "white";
        buttonEl.style.paddingRight = "10px";
        buttonEl.style.paddingLeft = "10px";
        buttonEl.style.paddingTop = "5px";
        buttonEl.style.paddingBottom = "5px";
        buttonEl.style.margin = "5px";

        buttonEl2.innerText = "Try Claim";
        buttonEl2.className = "claim-btn";
        buttonEl2.style.backgroundColor = "#262626";
        buttonEl2.style.color = "white";
        buttonEl2.style.paddingRight = "10px";
        buttonEl2.style.paddingLeft = "10px";
        buttonEl2.style.paddingTop = "5px";
        buttonEl2.style.paddingBottom = "5px";
        buttonEl2.style.margin = "5px";

        buttonEl3.innerText = "Try Unclaim";
        buttonEl3.className = "unclaim-btn";
        buttonEl3.style.backgroundColor = "#362626";
        buttonEl3.style.color = "white";
        buttonEl3.style.paddingRight = "10px";
        buttonEl3.style.paddingLeft = "10px";
        buttonEl3.style.paddingTop = "5px";
        buttonEl3.style.paddingBottom = "5px";
        buttonEl3.style.margin = "5px";

        const map = document.querySelector(".territories");
        if (map) {
          const selected = map.querySelector(".selected");
          if (selected) {
            console.log("dataset", selected.getAttribute("db_id"));
            const db_id = selected.getAttribute("db_id");

            if (db_id) {
              buttonEl.addEventListener("click", () =>
                startWar(db_id, buttonEl, diag)
              );
              selectedPanel.appendChild(buttonEl);

              buttonEl2.addEventListener("click", () =>
                claim(db_id, buttonEl2, diag)
              );
              selectedPanel.appendChild(buttonEl2);

              if (includeAbandon) {
                buttonEl3.addEventListener("click", () =>
                  abandon(db_id, buttonEl3, diag)
                );
                selectedPanel.appendChild(buttonEl3);
              }
            }
          }
        }
      }
    }
  };

  let setup = false;

  const observer = new MutationObserver((_, observer) => {
    let panel = document.querySelector(".leaflet-popup-pane");
    if (!setup && panel) {
      setup = true;
      observer.disconnect();
      observer.observe(document.querySelector(".leaflet-popup-pane"), {
        subtree: true,
        childList: true,
      });
    } else if (panel) {
      console.log("adding buttons");
      addButtons(panel);
      const wrappers = panel.querySelectorAll(".leaflet-rrose-content-wrapper");
      if (wrappers && wrappers.length > 1) {
        for (let i = 1; i < wrappers.length; i++) {
          const wrapper = wrappers[i];

          const real = wrapper.querySelector(".c-pointer");
          if (!real) wrapper.style.display = "none"; //Mostly to remove rackets because they should not play a big part in attacking anyway
        }
      }
    }
  });

  observer.observe(document, { subtree: true, childList: true });
})();
