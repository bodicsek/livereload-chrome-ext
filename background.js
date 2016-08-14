"use strict";
var chrome;

var tabIds = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.pageAction.show(tabs[0].id);
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

chrome.pageAction.onClicked.addListener(function (tab) {
  toggleLivereloadScript(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    chrome.pageAction.show(tabId);
    tabIds.filter(function (id) { return id === tabId; })
      .forEach(function (id) { setUpTab(id); });
  }
});

function toggleLivereloadScript(tabId) {
  if (!tabIds.includes(tabId)) {
    setUpTab(tabId);
  } else {
    tearDownTab(tabId);
  }
}

function setUpTab(tabId) {
  injectContentScript(tabId, function () {
    injectLivereloadScript(tabId, function () {
      tabIds = tabIds.concat([tabId]);
      chrome.pageAction.setIcon({ tabId: tabId, path: "images/active.png" });
    });
  });
}

function tearDownTab(tabId) {
  extractLivereloadScript(tabId, function () {
    tabIds = tabIds.filter(function (id) { return id !== tabId; });
    chrome.pageAction.setIcon({ tabId: tabId, path: "images/inactive.png" });
  });
}

function injectContentScript(tabId, callback) {
  delay(getInjectDelay(), function () {
    chrome.tabs.executeScript(tabId, { file: "content_script.js" }, callback);
  });
}

function injectLivereloadScript(tabId, callback) {
  chrome.tabs.sendMessage(tabId, { msg: "inject", url: getLivereloadScriptUrl() }, callback);
}

function extractLivereloadScript(tabId, callback) {
  chrome.tabs.sendMessage(tabId, { msg: "extract" }, callback);
}

function getLivereloadScriptUrl() {
  var defaultUrl = "http://localhost:35729/livereload.js";
  var storedUrl = localStorage["livereloadUrl"];
  if (storedUrl === undefined || storedUrl === null || storedUrl === "") {
    return defaultUrl;
  }
  return storedUrl;
}

function getInjectDelay() {
  var defaultDelay = 500;
  var storedDelay = localStorage["injectDelay"];
  if (storedDelay === undefined || storedDelay === null || storedDelay === "") {
    return defaultDelay;
  }
  return storedDelay;
}

function delay(ms, callback) {
  setTimeout(callback, ms);
}
