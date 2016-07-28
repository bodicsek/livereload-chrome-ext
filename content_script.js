'use strict';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    injectLivereload();
});

function injectLivereload() {
    var script = document.createElement("script");
    script.setAttribute("src",
        "http://localhost:35729/livereload.js");
    document.head.appendChild(script);
}
