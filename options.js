"use strict";

var defaultUrl = "http://localhost:35729/livereload.js";
var urlId = "livereloadUrl";

function loadOptions() {
  document.getElementById(urlId).value = getLivereloadScriptUrl();
}

function saveOptions() {
  setLivereloadUrl(document.getElementById(urlId).value);
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

document.addEventListener("DOMContentLoaded", function () {
  loadOptions();
  document.getElementById("saveButton").onclick = function () {
    saveOptions();
  };
});
