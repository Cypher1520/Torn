// ==UserScript==
// @name                Torn: BS%
// @version             1.0
// @author              Cypher [2641265] with help from Kwack [2190604]
// @description         BS% in the Battle Stats Box
// @match               https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// ==/UserScript==

//Finds the Battlestats Box on main page
const headerElem = Array.from(document.getElementsByTagName("h5")).filter(el => el.innerText === "Battle Stats")[0] 
//Creates const for BattleStats box
const container = headerElem.parentElement.parentElement; 
//Creates integer const rom the total battle stats
const totalStats = parseInt(
  container.querySelector(
      ".bottom-round>.cont-gray.battle.bottom-round>.info-cont-wrap>.last>.desc"
    ).innerText.replaceAll(",", "")
  );
//Loads all nodes for stats
const rows = container.querySelectorAll(
  ".bottom-round>.cont-gray.battle.bottom-round>.info-cont-wrap>li"
  );
//For loop to apply the stat% to stat line. 
for (row of rows) {
    const array = row.innerText.split(" ");
    const basestat = array[1];
    const stat = parseInt(basestat.replaceAll(",", ""));
    const percentageElement = ((stat * 100) / totalStats).toFixed(0) + "%";
    row.querySelector(".divider>.label").innerText += ": " + percentageElement;
    //row.querySelector(".divider>.label").innerHTML += `: <span>{percentageElement}</span>`
  }