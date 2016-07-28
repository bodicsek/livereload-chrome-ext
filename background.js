'use strict';

var tabIds = [];

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.pageAction.show(tabs[0].id);
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

chrome.pageAction.onClicked.addListener(function (tab) {
  injectLivereloadScript(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    if (tabIds.includes(tabId)) {
      injectLivereloadScript(tabId);
    }
  }
});

function injectLivereloadScript(tabId) {
  chrome.tabs.executeScript(tabId, {
    file: 'content_script.js'
  }, function () {
    chrome.tabs.sendMessage(tabId, {}, function (response) {
      if (!tabIds.includes(tabId)) {
        tabIds.push(tabId);
      }
    });
  });
}
