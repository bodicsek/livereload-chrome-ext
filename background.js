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
  console.log(`event: onUpdated tabId ${tabId} changeInfo ${JSON.stringify(changeInfo)}`);
  if (changeInfo.status == "complete") {
    chrome.pageAction.show(tabId);
    tabIds.filter(function (id) { return id === tabId; })
      .forEach(function (id) {
        delay(getInjectDelay(), function () {
          setUpTab(id);
        });
      });
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  console.log(`event: onRemove tabId ${tabId}`);
  const index = tabIds.indexOf(tabId);
  if (index > -1) {
    tabIds.splice(index, 1);
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
  console.log(`executing: setUpTab tabId ${tabId}`);
  injectContentScript(tabId, function () {
    injectLivereloadScript(tabId, function () {
      tabIds = tabIds.includes(tabId) ? tabIds : tabIds.concat([tabId]);
      chrome.pageAction.setIcon({ tabId: tabId, path: "images/active.png" });
      console.log(`done: setUpTab tabIds [${tabIds}]`);
    });
  });
}

function tearDownTab(tabId) {
  console.log(`executing: tearDownTab tabId ${tabId}`);
  extractLivereloadScript(tabId, function () {
    tabIds = tabIds.filter(function (id) { return id !== tabId; });
    chrome.pageAction.setIcon({ tabId: tabId, path: "images/inactive.png" });
    console.log(`done: tearDownTab tabIds [${tabIds}]`);
  });
}

function injectContentScript(tabId, callback) {
  chrome.tabs.executeScript(tabId, { file: "content_script.js" }, callback);
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
