'use strict';

var tabIds = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //TODO: check if the current page has livereload.js already inserted
  chrome.pageAction.show(tabs[0].id);
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  //TODO: check if the current page has livereload.js already inserted
  chrome.pageAction.show(tabId);
});

chrome.pageAction.onClicked.addListener(function (tab) {
  toggleLivereloadScript(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
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
  chrome.tabs.executeScript(tabId, { file: 'content_script.js' }, callback);
}

function injectLivereloadScript(tabId, callback) {
  chrome.tabs.sendMessage(tabId, { msg: "inject" }, callback);
}

function extractLivereloadScript(tabId, callback) {
  chrome.tabs.sendMessage(tabId, { msg: "extract" }, callback);
}
