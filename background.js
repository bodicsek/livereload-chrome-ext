'use strict';

var tabIds = [];

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript({
        file: 'content_script.js'
    }, function () {
        chrome.tabs.sendMessage(tab.id, {}, function (response) {
            if (tabIds.some(function (id) { id == tab.id })) {
                tabIds.push(tab.id);
            }
        });
    });
});