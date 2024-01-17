// ==UserScript==
// @name        Treat counter
// @description Adds treat counter to torn
// @namespace   m0tch.torn.treats
// @match       https://www.torn.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @version     0.1.overlay
// @author      m0tch
// @license     MIT
// ==/UserScript==

console.log("Treat counter initialized");
localStorage.treatCount = localStorage.treatCount ?? 0;

GM_addStyle(`
        #treatOverlayCounterDiv {
            position: fixed;
            top: 1px; /* Adjust this value to set the distance from the top */
            left: 1px; /* Adjust this value to set the distance from the left */
            background-color: #EB9853;
            color: black;
            border-radius: 10px;
            padding: 10px;
            z-index: 100000;
        }
`);

function addTreatsDisplay(node) {
  console.log(node);
  if (!node) return;

  if (
    Array.from(node.children).filter((x) => x.id == "treatCounter").length == 1
  ) {
    return;
  }
  const clone = node.children[0].cloneNode(true);
  clone.id = "treatCounter";
  clone.children[0].innerText = "Treats:";
  clone.children[1].innerText = localStorage.treatCount;

  node.appendChild(clone);
}

function addTreatsOverlayDisplay() {
  const overlayCounter = document.getElementById("treatOverlayCounter");
  if (overlayCounter == null) {
    const link = document.createElement("a");
    link.href = "item.php";
    link.target = "_blank";
    const outerDiv = document.createElement("div");
    outerDiv.id = "treatOverlayCounterDiv";
    const valueSpan = document.createElement("span");
    valueSpan.id = "treatOverlayCounter";
    valueSpan.textContent = localStorage.treatCount;
    outerDiv.appendChild(valueSpan);
    link.appendChild(outerDiv);
    document.querySelector("body").appendChild(link);
  }
}

function updateTreatsDisplay() {
  var node = document
    .getElementById("sidebarroot")
    .querySelectorAll("div[class^='points']")[0];
  if (!node) return;

  if (
    Array.from(node.children).filter((x) => x.id == "treatCounter").length == 0
  ) {
    addTreatsDisplay(node);
  }
  var treatCounterNode = Array.from(node.children).filter(
    (x) => x.id == "treatCounter"
  )[0];
  treatCounterNode.children[0].innerText = "Treats:";
  treatCounterNode.children[1].innerText = localStorage.treatCount;
}

function updateTreatsOverlayDisplay() {
  let overlayCounter = document.getElementById("treatOverlayCounter");
  if (overlayCounter == null) {
    addTreatsOverlayDisplay();
  }
  overlayCounter.textContent = localStorage.treatCount;
}

function updateTreatCount() {
  var availableTreatsNodes = document.querySelectorAll(".available-treats");
  if (availableTreatsNodes.length == 0) {
    return;
  }
  var treatText = document
    .querySelectorAll(".available-treats")[0]
    .querySelector(".halloween-text").innerText; //format: "x treats"
  var treats = treatText.substr(0, treatText.indexOf(" "));
  localStorage.treatCount = treats;
  console.log("Available treats read, updating count to: " + treats);
  updateTreatsDisplay();
  updateTreatsOverlayDisplay();
  //localStorage.treatCount = Math.floor(Math.random() * 20);
}

function getAttackReward() {
  var treatNode = document.querySelector(".dialog-title__halloween");
  if (!treatNode) {
    return;
  }
  var treatText = document.querySelector(".dialog-title__halloween").innerText;
  var treatGain = treatText.substr(1, treatText.indexOf(" ") - 1);
  localStorage.treatCount = Number(localStorage.treatCount) + Number(treatGain);
  updateTreatsOverlayDisplay();
}

addTreatsDisplay(
  document.querySelector &&
    document
      .getElementById("sidebarroot")
      .querySelectorAll("div[class^='points']")[0]
);
addTreatsOverlayDisplay();

// Sometimes sidebar takes a bit to load, so wait and then add it - won't be added if it already exists
setTimeout(
  addTreatsDisplay(
    document.querySelector &&
      document
        .getElementById("sidebarroot")
        .querySelectorAll("div[class^='points']")[0]
  ),
  5000
);

setInterval(() => updateTreatsDisplay(), 3000);
setInterval(() => updateTreatsOverlayDisplay(), 3000);

if (document.location.pathname.indexOf("item.php") > -1) {
  new MutationObserver((mutations) => {
    updateTreatCount();
  }).observe(document.getElementById("category-wrap"), {
    childList: true,
    subtree: true,
  });
}

if (document.location.href.indexOf("loader.php?sid=attack&") > -1) {
  setTimeout(() => {
    new MutationObserver((mutations) => {
      getAttackReward();
    }).observe(document.getElementById("defender"), {
      childList: true,
      subtree: true,
    });
  }, 2000);
}
