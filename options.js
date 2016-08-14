"use strict";

var defaultUrl = "http://localhost:35729/livereload.js";
var urlId = "livereloadUrl";

var defaultDelay = 500;
var delayId = "injectDelay";

function loadOptions() {
  document.getElementById(urlId).value = getLivereloadScriptUrl();
  document.getElementById(delayId).value = getInjectDelay();
}

function saveOptions() {
  setLivereloadUrl(document.getElementById(urlId).value);
  setInjectDelay(document.getElementById(delayId).value);
}

function getLivereloadScriptUrl() {
  var storedUrl = localStorage[urlId];
  if (storedUrl === undefined || storedUrl === null || storedUrl === "") {
    return defaultUrl;
  }
  return storedUrl;
}

function setLivereloadUrl(url) {
  localStorage[urlId] = url;
}

function getInjectDelay() {
  var storedDelay = localStorage[delayId];
  if (storedDelay === undefined || storedDelay === null || storedDelay === "") {
    return defaultDelay;
  }
  return storedDelay;
}

function setInjectDelay(delay) {
  localStorage[delayId] = delay;
}

document.addEventListener("DOMContentLoaded", function () {
  loadOptions();
  document.getElementById("saveButton").onclick = function () {
    saveOptions();
  };
});
